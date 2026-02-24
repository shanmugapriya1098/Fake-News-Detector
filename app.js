/**
 * FakeShield – Fake News Detector
 * Multi-signal heuristic analysis engine (client-side)
 */

// ──────────────────────────────────────────
// Tab Management
// ──────────────────────────────────────────
let activeTab = 'text';

document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.dataset.tab;
        document.getElementById(`content-${activeTab}`).classList.add('active');
    });
});

// Character counter
document.getElementById('news-text').addEventListener('input', function () {
    document.getElementById('char-count').textContent = this.value.length;
});

// ──────────────────────────────────────────
// Wordlists & patterns
// ──────────────────────────────────────────
const CLICKBAIT_WORDS = [
    'shocking', 'unbelievable', 'mind-blowing', "you won't believe", "won't believe",
    'secret revealed', "they don't want you to know", 'miracle', 'incredible', 'amazing',
    'stunning', 'jaw-dropping', 'insane', 'explosive', 'breaking', 'urgent', 'must see',
    'exposed', 'truth behind', 'hidden truth', 'what the media won\'t tell',
    'this one weird trick', 'doctors hate', 'government hiding', 'scientists baffled',
    'share before', 'share this', "before it's deleted", 'before they delete',
    'wake up', 'they are hiding', 'hiding from you', 'what they found',
    'discover', 'miracle cure'
];

const SENSATIONAL_PHRASES = [
    'BREAKING', 'EXCLUSIVE', 'SHOCKING', 'MUST READ', 'URGENT', 'ALERT',
    'CENSORED', 'BANNED', 'SUPPRESSED', 'WHISTLEBLOWER'
];

const EMOTIONAL_WORDS = [
    'outrage', 'furious', 'terrified', 'horrified', 'panic', 'disaster', 'catastrophe',
    'crisis', 'threat', 'dangerous', 'deadly', 'evil', 'corrupt', 'disgusting', 'devastating',
    'alarming', 'frightening', 'chaos', 'collapse', 'doom', 'apocalypse'
];

const CONSPIRACY_MARKERS = [
    'deep state', 'new world order', 'illuminati', 'false flag', 'crisis actor',
    'plandemic', 'microchip', '5g', 'chemtrails', 'qanon', 'great reset', 'globalist',
    'shadow government', "they don't want you to know", 'pills that cure',
    'cure for cancer', 'cancer cure', 'government is hiding', 'government hiding',
    'hiding from you', 'one weird trick', 'big pharma', 'suppressed cure',
    'miracle cure', 'scientists discovered', 'they found a cure'
];

const CREDIBLE_DOMAINS = [
    'reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk', 'theguardian.com',
    'nytimes.com', 'washingtonpost.com', 'economist.com', 'nature.com', 'science.org',
    'who.int', 'cdc.gov', 'nih.gov', 'nasa.gov', 'britannica.com', 'snopes.com',
    'politifact.com', 'factcheck.org', 'aljazeera.com', 'npr.org', 'pbs.org'
];

const SUSPICIOUS_DOMAINS = [
    'infowars', 'naturalnews', 'beforeitsnews', 'worldnewsdailyreport', 'thelastlineofdefense',
    'empirenews', 'worldtruth', 'now8news', 'huzlers', 'theonion', 'clickhole',
    'nationalreport', 'abcnews.com.co', 'nbc.com.co'
];

const UNRELIABLE_TLDS = ['.xyz', '.pw', '.tk', '.ml', '.ga', '.cf', '.biz.tc'];

// ──────────────────────────────────────────
// Main Analysis Function
// ──────────────────────────────────────────
async function analyzeNews() {
    const btn = document.getElementById('analyze-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('.btn-icon');

    // Get input
    let content = '';
    if (activeTab === 'text') content = document.getElementById('news-text').value.trim();
    else if (activeTab === 'url') content = document.getElementById('news-url').value.trim();
    else if (activeTab === 'headline') content = document.getElementById('news-headline').value.trim();

    if (!content) {
        shakeElement(btn);
        btnText.textContent = 'Please enter some content first!';
        setTimeout(() => { btnText.textContent = 'Analyze Now'; }, 2000);
        return;
    }

    // Loading state
    btn.classList.add('loading');
    btn.disabled = true;
    btnIcon.classList.add('spinning');
    btnText.textContent = 'Analyzing…';

    // Simulate processing time for realism
    await sleep(1600 + Math.random() * 800);

    // Run analysis
    const result = performAnalysis(content, activeTab);

    // Render results
    renderResults(result);

    // Reset button
    btn.classList.remove('loading');
    btn.disabled = false;
    btnIcon.classList.remove('spinning');
    btnIcon.textContent = '🔍';
    btnText.textContent = 'Analyze Now';

    // Scroll to results
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ──────────────────────────────────────────
// Analysis Engine
// ──────────────────────────────────────────
function performAnalysis(content, mode) {
    const lower = content.toLowerCase();
    const words = lower.split(/\s+/);
    const wordCount = words.length;

    // 1. Clickbait Score (0-100)
    let clickbaitHits = 0;
    CLICKBAIT_WORDS.forEach(w => { if (lower.includes(w)) clickbaitHits++; });
    SENSATIONAL_PHRASES.forEach(p => { if (content.includes(p)) clickbaitHits += 2; });
    const clickbaitScore = Math.min(100, clickbaitHits * 12);

    // 2. Emotional Manipulation Score
    let emotionalHits = 0;
    EMOTIONAL_WORDS.forEach(w => { if (lower.includes(w)) emotionalHits++; });
    const emotionalScore = Math.min(100, emotionalHits * 9);

    // 3. Conspiracy Score
    let conspiracyHits = 0;
    CONSPIRACY_MARKERS.forEach(m => { if (lower.includes(m)) conspiracyHits++; });
    const conspiracyScore = Math.min(100, conspiracyHits * 25);

    // 4. Source Reliability Score
    let sourceScore = 50; // neutral default
    if (mode === 'url') {
        const url = content.toLowerCase();
        if (CREDIBLE_DOMAINS.some(d => url.includes(d))) {
            sourceScore = 90 + Math.random() * 10;
        } else if (SUSPICIOUS_DOMAINS.some(d => url.includes(d))) {
            sourceScore = 5 + Math.random() * 15;
        } else if (UNRELIABLE_TLDS.some(t => url.includes(t))) {
            sourceScore = 15 + Math.random() * 20;
        } else {
            sourceScore = 40 + Math.random() * 35;
        }
    } else {
        sourceScore = 45 + Math.random() * 30;
    }

    // 5. Writing Quality Score
    const hasExcessiveCaps = (content.match(/[A-Z]{3,}/g) || []).length;
    const hasExclamation = (content.match(/!/g) || []).length;
    const hasQuestionMark = (content.match(/\?/g) || []).length;
    const avgWordLen = words.reduce((a, w) => a + w.length, 0) / Math.max(wordCount, 1);
    let writingScore = 70;
    writingScore -= hasExcessiveCaps * 5;
    writingScore -= hasExclamation * 3;
    writingScore -= (hasQuestionMark > 2 ? (hasQuestionMark - 2) * 4 : 0);
    writingScore += avgWordLen > 5 ? 10 : 0;
    writingScore = Math.max(5, Math.min(100, writingScore + (Math.random() * 10 - 5)));

    // 6. Bias Score
    const biasWords = ['obviously', 'clearly', 'everyone knows', 'undeniably', 'radical',
        'socialist', 'fascist', 'communist', 'terrorist', 'racist', 'bigot', 'libtard',
        'snowflake', 'deplorable', 'mainstream media', 'fake news', 'hoax'];
    let biasHits = 0;
    biasWords.forEach(w => { if (lower.includes(w)) biasHits++; });
    const biasScore = Math.min(100, biasHits * 14 + Math.random() * 15);

    // Compose weighted credibility score
    // Start at 50 (neutral baseline), apply positive & negative signals
    const baseCredibility = 50
        - clickbaitScore * 0.40      // clickbait heavily reduces credibility
        - emotionalScore * 0.28      // emotional manipulation reduces credibility
        - conspiracyScore * 0.50     // conspiracy language strongly reduces credibility
        + (sourceScore - 50) * 0.30  // credible sources boost; suspicious sources hurt
        + (writingScore - 50) * 0.12 // better writing quality gives a small boost
        - biasScore * 0.12;          // strong ideological bias reduces credibility

    const credibility = Math.round(Math.max(4, Math.min(96, baseCredibility)));

    // Verdict
    let verdict, verdictIcon, verdictSub, verdictClass;
    if (credibility >= 65) {
        verdict = 'Likely Credible';
        verdictIcon = '✅';
        verdictClass = 'verdict-real';
        verdictSub = 'The content shows strong signs of credibility. Low levels of manipulation, sensationalism, and conspiracy language detected.';
    } else if (credibility >= 38) {
        verdict = 'Suspicious / Unverified';
        verdictIcon = '⚠️';
        verdictClass = 'verdict-suspicious';
        verdictSub = 'Some red flags were detected. We recommend cross-referencing this content with trusted fact-checking sources before sharing.';
    } else {
        verdict = 'Likely Fake / Misleading';
        verdictIcon = '❌';
        verdictClass = 'verdict-fake';
        verdictSub = 'Multiple deception signals detected. This content exhibits strong patterns of fake news, misinformation, or propaganda.';
    }

    // Red flags
    const flags = [];
    if (clickbaitScore >= 24) flags.push('Clickbait language or sensationalist headlines detected');
    if (emotionalScore >= 27) flags.push('High emotional manipulation – designed to provoke fear or outrage');
    if (conspiracyScore >= 25) flags.push('Known conspiracy theory markers or tropes present');
    if (hasExcessiveCaps >= 3) flags.push('Excessive use of ALL CAPS – common in low-quality or misleading content');
    if (hasExclamation >= 4) flags.push('Overuse of exclamation marks signals sensationalism');
    if (biasScore >= 40) flags.push('Strong ideological bias language detected');
    if (sourceScore < 35 && mode === 'url') flags.push('URL from an unreliable or known misinformation domain');
    if (writingScore < 40) flags.push('Poor writing quality inconsistent with professional journalism');

    // Recommendations
    const recs = [
        'Cross-check the story on Reuters, AP News, or BBC before sharing',
        'Search for the same story on established fact-checkers (Snopes, PolitiFact, FactCheck.org)',
        'Verify the original source — does the author and publication exist?',
        'Check if the story cites any primary sources, studies, or official statements',
        'Look at the publication date — old news often recirculates as "breaking"',
        'Be especially wary of content that makes you feel angry or afraid',
    ];

    return {
        credibility, verdict, verdictIcon, verdictClass, verdictSub, flags,
        recommendations: recs,
        signals: {
            clickbait: clickbaitScore,
            emotional: emotionalScore,
            conspiracy: conspiracyScore,
            source: Math.round(sourceScore),
            writing: Math.round(writingScore),
            bias: Math.round(biasScore),
        }
    };
}

// ──────────────────────────────────────────
// Render Results
// ──────────────────────────────────────────
function renderResults(r) {
    const section = document.getElementById('results-section');
    section.style.display = 'block';

    // Verdict theme
    const resultArea = document.getElementById('results-section');
    resultArea.className = `results-section ${r.verdictClass}`;

    // Verdict banner
    document.getElementById('verdict-icon').textContent = r.verdictIcon;
    document.getElementById('verdict-label').textContent = r.verdict;
    document.getElementById('verdict-sub').textContent = r.verdictSub;
    document.getElementById('score-val').textContent = r.credibility;

    // Score ring animation
    const circumference = 314;
    const offset = circumference - (r.credibility / 100) * circumference;
    const ringFill = document.getElementById('ring-fill');
    ringFill.style.strokeDashoffset = circumference; // reset
    setTimeout(() => { ringFill.style.strokeDashoffset = offset; }, 100);

    // Signal cards
    const signalDefs = [
        { key: 'clickbait', icon: '🎯', name: 'Clickbait', inverted: true },
        { key: 'emotional', icon: '🎭', name: 'Emotional', inverted: true },
        { key: 'conspiracy', icon: '🌀', name: 'Conspiracy', inverted: true },
        { key: 'source', icon: '📡', name: 'Source', inverted: false },
        { key: 'writing', icon: '✍️', name: 'Writing', inverted: false },
        { key: 'bias', icon: '⚖️', name: 'Bias', inverted: true },
    ];

    const grid = document.getElementById('signals-grid');
    grid.innerHTML = '';
    signalDefs.forEach(({ key, icon, name, inverted }) => {
        const val = r.signals[key];
        const color = getSignalColor(val, inverted);
        const label = getSignalLabel(val, inverted);
        grid.innerHTML += `
      <div class="signal-card">
        <div class="signal-header">
          <span class="signal-icon">${icon}</span>
          <span class="signal-name">${name}</span>
        </div>
        <div class="signal-value" style="color:${color}">${label}</div>
        <div class="signal-bar-bg">
          <div class="signal-bar" style="width:0%; background:${color}" data-width="${val}%"></div>
        </div>
      </div>`;
    });
    // Animate bars
    setTimeout(() => {
        document.querySelectorAll('.signal-bar').forEach(bar => {
            bar.style.width = bar.dataset.width;
        });
    }, 150);

    // Breakdown bars
    const breakdownData = [
        { label: 'Credibility Score', value: r.credibility, color: getScoreColor(r.credibility) },
        { label: 'Clickbait Level', value: r.signals.clickbait, color: '#ff4d6d' },
        { label: 'Emotional Tone', value: r.signals.emotional, color: '#ffd166' },
        { label: 'Conspiracy Language', value: r.signals.conspiracy, color: '#ff6b6b' },
        { label: 'Source Reliability', value: r.signals.source, color: '#48cfad' },
        { label: 'Writing Quality', value: r.signals.writing, color: '#6c63ff' },
        { label: 'Ideological Bias', value: r.signals.bias, color: '#f78c6c' },
    ];
    const bbars = document.getElementById('breakdown-bars');
    bbars.innerHTML = '';
    breakdownData.forEach(({ label, value, color }) => {
        bbars.innerHTML += `
      <div class="bar-row">
        <div class="bar-label-row">
          <span class="bar-label">${label}</span>
          <span class="bar-pct" style="color:${color}">${value}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:0%; background:${color}" data-width="${value}%"></div>
        </div>
      </div>`;
    });
    setTimeout(() => {
        document.querySelectorAll('.bar-fill').forEach(b => { b.style.width = b.dataset.width; });
    }, 200);

    // Red flags
    const flagsCard = document.getElementById('flags-card');
    const flagsList = document.getElementById('flags-list');
    flagsList.innerHTML = '';
    if (r.flags.length > 0) {
        flagsCard.style.display = 'block';
        r.flags.forEach(f => { flagsList.innerHTML += `<li>${f}</li>`; });
    } else {
        flagsCard.style.display = 'none';
    }

    // Recommendations
    const recList = document.getElementById('rec-list');
    recList.innerHTML = '';
    r.recommendations.forEach(rec => { recList.innerHTML += `<li>${rec}</li>`; });
}

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────
function clearResults() {
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('news-text').value = '';
    document.getElementById('news-url').value = '';
    document.getElementById('news-headline').value = '';
    document.getElementById('char-count').textContent = '0';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getSignalColor(val, inverted) {
    const score = inverted ? (100 - val) : val;
    if (score >= 65) return '#06d6a0';
    if (score >= 38) return '#ffd166';
    return '#ff4d6d';
}

function getSignalLabel(val, inverted) {
    const score = inverted ? (100 - val) : val;
    if (score >= 75) return 'Good';
    if (score >= 55) return 'Fair';
    if (score >= 38) return 'Risky';
    return 'High';
}

function getScoreColor(score) {
    if (score >= 65) return '#06d6a0';
    if (score >= 38) return '#ffd166';
    return '#ff4d6d';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

// Add shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)}
  60%{transform:translateX(-5px)}
  80%{transform:translateX(5px)}
}`;
document.head.appendChild(shakeStyle);
