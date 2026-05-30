const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const dashboardPath = path.join(repoRoot, 'apps/web/src/app/dashboard/page.tsx');
const source = fs.readFileSync(dashboardPath, 'utf8');

const requiredSnippets = [
  "fetch('/api/orders'",
  "fetch('/api/reservations'",
  "fetch('/api/photos?mine=true'",
  "getAuthHeaders(user",
  'setOrders(',
  'setReservations(',
  'setPhotos(',
];

const failures = requiredSnippets.filter((snippet) => !source.includes(snippet));

if (source.includes('// Tab Components (placeholders for now)')) {
  failures.push('dashboard still marks tabs as placeholders');
}

if (failures.length > 0) {
  console.error('Dashboard backend wiring is incomplete:');
  for (const failure of failures) console.error(`- Missing: ${failure}`);
  process.exit(1);
}

console.log('Dashboard backend wiring checks passed.');
