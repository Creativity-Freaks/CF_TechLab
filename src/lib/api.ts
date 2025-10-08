// Central API base resolution. In dev we rely on Vite proxy (/api -> localhost:4000).
// In production (Vercel static hosting) set VITE_API_BASE to full backend origin (e.g. https://api.example.com)
// or rely on vercel.json rewrites that forward /api/*.

export function apiBase() {
  return import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || '';
}

export async function apiFetch(input: string, init?: RequestInit) {
  const url = input.startsWith('http') ? input : `${apiBase()}${input}`;
  return fetch(url, init);
}
