import { Gift } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApi } from "../hooks/useApi";
import { getName } from "../utils/format";

const CandidateProgress = () => {
  const { data, loading, reload } = useApi("/progress", { silent: true });

  const markOffer = async (row) => {
    try {
      await api.post("/progress/offer", { studentId: row.studentId?._id, companyId: row.companyId?._id });
      toast.success("Offer received status saved");
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to mark offer");
    }
  };

  return (
    <>
      <PageHeader title="Candidate Progress" subtitle="Track current round, completed rounds, and final placement status." />
      <DataTable
        loading={loading}
        rows={data?.items || []}
        columns={[
          { key: "student", label: "Student", render: (row) => `${getName(row.studentId)} (${row.studentId?.rollNo || "-"})` },
          { key: "company", label: "Company", render: (row) => getName(row.companyId) },
          { key: "currentRound", label: "Current Round", render: (row) => row.currentRound ? `${row.currentRound.roundNumber}. ${row.currentRound.roundName}` : "-" },
          { key: "completedRounds", label: "Completed", render: (row) => row.completedRounds?.length || 0 },
          { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
          { key: "finalResult", label: "Final Result", render: (row) => <StatusBadge value={row.finalResult} /> }
        ]}
        actions={(row) => row.status === "Selected" ? <button className="btn-secondary" onClick={() => markOffer(row)}><Gift size={15} />Offer</button> : null}
      />
    </>
  );
};

export default CandidateProgress;
