// Simulated service request API utility
// Stores requests in localStorage under key 'submitted_service_requests'
// In a real app replace with fetch('/api/service-request', { method: 'POST', body: JSON.stringify(payload) })
// Integrated with unified Edge Function email notification via sendNotification()

import { sendNotification } from './notify';

export interface ServiceRequestPayload {
  name: string;
  email: string;
  company?: string;
  meetingDate?: string;
  meetingTime?: string;
  message?: string;
  requested: string[];
  submittedAt: string;
}

export interface ServiceRequestResponse {
  id: string;
  receivedAt: string;
  estimateEta: string; // placeholder ETA for reply
}

const STORAGE_KEY = 'submitted_service_requests';

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_SIMULATE_SERVICE_REQUESTS?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export async function submitServiceRequest(payload: ServiceRequestPayload): Promise<ServiceRequestResponse> {
  // Feature flag: allow local simulation only if explicitly enabled
  const base = (import.meta as ImportMeta).env?.VITE_API_BASE || '';
  const simulate = ((import.meta as ImportMeta).env?.VITE_SIMULATE_SERVICE_REQUESTS === 'true');
  const endpoint = `${base}/api/service-request`;
  let id = crypto.randomUUID();
  let backendAttempted = false;
  if (typeof fetch !== 'undefined') {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      backendAttempted = true;
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.id) id = data.id;
      } else {
        // surface backend validation error for UX clarity
        const errText = await res.text().catch(() => '');
        throw new Error(`Backend rejected request (status ${res.status}) ${errText}`);
      }
    } catch (e) {
      if (!simulate) {
        // Re-throw so UI can show failure instead of silently simulating success
        throw e instanceof Error ? e : new Error('Failed submitting service request');
      }
    }
  }
  if (simulate && (!backendAttempted)) {
    // optional local simulation path
    const record = { id, ...payload };
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const arr = existingRaw ? JSON.parse(existingRaw) : [];
      arr.push(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch {
      // ignore persistence errors
    }
  }

  const eta = new Date(Date.now() + 24 * 60 * 60 * 1000);
  eta.setHours(10, 0, 0, 0);
  const response = {
    id,
    receivedAt: new Date().toISOString(),
    estimateEta: eta.toISOString(),
  };
  // Fire & forget email notification via Edge Function (service-request event)
  sendNotification({
    type: 'service-request',
    id: response.id,
    meta: {
      email: payload.email,
      name: payload.name,
      company: payload.company,
      meetingDate: payload.meetingDate,
      meetingTime: payload.meetingTime,
      requested: payload.requested.join(', '),
      message: payload.message
    }
  }).catch(() => {});
  return response;
}

export function listServiceRequests(): ServiceRequestPayload[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
