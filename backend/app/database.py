import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[2] / "predictions.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            prediction TEXT,
            confidence REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def insert_prediction(filename: str, prediction: str, confidence: float):
    conn = get_connection()
    conn.execute(
        "INSERT INTO predictions (filename, prediction, confidence) VALUES (?,?,?)",
        (filename, prediction, confidence),
    )
    conn.commit()
    conn.close()

def get_recent_predictions(limit: int = 20):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM predictions ORDER BY timestamp DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]
