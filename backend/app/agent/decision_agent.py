from pydantic_ai import Agent
from app.agent.schemas import DecisionInput, DecisionAnalysis
from app.agent.prompts import SYSTEM_PROMPT
from app.core.config import PRIMARY_MODEL, FALLBACK_MODEL


def _create_agent(model_name: str) -> Agent:
    return Agent(
        model=model_name,
        result_type=DecisionAnalysis,
        system_prompt=SYSTEM_PROMPT,
        model_settings={
            "tool_choice": "none",
            "temperature": 0.2
        }
    )


primary_agent = _create_agent(PRIMARY_MODEL)
fallback_agent = _create_agent(FALLBACK_MODEL)


def _format_input(input_data: DecisionInput) -> str:
    constraints_text = "\n".join(
        f"- {c.constraint}" for c in input_data.constraints
    )

    return f"""
Decision:
{input_data.decision}

Constraints:
{constraints_text}
"""


async def analyze_decision(input_data: DecisionInput):
    prompt = _format_input(input_data)

    try:
        result = await primary_agent.run(prompt)
        return {
            "analysis": result.data,
            "model_used": PRIMARY_MODEL,
            "fallback_used": False
        }
    except Exception:
        result = await fallback_agent.run(prompt)
        return {
            "analysis": result.data,
            "model_used": FALLBACK_MODEL,
            "fallback_used": True
        }
