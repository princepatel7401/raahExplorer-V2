import { useState } from "react";
import type { PromoPopup, PromoPopupKind } from "../types/site";
import { emptyPromoPopup } from "../hooks/useLocalPopups";
import { AdminSelect, type AdminSelectOption } from "./AdminSelect";

const KIND_OPTIONS: AdminSelectOption[] = [
  { value: "festival", label: "Festival offer", hint: "Shows until dismissed", tone: "international" },
  { value: "daily", label: "Daily update", hint: "Can return next day", tone: "domestic" },
];

interface AdminPopupsPanelProps {
  popups: PromoPopup[];
  onChange: (popups: PromoPopup[]) => void;
}

export function AdminPopupsPanel({ popups, onChange }: AdminPopupsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(() => popups[0]?.id ?? null);
  const selected = popups.find((p) => p.id === selectedId) ?? popups[0] ?? null;

  const commit = (next: PromoPopup[]) => onChange(next);

  const patch = (partial: Partial<PromoPopup>) => {
    if (!selected) return;
    commit(popups.map((p) => (p.id === selected.id ? { ...p, ...partial } : p)));
  };

  const add = () => {
    const p = emptyPromoPopup();
    commit([p, ...popups]);
    setSelectedId(p.id);
  };

  const remove = () => {
    if (!selected) return;
    if (!window.confirm(`Delete popup “${selected.title || "Untitled"}”?`)) return;
    const next = popups.filter((p) => p.id !== selected.id);
    commit(next);
    setSelectedId(next[0]?.id ?? null);
  };

  return (
    <div className="admin-popups">
      <aside className="admin-list admin-popups__list">
        <div className="admin-list__head">
          <h2>Popups</h2>
          <button type="button" className="admin-btn admin-btn--small" onClick={add}>
            + Add
          </button>
        </div>
        <p className="admin-muted admin-popups__hint">
          Festival offers & daily updates shown on the site after load.
        </p>
        <ul className="admin-list__items">
          {popups.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={`admin-list__item${p.id === selected?.id ? " is-active" : ""}`}
                onClick={() => setSelectedId(p.id)}
              >
                <strong>{p.title || "Untitled"}</strong>
                <span>
                  {p.kind === "festival" ? "Festival" : "Daily"}
                  {p.enabled ? " · On" : " · Off"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="admin-editor admin-popups__editor">
        {!selected ? (
          <p className="admin-muted">Add a popup to get started.</p>
        ) : (
          <>
            <div className="admin-editor__head">
              <h2>Edit popup</h2>
              <button type="button" className="admin-btn admin-btn--danger admin-btn--small" onClick={remove}>
                Delete
              </button>
            </div>

            <div className="admin-grid">
              <label className="admin-check admin-check--inline">
                <input
                  type="checkbox"
                  checked={selected.enabled}
                  onChange={(e) => patch({ enabled: e.target.checked })}
                />
                <span>Show on website</span>
              </label>

              <label>
                Type
                <AdminSelect
                  value={selected.kind}
                  options={KIND_OPTIONS}
                  ariaLabel="Popup type"
                  onChange={(v) => patch({ kind: v as PromoPopupKind })}
                />
              </label>

              <label>
                Title
                <input
                  value={selected.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  placeholder="Diwali getaway offer"
                />
              </label>

              <label className="admin-grid__full">
                Message
                <textarea
                  rows={3}
                  value={selected.message}
                  onChange={(e) => patch({ message: e.target.value })}
                  placeholder="Short offer or daily update copy"
                />
              </label>

              <label className="admin-grid__full">
                Image URL
                <input
                  value={selected.imageUrl}
                  onChange={(e) => patch({ imageUrl: e.target.value })}
                  placeholder="/International Destinations Labels/maldives.webp"
                />
              </label>

              <label>
                Button label
                <input
                  value={selected.ctaLabel}
                  onChange={(e) => patch({ ctaLabel: e.target.value })}
                  placeholder="Book now"
                />
              </label>

              <label>
                Button link
                <input
                  value={selected.ctaHref}
                  onChange={(e) => patch({ ctaHref: e.target.value })}
                  placeholder="#trips or WhatsApp URL"
                />
              </label>

              <label>
                Start date
                <input
                  type="date"
                  value={selected.startDate}
                  onChange={(e) => patch({ startDate: e.target.value })}
                />
              </label>

              <label>
                End date
                <input
                  type="date"
                  value={selected.endDate}
                  onChange={(e) => patch({ endDate: e.target.value })}
                />
              </label>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
