import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Applications from "./pages/Applications";
import Attendance from "./pages/Attendance";
import CandidateProgress from "./pages/CandidateProgress";
import Companies from "./pages/Companies";
import Dashboard from "./pages/Dashboard";
import InterviewRounds from "./pages/InterviewRounds";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import Results from "./pages/Results";
import Students from "./pages/Students";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="companies" element={<Companies />} />
          <Route path="applications" element={<Applications />} />
          <Route path="rounds" element={<InterviewRounds />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="results" element={<Results />} />
          <Route path="progress" element={<CandidateProgress />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
