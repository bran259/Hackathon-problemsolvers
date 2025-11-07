const API_BASE = 'http://localhost:3001';

export const api = {
  // Works
  getWorks: () => fetch(`${API_BASE}/works?_expand=user`).then(r => r.json()),
  getWork: (id) => fetch(`${API_BASE}/works/${id}`).then(r => r.json()),
  createWork: (work) => fetch(`${API_BASE}/works`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(work)
  }).then(r => r.json()),
  updateWork: (id, work) => fetch(`${API_BASE}/works/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(work)
  }).then(r => r.json()),

  // Site Visits
  getSiteVisits: () => fetch(`${API_BASE}/siteVisits?_expand=work`).then(r => r.json()),
  createSiteVisit: (visit) => fetch(`${API_BASE}/siteVisits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visit)
  }).then(r => r.json()),

}