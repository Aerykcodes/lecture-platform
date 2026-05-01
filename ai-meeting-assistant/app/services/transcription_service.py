import whisper

model = whisper.load_model("base")  # use "tiny" if slow

def transcribe(audio_path):
    result = model.transcribe(audio_path)
    return result["text"]
