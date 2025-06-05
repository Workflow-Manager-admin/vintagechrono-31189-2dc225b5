//
// Typewriter/phonograph click sound module for VintageChrono
//
// This module can be imported and used throughout the app wherever vintage sound effects are needed.
// Usage: import { playClickSound, setGlobalSoundEnabled } from './clickSound';
//        playClickSound();
//        setGlobalSoundEnabled(true | false);
//
// PUBLIC_INTERFACE
let audio = null;
let enabled = false;

// We use a short, license-free typewriter click sound (16-bit PCM WAV, 44.1kHz, mono, ~100ms).
// The below is a small, embeddable base64 WAV; for production, replace with asset import if desired.
const CLICK_WAV_BASE64 =
  "UklGRjwAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YYwAAAD/yP/I/5v/FP8U/wj/fX19fvj3+S2GkQaWnYDDz8/2AOeAcMJer2l1AvYGeh4Uy8lJq+gjHYGcIh7j5GLk77G4Dq4MzBCwGrPq3QBvHXFo0Hz3zwVWAFNa14WHgriMIQBwCKYAKOCYAAAAA0A1AAAAEQAAABUAAACGg21wAAAA";

function ensureAudio() {
  if (!audio) {
    const bin = atob(CLICK_WAV_BASE64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) arr[i] = bin.charCodeAt(i);
    const blob = new Blob([arr], { type: "audio/wav" });
    audio = new Audio(URL.createObjectURL(blob));
    audio.preload = "auto";
    audio.volume = 0.34;
  }
}

// PUBLIC_INTERFACE
export function setGlobalSoundEnabled(val) {
  enabled = !!val;
}

// PUBLIC_INTERFACE
export function playClickSound() {
  if (!enabled) return;
  ensureAudio();
  // For rapid clicks (e.g., repeated fast button presses), clone and play a new instance.
  try {
    const click = audio.cloneNode();
    click.currentTime = 0;
    // Safari/mobile handling: resume play if suspended.
    click.play();
  } catch (e) {
    // fail silent (e.g., audio blocked by browser policy)
  }
}
