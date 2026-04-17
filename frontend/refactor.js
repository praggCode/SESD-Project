const fs = require('fs');

const files = [
  "frontend/components/escalation/policy-form-dialog.jsx",
  "frontend/components/users/create-user-dialog.jsx",
  "frontend/components/login-form.jsx",
  "frontend/components/signup-form.jsx",
  "frontend/components/alerts/action-buttons.jsx",
  "frontend/components/alerts/create-alert-dialog.jsx",
  "frontend/app/(protected)/escalation/page.jsx",
  "frontend/app/(protected)/dashboard/page.jsx",
  "frontend/app/(protected)/teams/page.jsx",
  "frontend/app/(protected)/alerts/page.jsx",
  "frontend/app/(protected)/users/page.jsx",
  "frontend/app/(protected)/alerts/[id]/page.jsx"
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if we already injected the API_URL to avoid dupes on retries
  if (!content.includes('import { API_URL }')) {
    // Determine if it's a client component to insert after the directive
    if (content.startsWith('"use client";')) {
      content = content.replace('"use client";', '"use client";\nimport { API_URL } from "@/lib/api";\n');
    } else {
      content = 'import { API_URL } from "@/lib/api";\n' + content;
    }
  }

  // Replace backtick patterns like `http://localhost:7069/api/...`
  content = content.replace(/`http:\/\/localhost:7069\/api/g, '`${API_URL}');
  
  // Replace double quote patterns "http://localhost:7069/api/..." -> `${API_URL}/...`
  content = content.replace(/"http:\/\/localhost:7069\/api([^"]*)"/g, '`${API_URL}$1`');

  fs.writeFileSync(file, content);
});

console.log('✅ Refactor complete.');
