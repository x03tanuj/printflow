# PrintFlow Shop Agent

Desktop agent that runs on the print shop PC.

## Requirements
- Python 3.12 (managed via `uv`)

## Development Setup

```bash
# Sync dependencies
uv sync

# Run agent with example config
uv run python -m app.main --config config.example.json

# Run linter & tests
uv run ruff check .
uv run pytest
```
