# PrintFlow API

FastAPI backend service for the PrintFlow platform.

## Requirements
- Python 3.12 (managed via `uv`)

## Development Setup

```bash
# Sync dependencies
uv sync

# Run database migrations
uv run alembic upgrade head

# Run server
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run linter and tests
uv run ruff check .
uv run pytest
```
