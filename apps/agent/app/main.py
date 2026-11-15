import argparse
import json
import sys
from pathlib import Path


def load_config(config_path: str) -> dict:
    path = Path(config_path)
    if not path.is_file():
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def main() -> None:
    parser = argparse.ArgumentParser(description="PrintFlow Shop Desktop Agent")
    parser.add_argument(
        "--config",
        "-c",
        type=str,
        default="config.example.json",
        help="Path to agent JSON configuration file",
    )
    args = parser.parse_args()

    try:
        config = load_config(args.config)
        api_url = config.get("api_url", "Not configured")
        print(f"[PrintFlow Agent] Config loaded from: {args.config}")
        print(f"[PrintFlow Agent] Configured API URL: {api_url}")
    except Exception as e:
        print(f"[PrintFlow Agent] Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
