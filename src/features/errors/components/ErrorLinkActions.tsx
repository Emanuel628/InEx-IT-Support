type LinkableRecord = {
  id: string;
};

type ErrorLinkActionsProps = {
  title: string;
  records: LinkableRecord[];
  activeIds: string[];
  onToggle: (id: string) => void;
};

export function ErrorLinkActions({ title, records, activeIds, onToggle }: ErrorLinkActionsProps) {
  if (!records.length) {
    return null;
  }

  return (
    <div className="error-link-actions-group">
      <strong>{title}</strong>
      <div className="error-inline-actions">
        {records.map((record) => {
          const isActive = activeIds.includes(record.id);
          return (
            <button
              key={record.id}
              type="button"
              onClick={() => onToggle(record.id)}
            >
              {isActive ? `Unlink ${record.id}` : `Link ${record.id}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
