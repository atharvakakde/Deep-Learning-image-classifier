import json
import numpy as np
import tensorflow as tf
from pathlib import Path
from loguru import logger
import io
from PIL import Image

# Paths
BASE_DIR = Path(__file__).resolve().parents[2]
CONFIG_PATH = BASE_DIR / "model" / "config.json"
LABELS_PATH = BASE_DIR / "model" / "labels.json"
MODEL_PATH = BASE_DIR / "model" / "model.h5"
METRICS_PATH = BASE_DIR / "model" / "metrics.json"

# Load config and labels
with open(CONFIG_PATH) as f:
    config = json.load(f)
INPUT_SIZE = tuple(config["input_size"])  # (height, width)
NORMALIZE = config.get("normalize", "0-1")

with open(LABELS_PATH) as f:
    LABELS = json.load(f)  # e.g., {"0": "Cat", "1": "Dog"}

with open(METRICS_PATH) as f:
    PRECOMPUTED_METRICS = json.load(f)

logger.info("Loading TensorFlow model from {}", MODEL_PATH)
model = tf.keras.models.load_model(MODEL_PATH)
logger.info("Model loaded successfully")

# Warm‑up
dummy = np.zeros((1, INPUT_SIZE[0], INPUT_SIZE[1], 3), dtype=np.float32)
model.predict(dummy)
logger.info("Model warm‑up completed")

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((32, 32))
    arr = np.asarray(img).astype(np.float32)
    if NORMALIZE == "0-1":
        arr = arr / 255.0
    elif NORMALIZE == "-1-1":
        arr = (arr / 127.5) - 1.0
    return np.expand_dims(arr, axis=0)

def predict_image(image_bytes: bytes):
    x = preprocess_image(image_bytes)
    preds = model.predict(x)
    probs = preds[0]
    
    # Normalize probabilities
    probs = probs / np.sum(probs)
    
    # Extract top 3 predictions
    top_idxs = probs.argsort()[-3:][::-1]
    top = [(LABELS.get(str(i), "Unknown"), float(probs[i])) for i in top_idxs]
    
    # Map all probabilities
    full_probs = {LABELS.get(str(i), f"Class {i}"): float(probs[i]) for i in range(len(probs))}
    
    return top, full_probs, PRECOMPUTED_METRICS
