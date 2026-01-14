import React, { useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
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
import {
  Download,
  Pill,
  History,
  AlertTriangle,
  ShoppingCart,
  Leaf,
  Loader2,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";

interface ReportProps {
  setTab: Function;
}

const Report: React.FC<ReportProps> = ({ setTab }) => {
  const { userId } = useAppStore((state) => state);
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
  const allergicDrugs = allergies.map((d) => d?.drug);

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

  const now = new Date();
  const completed = schedule.filter((dose) => {
    const t = new Date(`${dose.date}T${dose.time}`);
    return t <= now && dose.completed;
  });
  const total = schedule.filter((dose) => {
    const t = new Date(`${dose.date}T${dose.time}`);
    return t <= now;
  });

  const adherence =
    total.length > 0 ? Math.round((completed.length / total.length) * 100) : 0;

  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setLoading(true);

    try {
      const clone = reportRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.width = "794px";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        width: 794,
        windowWidth: 794,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const ratio = pageWidth / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, canvas.height * ratio);

      pdf.save(`${name.replace(/\s+/g, "_")}_drug_report.pdf`);
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error("Failed to generate PDF");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const SummarySection = ({
    title,
    data,
    icon: Icon,
    chip,
  }: {
    title: string;
    data: string[] | string;
    icon: any;
    chip: string;
  }) => (
    <div className="flex gap-3 p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${chip}`}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">
          {title}
        </p>
        <p className="text-sm font-semibold break-words capitalize text-slate-800 dark:text-slate-100">
          {Array.isArray(data) ? data.join(", ") || "—" : data || "—"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] overflow-y-scroll w-full px-6 ss:px-8 pt-10 pb-24 font-Inter text-slate-800">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-6 font-karla">
        <button
          onClick={() => setTab("Account")}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Settings
        </button>
        <span className="dark:text-gray-600">/</span>
        <span className="text-gray-800 dark:text-slate-100 font-semibold">
          Report
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col ss:flex-row justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl ss:text-3xl font-semibold dark:text-slate-100">
            Drug Report
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Share your drug history with your physician
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="hidden ss:flex h-12 px-4 items-center gap-2 rounded-lg border border-gray-100 dark:border-slate-800 text-slate-800 dark:text-slate-400 disabled:opacity-70 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="size-5" />
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* ✅ MOBILE (< ss): Download Card */}
      <div className="ss:hidden flex justify-center mt-12">
        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="w-full max-w-sm h-44 flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="size-10 animate-spin text-gray-600 dark:text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Generating PDF…
              </p>
            </>
          ) : (
            <>
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Download className="size-8 text-slate-800 dark:text-slate-100" />
              </div>
              <div className="text-center">
                <p className="font-semibold dark:text-slate-100">
                  Download Drug Report
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF • A4 document
                </p>
              </div>
            </>
          )}
        </button>
      </div>

      {/* ✅ PREVIEW (>= ss only) */}
      <div className="hidden ss:flex justify-center">
        <div className="w-full max-w-[794px]">
          <div
            ref={reportRef}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm p-8 flex flex-col min-h-[1123px]"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="relative w-[120px] h-[24px] flex-shrink-0">
                <Image
                  src="/assets/logo/logo-with-name-blue.png"
                  alt="NoDoseOff"
                  fill
                  className="block dark:hidden object-contain"
                  sizes="120px"
                  priority
                />
                <Image
                  src="/assets/logo/logo-with-name-white.png"
                  alt="NoDoseOff"
                  fill
                  className="hidden dark:block object-contain"
                  sizes="120px"
                  priority
                />
              </div>

              <div className="text-right text-sm dark:text-slate-300">
                <p className="font-medium dark:text-slate-100">{name}</p>
                <p className="text-gray-500 dark:text-gray-400">{email}</p>
                <p className="text-gray-500 dark:text-gray-400">{phone}</p>
              </div>
            </div>

            {/* Content */}
            <div className="py-6 space-y-6 flex-1">
              <h1 className="text-xl text-slate-800 dark:text-slate-100 font-bold font-Poppins text-center">
                Medication History Report
              </h1>
              <div>
                <p className="text-sm font-medium mb-2 dark:text-slate-300">
                  Drug Compliance
                </p>
                <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full">
                  <div
                    className="h-full bg-slate-800 dark:bg-blue-500 rounded-full"
                    style={{ width: `${adherence}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {adherence}% adherence
                </p>
              </div>

              <SummarySection
                title="Ongoing Drugs"
                data={currentDrugs}
                icon={Pill}
                chip="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/50"
              />
              <SummarySection
                title="Past Drugs (Last 6 Months)"
                data={recentDrugs}
                icon={History}
                chip="text-orange-600 bg-orange-50 dark:bg-orange-900/50"
              />
              <SummarySection
                title="Allergies"
                data={allergicDrugs}
                icon={AlertTriangle}
                chip="text-red-600 bg-red-50 dark:bg-red-900/50"
              />

              <div className="grid grid-cols-2 gap-4">
                <SummarySection
                  title="OTC Drugs"
                  data={otcDrugs || "—"}
                  icon={ShoppingCart}
                  chip="text-blue-600 bg-blue-50 dark:bg-blue-900/50"
                />
                <SummarySection
                  title="Herbs & Concoctions"
                  data={herbs || "—"}
                  icon={Leaf}
                  chip="text-green-600 bg-green-50 dark:bg-green-900/50"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400 dark:text-gray-500 text-center">
              Report generated via NoDoseOff • {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
