import { Building2, ClipboardCheck, Layers3, UserCheck, UserX, Users, WalletCards } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import PageHeader from "../components/PageHeader";
import { useApi } from "../hooks/useApi";

const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className="panel p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-black text-ink">{value ?? 0}</p>
      </div>
      <div className={`rounded-md p-3 ${accent}`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const palette = ["#0f766e", "#2563eb", "#d99b22", "#d9534f", "#7c3aed", "#059669"];

const Dashboard = () => {
  const { data, loading } = useApi("/dashboard", { silent: true });
  const cards = data?.cards || {};
  const companyData = [...new Set((data?.charts?.companyWise || []).map((item) => item.companyName))].map((name) => ({
    name,
    applications: (data?.charts?.companyWise || [])
      .filter((item) => item.companyName === name)
      .reduce((sum, item) => sum + item.count, 0)
  }));
  const progressData = (data?.charts?.recruitmentProgress || []).map((item) => ({ name: item._id, value: item.count }));
  const attendanceData = (data?.charts?.attendanceSummary || []).map((item) => ({ name: item._id, students: item.count }));
  const selectionData = (data?.charts?.selectionSummary || []).map((item) => ({ name: item._id, students: item.count }));

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Live recruitment statistics and interview pipeline health." />
      {loading ? <div className="panel p-8 text-center text-slate-500">Loading dashboard...</div> : (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Students" value={cards.totalStudents} icon={Users} accent="bg-teal-50 text-brand" />
            <StatCard label="Total Companies" value={cards.totalCompanies} icon={Building2} accent="bg-amber-50 text-gold" />
            <StatCard label="Total Applications" value={cards.totalApplications} icon={ClipboardCheck} accent="bg-indigo-50 text-indigo-600" />
            <StatCard label="Total Interview Rounds" value={cards.totalInterviewRounds} icon={Layers3} accent="bg-rose-50 text-coral" />
            <StatCard label="Students In Process" value={cards.studentsInProcess} icon={WalletCards} accent="bg-sky-50 text-sky-600" />
            <StatCard label="Selected Students" value={cards.selectedStudents} icon={UserCheck} accent="bg-emerald-50 text-emerald-600" />
            <StatCard label="Rejected Students" value={cards.rejectedStudents} icon={UserX} accent="bg-red-50 text-red-600" />
            <StatCard label="Offer Received" value={cards.offerReceivedStudents} icon={UserCheck} accent="bg-orange-50 text-orange-600" />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <div className="panel p-5">
              <h3 className="mb-4 font-bold text-ink">Company Wise Recruitment</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#0f766e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel p-5">
              <h3 className="mb-4 font-bold text-ink">Recruitment Progress Overview</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={progressData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                      {progressData.map((entry, index) => <Cell key={entry.name} fill={palette[index % palette.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel p-5">
              <h3 className="mb-4 font-bold text-ink">Attendance Summary</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="students" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel p-5">
              <h3 className="mb-4 font-bold text-ink">Selection vs Rejection</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="students" fill="#d99b22" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
