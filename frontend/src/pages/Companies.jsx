import { money } from "../utils/format";
import ResourcePage from "./ResourcePage";

const Companies = () => (
  <ResourcePage
    title="Companies"
    singular="Company"
    subtitle="Manage recruiters, eligibility, packages, and job descriptions."
    endpoint="/companies"
    searchPlaceholder="Search by company name"
    fields={[
      { name: "companyName", label: "Company Name" },
      { name: "package", label: "Package (LPA)", type: "number", step: "0.1", valueAsNumber: true },
      { name: "location", label: "Location" },
      { name: "eligibilityCGPA", label: "Eligibility CGPA", type: "number", step: "0.01", valueAsNumber: true },
      { name: "jobRole", label: "Job Role" },
      { name: "description", label: "Description", type: "textarea" }
    ]}
    columns={[
      { key: "companyName", label: "Company" },
      { key: "jobRole", label: "Role" },
      { key: "package", label: "Package", render: (row) => money(row.package) },
      { key: "eligibilityCGPA", label: "Min CGPA" },
      { key: "location", label: "Location" }
    ]}
  />
);

export default Companies;
