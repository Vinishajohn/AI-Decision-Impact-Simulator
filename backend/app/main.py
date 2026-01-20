from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.decision import router as decision_router

app = FastAPI(title="AI Decision Impact Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for now (safe for assignment)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(decision_router)

@app.get("/")
def root():
    return {"status": "Backend running"}
