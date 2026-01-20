from fastapi import APIRouter, HTTPException

from app.agent.schemas import DecisionInput
from app.agent.decision_agent import analyze_decision
from app.db.database import save_decision

router = APIRouter()


@router.post("/analyze-decision")
async def analyze_decision_api(payload: DecisionInput):
    try:
        result = await analyze_decision(payload)

        save_decision(
            decision=payload.decision,
            agent_response=result["analysis"].model_dump(),
            model_used=result["model_used"],
            fallback_used=result["fallback_used"]
        )

        return result

    except Exception as e:
        print("🔥 ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
    )

