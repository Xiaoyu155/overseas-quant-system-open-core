import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_web_dashboard_bounds_all_data_fetches_and_clears_timeout():
    source = (ROOT / "web" / "app.js").read_text(encoding="utf-8")
    assert len(re.findall(r"\bfetch\s*\(", source)) == 1
    assert "signal: controller.signal" in source
    assert "setTimeout(() => controller.abort(), DATA_FETCH_TIMEOUT_MS)" in source
    assert "finally" in source and "clearTimeout(timer)" in source


def test_published_dashboard_bounds_requests_and_handles_storage_denial():
    source = (ROOT / "docs" / "index.html").read_text(encoding="utf-8")
    assert len(re.findall(r"\bfetch\s*\(", source)) == 1
    assert "signal: controller.signal" in source
    assert "setTimeout(() => controller.abort(), DATA_FETCH_TIMEOUT_MS)" in source
    assert "function readTimezonePreference()" in source
    assert "try { return localStorage.getItem('af_timezone') || 'UTC'; } catch { return 'UTC'; }" in source
    assert "try { localStorage.setItem('af_timezone', value); } catch {}" in source
