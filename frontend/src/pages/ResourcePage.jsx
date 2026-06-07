import { Edit2, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import PageHeader from "../components/PageHeader";
import { useApi } from "../hooks/useApi";

const ResourcePage = ({ title, singular = "Record", subtitle, endpoint, columns, fields, searchPlaceholder, transform = (v) => v }) => {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const url = useMemo(() => `${endpoint}${query ? `?search=${encodeURIComponent(query)}` : ""}`, [endpoint, query]);
  const { data, loading, reload } = useApi(url, { silent: true });

  const save = async (values) => {
    try {
      const payload = transform(values);
      if (editing?._id) {
        await api.put(`${endpoint}/${editing._id}`, payload);
        toast.success(`${singular} updated`);
      } else {
        await api.post(endpoint, payload);
        toast.success(`${singular} added`);
      }
      setModalOpen(false);
      setEditing(null);
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    }
  };

  const remove = async (row) => {
    if (!confirm("Delete this record?")) return;
    try {
      await api.delete(`${endpoint}/${row._id}`);
      toast.success("Record deleted");
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={<button className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} />Add</button>}
      />
      <div className="mb-4">
        <input className="field max-w-md" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder || "Search records"} />
      </div>
      <DataTable
        columns={columns}
        rows={data?.items || []}
        loading={loading}
        actions={(row) => (
          <div className="inline-flex gap-2">
            <button className="btn-secondary px-2" onClick={() => { setEditing(row); setModalOpen(true); }} aria-label="Edit"><Edit2 size={15} /></button>
            <button className="btn-danger px-2" onClick={() => remove(row)} aria-label="Delete"><Trash2 size={15} /></button>
          </div>
        )}
      />
      {modalOpen && <FormModal title={editing ? `Edit ${singular}` : `Add ${singular}`} fields={fields} initialValues={editing} onSubmit={save} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default ResourcePage;
