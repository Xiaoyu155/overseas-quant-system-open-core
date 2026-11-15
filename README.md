# Open-Core Quant System

This repository is a publication-safe shell for the live trading system. It documents orchestration contracts and publishes selected, de-identified evidence without distributing the private strategy implementation.

## Architecture

`RegimeOracle` feeds a `MultiStrategyCoordinator`, which produces an opaque portfolio intent for `ExecutionRouter`. A separate `IntradayGuardian` observes risk state on a 15-second cadence. The implementation contracts are in [`core_alpha_stub.py`](core_alpha_stub.py); the private models, selection rules, sizing coefficients, and exit logic are intentionally absent.

## Public material

- [`data_public/`](data_public/README.md) contains a sanitized 5,202-bar, 8-hour backtest summary and summaries of recent live decision snapshots.
- [`web/`](web/index.html) contains the static dashboard source.
- [`docs/`](docs/index.html) is the GitHub Pages publication directory.
- [`data_public/unit_nav_history.json`](data_public/unit_nav_history.json) publishes 2,367 de-identified production Unit-NAV observations from `2026-11-13T08:02:36Z` (`1.0000`) through `2026-11-15T00:08:23Z` (`1.08317407`). Each observation contains only its timestamp and normalized `unit_nav`; account balances, transfer references, and personal identifiers are excluded.

The backtest figures are historical simulation output and are not live performance or a guarantee of future results. The summary omits implementation parameters and raw strategy series.

## GitHub Pages

The site is buildless and uses local HTML, CSS, JavaScript, and JSON only. After Pages is enabled, it is available at <https://xiaoyu155.github.io/overseas-quant-system-open-core/>.

