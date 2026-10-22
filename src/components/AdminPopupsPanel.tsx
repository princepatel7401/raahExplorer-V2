import { useState } from "react";
import type { PromoPopup, PromoPopupKind } from "../types/site";
import {
  emptyPromoPopup,
  getPopupVisibility,
  todayIso,
  type PopupVisibility,
} from "../hooks/useLocalPopups";
import { AdminSelect, type AdminSelectOption } from "./AdminSelect";

const KIND_OPTIONS: AdminSelectOption[] = [
  {
    value: "festival",
    label: "Festival offer",
    hint: "Shows in a date range (or always if dates empty)",
    tone: "international",
  },
  {
    value: "daily",
    label: "Daily update",
    hint: "Shows only on the dates you set — beats festival when live",
    tone: "domestic",
  },
];

const STATUS_LABEL: Record<PopupVisibility, string> = {
  live: "Live now",
  scheduled: "Scheduled",
  ended: "Ended",
  off: "Off",
  "needs-date": "Needs date",
  empty: "Add content",
};

interface AdminPopupsPanelProps {
  popups: PromoPopup[];
  onChange: (popups: PromoPopup[]) => void;
}

function formatWindow(p: PromoPopup): string {
  if (p.kind === "daily") {
    if (!p.startDate) return "Set a date";
    if (!p.endDate || p.endDate === p.startDate) return p.startDate;
    return `${p.startDate} → ${p.endDate}`;
  }
  if (!p.startDate && !p.endDate) return "Always";
  if (p.startDate && !p.endDate) return `From ${p.startDate}`;
  if (!p.startDate && p.endDate) return `Until ${p.endDate}`;
  return `${p.startDate} → ${p.endDate}`;
}

export function AdminPopupsPanel({ popups, onChange }: AdminPopupsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(() => popups[0]?.id ?? null);
  const selected = popups.find((p) => p.id === selectedId) ?? popups[0] ?? null;
  const today = todayIso();

  const commit = (next: PromoPopup[]) => onChange(next);

  const patch = (partial: Partial<PromoPopup>) => {
    if (!selected) return;
    commit(popups.map((p) => (p.id === selected.id ? { ...p, ...partial } : p)));
  };

  const setKind = (kind: PromoPopupKind) => {
    if (!selected) return;
    if (kind === "daily" && !selected.startDate) {
      patch({ kind, startDate: today, endDate: selected.endDate || today });
      return;
    }
    patch({ kind });
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

  const selectedStatus = selected ? getPopupVisibility(selected, today) : null;
  const rangeInvalid =
    Boolean(selected?.startDate && selected?.endDate && selected.startDate > selected.endDate);

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
          Daily updates take priority over festival offers when both are live today.
        </p>
        <ul className="admin-list__items">
          {popups.map((p) => {
            const status = getPopupVisibility(p, today);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`admin-list__item${p.id === selected?.id ? " is-active" : ""}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <strong>{p.highlight || p.title || "Untitled"}</strong>
                  <span>
                    {p.kind === "festival" ? "Festival" : "Daily"} · {formatWindow(p)}
                  </span>
                  <span className={`admin-popup-status admin-popup-status--${status}`}>
                    {STATUS_LABEL[status]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="admin-editor admin-popups__editor">
        {!selected ? (
          <p className="admin-muted">Add a popup to get started.</p>
        ) : (
          <>
            <div className="admin-editor__head">
              <h2>Edit popup</h2>
              <div className="admin-popups__head-actions">
                {selectedStatus ? (
                  <span className={`admin-popup-status admin-popup-status--${selectedStatus}`}>
                    {STATUS_LABEL[selectedStatus]}
                  </span>
                ) : null}
                <button type="button" className="admin-btn admin-btn--danger admin-btn--small" onClick={remove}>
                  Delete
                </button>
              </div>
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
                  onChange={(v) => setKind(v as PromoPopupKind)}
                />
              </label>

              <label>
                Offer tag
                <input
                  value={selected.highlight}
                  onChange={(e) => patch({ highlight: e.target.value })}
                  placeholder="5% OFF"
                />
              </label>

              <label>
                Title
                <input
                  value={selected.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  placeholder="5% off on booking"
                />
              </label>

              <label className="admin-grid__full">
                Details
                <textarea
                  rows={3}
                  value={selected.message}
                  onChange={(e) => patch({ message: e.target.value })}
                  placeholder="Short offer details"
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

              {selected.kind === "daily" ? (
                <>
                  <label>
                    Show from
                    <input
                      type="date"
                      value={selected.startDate}
                      onChange={(e) => {
                        const startDate = e.target.value;
                        const endDate =
                          !selected.endDate || selected.endDate < startDate
                            ? startDate
                            : selected.endDate;
                        patch({ startDate, endDate });
                      }}
                    />
                  </label>
                  <label>
                    Show until
                    <input
                      type="date"
                      value={selected.endDate || selected.startDate}
                      min={selected.startDate || undefined}
                      onChange={(e) => patch({ endDate: e.target.value })}
                    />
                  </label>
                  <p className="admin-muted admin-grid__full admin-popups__date-hint">
                    Daily updates only appear between these dates (inclusive). Leave “until” the same as
                    “from” for a single day. Today is {today}.
                  </p>
                </>
              ) : (
                <>
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
                      min={selected.startDate || undefined}
                      onChange={(e) => patch({ endDate: e.target.value })}
                    />
                  </label>
                  <p className="admin-muted admin-grid__full admin-popups__date-hint">
                    Optional. Empty start/end = always show while enabled. Outside the range = hidden.
                    Today is {today}.
                  </p>
                </>
              )}

              {rangeInvalid ? (
                <p className="admin-popups__warn admin-grid__full">
                  End date is before start date — this popup will not show.
                </p>
              ) : null}
              {selectedStatus === "scheduled" ? (
                <p className="admin-popups__info admin-grid__full">
                  Not visible yet — starts on {selected.startDate}.
                </p>
              ) : null}
              {selectedStatus === "ended" ? (
                <p className="admin-popups__warn admin-grid__full">
                  Not visible — the end date has passed. Extend the end date or turn on a new popup.
                </p>
              ) : null}
              {selectedStatus === "needs-date" ? (
                <p className="admin-popups__warn admin-grid__full">
                  Daily updates need a start date before they can appear on the site.
                </p>
              ) : null}
              {selectedStatus === "live" ? (
                <p className="admin-popups__info admin-grid__full">
                  Visible on the site now
                  {selected.kind === "daily" ? " (daily updates win over festival offers)." : "."}
                </p>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
