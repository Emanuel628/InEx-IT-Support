import { getActivityByEntity } from '@/features/activity/lib/activityStore';

type ErrorActivitySectionProps = {
  errorId: string;
};

export function ErrorActivitySection({ errorId }: ErrorActivitySectionProps) {
  const items = getActivityByEntity('error', errorId).slice(0, 8);

  return (
    <section className="error-panel">
      <div className="error-section-header">
        <h3>Recent Error Activity</h3>
        <span>Latest actions recorded for this error</span>
      </div>

      {items.length ? (
        <div className="error-activity-list">
          {items.map((item) => (
            <article key={item.id} className="error-activity-item">
              <div className="error-activity-header">
                <strong>{item.action.replace(/_/g, ' ')}</strong>
                <span>{item.timestamp}</span>
              </div>
              <p>{item.summary}</p>
              <small>{item.actor}</small>
            </article>
          ))}
        </div>
      ) : (
        <div className="error-empty-state">
          <span>No recorded activity</span>
          <p>This error has not generated any visible activity items yet.</p>
        </div>
      )}
    </section>
  );
}
