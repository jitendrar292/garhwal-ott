#!/usr/bin/env python3
"""
GBM Tokenizer sidecar — persistent stdin/stdout JSON-lines server.

The Node.js service (gbmTokenizer.js) spawns this process ONCE at startup.
Subsequent tokenization requests are cheap stdin/stdout IPC — no process
spawn overhead, no model reload.

Protocol
--------
  stdin  (Node → Python):  {"id": "<hex>", "text": "<query>"}\n
  stdout (Python → Node):  {"id": "<hex>", "stems": ["गढ़", "टोकन", ...]}\n
  startup:                  {"ready": true}\n  (emitted after model loads)

  "stems" = word-initial SentencePiece pieces (▁-prefix stripped).
  For "गढ़वळि टोकनिज़र" the pieces are:
    ['▁गढ़', 'व', 'ळ', 'ि', '▁टोकन', 'िज़', 'र']
  and stems = ['गढ़', 'टोकन'] — natural Devanagari word roots.

Setup
-----
  pip install sentencepiece huggingface_hub

  Then either:
    a) Set GBM_MODEL_PATH to the local .model file path, OR
    b) Set HF_TOKEN and the script will download from somu9/gbm-tokenizer
       (requires approved access at huggingface.co/somu9/gbm-tokenizer)

  Place the model at:  server/data/gbm_tokenizer.model
  and set in .env:      GBM_MODEL_PATH=data/gbm_tokenizer.model
"""
import sys
import os
import json


def resolve_model_path():
    # Explicit env var takes priority
    env_path = os.environ.get('GBM_MODEL_PATH', '')
    if env_path and os.path.isfile(env_path):
        return env_path

    # CLI argument
    if len(sys.argv) > 1 and os.path.isfile(sys.argv[1]):
        return sys.argv[1]

    # Relative to this script: ../../data/gbm_tokenizer.model
    script_dir = os.path.dirname(os.path.abspath(__file__))
    local = os.path.join(script_dir, '..', 'data', 'gbm_tokenizer.model')
    local = os.path.normpath(local)
    if os.path.isfile(local):
        return local

    # Try downloading from Hugging Face (requires approved gated access)
    try:
        from huggingface_hub import hf_hub_download
        path = hf_hub_download(
            repo_id='somu9/gbm-tokenizer',
            filename='gbm_tokenizer.model',
            cache_dir=os.path.join(script_dir, '..', 'data'),
        )
        return path
    except Exception as e:
        sys.stderr.write(f'[gbm] HF download failed: {e}\n')
        return None


def main():
    model_path = resolve_model_path()
    if not model_path:
        sys.stderr.write('[gbm] Model not found. Set GBM_MODEL_PATH or download from somu9/gbm-tokenizer.\n')
        # Stay alive but signal unavailable so Node.js degrades gracefully
        print(json.dumps({'ready': False, 'error': 'model_not_found'}), flush=True)
        sys.exit(1)

    try:
        import sentencepiece as spm
    except ImportError:
        sys.stderr.write('[gbm] sentencepiece not installed. Run: pip install sentencepiece\n')
        print(json.dumps({'ready': False, 'error': 'sentencepiece_not_installed'}), flush=True)
        sys.exit(1)

    sp = spm.SentencePieceProcessor()
    try:
        sp.load(model_path)
    except Exception as e:
        sys.stderr.write(f'[gbm] Failed to load model: {e}\n')
        print(json.dumps({'ready': False, 'error': str(e)}), flush=True)
        sys.exit(1)

    # Signal ready to Node.js
    print(json.dumps({'ready': True}), flush=True)

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            text = req.get('text', '')
            pieces = sp.encode(text, out_type=str)
            # Word-initial pieces start with the ▁ (U+2581) sentencepiece marker.
            # Stripping it gives the natural word stem / root form.
            stems = [p[1:] for p in pieces if p.startswith('\u2581') and len(p) > 1]
            print(json.dumps({'id': req.get('id', ''), 'stems': stems}), flush=True)
        except json.JSONDecodeError:
            pass  # ignore malformed lines
        except Exception as e:
            req_id = ''
            try:
                req_id = json.loads(line).get('id', '')
            except Exception:
                pass
            print(json.dumps({'id': req_id, 'error': str(e)}), flush=True)


if __name__ == '__main__':
    main()
