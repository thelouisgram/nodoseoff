import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { toast } from "sonner";
import { DrugProps } from "../../../../types/dashboard/dashboard";
import {
  Download,
  Pill,
  History,
  AlertTriangle,
  ShoppingCart,
  Leaf,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";

interface ReportProps {
  setTab: Function;
}

const Report: React.FC<ReportProps> = ({ setTab }) => {
  const { drugs, schedule, info, allergies, completedDrugs, otcDrugs, herbs } =
    useSelector((state: RootState) => state.app);

  const { name, phone, email } = info[0];

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
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(
        pageWidth / canvas.width,
        pageHeight / canvas.height
      );

      pdf.addImage(
        imgData,
        "PNG",
        (pageWidth - canvas.width * ratio) / 2,
        0,
        canvas.width * ratio,
        canvas.height * ratio
      );

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
    <div className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${chip}`}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">
          {title}
        </p>
        <p className="text-sm font-semibold break-words capitalize">
          {Array.isArray(data) ? data.join(", ") || "—" : data || "—"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] overflow-y-scroll w-full md:px-12 md:py-16 px-8 pt-10 pb-24 font-Inter">
      {/* Back */}
     <nav className="text-sm text-gray-500 flex items-center gap-1 mb-6 font-medium">
  <button
    onClick={() => setTab("Account")}
    className="hover:text-blue-600 transition-colors"
  >
    Settings
  </button>

  <span className="mx-1">/</span>

  <span className="text-gray-800 font-semibold">
    Report
  </span>
</nav>

      {/* Header */}
      <div className="flex flex-col ss:flex-row justify-between gap-6 mb-6">
        <div>
          <h1 className="text-2xl ss:text-3xl font-semibold">Drug Report</h1>
          <p className="text-sm text-gray-500">
            Share your drug history with your physician
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="h-12 px-4 flex items-center justify-center gap-2 rounded-lg border border-gray-200 text-slate-800 disabled:opacity-70"
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

      {/* A4 Preview */}
      <div className="flex justify-center">
        <div className="w-full max-w-[794px]">
          <div
            ref={reportRef}
            className="bg-white border border-gray-200 shadow-sm p-6 ss:p-8 flex flex-col min-h-[1123px]"
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b">
              <div className="relative w-[120px] h-[24px]">
                <Image
                  src="/assets/logo/logo-with-name-blue.png"
                  alt="NoDoseOff"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-right text-sm">
                <p className="font-medium">{name}</p>
                <p className="text-gray-500">{email}</p>
                <p className="text-gray-500">{phone}</p>
              </div>
            </div>

            {/* Content */}
            <div className="py-6 space-y-6 flex-1">
              {/* Compliance */}
              <div>
                <p className="text-sm font-medium mb-2">Drug Compliance</p>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-slate-800 rounded-full"
                    style={{ width: `${adherence}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {adherence}% adherence
                </p>
              </div>

              {/* Sections */}
              <SummarySection
                title="Ongoing Drugs"
                data={currentDrugs}
                icon={Pill}
                chip="text-indigo-600 bg-indigo-50"
              />
              <SummarySection
                title="Past Drugs (Last 6 Months)"
                data={recentDrugs}
                icon={History}
                chip="text-orange-600 bg-orange-50"
              />
              <SummarySection
                title="Allergies"
                data={allergicDrugs}
                icon={AlertTriangle}
                chip="text-red-600 bg-red-50"
              />

              <div className="grid ss:grid-cols-2 gap-4">
                <SummarySection
                  title="Over the Counter Drugs"
                  data={otcDrugs || "—"}
                  icon={ShoppingCart}
                  chip="text-blue-600 bg-blue-50"
                />
                <SummarySection
                  title="Herbs & Concoctions"
                  data={herbs || "—"}
                  icon={Leaf}
                  chip="text-green-600 bg-green-50"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t text-xs text-gray-400 text-center">
              Report generated via NoDoseOff • {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
