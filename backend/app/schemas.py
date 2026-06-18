from pydantic import BaseModel
from typing import List, Dict

class TopPrediction(BaseModel):
    class_name: str
    confidence: float

class Metrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    top_predictions: List[TopPrediction]
    probabilities: Dict[str, float] = None
    metrics: Metrics = None

class HistoryItem(BaseModel):
    id: int
    filename: str
    prediction: str
    confidence: float
    timestamp: str
