"""Public orchestration contracts. Private alpha implementations are omitted."""

from dataclasses import dataclass
from typing import Mapping, Protocol, Sequence


INTRADAY_GUARDIAN_INTERVAL_SECONDS = 15


@dataclass(frozen=True)
class MarketContext:
    as_of_utc: str
    observations: Mapping[str, float]


@dataclass(frozen=True)
class RegimeSnapshot:
    as_of_utc: str
    label: str


@dataclass(frozen=True)
class PortfolioIntent:
    as_of_utc: str
    targets: Mapping[str, float]


@dataclass(frozen=True)
class ExecutionResult:
    accepted: bool
    reference: str | None = None


@dataclass(frozen=True)
class GuardianResult:
    safe_to_continue: bool
    reason_code: str


class RegimeOracle(Protocol):
    def evaluate(self, context: MarketContext) -> RegimeSnapshot: ...


class MultiStrategyCoordinator(Protocol):
    def build_intent(
        self, context: MarketContext, regime: RegimeSnapshot
    ) -> PortfolioIntent: ...


class ExecutionRouter(Protocol):
    def route(self, intent: PortfolioIntent) -> Sequence[ExecutionResult]: ...


class IntradayGuardian(Protocol):
    interval_seconds: int

    def inspect(self, context: MarketContext) -> GuardianResult: ...


class RiskProfileProvider(Protocol):
    def resolve(self, profile_id: str) -> Mapping[str, float]: ...

