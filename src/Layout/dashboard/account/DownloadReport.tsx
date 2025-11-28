import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { toast } from "sonner";
import { DrugProps } from "../../../../types/dashboard/dashboard";
import { Download } from "lucide-react";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DrugHistoryReport: React.FC = () => {
  const { drugs, schedule, info, allergies, completedDrugs, otcDrugs, herbs } =
    useSelector((state: RootState) => state.app);

  const { name, phone, email } = info[0];
  const currentDrugs = drugs.map((drug) => drug.drug);
  const allergicDrugs = allergies.map((drug) => drug?.drug);

  const filterRecentDrugs = (completedDrugs: DrugProps[]) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return completedDrugs
      .filter((drug) => new Date(drug.end) >= sixMonthsAgo)
      .map((drug) => drug.drug);
  };
  const recentDrugs = Array.from(new Set(filterRecentDrugs(completedDrugs)));

  const currentTime = new Date();
  const completedBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose?.date}T${dose?.time}`);
    return doseDateTime <= currentTime && dose?.completed;
  });
  const totalBeforeCurrentTime = schedule.filter((dose) => {
    const doseDateTime = new Date(`${dose?.date}T${dose?.time}`);
    return doseDateTime <= currentTime;
  });
  const percentageCompleted =
    totalBeforeCurrentTime.length > 0
      ? (completedBeforeCurrentTime.length / totalBeforeCurrentTime.length) *
        100
      : 0;

  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setLoading(true);
    toast.loading("Generating PDF...");

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");

      // A4 page size in px at 96dpi
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate width and height to fit A4
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
      pdf.save(`${name}_drug_history_report.pdf`);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  const sectionClass =
    "border border-navyBlue/20 rounded-lg overflow-hidden mb-4";
  const sectionHeader = "bg-navyBlue text-white px-4 py-2 text-sm font-medium";
  const sectionBody = "px-4 py-3 text-sm capitalize";

  const Section = ({ title, data }: { title: string; data: string[] | string }) => (
    <div className={sectionClass}>
      <div className={sectionHeader}>{title}</div>
      <div className={sectionBody}>{Array.isArray(data) ? data.join(", ") || "N/A" : data}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-start w-full font-sans">
      {/* Header with download button */}
      <div className="w-full flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl ss:text-3xl font-semibold text-navyBlue">
            Drug History Reports
          </h1>
          <p className="text-sm ss:text-base text-gray-500">
            Share your drug history with your physician
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="px-4 py-2 flex gap-2 h-12 items-center text-white rounded-md bg-navyBlue hover:opacity-90 transition"
        >
          <Download className="w-5 h-5 text-white" />
          <span className="hidden sm:flex">{loading ? "Generating..." : "Download PDF"}</span>
        </button>
      </div>

      {/* Report content */}
      <div
        ref={reportRef}
        className="bg-white w-[210mm] min-h-[297mm] rounded-xl shadow-lg p-6 ss:p-10 text-navyBlue flex flex-col"
      >
        {/* Report header */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">Drug History Report</h2>
          <div className="text-right">
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="text-sm text-gray-600">{phone}</p>
          </div>
        </div>

        {/* Compliance bar */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-1">Drug Compliance</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-navyBlue h-3 rounded-full transition-all"
              style={{ width: `${percentageCompleted}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{percentageCompleted.toFixed(0)}% adherence</p>
        </div>

        {/* Sections */}
        <Section title="Ongoing Drugs" data={currentDrugs} />
        <Section title="Past Drugs (Last 6 Months)" data={recentDrugs} />
        <Section title="Allergies" data={allergicDrugs} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="Over the Counter Drugs" data={otcDrugs || "--"} />
          <Section title="Herbs & Concoctions" data={herbs || "--"} />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t text-center text-xs text-gray-400">
          Report generated via NoDoseOff
        </div>
      </div>
    </div>
  );
};

export default DrugHistoryReport;
