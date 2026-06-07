import { getName } from "../utils/format";
import ResourcePage from "./ResourcePage";
import { useApi } from "../hooks/useApi";

const InterviewRounds = () => {
  const { data: companies } = useApi("/companies", { silent: true });
  return (
    <ResourcePage
      title="Interview Rounds"
      singular="Interview Round"
      subtitle="Maintain ordered round sequences for each company."
      endpoint="/rounds"
      fields={[
        { name: "companyId", label: "Company", type: "select", options: (companies?.items || []).map((item) => ({ value: item._id, label: item.companyName })) },
        { name: "roundName", label: "Round Name" },
        { name: "roundNumber", label: "Round Number", type: "number", valueAsNumber: true }
      ]}
      transform={(values) => ({ ...values, companyId: typeof values.companyId === "object" ? values.companyId._id : values.companyId })}
      columns={[
        { key: "company", label: "Company", render: (row) => getName(row.companyId) },
        { key: "roundNumber", label: "Sequence" },
        { key: "roundName", label: "Round" }
      ]}
    />
  );
};

export default InterviewRounds;
