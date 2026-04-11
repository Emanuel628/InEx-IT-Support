type PlaceholderCard = {
  title: string;
  body: string;
};

type PlaceholderPageProps = {
  title: string;
  description: string;
  cards: PlaceholderCard[];
};

export function PlaceholderPage({ title, description, cards }: PlaceholderPageProps) {
  return (
    <section className="placeholder-page">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="placeholder-grid">
        {cards.map((card) => (
          <article key={card.title} className="placeholder-card">
            <strong>{card.title}</strong>
            <span>{card.body}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
