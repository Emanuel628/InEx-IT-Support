export function TicketFiltersBar() {
  return (
    <div className="ticket-filters-bar">
      <div className="ticket-filter-group">
        <label>
          Search
          <input type="text" placeholder="Search tickets, users, assets..." />
        </label>
      </div>
      <div className="ticket-filter-group">
        <label>
          Status
          <select defaultValue="all">
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_on_user">Waiting on User</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
      </div>
      <div className="ticket-filter-group">
        <label>
          Priority
          <select defaultValue="all">
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>
    </div>
  );
}
