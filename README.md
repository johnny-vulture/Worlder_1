# Worlder

Worlder (TabSync) is a React + Vite web app backed by [Supabase](https://supabase.com). It lets users sign in, create named **stacks** (tab groups), and manage **links** (saved URLs) so they can organize and revisit tabs across browsers and devices.

## Features

- **Authentication** — Email/password sign-up and login via Supabase Auth
- **Stacks** — Create, rename, and delete tab groups owned by the signed-in user
- **Links** — View, edit, and delete URLs within a stack
- **Session persistence** — Auth state stored in `sessionStorage` for the browser session

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | React 18, Tailwind CSS, Bootstrap / MDB UI Kit |
| Routing | React Router v6 |
| Build | Vite 3 |
| Backend | Supabase (Auth + PostgreSQL) |

## Project structure

```
Worlder_1-main/
├── public/                 # Static assets
├── src/
│   ├── assets/             # SVG and other media
│   ├── components/
│   │   ├── Stacks.jsx      # Standalone stack list (unused in routes)
│   │   ├── StackDetails.jsx # Single stack + its links
│   │   └── LinkDetails.jsx  # View/edit a single link
│   ├── pages/
│   │   ├── index.js        # Barrel export for pages
│   │   ├── Login.jsx       # Sign-in form
│   │   ├── SignUp.jsx      # Registration form
│   │   └── Homepage.jsx    # Dashboard: CRUD for stacks
│   ├── App.jsx             # Routes + auth token state
│   ├── client.js           # Supabase client (env-based config)
│   ├── main.jsx            # React entry + BrowserRouter
│   └── index.css           # Global styles (Tailwind)
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env.example            # Template for Supabase keys (copy to .env)
```

## Routes

| Path | Component | Auth required | Description |
|------|-----------|---------------|-------------|
| `/` | `Login` | No | Sign in |
| `/signup` | `SignUp` | No | Create account |
| `/homepage` | `Homepage` | Yes | Manage stacks |
| `/stack/:stackId` | `StackDetails` | No* | Links in a stack |
| `/link/:linkId` | `LinkDetails` | No* | Edit a link |

\*These routes are not guarded in `App.jsx`; protection relies on Supabase Row Level Security (RLS) if configured.

## Data model (Supabase)

The app expects two tables:

### `Stack`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid / serial | Primary key |
| `name` | text | Display name |
| `created_at` | timestamp | Set on insert |
| `owner` | uuid | Supabase user id (`token.user.id`) |

### `Link`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid / serial | Primary key |
| `name` | text | Link label |
| `src` | text | URL |
| `stack_name` | text | Joins to `Stack.name` |
| `created_at` | timestamp | Optional |

Configure RLS policies so users can only read/write their own stacks and related links.

## Getting started

### Prerequisites

- Node.js 16+
- A [Supabase](https://supabase.com) project with the tables above and Auth enabled

### Install

```bash
npm install
```

### Configure Supabase

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. In the [Supabase dashboard](https://supabase.com/dashboard) → **Project Settings → API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

3. Fill in `.env` (never commit this file):

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Run

```bash
npm run dev      # Development server (default http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

## Auth flow

1. **Sign up** (`SignUp.jsx`) — `supabase.auth.signUp()` with `full_name` in user metadata; email verification may be required depending on project settings.
2. **Login** (`Login.jsx`) — `supabase.auth.signInWithPassword()`; session object is passed to `App` via `setToken` and saved to `sessionStorage`.
3. **Logout** (`Homepage.jsx`) — Clears `sessionStorage` and redirects to `/`.

## Key modules

| File | Responsibility |
|------|----------------|
| `src/client.js` | Creates and exports the Supabase client from `VITE_*` env vars |
| `src/App.jsx` | Defines routes; restores token from `sessionStorage` on load |
| `src/pages/Homepage.jsx` | Stack CRUD against the `Stack` table |
| `src/components/StackDetails.jsx` | Loads stack by id; lists links where `stack_name` matches |
| `src/components/LinkDetails.jsx` | Loads and updates a single `Link` row |


## License

Private project (`package.json`: `"private": true`).
