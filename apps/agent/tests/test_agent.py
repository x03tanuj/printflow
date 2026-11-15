import json
from pathlib import Path

from app.main import load_config


def test_load_config(tmp_path: Path) -> None:
    test_config = {
        "shop_id": "test_shop",
        "api_url": "ws://localhost:8000/ws/agent",
        "auth_token": "secret_token",
    }
    config_file = tmp_path / "config.json"
    config_file.write_text(json.dumps(test_config), encoding="utf-8")

    loaded = load_config(str(config_file))
    assert loaded["shop_id"] == "test_shop"
    assert loaded["api_url"] == "ws://localhost:8000/ws/agent"
