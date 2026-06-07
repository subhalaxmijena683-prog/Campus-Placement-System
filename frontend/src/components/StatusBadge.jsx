const styles = {
  Applied: "bg-slate-100 text-slate-700",
  "In Process": "bg-sky-100 text-sky-700",
  Rejected: "bg-red-100 text-red-700",
  Selected: "bg-emerald-100 text-emerald-700",
  Pending: "bg-slate-100 text-slate-700",
  "Offer Received": "bg-amber-100 text-amber-700",
  Present: "bg-emerald-100 text-emerald-700",
  Absent: "bg-red-100 text-red-700",
  Pass: "bg-emerald-100 text-emerald-700",
  Fail: "bg-red-100 text-red-700"
};

const StatusBadge = ({ value }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value] || "bg-slate-100 text-slate-700"}`}>
    {value || "-"}
  </span>
);

export default StatusBadge;
