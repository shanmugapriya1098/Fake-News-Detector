# 🛡️ Eureka – Fake News Detector

A sleek, fully client-side fake news and misinformation detector built with vanilla HTML, CSS, and JavaScript. No server, no API keys — runs entirely in the browser.

---

## 🚀 Live Demo

Open `index.html` directly in any modern browser — no build step or server required.

---

## ✨ Features

- **Three input modes** — paste full article text, enter a news URL, or type a headline
- **Multi-signal analysis engine** — evaluates 6 independent signals and computes a weighted credibility score
- **Animated credibility ring** — visual score from 0–100 with color-coded verdict
- **Red flags** — highlights specific deceptive patterns found in the content
- **Actionable recommendations** — tells the reader how to verify the information
- **Premium dark UI** — animated gradient orbs, glassmorphism cards, smooth micro-animations

---

## 🧠 Detection Signals

| Signal | Description |
|---|---|
| 🎯 **Clickbait** | Detects sensationalist words and phrases designed to mislead |
| 🎭 **Emotional Tone** | Measures fear-mongering and emotionally manipulative language |
| 🌀 **Conspiracy Language** | Flags known conspiracy theory tropes and markers |
| 📡 **Source Quality** | Evaluates domain reputation against credible/suspicious domain lists |
| ✍️ **Writing Quality** | Checks for ALL-CAPS abuse, excess punctuation, and journalistic quality |
| ⚖️ **Ideological Bias** | Detects strong partisan or ideological slant |

---

## 📁 Project Structure

```
fake-news-detector/
├── index.html   # App markup — hero, detector card, results section
├── style.css    # Full dark-mode design system, animations, responsive layout
└── app.js       # Multi-signal heuristic analysis engine
```

---

## ⚙️ How It Works

1. **User submits content** via one of three tabs (text, URL, or headline)
2. **`performAnalysis()`** runs six independent heuristic checks against curated word lists and domain databases
3. A **weighted credibility score** (0–100) is computed from all signals
4. **Verdict** is determined:
   - ✅ **Likely Credible** — score ≥ 65
   - ⚠️ **Suspicious / Unverified** — score 38–64
   - ❌ **Likely Fake / Misleading** — score < 38
5. Results are rendered with animated signal cards, breakdown bars, red flags, and recommendations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS (custom properties, CSS Grid, animations) |
| Logic | Vanilla JavaScript (ES2020+, no dependencies) |
| Fonts | Google Fonts – Inter |

---

## ⚠️ Disclaimer

Eureka is an **educational tool** and uses heuristic pattern-matching — not a trained ML model. Results are indicative, not definitive. Always verify information from multiple trusted sources (Reuters, AP News, BBC, Snopes, PolitiFact) before drawing conclusions or sharing content.

---

© 2026 Eureka • Built for digital literacy

