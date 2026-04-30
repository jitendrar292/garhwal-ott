import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function VoiceRecordingPage() {
  const { user, isAuthenticated } = useAuth();
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ recorded: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  // Load sentences on mount
  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = async () => {
    try {
      const res = await fetch('/api/tts/sentences');
      const data = await res.json();
      setSentences(data.sentences || []);
      setStats({ recorded: data.recorded || 0, total: data.total || 0 });
      setLoading(false);
    } catch (err) {
      setError('Failed to load sentences');
      setLoading(false);
    }
  };

  const startRecording = async () => {
    setError('');
    setSuccess('');
    setAudioBlob(null);
    setAudioUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 22050,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadRecording = async () => {
    if (!audioBlob || !sentences[currentIndex]) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, `${sentences[currentIndex].id}.webm`);
      formData.append('sentenceId', sentences[currentIndex].id);
      formData.append('text', sentences[currentIndex].text);
      if (user) {
        formData.append('userId', user.email);
        formData.append('userName', user.name);
      }

      const res = await fetch('/api/tts/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      setSuccess('Recording uploaded successfully!');
      setStats(prev => ({ ...prev, recorded: prev.recorded + 1 }));
      
      // Move to next sentence after short delay
      setTimeout(() => {
        setAudioBlob(null);
        setAudioUrl(null);
        setSuccess('');
        if (currentIndex < sentences.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }, 1500);
    } catch (err) {
      setError('Failed to upload recording. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const skipSentence = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setError('');
    setSuccess('');
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentSentence = sentences[currentIndex];
  const progress = sentences.length > 0 ? ((currentIndex + 1) / sentences.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <SEO
        title="Voice Recording - Garhwali TTS"
        description="Help us build a Garhwali voice model by recording sentences"
        path="/voice-recording"
      />

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="page-header mb-2">🎙️ गढ़वाली <span className="gradient-text">आवाज रिकॉर्डिंग</span></h1>
        <p className="text-gray-400">
          Help us create a Garhwali voice model by recording these sentences
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-dark-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-primary-400">{currentIndex + 1} / {sentences.length}</span>
        </div>
        <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <span>Total recordings: {stats.recorded}</span>
          <span>Category: {currentSentence?.category || '-'}</span>
        </div>
      </div>

      {/* Recording Card */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-white/5 mb-6">
        {/* Sentence Display */}
        <div className="text-center mb-8">
          <p className="text-xs text-gray-500 mb-2">Read this sentence clearly:</p>
          <p className="text-2xl sm:text-3xl font-bold text-white leading-relaxed">
            {currentSentence?.text || 'No sentence available'}
          </p>
          <p className="text-xs text-gray-500 mt-2">ID: {currentSentence?.id}</p>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center gap-4">
          {/* Record Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={uploading}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
              isRecording 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-gradient-to-br from-primary-500 to-primary-600'
            }`}
          >
            {isRecording ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </button>
          <p className="text-sm text-gray-400">
            {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
          </p>

          {/* Audio Playback */}
          {audioUrl && (
            <div className="w-full max-w-md">
              <audio ref={audioRef} src={audioUrl} controls className="w-full" />
            </div>
          )}

          {/* Action Buttons */}
          {audioBlob && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setAudioBlob(null); setAudioUrl(null); }}
                className="px-4 py-2 bg-dark-600 text-gray-300 rounded-lg hover:bg-dark-500 transition-colors"
              >
                🔄 Re-record
              </button>
              <button
                onClick={uploadRecording}
                disabled={uploading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
              >
                {uploading ? '⏳ Uploading...' : '✓ Submit'}
              </button>
            </div>
          )}

          {/* Skip Button */}
          <button
            onClick={skipSentence}
            className="text-sm text-gray-500 hover:text-gray-300 mt-2"
          >
            Skip this sentence →
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm text-center">{success}</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-dark-800 rounded-xl p-4">
        <h3 className="font-medium text-white mb-3">📋 Recording Tips</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex gap-2">
            <span className="text-primary-400">•</span>
            Find a quiet place with no background noise
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400">•</span>
            Speak clearly and naturally at normal pace
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400">•</span>
            Keep phone/mic 6-12 inches from your mouth
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400">•</span>
            Listen to playback before submitting
          </li>
          <li className="flex gap-2">
            <span className="text-primary-400">•</span>
            Skip if you're unsure about pronunciation
          </li>
        </ul>
      </div>

      {/* Auth Status */}
      <div className="text-center mt-6">
        {isAuthenticated ? (
          <p className="text-sm text-gray-500">
            Recording as: <span className="text-primary-400">{user?.name}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            <Link to="/login" className="text-primary-400 hover:underline">Sign in</Link>
            {' '}to get credit for your contributions
          </p>
        )}
      </div>

      {/* Back Link */}
      <div className="text-center mt-4">
        <Link to="/" className="text-sm text-gray-400 hover:text-white">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
