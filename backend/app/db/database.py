import sqlite3
from datetime import datetime
import json

DB_NAME = "decisions.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS decisions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            decision TEXT NOT NULL,
            response TEXT NOT NULL,
            model_used TEXT NOT NULL,
            fallback_used INTEGER NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def save_decision(
    decision: str,
    agent_response: dict,
    model_used: str,
    fallback_used: bool
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO decisions
        (decision, response, model_used, fallback_used, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            decision,
            json.dumps(agent_response),
            model_used,
            int(fallback_used),
            datetime.utcnow().isoformat()
        )
    )

    conn.commit()
    conn.close()
