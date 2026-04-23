"""
Garhwali TTS - HuggingFace Space
Text-to-Speech for Garhwali language using fine-tuned VITS model
"""

import gradio as gr
import torch
from TTS.api import TTS
import os
import tempfile

# Model configuration
MODEL_PATH = "model.pth"
CONFIG_PATH = "config.json"

# Example sentences
EXAMPLES = [
    "नमस्कार, तुम कैसा छा?",
    "गढ़वाल बड़ो सुंदर छ",
    "आज मौसम बड़ो छ",
    "मी घर जान्दू",
    "जय बदरी विशाल",
    "खाणा बड़ो स्वादिष्ट छ",
    "फिर मिलांगे भाई",
    "बड़ो धन्यवाद तुम्हारो",
]

# Initialize TTS model
print("Loading Garhwali TTS model...")
try:
    tts = TTS(model_path=MODEL_PATH, config_path=CONFIG_PATH, progress_bar=False)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    tts = None


def synthesize(text: str) -> str:
    """Convert Garhwali text to speech"""
    if not text or not text.strip():
        return None
    
    if tts is None:
        raise gr.Error("TTS model not loaded. Please check the logs.")
    
    try:
        # Generate audio
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            output_path = f.name
        
        tts.tts_to_file(text=text.strip(), file_path=output_path)
        return output_path
        
    except Exception as e:
        raise gr.Error(f"Synthesis failed: {str(e)}")


# Create Gradio interface
with gr.Blocks(
    title="Garhwali TTS - घुघुती AI",
    theme=gr.themes.Soft(primary_hue="orange"),
) as demo:
    gr.Markdown(
        """
        # 🎙️ Garhwali Text-to-Speech
        ## घुघुती AI - गढ़वाली भाषा में बोलो
        
        Convert Garhwali/Devanagari text to natural speech using AI.
        
        Part of [PahadiTube.in](https://pahaditube.in) - Preserving Uttarakhandi culture through technology.
        """
    )
    
    with gr.Row():
        with gr.Column(scale=2):
            text_input = gr.Textbox(
                label="Enter Garhwali text (गढ़वाली में लिखो)",
                placeholder="नमस्कार, तुम कैसा छा?",
                lines=3,
            )
            
            submit_btn = gr.Button("🔊 Generate Speech", variant="primary", size="lg")
            
        with gr.Column(scale=1):
            audio_output = gr.Audio(
                label="Generated Speech",
                type="filepath",
            )
    
    # Examples
    gr.Examples(
        examples=[[ex] for ex in EXAMPLES],
        inputs=text_input,
        outputs=audio_output,
        fn=synthesize,
        cache_examples=True,
    )
    
    # Info section
    with gr.Accordion("ℹ️ About this model", open=False):
        gr.Markdown(
            """
            ### Model Details
            - **Base Model**: VITS (Variational Inference with adversarial learning for end-to-end Text-to-Speech)
            - **Fine-tuned on**: Garhwali language audio recordings
            - **Language**: Garhwali (गढ़वाली) - an Indo-Aryan language spoken in Uttarakhand, India
            
            ### How to use
            1. Type or paste Garhwali text in Devanagari script
            2. Click "Generate Speech"
            3. Listen to the generated audio
            
            ### Contribute
            Help improve this model by recording your voice at [pahaditube.in/voice-recording](https://pahaditube.in/voice-recording)
            
            ### Credits
            - [Coqui TTS](https://github.com/coqui-ai/TTS)
            - [PahadiTube](https://pahaditube.in)
            - Voice contributors from the Garhwali community
            """
        )
    
    # Event handlers
    submit_btn.click(
        fn=synthesize,
        inputs=text_input,
        outputs=audio_output,
    )
    
    text_input.submit(
        fn=synthesize,
        inputs=text_input,
        outputs=audio_output,
    )


if __name__ == "__main__":
    demo.launch()
