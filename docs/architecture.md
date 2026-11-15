# System Architecture

```text
Market Context
      |
      v
RegimeOracle
      |
      v
MultiStrategyCoordinator
      |
      v
ExecutionRouter

IntradayGuardian -- observes risk state every 15 seconds
RiskProfileProvider -- supplies a profile through an opaque interface
```

The public contract describes scheduling and module boundaries only. Private regime thresholds, strategy selection, allocation coefficients, and exit rules are not part of this release.

## Responsibilities

- `RegimeOracle` converts a market context into an opaque regime snapshot.
- `MultiStrategyCoordinator` converts the snapshot and context into a portfolio intent.
- `ExecutionRouter` validates and dispatches the intent through the execution boundary.
- `IntradayGuardian` checks the current context independently on a 15-second cadence.
- `RiskProfileProvider` supplies risk settings without exposing private profile values.

The public package contains interfaces, not a runnable trading implementation.

