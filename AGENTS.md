# AGENTS.md

## Project Overview
PrintFlow is an automated cloud-to-print platform designed for university and retail print ecosystems. It enables students to upload documents from any device, select granular print specifications (such as black-and-white vs. colour, single-sided vs. double-sided, copies, and page ranges), pay securely online, and automatically have the print shop's local computer route and print the job without manual staff file handling. PrintFlow serves three core personas: **students** who demand fast, transparent self-service printing without waiting in queues; **shop owners** who gain automated order intake, revenue reconciliation, and reduced counter bottlenecks; and the **shop agent**, a lightweight desktop background service installed on the print shop's Windows/Linux PC that receives print jobs via secure outbound connection and interfaces directly with local printer queues.

---

## Architecture
The platform is built as a modular monorepo containing three core applications and containerized supporting infrastructure:
- **`apps/web`**: Next.js App Router application with TypeScript, Tailwind CSS, and shadcn/ui. Hosts both the public student-facing ordering flow (`(customer)` route group) and the print shop administration dashboard (`(shop)` route group).
- **`apps/api`**: High-performance FastAPI backend (Python 3.12 managed with `uv`). Interfaces with PostgreSQL 16 via SQLAlchemy 2.x and Alembic for transactional data, and object storage for document binaries (MinIO locally, Cloudflare R2 in production via S3-compatible APIs).
- **`apps/agent`**: Lightweight Python desktop daemon running on shop hardware. The agent establishes an **outbound WebSocket connection** to the API server, ensuring zero inbound port forwarding or firewall adjustments are needed on shop networks. The agent receives job payloads, fetches documents using short-lived signed URLs, dispatches them to local printers, and streams status updates back to the API.
- **Payments**: Handled exclusively via Razorpay payment gateway integration.

---

## Order States
An order transitions through the following finite lifecycle states:
- `uploaded`: Document uploaded and validated; print specifications selected.
- `awaiting_payment`: Payment transaction initiated with Razorpay.
- `paid`: Payment signature verified by server webhook; order placed in processing pipeline.
- `queued`: Order confirmed and placed in the shop's printer queue.
- `printing`: Shop agent has received the document and dispatched it to the local print spooler.
- `ready`: Printing complete and document waiting at the shop counter for pickup.
- `collected`: Customer has retrieved the printed job.
- `failed`: Job encountered an unrecoverable processing or hardware error.
- `refunded`: Payment refunded to customer (due to cancellation or print failure).
- `cancelled`: Order cancelled prior to print dispatch.

---

## Pricing Rules for the First Shop
All pricing rules, percentages, and minimum thresholds are defined in per-shop configuration tables and **never hardcoded** in application logic. The reference initial shop rules are:
- **Black & White Single-Sided**: ₹2.00 per page (200 paise/page).
- **Black & White Double-Sided**: ₹3.00 per sheet (300 paise/sheet). Each sheet holds 2 pages:
  $$\text{sheets} = \lceil \text{pages} / 2 \rceil$$
- **Colour**: ₹10.00 per page (1000 paise/page).
- **Platform Fee**: Charged to the student on top of print price:
  $$\text{platform\_fee} = \max(100\text{ paise}, \lceil 0.05 \times \text{print\_price} \rceil)$$
- **Shop Commission**: Deducted from the shop payout:
  $$\text{shop\_commission} = \max(100\text{ paise}, \lceil 0.05 \times \text{print\_price} \rceil)$$
- **Shop Net Payout**: Shop receives:
  $$\text{shop\_net} = \text{print\_price} - \text{shop\_commission}$$
- **Gateway Fee Reference Value**: 2.36% of the total amount paid by the student (used for analytics and financial reconciliation).

---

## Money Rules
- **Integer Arithmetic Only**: Every monetary amount MUST be stored and computed as an integer in **paise** (1 INR = 100 paise).
- **Never Use Floats**: Floats are strictly prohibited for monetary calculations to eliminate IEEE-754 precision errors.
- **Server-Side Recalculation**: The API backend MUST recalculate prices from validated order specs and shop rate cards. Never trust an amount provided by the frontend client.

---

## Security Rules
- **Razorpay Signature Verification**: Webhook signatures (`x-razorpay-signature`) MUST be cryptographically verified using HMAC SHA-256 before processing.
- **Webhook Source of Truth**: Orders MUST only transition to `paid` status via verified backend webhook events, never from frontend redirect callbacks.
- **Expiring Signed URLs**: Uploaded document binaries are accessible only via short-lived pre-signed URLs (TTL ≤ 15 minutes).
- **Automatic Data Hygiene**: Documents MUST be deleted from storage immediately upon job completion (`collected`) or at most 24 hours after upload.
- **Access Isolation**: Shop staff dashboards cannot download raw customer document files.
- **Secrets & PII**: Never commit secrets or `.env` files. Never log document contents, customer phone numbers, or payment tokens/card details.

---

## Code Conventions
- **TypeScript**: Strict mode enabled (`"strict": true` in `tsconfig.json`). No implicit `any`.
- **Python**: Enforce Python 3.12 managed exclusively with `uv`. Strict type hints across all functions and models. Ruff for formatting and linting.
- **Git & Commits**: Conventional Commits specification (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- **Branching**: One feature or bugfix per branch (`feat/name`, `fix/name`, `chore/name`). Keep pull requests small and focused.

---

## Commands Section
*These commands are verified working instructions for local development, linting, and testing:*

### Infrastructure
```bash
# Start PostgreSQL 16 and MinIO containers
docker compose -f infra/docker-compose.yml up -d

# Check health of containers
docker compose -f infra/docker-compose.yml ps

# Stop containers
docker compose -f infra/docker-compose.yml down
```

### API (`apps/api`)
```bash
cd apps/api

# Sync dependencies with uv using Python 3.12
uv sync

# Run database migrations
uv run alembic upgrade head

# Run development server
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run linter & formatter check
uv run ruff check .
uv run ruff format --check .

# Run test suite
uv run pytest
```

### Web (`apps/web`)
```bash
cd apps/web

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run linter & typecheck
pnpm lint
pnpm typecheck
pnpm format:check

# Build for production
pnpm build
```

### Agent (`apps/agent`)
```bash
cd apps/agent

# Sync dependencies with uv using Python 3.12
uv sync

# Run agent CLI
uv run python -m app.main --config config.example.json

# Run linter & formatter check
uv run ruff check .
uv run ruff format --check .

# Run test suite
uv run pytest
```

---

## Working Agreement
- Before finishing any task, run all linters and tests across affected apps to ensure zero regressions.
- Update documentation immediately if any architectural or behavioral change is introduced.
- Always provide a clear summary of what was completed and what remains.
- If a requirement is ambiguous or unspecified, ask the user before assuming.
- Do not add features, packages, or code beyond the explicit scope of the current task.
