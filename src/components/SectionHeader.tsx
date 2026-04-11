interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  /** Optional — some sections are title-only (e.g. testimonials). */
  copy?: string;
}

export function SectionHeader({ eyebrow, title, copy }: SectionHeaderProps) {
  return (
    <div className={`section-head${copy ? "" : " section-head--no-aside"}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}
