# mybengkel-frontend

Nuxt 4 frontend for the **Woksop** platform. Covers two role-aware portals in a single app:

- **Panel Portal** (`/panel/*`) — Workshop staff: managers and technicians managing bookings, jobs, bays, customers, and service catalogue
- **Partner Portal** (`/partner/*`) — Partner workshop staff accepting and completing assigned jobs

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Nuxt 4 (`compatibilityVersion: 4`) |
| Auth | `@onmax/nuxt-better-auth` + `better-auth/vue` (clientOnly mode) |
| UI | shadcn-vue + Tailwind CSS v3 |
| State | Pinia v3 |
| HTTP | `useApi` composable (`$fetch` wrapper) |
| Language | TypeScript |
| Package manager | pnpm 9.5.0 |
| Tests | Vitest + happy-dom |

---

## Prerequisites

- Node >= 22
- pnpm 9.5.0
- Running instance of [mybengkel-backend](../mybengkel-backend) (NestJS)

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start dev server (default: http://localhost:3000)
pnpm dev
```

---

## Environment Variables

```ini
# Backend API base URL (NestJS)
NUXT_PUBLIC_API_BASE=http://localhost:3000

# Frontend URL (for CORS and Better Auth trustedOrigins)
NUXT_PUBLIC_SITE_URL=http://localhost:3001
```

---

## Commands

```bash
pnpm dev          # Start dev server with HMR
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm test         # Run unit tests
pnpm test:watch   # Watch mode
pnpm lint         # ESLint
```

---

## Project Structure

```
app/
├── auth.config.ts              # Better Auth client (clientOnly, points to NestJS)
├── app.vue
├── assets/css/main.css         # CSS variables + Tailwind directives
├── components/
│   ├── layout/
│   │   ├── AppSidebar.vue      # Fixed sidebar (logo, nav, logout)
│   │   ├── AppTopBar.vue       # User name + avatar (topbar)
│   │   ├── PanelNav.vue        # Panel navigation items
│   │   └── PartnerNav.vue      # Partner navigation items
│   └── ui/                     # shadcn-vue primitives
│       └── button, card, badge, input, table, avatar, select, tabs, textarea, switch
├── composables/
│   ├── usePermissions.ts       # can(), canAny(), isPanel(), isPartner()
│   ├── usePortal.ts            # portalType, dashboardPath
│   └── useApi.ts               # $fetch with x-tenant-id header
├── layouts/
│   ├── auth.vue                # Centered layout for login/register pages
│   ├── panel.vue               # Sidebar + topbar layout for Panel users
│   └── partner.vue             # Sidebar + topbar layout for Partner users
├── middleware/
│   └── portal-guard.ts         # Redirects users to correct portal based on role
├── pages/
│   ├── login.vue               # Email + password + MFA OTP step
│   ├── forgot-password.vue
│   ├── reset-password.vue
│   ├── setup-password/[token].vue
│   ├── unauthorized.vue
│   ├── panel/
│   │   ├── dashboard.vue
│   │   ├── bookings/
│   │   ├── jobs/
│   │   ├── customers/
│   │   ├── service-catalogue/
│   │   └── settings/
│   └── partner/
│       ├── dashboard.vue
│       ├── jobs/
│       └── settings/
├── stores/
│   ├── auth.store.ts           # Portal type resolution
│   └── ui.store.ts             # Sidebar collapsed state
└── types/
    └── auth.ts                 # BetterAuthRole, Resource, Action, PARTNER_ROLES
```

---

## Authentication

Handled by `@onmax/nuxt-better-auth` in `clientOnly` mode — no local auth server. The Better Auth client points directly to:

```
NUXT_PUBLIC_API_BASE/api/v1/better-auth/*
```

### Login flow

1. `signIn.email()` → session cookie set by NestJS backend
2. If MFA enabled → OTP step via `client.twoFactor.verifyOtp()`
3. `portal-guard` middleware reads `user.role` → redirects to `/panel/dashboard` or `/partner/dashboard`

### Route protection

| Route | Rule |
|---|---|
| `/login`, `/forgot-password`, `/reset-password` | `auth: 'guest'` |
| `/setup-password/**`, `/invite/**` | `auth: false` |
| `/panel/**`, `/partner/**` | `auth: 'user'` |

---

## Roles & Permissions

Six roles across three tiers:

| Role | Portal | Hierarchy |
|---|---|---|
| `super_admin` | Panel | 100 |
| `admin` | Panel | 90 |
| `panel_manager` | Panel | 70 |
| `panel_technician` | Panel | 40 |
| `partner_manager` | Partner | 60 |
| `partner_technician` | Partner | 30 |

Permissions are computed client-side from the `PERMISSIONS` matrix in `usePermissions.ts`, mirroring the backend `PERMISSION_STATEMENTS` exactly.

```ts
const { can, canAny, isPanel, isPartner } = usePermissions()

can('job', 'create')                    // boolean
canAny('job', ['edit', 'assign'])       // boolean
isPanel()                               // true for panel + admin + super_admin
isPartner()                             // true for partner_manager + partner_technician
```

Navigation items are filtered by `can()` — no hardcoded role checks in templates.

---

## API Calls

All requests go through `useApi()` which auto-injects:

- `x-tenant-id: <baOrganizationId>` from the session
- `credentials: 'include'` for cookie-based session auth

```ts
const $api = useApi()
const data = await $api('/api/v1/jobs?limit=10')
```

---

## Design Tokens

| Token | Value |
|---|---|
| Primary | `#14B8A6` |
| Sidebar bg | `#2D2D2D` |
| Background | `#F5F5F5` |
| Surface | `#FFFFFF` |
| Text | `#111827` |
| Text muted | `#6B7280` |
| Danger | `#EF4444` |
| Success | `#22C55E` |

---

## Running Tests

```bash
pnpm test
```

Tests live in `tests/composables/`. The permission matrix is tested in isolation against the real `PERMISSIONS` export from `usePermissions.ts`.
