import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApi } from "../hooks/useApi";
import { getName } from "../utils/format";

const Results = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, loading, reload } = useApi("/results", { silent: true });
  const { data: students } = useApi("/students?limit=100", { silent: true });
  const { data: companies } = useApi("/companies", { silent: true });
  const { data: rounds } = useApi("/rounds", { silent: true });

  const fields = [
    { name: "studentId", label: "Student", type: "select", options: (students?.items || []).map((item) => ({ value: item._id, label: `${item.name} (${item.rollNo})` })) },
    { name: "companyId", label: "Company", type: "select", options: (companies?.items || []).map((item) => ({ value: item._id, label: item.companyName })) },
    { name: "roundId", label: "Round", type: "select", options: (rounds?.items || []).map((item) => ({ value: item._id, label: `${getName(item.companyId)} - ${item.roundNumber}. ${item.roundName}` })) },
    { name: "result", label: "Result", type: "select", options: ["Selected", "Rejected", "Pending"].map((item) => ({ value: item, label: item })) }
  ];

  const save = async (values) => {
    try {
      await api.post("/results", values);
      toast.success("Result saved and progress updated");
      setModalOpen(false);
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Result failed");
    }
  };

  return (
    <>
      <PageHeader title="Results" subtitle="Enter selected, rejected, or pending results with progression rules enforced by the API." action={<button className="btn-primary" onClick={() => setModalOpen(true)}><Plus size={16} />Add Result</button>} />
      <DataTable
        loading={loading}
        rows={data?.items || []}
        columns={[
          { key: "student", label: "Student", render: (row) => `${getName(row.studentId)} (${row.studentId?.rollNo || "-"})` },
          { key: "company", label: "Company", render: (row) => getName(row.companyId) },
          { key: "round", label: "Round", render: (row) => `${row.roundId?.roundNumber}. ${getName(row.roundId)}` },
          { key: "result", label: "Result", render: (row) => <StatusBadge value={row.result} /> }
        ]}
      />
      {modalOpen && <FormModal title="Enter Result" fields={fields} onSubmit={save} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default Results;
