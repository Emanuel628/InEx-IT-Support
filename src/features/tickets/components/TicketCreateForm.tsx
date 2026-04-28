import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '@/features/tickets/lib/ticketStore';
import { getErrors } from '@/features/errors/lib/errorStore';
import { getIncidents } from '@/features/incidents/lib/incidentStore';
import { getKnowledgeArticles } from '@/features/knowledge/lib/knowledgeStore';
import { getResolutions } from '@/features/resolutions/lib/resolutionStore';
import { getReleases } from '@/features/releases/lib/releaseStore';
import { getSettings } from '@/features/settings/lib/settingsStore';
import { TICKET_PRIORITIES, TICKET_SEVERITIES } from '@/constants/workflow';
import type {
  CreateTicketInput,
  TicketPriority,
  TicketSeverity,
} from '@/types/tickets';

type TicketFormState = CreateTicketInput & {
  tagsText: string;
  relatedErrorIdsText: string;
  relatedKnowledgeArticleIdsText: string;
};

const initialState: TicketFormState = {
  title: '',
  requester: '',
  requesterEmail: '',
  businessName: '',
  department: 'Customer Support',
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
  relatedRelease: '',
  relatedErrorIds: [],
  relatedIncidentId: '',
  relatedResolutionId: '',
  relatedKnowledgeArticleIds: [],
  tags: [],
  tagsText: '',
  relatedErrorIdsText: '',
  relatedKnowledgeArticleIdsText: '',
};

function toCommaList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function labelize(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function TicketCreateForm() {
  const navigate = useNavigate();
  const settings = useMemo(() => getSettings(), []);
  const releases = useMemo(() => getReleases().slice(0, 6), []);
  const errors = useMemo(() => getErrors().slice(0, 6), []);
  const incidents = useMemo(() => getIncidents().slice(0, 6), []);
  const resolutions = useMemo(() => getResolutions().slice(0, 6), []);
  const knowledgeArticles = useMemo(() => getKnowledgeArticles().slice(0, 6), []);
  const [form, setForm] = useState<TicketFormState>({
    ...initialState,
    assignedTech: settings.defaultAssignee || 'Unassigned',
    category: (settings.categories[0] || 'bug') as TicketFormState['category'],
    source: (settings.sources[0] || 'manual') as TicketFormState['source'],
    environment: (settings.environments[0] || 'production') as TicketFormState['environment'],
    appArea: (settings.appAreas[0] || 'unknown') as TicketFormState['appArea'],
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleReset() {
    setForm({
      ...initialState,
      assignedTech: settings.defaultAssignee || 'Unassigned',
      category: (settings.categories[0] || 'bug') as TicketFormState['category'],
      source: (settings.sources[0] || 'manual') as TicketFormState['source'],
      environment: (settings.environments[0] || 'production') as TicketFormState['environment'],
      appArea: (settings.appAreas[0] || 'unknown') as TicketFormState['appArea'],
    });
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
      relatedErrorIds: toCommaList(form.relatedErrorIdsText),
      relatedIncidentId: form.relatedIncidentId,
      relatedResolutionId: form.relatedResolutionId,
      relatedKnowledgeArticleIds: toCommaList(form.relatedKnowledgeArticleIdsText),
      tags: toCommaList(form.tagsText),
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
            placeholder="Affected business or account name"
          />
        </label>

        <label>
          Department
          <input
            name="department"
            type="text"
            value={form.department}
            onChange={handleChange}
            placeholder="Customer Support"
          />
        </label>

        <label>
          Product Surface
          <input
            name="asset"
            type="text"
            value={form.asset}
            onChange={handleChange}
            placeholder="Page, route, workflow, or service"
          />
        </label>

        <label>
          Assigned Tech
          <select name="assignedTech" value={form.assignedTech} onChange={handleChange}>
            {['Unassigned', ...settings.technicians].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {settings.categories.map((value) => (
              <option key={value} value={value}>{labelize(value)}</option>
            ))}
          </select>
        </label>

        <label>
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            {TICKET_PRIORITIES.map((value) => (
              <option key={value} value={value}>{labelize(value)}</option>
            ))}
          </select>
        </label>

        <label>
          Source
          <select name="source" value={form.source} onChange={handleChange}>
            {settings.sources.map((value) => (
              <option key={value} value={value}>{labelize(value)}</option>
            ))}
          </select>
        </label>

        <label>
          Environment
          <select name="environment" value={form.environment} onChange={handleChange}>
            {settings.environments.map((value) => (
              <option key={value} value={value}>{labelize(value)}</option>
            ))}
          </select>
        </label>

        <label>
          App Area
          <select name="appArea" value={form.appArea} onChange={handleChange}>
            {settings.appAreas.map((value) => (
              <option key={value} value={value}>{labelize(value)}</option>
            ))}
          </select>
        </label>

        <label>
          Severity
          <select name="severity" value={form.severity} onChange={handleChange}>
            {TICKET_SEVERITIES.map((value) => (
              <option key={value} value={value}>{labelize(value)}</option>
            ))}
          </select>
        </label>

        <label>
          Due By
          <input name="dueAt" type="datetime-local" value={form.dueAt} onChange={handleChange} />
        </label>

        <label>
          Related Release ID
          <input
            name="relatedRelease"
            type="text"
            value={form.relatedRelease}
            onChange={handleChange}
            placeholder="REL-3004"
          />
        </label>

        <label>
          Related Business ID
          <input
            name="relatedBusinessId"
            type="text"
            value={form.relatedBusinessId}
            onChange={handleChange}
            placeholder="BIZ-2001"
          />
        </label>

        <label>
          Related User ID
          <input
            name="relatedUserId"
            type="text"
            value={form.relatedUserId}
            onChange={handleChange}
            placeholder="USR-1001"
          />
        </label>

        <label>
          Related Incident ID
          <input
            name="relatedIncidentId"
            type="text"
            value={form.relatedIncidentId}
            onChange={handleChange}
            placeholder="INCIDENT-2001"
          />
        </label>

        <label>
          Related Resolution ID
          <input
            name="relatedResolutionId"
            type="text"
            value={form.relatedResolutionId}
            onChange={handleChange}
            placeholder="RES-4001"
          />
        </label>
      </div>

      <div className="ticket-detail-stack">
        <div>
          <strong>Available link targets</strong>
          <p>Releases: {releases.map((release) => release.id).join(', ') || '—'}</p>
          <p>Errors: {errors.map((record) => record.id).join(', ') || '—'}</p>
          <p>Incidents: {incidents.map((incident) => incident.id).join(', ') || '—'}</p>
          <p>Resolutions: {resolutions.map((resolution) => resolution.id).join(', ') || '—'}</p>
          <p>Knowledge: {knowledgeArticles.map((article) => article.id).join(', ') || '—'}</p>
        </div>
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
        Related Error IDs
        <input
          name="relatedErrorIdsText"
          type="text"
          value={form.relatedErrorIdsText}
          onChange={handleChange}
          placeholder="ERR-5001, ERR-5002"
        />
      </label>

      <label>
        Related Knowledge Article IDs
        <input
          name="relatedKnowledgeArticleIdsText"
          type="text"
          value={form.relatedKnowledgeArticleIdsText}
          onChange={handleChange}
          placeholder="KB-6001, KB-6002"
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
