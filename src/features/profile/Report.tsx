import React, { useRef, useState } from "react";
import { useAppSelector } from "@/store";
import {
  useDrugs,
  useSchedule,
  useUserInfo,
  useAllergies,
  useCompletedDrugs,
  useOtcDrugs,
  useHerbs,
} from "@/hooks/useDashboardData";
import { toast } from "sonner";
import { DrugProps } from "@/types/dashboard";
import { calculateOverallCompliance } from "@/utils/dashboard/drugs";
import {
  Download,
  Pill,
  History,
  AlertTriangle,
  ShoppingCart,
  Leaf,
  Loader2,
} from "lucide-react";

interface ReportProps {
  setTab: Function;
}

function formatList(items: string[] | string | undefined | null): string {
  if (Array.isArray(items)) {
    const cleaned = items.map((s) => String(s || "").trim()).filter(Boolean);
    return cleaned.length ? cleaned.join(", ") : "None recorded";
  }
  const s = String(items || "").trim();
  return s || "None recorded";
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

  const userInfo = info?.[0] || { name: "", phone: "", email: "" };
  const { name, phone, email } = userInfo;

  const currentDrugs = drugs.map((d) => d.drug);
  const allergicDrugs = allergies
    .map((d) => d?.drug)
    .filter(Boolean) as string[];

  const filterRecentDrugs = (items: DrugProps[]) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return Array.from(
      new Set(
        items.filter((d) => new Date(d.end) >= sixMonthsAgo).map((d) => d.drug)
      )
    );
  };

  const recentDrugs = filterRecentDrugs(completedDrugs);
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
    {
      title: "Current medications",
      body: formatList(currentDrugs),
      icon: Pill,
      tone: "bg-[#E8EEF5] text-[#002860]",
    },
    {
      title: "Completed (last 6 months)",
      body: formatList(recentDrugs),
      icon: History,
      tone: "bg-[#F6E7D8] text-[#7A5A3C]",
    },
    {
      title: "Allergies",
      body: formatList(allergicDrugs),
      icon: AlertTriangle,
      tone: "bg-[#FFE4EE] text-[#8A3D5A]",
    },
    {
      title: "Over-the-counter",
      body: formatList(otcDrugs),
      icon: ShoppingCart,
      tone: "bg-[#E8EEF5] text-[#002860]",
    },
    {
      title: "Herbs & supplements",
      body: formatList(herbs),
      icon: Leaf,
      tone: "bg-[#E5F6EE] text-[#2F6B4F]",
    },
  ];

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

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={loading}
          className="hidden h-11 items-center gap-2 rounded-xl bg-soft-primary px-4 text-[14px] font-semibold text-white shadow-soft-sm transition hover:bg-soft-primary/90 disabled:opacity-70 ss:inline-flex"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Download className="size-4" />
              Download PDF
            </>
          )}
        </button>
      </div>

      <div className="mt-8 flex justify-center ss:hidden">
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={loading}
          className="flex h-44 w-full max-w-sm flex-col items-center justify-center gap-4 rounded-2xl border border-black/[0.05] bg-white shadow-soft-sm disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="size-10 animate-spin text-soft-muted" />
              <p className="text-sm text-soft-muted">Generating PDF…</p>
            </>
          ) : (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-soft-primary-soft text-soft-primary">
                <Download className="size-7" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-soft-ink">Download report</p>
                <p className="text-xs text-soft-muted">PDF · A4</p>
              </div>
            </>
          )}
        </button>
      </div>

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

              {/* Sections */}
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
