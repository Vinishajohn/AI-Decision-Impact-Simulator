from app.agent.schemas import DecisionInput

# Valid test input
test_input = DecisionInput(
    decision="Buying an expensive laptop on EMI",
    constraints=[
        {"constraint": "Monthly budget under 10k"},
        {"constraint": "Need it for coding and ML"}
    ]
)

print("Schema validation successful!")
print(test_input)
