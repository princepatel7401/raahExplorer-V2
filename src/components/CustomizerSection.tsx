import { useMemo, useState, type FormEvent } from "react";
import type { CustomizerFieldOption, SiteContent } from "../types/site";
import { digitsOnly, formatIndianBudgetInput } from "../lib/indianRupeesFormat";
import { emptyCustomizerValues, openCustomizerMailto } from "../lib/tripCustomizerMailto";
import { SectionHeader } from "./SectionHeader";
import { TravelMonthField } from "./TravelMonthField";

function fieldId(label: string) {
  return `customizer-${label.replace(/\s+/g, "-").toLowerCase()}`;
}

function validateField(field: CustomizerFieldOption, raw: string): string | null {
  const v = raw.trim();
  if (field.type === "select" && !v) {
    return "Please choose an option.";
  }
  if (!v) {
    return "This field is required.";
  }
  if (field.type === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return "Enter a valid email address.";
    }
  }
  if (field.type === "month") {
    if (!/^\d{4}-\d{2}$/.test(v)) {
      return "Choose a month.";
    }
  }
  if (field.type === "inr") {
    if (digitsOnly(v).length === 0) {
      return "Enter budget in rupees.";
    }
  }
  return null;
}

export function CustomizerSection({ customizer }: { customizer: SiteContent["customizer"] }) {
  const initialValues = useMemo(() => emptyCustomizerValues(customizer.fields), [customizer.fields]);
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const gridFields = customizer.fields.slice(0, 4);
  const restFields = customizer.fields.slice(4);

  function setField(label: string, value: string) {
    setValues((prev) => ({ ...prev, [label]: value }));
    if (errors[label]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[label];
        return next;
      });
    }
    if (status !== "idle") setStatus("idle");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const f of customizer.fields) {
      const err = validateField(f, values[f.label] ?? "");
      if (err) nextErrors[f.label] = err;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    openCustomizerMailto(values);
    setStatus("success");
    setValues(emptyCustomizerValues(customizer.fields));
    setErrors({});
  }

  function renderField(field: CustomizerFieldOption) {
    const id = fieldId(field.label);
    const err = errors[field.label];
    const invalid = Boolean(err);
    const common = {
      id,
      value: values[field.label] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setField(field.label, e.target.value),
      "aria-invalid": invalid,
      "aria-describedby": invalid ? `${id}-error` : undefined,
    };

    return (
      <label key={field.label} htmlFor={id}>
        {field.label}
        {field.type === "select" ? (
          <select
            {...common}
            className={`customizer-select ${!(values[field.label] ?? "").trim() ? "customizer-select--empty" : ""}`}
          >
            <option value="">Select…</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea {...common} rows={5} placeholder={field.placeholder} />
        ) : field.type === "month" ? (
          <TravelMonthField
            id={id}
            value={values[field.label] ?? ""}
            onChange={(next) => setField(field.label, next)}
            invalid={invalid}
            min="2024-01"
            max="2035-12"
            ariaDescribedBy={invalid ? `${id}-error` : undefined}
          />
        ) : field.type === "inr" ? (
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={values[field.label] ?? ""}
            onChange={(e) => setField(field.label, formatIndianBudgetInput(e.target.value))}
            placeholder={field.placeholder}
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-error` : undefined}
            className="customizer-inr"
          />
        ) : (
          <input
            {...common}
            type={field.type === "email" ? "email" : "text"}
            placeholder={field.placeholder}
            autoComplete={field.type === "email" ? "email" : undefined}
          />
        )}
        {err ? (
          <span className="field-error" id={`${id}-error`} role="alert">
            {err}
          </span>
        ) : null}
      </label>
    );
  }

  return (
    <section id="customize" className="section section-contrast">
      <SectionHeader eyebrow={customizer.eyebrow} title={customizer.title} copy={customizer.copy} />

      <div className="customizer-layout">
        <form className="customizer-form" onSubmit={handleSubmit} noValidate>
          <div className="field-grid">{gridFields.map(renderField)}</div>

          {restFields.map(renderField)}

          <button className="btn btn-primary full-width" type="submit">
            {customizer.submitLabel}
          </button>

          {status === "success" ? (
            <p className="customizer-form__status customizer-form__status--success" role="status">
              Your email app should open with a draft to info@raahexplorer.com containing your details — send it to
              finish your request. If nothing opens, email us at info@raahexplorer.com manually.
            </p>
          ) : null}
        </form>

        <div className="proposal-card">
          <p className="eyebrow">{customizer.includedTitle}</p>
          <ul className="feature-list">
            {customizer.includedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
