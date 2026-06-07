import ResourcePage from "./ResourcePage";

const Students = () => (
  <ResourcePage
    title="Students"
    singular="Student"
    subtitle="Create, search, edit, and maintain eligible student profiles."
    endpoint="/students"
    searchPlaceholder="Search by name, roll number, or branch"
    fields={[
      { name: "name", label: "Name" },
      { name: "rollNo", label: "Roll Number" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
      { name: "branch", label: "Branch" },
      { name: "cgpa", label: "CGPA", type: "number", step: "0.01", valueAsNumber: true },
      { name: "passingYear", label: "Passing Year", type: "number", valueAsNumber: true }
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "rollNo", label: "Roll No" },
      { key: "branch", label: "Branch" },
      { key: "cgpa", label: "CGPA" },
      { key: "passingYear", label: "Year" },
      { key: "email", label: "Email" }
    ]}
  />
);

export default Students;
