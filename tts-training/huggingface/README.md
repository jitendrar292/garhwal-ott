---
title: Garhwali TTS
emoji: 🎙️
colorFrom: orange
colorTo: red
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: apache-2.0
tags:
  - tts
  - text-to-speech
  - garhwali
  - indian-languages
  - uttarakhand
---

# Garhwali TTS - घुघुती AI

Text-to-Speech model for Garhwali language, fine-tuned on community-recorded audio.

## Features

- 🗣️ Natural Garhwali speech synthesis
- 📝 Devanagari script input
- ⚡ Fast inference
- 🎯 Trained on native speaker recordings

## Usage

### Web Interface
Visit the Space above to try the model interactively.

### API
```python
import requests

response = requests.post(
    "https://api-inference.huggingface.co/models/YOUR_USERNAME/garhwali-tts",
    headers={"Authorization": f"Bearer {HF_TOKEN}"},
    json={"inputs": "नमस्कार, तुम कैसा छा?"}
)

with open("output.wav", "wb") as f:
    f.write(response.content)
```

### Local Installation
```python
from TTS.api import TTS

# Download and load model
tts = TTS(model_path="model.pth", config_path="config.json")

# Generate speech
tts.tts_to_file(text="गढ़वाल बड़ो सुंदर छ", file_path="output.wav")
```

## Model Details

- **Architecture**: VITS (Variational Inference TTS)
- **Base Model**: LJSpeech VITS
- **Language**: Garhwali (गढ़वाली)
- **Sample Rate**: 22050 Hz

## Training Data

Trained on community-recorded audio from [PahadiTube.in](https://pahaditube.in/voice-recording).

## License

Apache 2.0

## Citation

```bibtex
@misc{garhwali-tts,
  title={Garhwali TTS: Text-to-Speech for Garhwali Language},
  author={PahadiTube Contributors},
  year={2026},
  url={https://huggingface.co/spaces/YOUR_USERNAME/garhwali-tts}
}
```

## Contribute

Help improve this model by recording Garhwali sentences at [pahaditube.in/voice-recording](https://pahaditube.in/voice-recording).
