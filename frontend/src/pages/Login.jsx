import { ArrowRight, BarChart3, Building2, CheckCircle2, GraduationCap, ShieldCheck, UsersRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [mode, setMode] = useState("login");
  const { login, register: registerAdmin, isAuthenticated } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (values) => {
    try {
      if (mode === "register") {
        await registerAdmin({ ...values, role: "Admin" });
        toast.success("Admin registered");
      } else {
        await login(values);
        toast.success("Welcome back");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-white shadow-soft lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative bg-[linear-gradient(135deg,#0f172a_0%,#155e75_52%,#0f766e_100%)] p-6 sm:p-10 lg:p-12">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.55))]" />
          <div className="relative z-10 flex min-h-full flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-bold text-teal-50 ring-1 ring-white/15">
              <GraduationCap size={18} />
              Campus Interview Tracking
            </div>
            <div className="mt-12 max-w-3xl lg:mt-20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-100">Placement operations console</p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Campus hiring control room for every round, result, and offer.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-teal-50/85">
                Track students, companies, interview workflows, attendance, results, and placement reports from one secure officer dashboard.
              </p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Students", value: "2,400+", icon: UsersRound },
                { label: "Companies", value: "120+", icon: Building2 },
                { label: "Round Results", value: "Live", icon: BarChart3 }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <Icon className="text-teal-100" size={20} />
                    <p className="mt-4 text-2xl font-black">{item.value}</p>
                    <p className="text-sm text-teal-50/75">{item.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-auto grid gap-3 pt-10 text-sm text-teal-50/85 sm:grid-cols-2">
              <div className="flex items-center gap-2"><CheckCircle2 size={17} /> Sequence-safe interview workflows</div>
              <div className="flex items-center gap-2"><ShieldCheck size={17} /> JWT protected placement data</div>
            </div>
          </div>
        </section>
        <section className="flex items-center bg-slate-50 p-6 text-ink sm:p-10 lg:p-12">
          <div className="w-full">
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Officer access</p>
              <h2 className="mt-2 text-3xl font-black text-ink">{mode === "login" ? "Sign in to dashboard" : "Create placement admin"}</h2>
              <p className="mt-2 text-sm text-slate-500">Seed login: admin@campus.edu / Admin@123</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {mode === "register" && (
                <label>
                  <span className="mb-1 block text-sm font-semibold">Name</span>
                  <input className="field" {...register("name", { required: true })} />
                </label>
              )}
              <label>
                <span className="mb-1 block text-sm font-semibold">Email</span>
                <input className="field" type="email" {...register("email", { required: true })} />
              </label>
              <label>
                <span className="mb-1 block text-sm font-semibold">Password</span>
                <input className="field" type="password" {...register("password", { required: true })} />
              </label>
              <button className="btn-primary w-full py-3" disabled={isSubmitting}>
                {mode === "login" ? "Login" : "Create Admin"}
                <ArrowRight size={17} />
              </button>
            </form>
            <button className="mt-5 text-sm font-semibold text-brand hover:text-teal-800" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create a new admin account" : "Already have an account? Login"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
