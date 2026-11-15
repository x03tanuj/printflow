# PrintFlow Web

Next.js frontend application for students and print shop owners.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

## Routes

- `/` - Customer landing page
- `/s/[shopSlug]` - Customer shop order page
- `/shop` - Shop owner dashboard

## Development Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run linter and typecheck
pnpm lint
pnpm typecheck
pnpm format:check

# Build for production
pnpm build
```
