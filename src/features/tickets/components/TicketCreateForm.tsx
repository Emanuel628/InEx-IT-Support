import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '@/features/tickets/lib/ticketStore';
import type {
  CreateTicketInput,
  TicketAppArea,
  TicketCategory,
  TicketEnvironment,
  TicketPriority,
  TicketSeverity,
  TicketSource,
} from '@/types/tickets';

type TicketFormState = CreateTicketInput & {
  tagsText: string;
};

const initialState: TicketFormState = {
  title: '',
  requester: '',
  requesterEmail: '',
  businessName: 'InEx Ledger',
  department: 'Product',
  asset: '',
  assignedTech: 'Evelyn',
  priority: 'medium',
  category: 'bug',
  source: 'manual',
  environment: 'production',
  appArea: 'unknown',
  severity: 'major',
  dueAt: '',
  details: '',
  reproductionSteps: '',
  expectedResult: '',
  actualResult: '',
  workaround: '',
  relatedBusinessId: '',
  relatedUserId: '',
  relatedRelease: 'v1',
  tags: [],
  tagsText: '',
};

const categoryOptions: { value: TicketCategory; label: string }[] = [
  { value: 'bug', label: 'Bug' },
  { value: 'billing', label: 'Billing' },
  { value: 'exports', label: 'Exports' },
  { value: 'receipts', label: 'Receipts' },
  { value: 'authentication', label: 'Authentication' },
  { value: 'data_integrity', label: 'Data Integrity' },
  { value: 'ui_ux', label: 'UI / UX' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'infrastructure', label: 'Infrastructure' },
];

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const sourceOptions: { value: TicketSource; label: string }[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'email', label: 'Email' },
  { value: 'contact_form', label: 'Contact Form' },
];

const environmentOptions: { value: TicketEnvironment; label: string }[] = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'local', label: 'Local' },
];

const appAreaOptions: { value: TicketAppArea; label: string }[] = [
  { value: 'auth', label: 'Auth' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'accounts', label: 'Accounts' },
  { value: 'categories', label: 'Categories' },
  { value: 'receipts', label: 'Receipts' },
  { value: 'exports', label: 'Exports' },
  { value: 'billing', label: 'Billing' },
  { value: 'settings', label: 'Settings' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'unknown', label: 'Unknown' },
];

const severityOptions: { value: TicketSeverity; label: string }[] = [
  { value: 'minor', label: 'Minor' },
  { value: 'major', label: 'Major' },
  { value: 'critical', label: 'Critical' },
];

function toTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function TicketCreateForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<TicketFormState>(initialState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleReset() {
    setForm(initialState);
    setError('');
  }

  function validateForm() {
    if (!form.title.trim()) return 'Ticket title is required.';
    if (!form.requester.trim()) return 'Requester is required.';
    if (!form.requesterEmail.trim()) return 'Requester email is required.';
    if (!form.details.trim()) return 'Issue details are required.';
    if (!form.expectedResult.trim()) return 'Expected result is required.';
    if (!form.actualResult.trim()) return 'Actual result is required.';
    return '';
  }

  function buildPayload(): CreateTicketInput {
    return {
      title: form.title,
      requester: form.requester,
      requesterEmail: form.requesterEmail,
      businessName: form.businessName,
      department: form.department,
      asset: form.asset,
      assignedTech: form.assignedTech,
      priority: form.priority,
      category: form.category,
      source: form.source,
      environment: form.environment,
      appArea: form.appArea,
      severity: form.severity,
      dueAt: form.dueAt,
      details: form.details,
      reproductionSteps: form.reproductionSteps,
      expectedResult: form.expectedResult,
      actualResult: form.actualResult,
      workaround: form.workaround,
      relatedBusinessId: form.relatedBusinessId,
      relatedUserId: form.relatedUserId,
      relatedRelease: form.relatedRelease,
      tags: toTags(form.tagsText),
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const ticket = createTicket(buildPayload());
      navigate(`/tickets/${ticket.id}`);
    } catch {
      setError('Failed to create ticket.');
      setIsSubmitting(false);
    }
  }

  return (
    <form className="ticket-form-layout" onSubmit={handleSubmit}>
      <div className="ticket-form-grid">
        <label>
          Requester
          <input
            name="requester"
            type="text"
            value={form.requester}
            onChange={handleChange}
            placeholder="Enter requester name"
          />
        </label>

        <label>
          Requester Email
          <input
            name="requesterEmail"
            type="email"
            value={form.requesterEmail}
            onChange={handleChange}
            placeholder="name@example.com"
          />
        </label>

        <label>
          Business Name
          <input
            name="businessName"
            type="text"
            value={form.businessName}
            onChange={handleChange}
            placeholder="Business or app name"
          />
        </label>

        <label>
          Department
          <input
            name="department"
            type="text"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
          />
        </label>

        <label>
          Asset / Surface
          <input
            name="asset"
            type="text"
            value={form.asset}
            onChange={handleChange}
            placeholder="Page, route, feature, device, or service"
          />
        </label>

        <label>
          Assigned Tech
          <input
            name="assignedTech"
            type="text"
            value={form.assignedTech}
            onChange={handleChange}
            placeholder="Technician name"
          />
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Source
          <select name="source" value={form.source} onChange={handleChange}>
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Environment
          <select name="environment" value={form.environment} onChange={handleChange}>
            {environmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          App Area
          <select name="appArea" value={form.appArea} onChange={handleChange}>
            {appAreaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Severity
          <select name="severity" value={form.severity} onChange={handleChange}>
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Due By
          <input name="dueAt" type="datetime-local" value={form.dueAt} onChange={handleChange} />
        </label>

        <label>
          Release
          <input
            name="relatedRelease"
            type="text"
            value={form.relatedRelease}
            onChange={handleChange}
            placeholder="v1"
          />
        </label>

        <label>
          Related Business ID
          <input
            name="relatedBusinessId"
            type="text"
            value={form.relatedBusinessId}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>

        <label>
          Related User ID
          <input
            name="relatedUserId"
            type="text"
            value={form.relatedUserId}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>
      </div>

      <label>
        Ticket Title
        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Short summary of the issue"
        />
      </label>

      <label>
        Issue Details
        <textarea
          name="details"
          rows={5}
          value={form.details}
          onChange={handleChange}
          placeholder="Describe the problem clearly"
        />
      </label>

      <label>
        Reproduction Steps
        <textarea
          name="reproductionSteps"
          rows={4}
          value={form.reproductionSteps}
          onChange={handleChange}
          placeholder="Steps to reproduce"
        />
      </label>

      <label>
        Expected Result
        <textarea
          name="expectedResult"
          rows={3}
          value={form.expectedResult}
          onChange={handleChange}
          placeholder="What should happen"
        />
      </label>

      <label>
        Actual Result
        <textarea
          name="actualResult"
          rows={3}
          value={form.actualResult}
          onChange={handleChange}
          placeholder="What actually happens"
        />
      </label>

      <label>
        Workaround
        <textarea
          name="workaround"
          rows={3}
          value={form.workaround}
          onChange={handleChange}
          placeholder="Known workaround, if any"
        />
      </label>

      <label>
        Tags
        <input
          name="tagsText"
          type="text"
          value={form.tagsText}
          onChange={handleChange}
          placeholder="Comma separated tags"
        />
      </label>

      {error ? <p className="ticket-form-error">{error}</p> : null}

      <div className="ticket-form-actions">
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
}