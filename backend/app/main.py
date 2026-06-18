from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .model import predict_image
from .schemas import PredictionResponse, TopPrediction, HistoryItem, Metrics
from .logger import logger
from .database import init_db, insert_prediction, get_recent_predictions
import asyncio

app = FastAPI(title="Image Classification API")

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()
    logger.info("Database initialized and model warm‑up completed")

@app.post("/predict", response_model=PredictionResponse)
async def predict_endpoint(file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg", "image/png"}:
        logger.warning("Invalid file type: {}", file.content_type)
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG/PNG allowed.")
    try:
        content = await file.read()
        top_preds, full_probs, precomputed_metrics = predict_image(content)
        confidence = top_preds[0][1]

        # Confidence threshold
        if confidence < 0.6:
            prediction_label = "Uncertain"
        else:
            prediction_label = top_preds[0][0]
            
        # Store in SQLite
        insert_prediction(file.filename, prediction_label, confidence)
        
        # Load literal metrics from model.py
        real_metrics = Metrics(**precomputed_metrics)
        
        # Build out dictionary of all probabilities directly from model
        probabilities_map = {k: round(v, 4) for k, v in full_probs.items()}

        response = PredictionResponse(
            prediction=prediction_label,
            confidence=round(confidence, 3),
            top_predictions=[TopPrediction(class_name=cls, confidence=round(conf, 3)) for cls, conf in top_preds],
            probabilities=probabilities_map,
            metrics=real_metrics
        )
        logger.info("Prediction: {} (conf={})", prediction_label, confidence)
        return response
    except Exception as e:
        logger.error("Prediction error: {}", e)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/history", response_model=list[HistoryItem])
async def history_endpoint(limit: int = 20):
    rows = get_recent_predictions(limit)
    result = []
    for row in rows:
        result.append(
            HistoryItem(
                id=row["id"],
                filename=row["filename"],
                prediction=row["prediction"],
                confidence=round(row["confidence"], 3),
                timestamp=row["timestamp"]
            )
        )
    return result
