# Login Module

Phase 1 — Login Page for the Accessories Repair & ATR Management System.

## Stack
React + Vite + Tailwind CSS + plain JavaScript (JS/JSX).

## Files
| File | Purpose |
|---|---|
| `LoginPage.jsx` | Page shell: branding, layout, post-login navigation |
| `LoginForm.jsx` | Controlled form: fields, validation, submit handling |
| `authService.js` | API call layer — **this is the contract the backend implements** |
| `types.js` | Shared TypeScript interfaces / API contract types |
| `validation.js` | Pure client-side validation functions |
| Tailwind CSS utility classes | Scoped styling |

## API contract (for backend/DB team)

**`POST /api/auth/login`**

Request body:
```json
{
  "employeeId": "EMP-1042",
  "password": "plaintext-from-user",
  "rememberMe": true
}
```

Success response — `200 OK`:
```json
{
  "token": "jwt-or-session-token",
  "refreshToken": "only present if rememberMe was true",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "employeeId": "EMP-1042",
    "name": "Krithika S",
    "role": "HOD",
    "department": "Electrical",
    "email": "krithika@example.edu"
  }
}
```

`role` must be one of the roles from the workflow chart:
`SUPERVISOR | ELECTRICIAN_INCHARGE | HOD | ELECTRICIAN_HEAD | ELECTRICIAN | MANAGER | DEAN_IQAC`

Error response — `401 / 423 / 500`:
```json
{ "message": "Invalid employee ID or password.", "code": "INVALID_CREDENTIALS" }
```
`code` is one of `INVALID_CREDENTIALS | ACCOUNT_LOCKED | ACCOUNT_DISABLED | SERVER_ERROR`.

### Suggested `users` table
```
id                    uuid PK
employee_id           varchar UNIQUE NOT NULL
name                  varchar NOT NULL
password_hash         varchar NOT NULL
role                  varchar NOT NULL   -- enum above
department            varchar
email                 varchar
is_active             boolean DEFAULT true
failed_login_attempts int DEFAULT 0
locked_until          timestamp NULL
created_at            timestamp DEFAULT now()
```

### Env var
Frontend reads the API base URL from `VITE_API_BASE_URL` (defaults to `/api`).
Set this in `.env` / `.env.local`, e.g.:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## What's implemented
- Username / Employee ID + Password fields
- Show / Hide password toggle
- Remember Me checkbox (switches session storage vs local storage on success)
- Login button with loading state
- Forgot Password link (navigates to `/forgot-password` — route to be built)
- Client-side validation with inline field errors
- Server error surfaced at the top of the form
- Responsive, keyboard-accessible layout

## Not yet implemented (flagged, not silently skipped)
- The `/forgot-password` route/page itself (link is wired, page is a follow-up ticket)
- Role-based redirect after login (currently routes everyone to `/dashboard`;
  see `TODO(backend)` comment in `LoginPage.jsx`)
- Token refresh logic
