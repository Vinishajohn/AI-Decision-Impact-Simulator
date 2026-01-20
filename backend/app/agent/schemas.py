from pydantic import BaseModel, Field
from typing import List


class Constraint(BaseModel):
    constraint: str = Field(..., min_length=3)


class DecisionInput(BaseModel):
    decision: str = Field(..., min_length=10)
    constraints: List[Constraint] = []


class RiskFactor(BaseModel):
    risk: str
    impact_level: str
    explanation: str


class Outcome(BaseModel):
    title: str
    description: str
    likelihood: str
    impact: str


class AlternativeOption(BaseModel):
    option: str
    why_safer: str


class DecisionAnalysis(BaseModel):
    decision_summary: str
    risks: List[RiskFactor]

    best_case: Outcome
    worst_case: Outcome
    most_likely_case: Outcome

    alternatives: List[AlternativeOption]
    confidence_score: int = Field(..., ge=0, le=100)
    uncertainty_explanation: str
