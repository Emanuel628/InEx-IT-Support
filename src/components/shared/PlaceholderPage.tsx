type PlaceholderCard = {
  title: string;
  body: string;
};

type PlaceholderPageProps = {
  title: string;
  description: string;
  cards: PlaceholderCard[];
  actionLabel?: string;
  actionHint?: string;
  emptyStateTitle?: string;
  emptyStateBody?: string;
};

export function PlaceholderPage({
  title,
  description,
  cards,
  actionLabel,
  actionHint,
  emptyStateTitle = 'Nothing here yet',
  emptyStateBody = 'This scaffold page is in place and ready for local-first wiring.',
}: PlaceholderPageProps) {
  return (
    <section className="placeholder-page">
      <header className="placeholder-page-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        {actionLabel ? (
          <div className="placeholder-page-action" aria-label={`${title} primary action placeholder`}>
            <button type="button">{actionLabel}</button>
            {actionHint ? <span>{actionHint}</span> : null}
          </div>
        ) : null}
      </header>

      <div className="placeholder-grid">
        {cards.map((card) => (
          <article key={card.title} className="placeholder-card">
            <strong>{card.title}</strong>
            <span>{card.body}</span>
          </article>
        ))}
      </div>

      <section className="placeholder-empty-state" aria-label={`${title} empty state`}>
        <strong>{emptyStateTitle}</strong>
        <p>{emptyStateBody}</p>
      </section>
    </section>
  );
}
