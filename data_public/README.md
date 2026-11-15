# Public Data

`backtest_5202.json` and `backtest_5202.csv` contain a sanitized summary of an archived 8-hour simulation across train, validation, test, and full-period windows. The summary reports 5,202 bars and 448 evaluated variants. It omits strategy names, formula parameters, per-bar returns, and raw equity series.

`decision_summaries.json` contains eight recent live decision summaries. It retains only timestamps, cadence, and action counts; symbols, allocations, balances, signal fields, and strategy identifiers are excluded.

`unit_nav_history.json` contains 2,367 de-identified production Unit-NAV observations from `2026-11-13T08:02:36Z` through `2026-11-15T00:08:23Z`. Each series row contains only `timestamp` and normalized `unit_nav`; account balances, transfer references, and personal identifiers are excluded. The first observation is `1.0000` and the latest is `1.08317407`.

Backtest output is simulation evidence, not a live return record or a promise of future performance. Variant selection can introduce selection bias.

