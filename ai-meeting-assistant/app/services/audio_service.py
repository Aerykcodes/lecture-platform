from moviepy.editor import VideoFileClip

def extract_audio(video_path):
    audio_path = video_path.rsplit(".", 1)[0] + ".mp3"

    clip = VideoFileClip(video_path)
    clip.audio.write_audiofile(audio_path)

    return audio_path
