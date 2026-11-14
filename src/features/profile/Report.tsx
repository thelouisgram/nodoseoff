import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/store";
import {
  useDrugs,
  useSchedule,
  useUserInfo,
  useAllergies,
  useCompletedDrugs,
  useOtcDrugs,
  useHerbs,
  useHealthJournal,
} from "@/hooks/useDashboardData";
import { toast } from "sonner";
import { DrugProps, HealthJournalEntry } from "@/types/dashboard";
import { calculateOverallCompliance } from "@/utils/dashboard/drugs";
import {
  formatDrugNamesWithCourses,
  uniqueDrugDisplayNames,
} from "@/utils/drugs";
import {
  Download,
  Pill,
  History,
  AlertTriangle,
  ShoppingCart,
  Leaf,
  Loader2,
  CircleAlert,
  SlidersHorizontal,
  X,
} from "lucide-react";

interface ReportProps {
  setTab: Function;
}

type PastMedsRange = "6m" | "1y" | "lifetime";

type ReportSettings = {
  pastMedsRange: PastMedsRange;
  includeAdherence: boolean;
  includeCurrent: boolean;
  includePast: boolean;
  includeAllergies: boolean;
  includeSideEffects: boolean;
  includeOtc: boolean;
  includeHerbs: boolean;
};

const PAST_MEDS_OPTIONS: { value: PastMedsRange; label: string }[] = [
  { value: "6m", label: "6 months" },
  { value: "1y", label: "1 year" },
  { value: "lifetime", label: "Lifetime" },
];

const DEFAULT_REPORT_SETTINGS: ReportSettings = {
  pastMedsRange: "6m",
  includeAdherence: true,
  includeCurrent: true,
  includePast: true,
  includeAllergies: true,
  includeSideEffects: true,
  includeOtc: true,
  includeHerbs: true,
};

const REPORT_SETTINGS_KEY = "nodoseoff_report_settings";

function isPastMedsRange(value: unknown): value is PastMedsRange {
  return value === "6m" || value === "1y" || value === "lifetime";
}

function pastMedsTitle(range: PastMedsRange): string {
  if (range === "lifetime") return "Completed (lifetime)";
  if (range === "1y") return "Completed (last 1 year)";
  return "Completed (last 6 months)";
}

function pastMedsHint(range: PastMedsRange): string {
  if (range === "lifetime") return "All completed courses";
  if (range === "1y") return "Completed in the last year";
  return "Completed in the last 6 months";
}

function loadReportSettings(userId: string | undefined): ReportSettings {
  if (typeof window === "undefined" || !userId) return DEFAULT_REPORT_SETTINGS;
  try {
    const raw = localStorage.getItem(`${REPORT_SETTINGS_KEY}:${userId}`);
    if (!raw) return DEFAULT_REPORT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ReportSettings>;
    return {
      ...DEFAULT_REPORT_SETTINGS,
      ...parsed,
      pastMedsRange: isPastMedsRange(parsed.pastMedsRange)
        ? parsed.pastMedsRange
        : DEFAULT_REPORT_SETTINGS.pastMedsRange,
    };
  } catch {
    return DEFAULT_REPORT_SETTINGS;
  }
}

function saveReportSettings(userId: string | undefined, next: ReportSettings) {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(
      `${REPORT_SETTINGS_KEY}:${userId}`,
      JSON.stringify(next)
    );
  } catch {
    // ignore quota / private mode
  }
}

function formatList(items: string[] | string | undefined | null): string {
  if (Array.isArray(items)) {
    const cleaned = items.map((s) => String(s || "").trim()).filter(Boolean);
    return cleaned.length ? cleaned.join(", ") : "None recorded";
  }
  const s = String(items || "").trim();
  return s || "None recorded";
}

/** Clinician-facing side-effect summary from health journal logs. */
function formatSideEffectsSummary(journal: HealthJournalEntry[]): string {
  const effects = journal.filter(
    (e) => e.kind === "side_effect" && String(e.symptom || "").trim()
  );
  if (effects.length === 0) return "None recorded";

  const byKey = new Map<
    string,
    { symptom: string; drug: string; count: number; severities: number[] }
  >();

  for (const e of effects) {
    const symptom = String(e.symptom || "").trim();
    const drug = String(e.drug || "").trim();
    const key = `${drug.toLowerCase()}::${symptom.toLowerCase()}`;
    const prev = byKey.get(key) || {
      symptom,
      drug,
      count: 0,
      severities: [] as number[],
    };
    prev.count += 1;
    if (e.severity != null && !Number.isNaN(Number(e.severity))) {
      prev.severities.push(Number(e.severity));
    }
    byKey.set(key, prev);
  }

  return Array.from(byKey.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
    .map((row) => {
      const linked = row.drug ? ` (with ${row.drug})` : "";
      const avg =
        row.severities.length > 0
          ? (
              row.severities.reduce((s, n) => s + n, 0) / row.severities.length
            ).toFixed(1)
          : null;
      const countLabel = `${row.count} log${row.count === 1 ? "" : "s"}`;
      const severityLabel = avg ? `, avg severity ${avg}/5` : "";
      return `${row.symptom}${linked}: ${countLabel}${severityLabel}`;
    })
    .join("; ");
}

function SettingToggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-soft-ink">
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-[12px] text-soft-muted">{hint}</span>
        ) : null}
      </span>
      <div
        role="group"
        aria-label={label}
        className="inline-flex shrink-0 rounded-lg border border-black/[0.06] bg-soft-canvas/80 p-0.5"
      >
        <button
          type="button"
          aria-pressed={checked}
          onClick={() => onChange(true)}
          className={`rounded-md px-2.5 py-1 text-[12px] font-semibold tracking-tight transition ${
            checked
              ? "bg-white text-soft-ink shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
              : "text-soft-muted hover:text-soft-ink"
          }`}
        >
          Include
        </button>
        <button
          type="button"
          aria-pressed={!checked}
          onClick={() => onChange(false)}
          className={`rounded-md px-2.5 py-1 text-[12px] font-semibold tracking-tight transition ${
            !checked
              ? "bg-white text-soft-ink shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
              : "text-soft-muted hover:text-soft-ink"
          }`}
        >
          Hide
        </button>
      </div>
    </div>
  );
}

const Report: React.FC<ReportProps> = ({ setTab }) => {
  const { userId } = useAppSelector((state) => state.app);
  const { data: drugs = [] } = useDrugs(userId);
  const { data: schedule = [] } = useSchedule(userId);
  const { data: info = [] } = useUserInfo(userId);
  const { data: allergies = [] } = useAllergies(userId);
  const { data: completedDrugs = [] } = useCompletedDrugs(userId);
  const { data: otcDrugs = "" } = useOtcDrugs(userId);
  const { data: herbs = "" } = useHerbs(userId);
  const { data: journal = [] } = useHealthJournal(userId);

  const userInfo = info?.[0] || { name: "", phone: "", email: "" };
  const { name, phone, email } = userInfo;

  const [settings, setSettings] = useState<ReportSettings>(
    DEFAULT_REPORT_SETTINGS
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setSettings(loadReportSettings(userId));
  }, [userId]);

  const updateSettings = (patch: Partial<ReportSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveReportSettings(userId, next);
      return next;
    });
  };

  // Collapse courses — never list "Paracetamol" four times for four regimens.
  const currentDrugs = formatDrugNamesWithCourses(drugs);
  const allergicDrugs = uniqueDrugDisplayNames(
    allergies.filter((d): d is DrugProps => Boolean(d?.drug))
  );
  const sideEffectsSummary = formatSideEffectsSummary(journal);

  const pastDrugs = useMemo(() => {
    if (settings.pastMedsRange === "lifetime") {
      return formatDrugNamesWithCourses(completedDrugs);
    }
    const cutoff = new Date();
    if (settings.pastMedsRange === "1y") {
      cutoff.setFullYear(cutoff.getFullYear() - 1);
    } else {
      cutoff.setMonth(cutoff.getMonth() - 6);
    }
    return formatDrugNamesWithCourses(
      completedDrugs.filter((d) => {
        const end = new Date(d.end);
        return !Number.isNaN(end.getTime()) && end >= cutoff;
      })
    );
  }, [completedDrugs, settings.pastMedsRange]);

  const pastTitle = pastMedsTitle(settings.pastMedsRange);

  const adherence = calculateOverallCompliance(schedule);
  const generatedLabel = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    const hasContent =
      settings.includeAdherence ||
      settings.includeCurrent ||
      settings.includePast ||
      settings.includeAllergies ||
      settings.includeSideEffects ||
      settings.includeOtc ||
      settings.includeHerbs;

    if (!hasContent) {
      toast.error("Turn on at least one report section");
      return;
    }

    setLoading(true);

    let clone: HTMLElement | null = null;

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      clone = reportRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.width = "794px";
      clone.style.maxWidth = "794px";
      clone.style.minHeight = "auto";
      clone.style.height = "auto";
      clone.style.margin = "0";
      clone.style.zIndex = "-1";
      clone.style.opacity = "1";
      clone.style.background = "#ffffff";
      clone.style.pointerEvents = "none";
      // Lock logo size in the clone so html2canvas can't stretch it
      clone.querySelectorAll("img[data-report-logo]").forEach((node) => {
        const img = node as HTMLImageElement;
        img.style.width = "120px";
        img.style.height = "auto";
        img.style.maxWidth = "120px";
        img.style.maxHeight = "28px";
        img.removeAttribute("sizes");
      });
      document.body.appendChild(clone);

      // Wait for logo image(s) to decode before capture
      await Promise.all(
        Array.from(clone.querySelectorAll("img")).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              })
        )
      );

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794,
        windowWidth: 794,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 0;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      // Fit the full report on a single page — avoids mid-component page cuts
      const widthRatio = usableWidth / canvas.width;
      const heightRatio = usableHeight / canvas.height;
      const ratio = Math.min(widthRatio, heightRatio);

      const renderWidth = canvas.width * ratio;
      const renderHeight = canvas.height * ratio;
      const offsetX = margin + (usableWidth - renderWidth) / 2;
      const offsetY = margin + (usableHeight - renderHeight) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        offsetX,
        offsetY,
        renderWidth,
        renderHeight,
        undefined,
        "FAST"
      );

      const fileName = `${(name || "patient").replace(/\s+/g, "_")}_medication_report.pdf`;
      pdf.save(fileName);
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error("Failed to generate PDF");
      console.error(err);
    } finally {
      if (clone?.parentNode) clone.parentNode.removeChild(clone);
      setLoading(false);
    }
  };

  const sections: {
    title: string;
    body: string;
    icon: typeof Pill;
    tone: string;
  }[] = [
    settings.includeCurrent
      ? {
          title: "Current medications",
          body: formatList(currentDrugs),
          icon: Pill,
          tone: "bg-[#E8EEF5] text-[#002860]",
        }
      : null,
    settings.includePast
      ? {
          title: pastTitle,
          body: formatList(pastDrugs),
          icon: History,
          tone: "bg-[#F6E7D8] text-[#7A5A3C]",
        }
      : null,
    settings.includeAllergies
      ? {
          title: "Allergies",
          body: formatList(allergicDrugs),
          icon: AlertTriangle,
          tone: "bg-[#FFE4EE] text-[#8A3D5A]",
        }
      : null,
    settings.includeSideEffects
      ? {
          title: "Side effects",
          body: sideEffectsSummary,
          icon: CircleAlert,
          tone: "bg-[#FFF3E8] text-[#8A5530]",
        }
      : null,
    settings.includeOtc
      ? {
          title: "Over-the-counter",
          body: formatList(otcDrugs),
          icon: ShoppingCart,
          tone: "bg-[#E8EEF5] text-[#002860]",
        }
      : null,
    settings.includeHerbs
      ? {
          title: "Herbs & supplements",
          body: formatList(herbs),
          icon: Leaf,
          tone: "bg-[#E5F6EE] text-[#2F6B4F]",
        }
      : null,
  ].filter(Boolean) as {
    title: string;
    body: string;
    icon: typeof Pill;
    tone: string;
  }[];

  return (
    <div className="h-[100dvh] w-full overflow-y-scroll px-6 pb-24 pt-10 font-jakarta text-soft-ink ss:px-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-soft-muted">
        <button
          type="button"
          onClick={() => setTab("Account")}
          className="transition-colors hover:text-soft-primary"
        >
          Settings
        </button>
        <span>/</span>
        <span className="font-semibold text-soft-ink">Report</span>
      </nav>

      <div className="mb-8 flex flex-col justify-between gap-6 ss:flex-row ss:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight ss:text-3xl">
            Medication report
          </h1>
          <p className="mt-1 text-sm text-soft-muted">
            A clean summary you can share with your clinician
          </p>
        </div>

        <div className="hidden items-center gap-2 ss:flex">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="ndo-press group inline-flex h-11 items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-4 text-[14px] font-semibold text-soft-ink shadow-soft-sm hover:bg-soft-canvas"
          >
            <SlidersHorizontal className="ndo-wiggle size-4" strokeWidth={1.75} />
            Settings
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={loading}
            className="ndo-press group inline-flex h-11 items-center gap-2 rounded-xl bg-soft-primary px-4 text-[14px] font-semibold text-white shadow-soft-sm hover:bg-soft-primary/90 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Download className="ndo-dl size-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center gap-3 ss:hidden">
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="ndo-press group flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-black/[0.06] bg-white text-[14px] font-semibold text-soft-ink shadow-soft-sm"
        >
          <SlidersHorizontal className="ndo-wiggle size-4" strokeWidth={1.75} />
          Report settings
        </button>
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={loading}
          className="ndo-press group flex h-44 w-full max-w-sm flex-col items-center justify-center gap-4 rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="size-10 animate-spin text-soft-muted" />
              <p className="text-sm text-soft-muted">Generating PDF…</p>
            </>
          ) : (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-soft-primary-soft text-soft-primary">
                <Download className="ndo-dl size-7" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-soft-ink">Download report</p>
                <p className="text-xs text-soft-muted">PDF · A4</p>
              </div>
            </>
          )}
        </button>
      </div>

      {settingsOpen ? (
        <div
          onClick={() => setSettingsOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-soft-ink/25 p-0 backdrop-blur-sm ss:items-center ss:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[min(92dvh,720px)] w-full max-w-md overflow-y-auto rounded-t-[22px] border border-soft-line bg-white shadow-soft-lg ss:rounded-[22px]"
          >
            <div className="sticky top-0 z-[1] flex items-start justify-between gap-4 border-b border-black/[0.05] bg-white px-5 py-5 ss:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-soft-muted">
                  Preferences
                </p>
                <h2 className="mt-1 text-[20px] font-bold tracking-tight text-soft-ink">
                  Report settings
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="ndo-press -mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-xl text-soft-muted hover:bg-soft-canvas hover:text-soft-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 ss:p-5">
              <div className="overflow-hidden rounded-[18px] border border-soft-line">
                <div className="divide-y divide-soft-line">
                  <SettingToggle
                    label="Overall adherence"
                    hint="Dose completion percentage"
                    checked={settings.includeAdherence}
                    onChange={(includeAdherence) =>
                      updateSettings({ includeAdherence })
                    }
                  />
                  <SettingToggle
                    label="Current medications"
                    checked={settings.includeCurrent}
                    onChange={(includeCurrent) =>
                      updateSettings({ includeCurrent })
                    }
                  />
                  <div>
                    <SettingToggle
                      label="Past medications"
                      hint={pastMedsHint(settings.pastMedsRange)}
                      checked={settings.includePast}
                      onChange={(includePast) =>
                        updateSettings({ includePast })
                      }
                    />
                    {settings.includePast ? (
                      <div className="px-4 pb-4">
                        <div
                          role="radiogroup"
                          aria-label="Past medications range"
                          className="grid grid-cols-3 rounded-lg border border-black/[0.06] bg-soft-canvas/80 p-0.5"
                        >
                          {PAST_MEDS_OPTIONS.map(({ value, label }) => {
                            const selected =
                              settings.pastMedsRange === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() =>
                                  updateSettings({ pastMedsRange: value })
                                }
                                className={`rounded-md px-1.5 py-1.5 text-[12px] font-semibold tracking-tight transition ${
                                  selected
                                    ? "bg-white text-soft-ink shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                                    : "text-soft-muted hover:text-soft-ink"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <SettingToggle
                    label="Allergies"
                    checked={settings.includeAllergies}
                    onChange={(includeAllergies) =>
                      updateSettings({ includeAllergies })
                    }
                  />
                  <SettingToggle
                    label="Side effects"
                    hint="From your health journal logs"
                    checked={settings.includeSideEffects}
                    onChange={(includeSideEffects) =>
                      updateSettings({ includeSideEffects })
                    }
                  />
                  <SettingToggle
                    label="Over-the-counter"
                    checked={settings.includeOtc}
                    onChange={(includeOtc) => updateSettings({ includeOtc })}
                  />
                  <SettingToggle
                    label="Herbs & supplements"
                    checked={settings.includeHerbs}
                    onChange={(includeHerbs) =>
                      updateSettings({ includeHerbs })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="ss:flex ss:justify-center">
        <div className="pointer-events-none fixed left-[-9999px] top-0 w-[794px] ss:pointer-events-auto ss:static ss:w-full ss:max-w-[794px]">
          <div
            ref={reportRef}
            className="flex flex-col bg-white text-[#0B1A2E]"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            {/* Header — former compact logo treatment */}
            <div className="flex items-center justify-between gap-6 border-b border-black/[0.06] px-10 py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-report-logo
                src="/assets/logo/logo-with-name-blue.png"
                alt="NoDoseOff"
                width={120}
                height={28}
                style={{
                  width: 120,
                  height: "auto",
                  maxWidth: 120,
                  maxHeight: 28,
                  display: "block",
                  objectFit: "contain",
                }}
              />
              <div className="text-right text-[13px] leading-snug">
                <p className="font-semibold capitalize text-[#0B1A2E]">
                  {name || "Patient"}
                </p>
                <p className="text-[#6B7280]">{email || "—"}</p>
                <p className="text-[#6B7280]">{phone || "—"}</p>
              </div>
            </div>

            <div className="px-10 py-7">
              <div className="flex items-end justify-between gap-4 border-b border-black/[0.06] pb-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
                    Clinical summary
                  </p>
                  <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[#002860]">
                    Medication History Report
                  </h1>
                </div>
                <p className="shrink-0 text-[12px] text-[#6B7280]">
                  {generatedLabel}
                </p>
              </div>

              {/* Adherence */}
              {settings.includeAdherence ? (
                <div className="mt-6 rounded-xl border border-black/[0.06] bg-[#F4F5F7] p-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
                        Overall adherence
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#6B7280]">
                        Based on recorded dose completions
                      </p>
                    </div>
                    <p className="text-[32px] font-bold leading-none tracking-tight text-[#002860]">
                      {adherence}
                      <span className="text-[16px] font-semibold text-[#6B7280]">
                        %
                      </span>
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#002860]"
                      style={{
                        width: `${Math.min(100, Math.max(0, adherence))}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null}

              {/* Sections */}
              {sections.length > 0 ? (
                <div className="mt-6 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
                    Medication overview
                  </p>
                  {sections.map(({ title, body, icon: Icon, tone }) => (
                    <div
                      key={title}
                      className="flex gap-3 rounded-xl border border-black/[0.06] bg-white p-3.5"
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tone}`}
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
                          {title}
                        </p>
                        <p className="mt-0.5 text-[13px] font-medium leading-relaxed capitalize text-[#0B1A2E]">
                          {body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-8 border-t border-black/[0.06] pt-4">
                <p className="text-[11px] leading-relaxed text-[#6B7280]">
                  Generated with NoDoseOff for clinical discussion. This report
                  is informational and does not replace professional medical
                  advice. Verify details with the patient before changing
                  treatment.
                </p>
                <p className="mt-2 text-[11px] text-[#9CA3AF]">
                  nodoseoff.com · Report generated {generatedLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
