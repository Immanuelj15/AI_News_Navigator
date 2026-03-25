import os
import subprocess
from gtts import gTTS
from moviepy import ImageClip, CompositeVideoClip, ColorClip, AudioFileClip
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont

class VideoStudio:
    def __init__(self, output_dir="media/videos"):
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

    def _create_text_image(self, text, size=(600, 800), fontsize=40, color=(255, 255, 255)):
        img = Image.new('RGBA', size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        try:
            font = ImageFont.truetype("arial.ttf", fontsize)
        except:
            font = ImageFont.load_default()

        words = text.split()
        lines = []
        current_line = []
        for word in words:
            current_line.append(word)
            if len(" ".join(current_line)) > 30:
                lines.append(" ".join(current_line))
                current_line = []
        if current_line:
            lines.append(" ".join(current_line))
            
        y_text = 0
        for line in lines:
            draw.text((0, y_text), line, font=font, fill=color)
            y_text += fontsize + 10
        return img

    def generate_short(self, briefing_text, topic):
        tts = gTTS(text=briefing_text, lang='en')
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
            
        safe_topic = topic.replace(" ", "_").replace("/", "_")
        voice_path = os.path.join(self.output_dir, f"{safe_topic}_voice.mp3")
        tts.save(voice_path)

        audio = AudioFileClip(voice_path)
        duration = audio.duration
        
        bg = ColorClip(size=(720, 1280), color=(0,0,0), duration=duration)
        
        caption_img = self._create_text_image(briefing_text, size=(600, 1000), fontsize=35)
        caption_path = os.path.join(self.output_dir, f"{safe_topic}_caption.png")
        caption_img.save(caption_path)
        
        txt_clip = ImageClip(caption_path).with_duration(duration).with_position('center')
        
        title_img = self._create_text_image(f"ET PULSE: {topic.upper()}", size=(700, 100), fontsize=50, color=(0, 255, 65))
        title_path = os.path.join(self.output_dir, f"{safe_topic}_title.png")
        title_img.save(title_path)
        
        title_clip = ImageClip(title_path).with_duration(duration).with_position(('center', 100))

        video = CompositeVideoClip([bg, txt_clip, title_clip]).with_audio(audio)
        
        output_path = os.path.join(self.output_dir, f"{safe_topic}_briefing.mp4")
        video.write_videofile(output_path, fps=24, codec="libx264", audio_codec="aac")
        
        return output_path
