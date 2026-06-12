<h1 align="center">HireMe AI ☕</h1>

<h2 align="center">Get Hired. Not Ghosted.</h2>

HireMe AI is an AI-powered career workspace for resume analysis, GitHub profile review, and recruiter-ready portfolio generation.

The app is built around a practical job-search workflow:
- upload a resume
- analyze ATS readiness with Gemini
- review GitHub quality and portfolio readiness
- generate and save portfolio drafts
- manage plans and upgrade through Dodo Payments

## Tech Stack 🛠️

- Next.js 16
- TypeScript
- Tailwind CSS v4
- Clerk authentication
- Neon Postgres
- Drizzle ORM
- Gemini API
- Framer Motion
- Dodo Payments

## Core Features ✨

- Custom sign-in and sign-up pages 🔐
- Resume upload for `PDF` and `DOCX` 📄
- ATS analysis with structured AI output 🤖
- GitHub username analysis with saved results 🐙
- Portfolio builder with live preview and draft persistence 🎨
- Settings page with saved user preferences ⚙️
- Pricing page with Dodo checkout initiation 💳
- Light mode and Dark Coffee mode support 🌗

## App Routes 🧭

- `/` landing page
- `/sign-in`
- `/sign-up`
- `/dashboard`
- `/analyze`
- `/github`
- `/portfolio`
- `/pricing`
- `/settings`
- `/user-profile`

## API Routes 🔌

- `POST /api/analyze-resume`
- `POST /api/generate-suggestions`
- `POST /api/analyze-github`
- `POST /api/generate-portfolio`
- `POST /api/billing/checkout`
- `POST /api/webhooks/dodo`
- `GET /api/settings`
- `POST /api/settings`

## Environment Variables 🔐

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

DATABASE_URL=
GEMINI_API_KEY=
GITHUB_TOKEN=

DODO_PAYMENTS_API_KEY=
DODO_PAYMENTS_ENVIRONMENT=test
DODO_PAYMENTS_WEBHOOK_KEY=
DODO_PRO_PRODUCT_ID=
```

Notes:
- `GITHUB_TOKEN` is optional but recommended for GitHub API reliability.
- `DODO_PAYMENTS_ENVIRONMENT` is normalized in code and can be `test` during local work.

## Local Setup 🚀

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Database Setup 🗄️

Generate Drizzle artifacts:

```bash
npm run db:generate
```

Push schema changes to Neon:

```bash
npm run db:push
```

Open Drizzle Studio:

```bash
npm run db:studio
```

## Resume Analysis Flow 📄

`/api/analyze-resume` performs:

1. Clerk auth check
2. file validation
3. PDF or DOCX text extraction
4. Gemini ATS analysis
5. database persistence
6. response back to the frontend

The analysis response includes:
- ATS score
- keyword match
- formatting score
- skills score
- projects score
- experience score
- missing skills
- strengths
- weaknesses
- suggestions
- improved bullets
- summary

## GitHub Analysis Flow 🐙

`/api/analyze-github` performs:

1. Clerk auth check
2. GitHub username validation
3. public GitHub API fetch
4. Gemini developer-profile analysis
5. database persistence

Returned data includes:
- repo count
- stars
- top languages
- best projects
- portfolio-ready score
- focused recommendations

## Portfolio Generation Flow 🎨

`/api/generate-portfolio` performs:

1. Clerk auth check
2. load latest or selected resume analysis
3. generate structured portfolio content with Gemini
4. save draft to `portfolio_drafts`
5. return generated content for preview

## Billing 💳

Pricing uses Dodo Payments.

Current backend pieces:
- checkout session creation
- webhook endpoint
- plan update flow

To complete billing locally:

1. create the Pro product in Dodo
2. set `DODO_PRO_PRODUCT_ID`
3. expose localhost with `ngrok` or equivalent
4. configure Dodo webhook to:

```txt
https://<public-url>/api/webhooks/dodo
```

5. complete a test payment and verify `users.plan` updates

## Scripts 📜

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:push
npm run db:studio
```

## Validation ✅

Before pushing changes:

```bash
npm run lint
npm run build
```

## Current Status 📌

Implemented:
- auth
- resume analysis backend
- GitHub analysis backend
- portfolio draft generation
- settings persistence
- pricing UI and Dodo checkout initiation

Still operationally dependent on external setup:
- live Dodo webhook verification
- full Free vs Pro backend enforcement
- production deployment configuration
