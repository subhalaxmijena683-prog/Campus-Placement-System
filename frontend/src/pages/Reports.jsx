import { Download } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { downloadReport } from "../services/reportService";

const reports = [
  { title: "Student Placement Report", path: "student-placement" },
  { title: "Company Recruitment Report", path: "company-recruitment" },
  { title: "Attendance Report", path: "attendance" },
  { title: "Selection/Rejection Report", path: "selection-rejection" },
  { title: "Recruitment Summary Report", path: "recruitment-summary" }
];

const Reports = () => {
  return (
    <>
      <PageHeader title="Reports" subtitle="Export placement, recruitment, attendance, and summary reports as PDF." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <div key={report.path} className="panel p-5">
            <h3 className="font-bold text-ink">{report.title}</h3>
            <p className="mt-2 text-sm text-slate-500">Ready-to-download exports generated from live database records.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={() => downloadReport(report, "pdf")}>
                <Download size={16} />
                PDF
              </button>
              <button className="btn-secondary" onClick={() => downloadReport(report, "csv")}>
                <Download size={16} />
                CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Reports;
