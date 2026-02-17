from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os
import re
from PIL import Image, ImageStat

app = FastAPI(
    title="ML Dashboard API",
    description="Lightweight API for free-tier deployment",
    version="2.1.0"
)

origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POSITIVE_WORDS = {
    "good", "great", "awesome", "amazing", "excellent", "love", "happy", "best", "nice", "perfect"
}
NEGATIVE_WORDS = {
    "bad", "terrible", "awful", "hate", "worst", "sad", "angry", "poor", "broken", "disappointed"
}

def normalize_text(text: str):
    return re.findall(r"[a-zA-Z']+", text.lower())

def binary_sentiment(text: str):
    words = normalize_text(text)
    pos = sum(1 for w in words if w in POSITIVE_WORDS)
    neg = sum(1 for w in words if w in NEGATIVE_WORDS)
    total = max(1, pos + neg)
    if pos >= neg:
        return "positive", round(pos / total, 2)
    return "negative", round(neg / total, 2)

def three_class_sentiment(text: str):
    words = normalize_text(text)
    pos = sum(1 for w in words if w in POSITIVE_WORDS)
    neg = sum(1 for w in words if w in NEGATIVE_WORDS)
    score = pos - neg
    if score > 0:
        return "positive", round(min(0.99, 0.5 + (score * 0.1)), 2)
    if score < 0:
        return "negative", round(min(0.99, 0.5 + (abs(score) * 0.1)), 2)
    return "neutral", 0.5

@app.get("/")
def home():
    return {
        "message": "ML Dashboard API - Lightweight Mode",
        "status": "running",
        "version": "2.1.0",
        "models_loaded": False,
        "mode": "free-tier",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "models": "/api/models",
            "text_classification": "/api/predict/text-classification",
            "sentiment_analysis": "/api/predict/sentiment-analysis",
            "image_caption": "/api/predict/image-caption"
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy", "mode": "lightweight"}

@app.get("/api/models")
def get_models():
    return {
        "models": [
            {
                "id": "text-classification",
                "name": "Text Classification",
                "description": "Lightweight keyword-based classifier",
                "type": "NLP",
                "status": "active",
                "accepts": "CSV file with 'text' column",
                "model": "keyword-rules-v1"
            },
            {
                "id": "sentiment-analysis",
                "name": "Sentiment Analysis",
                "description": "Lightweight 3-class sentiment (rule-based)",
                "type": "NLP",
                "status": "active",
                "accepts": "CSV file with 'text' column",
                "model": "keyword-rules-v1"
            },
            {
                "id": "image-caption",
                "name": "Image Captioning",
                "description": "Lightweight image descriptor",
                "type": "Computer Vision",
                "status": "active",
                "accepts": "Any image file (JPG, PNG, WebP, etc.)",
                "model": "image-metadata-v1"
            }
        ]
    }

@app.post("/api/predict/text-classification")
async def predict_text_classification(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        try:
            df = pd.read_csv(io.BytesIO(contents), encoding="utf-8")
        except UnicodeDecodeError:
            df = pd.read_csv(io.BytesIO(contents), encoding="latin1")

        if "text" not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must have a 'text' column")

        predictions = []
        for idx, text in enumerate(df["text"]):
            text_str = str(text).strip()
            if not text_str:
                continue
            label, confidence = binary_sentiment(text_str)
            predictions.append({
                "id": idx + 1,
                "text": text_str[:100] + "..." if len(text_str) > 100 else text_str,
                "prediction": label,
                "confidence": confidence
            })

        return {
            "success": True,
            "model": "text-classification",
            "model_name": "Keyword Rules (Lightweight)",
            "filename": file.filename,
            "total_predictions": len(predictions),
            "summary": {
                "positive": sum(1 for p in predictions if p["prediction"] == "positive"),
                "negative": sum(1 for p in predictions if p["prediction"] == "negative")
            },
            "predictions": predictions[:10]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/predict/sentiment-analysis")
async def predict_sentiment(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        try:
            df = pd.read_csv(io.BytesIO(contents), encoding="utf-8")
        except UnicodeDecodeError:
            df = pd.read_csv(io.BytesIO(contents), encoding="latin1")

        if "text" not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must have a 'text' column")

        predictions = []
        for idx, text in enumerate(df["text"]):
            text_str = str(text).strip()
            if not text_str:
                continue
            sentiment, score = three_class_sentiment(text_str)
            predictions.append({
                "id": idx + 1,
                "text": text_str[:100] + "..." if len(text_str) > 100 else text_str,
                "sentiment": sentiment,
                "score": score
            })

        return {
            "success": True,
            "model": "sentiment-analysis",
            "model_name": "Keyword Rules (Lightweight)",
            "filename": file.filename,
            "total_predictions": len(predictions),
            "summary": {
                "positive": sum(1 for p in predictions if p["sentiment"] == "positive"),
                "negative": sum(1 for p in predictions if p["sentiment"] == "negative"),
                "neutral": sum(1 for p in predictions if p["sentiment"] == "neutral")
            },
            "predictions": predictions[:10]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/predict/image-caption")
async def predict_image_caption(file: UploadFile = File(...)):
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"File must be an image. You uploaded: {file.content_type}")

        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        width, height = image.size
        ratio = width / max(1, height)

        stat = ImageStat.Stat(image.convert("L"))
        brightness = stat.mean[0]

        orientation = "landscape" if ratio > 1.2 else "portrait" if ratio < 0.8 else "square-ish"
        tone = "bright" if brightness > 150 else "dark" if brightness < 90 else "balanced"

        caption = f"A {tone}, {orientation} image with resolution {width}x{height}."

        return {
            "success": True,
            "model": "image-caption",
            "model_name": "Image Metadata (Lightweight)",
            "filename": file.filename,
            "caption": caption,
            "confidence": 0.7
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
