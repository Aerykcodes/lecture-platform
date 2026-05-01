from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import urllib.request
import urllib.parse

from app.services.audio_service import extract_audio
from app.services.transcription_service import transcribe
from app.services.summarizer import summarize
from app.services.action_service import extract_actions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "AI Meeting Assistant API is running"}


class VideoURLRequest(BaseModel):
    url: str


@app.post("/process-video-url")
async def process_video_url(req: VideoURLRequest):
    parsed = urllib.parse.urlparse(req.url)
    encoded_path = urllib.parse.quote(parsed.path)
    safe_url = urllib.parse.urlunparse(parsed._replace(path=encoded_path))
    filename = os.path.basename(parsed.path) or "lecture.mp4"
    video_path = os.path.join(TEMP_DIR, filename)
    urllib.request.urlretrieve(safe_url, video_path)

    audio_path = extract_audio(video_path)
    transcript = transcribe(audio_path)
    summary = summarize(transcript)
    actions = extract_actions(transcript)

    return {"transcript": transcript, "summary": summary, "actions": actions}


@app.post("/process-video")
async def process_video(file: UploadFile = File(...)):
    video_path = os.path.join(TEMP_DIR, file.filename)

    # Save video
    with open(video_path, "wb") as f:
        f.write(await file.read())

    # Extract audio
    audio_path = extract_audio(video_path)

    # Transcribe
    transcript = transcribe(audio_path)

    # Summarize
    summary = summarize(transcript)

    # Extract actions
    actions = extract_actions(transcript)

    return {
        "transcript": transcript,
        "summary": summary,
        "actions": actions
    }
