import {
  BarChart3,
  Building2,
  ClipboardCheck,
  FileText,
  Gauge,
  GraduationCap,
  Layers3,
  ListChecks,
  LogOut,
  Menu,
  Trophy,
  UsersRound,
  X
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/students", label: "Students", icon: GraduationCap },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/applications", label: "Applications", icon: ClipboardCheck },
  { to: "/rounds", label: "Interview Rounds", icon: Layers3 },
  { to: "/attendance", label: "Attendance", icon: ListChecks },
  { to: "/results", label: "Results", icon: Trophy },
  { to: "/progress", label: "Candidate Progress", icon: UsersRound },
  { to: "/reports", label: "Reports", icon: FileText }
];

const Sidebar = ({ close }) => (
  <aside className="flex h-full w-72 flex-col bg-ink text-white">
    <div className="border-b border-white/10 px-5 py-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-200">CITRMS</p>
          <h1 className="mt-1 text-lg font-bold leading-tight">Campus Interview Tracking</h1>
        </div>
        <button className="rounded-md p-2 hover:bg-white/10 lg:hidden" onClick={close} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>
    </div>
    <nav className="flex-1 space-y-1 px-3 py-4">
      {nav.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-brand text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  </aside>
);

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar />
      </div>
      {open && (
  <div className="fixed inset-0 z-40 lg:hidden">
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setOpen(false)}
    />
    <div className="relative z-50">
      <Sidebar close={() => setOpen(false)} />
    </div>
  </div>
)}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between">
            <button className="rounded-md p-2 text-ink hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div className="hidden items-center gap-2 text-sm font-semibold text-slate-600 lg:flex">
              <BarChart3 size={18} className="text-brand" />
              Placement operations console
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">{user?.name || "Admin"}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button className="btn-secondary" onClick={handleLogout}>
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
