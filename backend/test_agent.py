import asyncio
from app.agent.decision_agent import analyze_decision
from app.agent.schemas import DecisionInput


async def main():
    test_input = DecisionInput(
        decision="Buying an expensive laptop on EMI",
        constraints=[
            {"constraint": "Monthly budget under 10k"},
            {"constraint": "Need it for ML work"}
        ]
    )

    result = await analyze_decision(test_input)
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
    