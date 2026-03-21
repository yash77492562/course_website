'use client';

interface ProgramOutcomeSectionProps {
  outcomes: string[];
  modules: Array<{
    title: string;
    items: string[];
  }>;
}

export function ProgramOutcomeSection({ outcomes, modules }: ProgramOutcomeSectionProps) {
  const outcomesHtml = (outcomes || []).map((outcome, index) => (
    <li key={index}>{outcome}</li>
  ));

  const modulesHtml = (modules || [])
    .map((m, index) => (
      <details key={index} className="curriculum-item" open={index === 0}>
        <summary>{m.title}</summary>
        <ul className="curriculum-list">
          {(m.items || []).map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      </details>
    ));

  return (
    <section className="program-section">
      <div className="program-two-col">
        <div className="reveal">
          <span className="section-label">Program Outcome</span>
          <h2 className="section-title">What you'll be able to do</h2>
          <ul className="bullets">{outcomesHtml}</ul>
        </div>
        <div className="reveal reveal-delay-1">
          <span className="section-label">Curriculum</span>
          <h2 className="section-title">Modules & projects</h2>
          <div className="accordion">{modulesHtml}</div>
        </div>
      </div>
    </section>
  );
}