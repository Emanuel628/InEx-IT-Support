export function TicketCreateForm() {
  return (
    <form className="ticket-form-layout">
      <div className="ticket-form-grid">
        <label>
          Requester
          <input type="text" placeholder="Search or enter requester" />
        </label>
        <label>
          Asset
          <input type="text" placeholder="Device, asset tag, or pending" />
        </label>
        <label>
          Category
          <select defaultValue="hardware">
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="network">Network</option>
            <option value="access">Access</option>
            <option value="printer">Printer</option>
            <option value="email">Email</option>
            <option value="security">Security</option>
          </select>
        </label>
        <label>
          Priority
          <select defaultValue="medium">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </label>
        <label>
          Assigned Tech
          <input type="text" placeholder="Assign technician" />
        </label>
        <label>
          Due By
          <input type="datetime-local" />
        </label>
      </div>

      <label>
        Ticket Title
        <input type="text" placeholder="Short summary of the issue" />
      </label>

      <label>
        Issue Details
        <textarea rows={6} placeholder="Describe the issue, symptoms, and what the user reported" />
      </label>

      <div className="ticket-form-actions">
        <button type="button">Save Draft</button>
        <button type="submit">Create Ticket</button>
      </div>
    </form>
  );
}
