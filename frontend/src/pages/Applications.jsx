import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApi } from "../hooks/useApi";
import { getName, shortDate } from "../utils/format";

const Applications = () => {
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { data, loading, reload } = useApi(`/applications${status ? `?status=${status}` : ""}`, { silent: true });
  const { data: students } = useApi("/students?limit=100", { silent: true });
  const { data: companies } = useApi("/companies", { silent: true });

  const fields = [
    { name: "studentId", label: "Student", type: "select", options: (students?.items || []).map((item) => ({ value: item._id, label: `${item.name} (${item.rollNo})` })) },
    { name: "companyId", label: "Company", type: "select", options: (companies?.items || []).map((item) => ({ value: item._id, label: item.companyName })) }
  ];

  const save = async (values) => {
    try {
      await api.post("/applications", values);
      toast.success("Student registered to company");
      setModalOpen(false);
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const remove = async (row) => {
    if (!confirm("Delete this application?")) return;
    await api.delete(`/applications/${row._id}`);
    toast.success("Application deleted");
    reload();
  };

  return (
    <>
      <PageHeader title="Applications" subtitle="Register students to companies before interview rounds." action={<button className="btn-primary" onClick={() => setModalOpen(true)}><Plus size={16} />Register</button>} />
      <div className="mb-4 max-w-xs">
        <select className="field" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          {["Applied", "In Process", "Rejected", "Selected", "Offer Received"].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <DataTable
        loading={loading}
        rows={data?.items || []}
        columns={[
          { key: "student", label: "Student", render: (row) => `${getName(row.studentId)} (${row.studentId?.rollNo || "-"})` },
          { key: "company", label: "Company", render: (row) => getName(row.companyId) },
          { key: "role", label: "Role", render: (row) => row.companyId?.jobRole },
          { key: "applicationDate", label: "Applied On", render: (row) => shortDate(row.applicationDate) },
          { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> }
        ]}
        actions={(row) => <button className="btn-danger px-2" onClick={() => remove(row)} aria-label="Delete"><Trash2 size={15} /></button>}
      />
      {modalOpen && <FormModal title="Register Student To Company" fields={fields} onSubmit={save} onClose={() => setModalOpen(false)} submitLabel="Register" />}
    </>
  );
};

export default Applications;
