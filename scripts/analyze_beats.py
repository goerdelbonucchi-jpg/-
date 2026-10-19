#!/usr/bin/env python3
"""Print a reproducible beat/downbeat estimate for a supplied music file."""

import argparse
import json

import librosa
import numpy as np


parser = argparse.ArgumentParser()
parser.add_argument("audio")
parser.add_argument("--limit", type=float, default=60)
args = parser.parse_args()

y, sr = librosa.load(args.audio, sr=22050, mono=True)
harmonic, percussive = librosa.effects.hpss(y)
hop = 512
onsets = librosa.onset.onset_strength(y=percussive, sr=sr, hop_length=hop)
tempo, frames = librosa.beat.beat_track(
    onset_envelope=onsets,
    sr=sr,
    hop_length=hop,
    start_bpm=100,
    tightness=80,
)
tempo = float(np.atleast_1d(tempo)[0])
times = librosa.frames_to_time(frames, sr=sr, hop_length=hop)
strengths = onsets[np.minimum(frames, len(onsets) - 1)]

# The strongest average accent among the four beat positions is the likely bar start.
usable = times > 4
phase_scores = []
for phase in range(4):
    values = strengths[(np.arange(len(times)) % 4 == phase) & usable]
    phase_scores.append(float(np.mean(values)) if len(values) else 0.0)
downbeat_phase = int(np.argmax(phase_scores))
downbeats = times[np.arange(len(times)) % 4 == downbeat_phase]

# Estimate the tonal center so pitched sound effects can stay musical.
chroma = librosa.feature.chroma_cqt(y=harmonic, sr=sr, hop_length=hop)
chroma_mean = np.mean(chroma, axis=1)
major_profile = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
minor_profile = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
keys = []
for tonic in range(12):
    keys.append((float(np.corrcoef(chroma_mean, np.roll(major_profile, tonic))[0, 1]), f"{names[tonic]} major"))
    keys.append((float(np.corrcoef(chroma_mean, np.roll(minor_profile, tonic))[0, 1]), f"{names[tonic]} minor"))
keys.sort(reverse=True)

payload = {
    "duration_seconds": round(len(y) / sr, 3),
    "bpm": round(tempo, 4),
    "beat_interval_seconds": round(60 / tempo, 6),
    "meter": "4/4 (estimated)",
    "estimated_key": keys[0][1],
    "key_confidence_correlation": round(keys[0][0], 4),
    "downbeat_phase": downbeat_phase,
    "phase_scores": [round(score, 4) for score in phase_scores],
    "beats_seconds": [round(float(t), 4) for t in times if t <= args.limit],
    "downbeats_seconds": [round(float(t), 4) for t in downbeats if t <= args.limit],
}
print(json.dumps(payload, ensure_ascii=False, indent=2))
