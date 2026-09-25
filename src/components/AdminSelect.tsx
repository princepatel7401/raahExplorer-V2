import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface AdminSelectOption {
  value: string;
  label: string;
  hint?: string;
  tone?: "all" | "international" | "domestic" | "group" | "neutral";
}

interface AdminSelectProps {
  value: string;
  options: AdminSelectOption[];
  onChange: (value: string) => void;
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export function AdminSelect({
  value,
  options,
  onChange,
  label,
  ariaLabel,
  className = "",
}: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value) ?? options[0];

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setMenuPos(null);
      return;
    }
    const place = () => {
      const r = triggerRef.current!.getBoundingClientRect();
      const menuH = Math.min(280, window.innerHeight * 0.42);
      const spaceBelow = window.innerHeight - r.bottom - 10;
      const openUp = spaceBelow < menuH && r.top > spaceBelow;
      setMenuPos({
        top: openUp ? Math.max(8, r.top - menuH - 6) : r.bottom + 6,
        left: r.left,
        width: Math.max(r.width, 220),
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu =
    open && menuPos
      ? createPortal(
          <ul
            className="admin-dd__menu admin-dd__menu--portal"
            id={listId}
            role="listbox"
            aria-label={ariaLabel ?? label}
            ref={menuRef}
            style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <li key={opt.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`admin-dd__option${active ? " is-active" : ""}`}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <span className={`admin-dd__chip admin-dd__chip--${opt.tone ?? "neutral"}`} aria-hidden>
                      <span className="admin-dd__dot" />
                    </span>
                    <span className="admin-dd__option-text">
                      <strong>{opt.label}</strong>
                      {opt.hint ? <small>{opt.hint}</small> : null}
                    </span>
                    {active ? <span className="admin-dd__check" aria-hidden>✓</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body
        )
      : null;

  const body = (
    <div className={`admin-dd${open ? " is-open" : ""}${className ? ` ${className}` : ""}`} ref={rootRef}>
      <button
        type="button"
        className="admin-dd__trigger"
        ref={triggerRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel ?? label}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`admin-dd__chip admin-dd__chip--${selected?.tone ?? "neutral"}`} aria-hidden>
          <span className="admin-dd__dot" />
        </span>
        <span className="admin-dd__value">
          <strong>{selected?.label ?? "Select"}</strong>
          {selected?.hint ? <small>{selected.hint}</small> : null}
        </span>
        <span className="admin-dd__caret" aria-hidden />
      </button>
      {menu}
    </div>
  );

  if (!label) return body;

  return (
    <label className="admin-dd-field">
      {label}
      {body}
    </label>
  );
}
