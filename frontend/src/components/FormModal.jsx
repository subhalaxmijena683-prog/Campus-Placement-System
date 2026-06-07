import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const FormModal = ({ title, fields, initialValues, onSubmit, onClose, submitLabel = "Save" }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: initialValues || {} });

  useEffect(() => {
    reset(initialValues || {});
  }, [initialValues, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      <div className="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <button className="rounded-md p-2 hover:bg-slate-100" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form className="grid gap-4 p-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field) => (
            <label key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
              <span className="mb-1 block text-sm font-semibold text-slate-700">{field.label}</span>
              {field.type === "select" ? (
                <select className="field" {...register(field.name, { required: field.required !== false })}>
                  <option value="">Select</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea className="field min-h-24" {...register(field.name, { required: field.required !== false })} />
              ) : (
                <input className="field" type={field.type || "text"} step={field.step} {...register(field.name, { required: field.required !== false, valueAsNumber: field.valueAsNumber })} />
              )}
              {errors[field.name] && <span className="mt-1 block text-xs text-red-600">This field is required</span>}
            </label>
          ))}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 sm:col-span-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
