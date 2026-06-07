import api from "../api/axios";

export const downloadReport = async (report, format = "pdf") => {
  const response = await api.get(`/reports/${report.path}?format=${format}`, { responseType: "blob" });
  const mimeType = format === "csv" ? "text/csv" : "application/pdf";
  const url = URL.createObjectURL(new Blob([response.data], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.path}.${format}`;
  link.click();
  URL.revokeObjectURL(url);
};
