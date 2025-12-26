# Quick Start: Testing & Metrics

## Run Batch Tests

### All Conversations (12 scenarios, ~50 turns)
```bash
npm run test:batch
```

### First 3 Conversations Only
```bash
npm run test:batch -- --conversations 3
```

### Stub Mode (Fast, No API Calls)
```bash
VOICE_STACK_MODE=stub npm run test:batch
```

### Live Mode (Real APIs)
```bash
VOICE_STACK_MODE=live npm run test:batch
```

---

## View Results

### Console Output
Real-time metrics shown during test run

### Files (in `test-results/`)
- `metrics-TIMESTAMP.json` - Full structured data
- `metrics-TIMESTAMP.csv` - Spreadsheet analysis

### Open in Excel/Sheets
```bash
open test-results/metrics-*.csv
```

---

## Quick Analysis

### Python
```python
import pandas as pd
df = pd.read_csv('test-results/metrics-*.csv')
df.groupby('intent_type')['total_latency_ms'].mean()
```

### JavaScript
```javascript
const m = require('./test-results/metrics-*.json');
console.log(m.summary);
```

---

## Add Custom Tests

Edit `scripts/test-conversations.json`:
```json
{
  "id": "my_test",
  "description": "My scenario",
  "turns": ["Message 1", "Message 2", "Message 3"]
}
```

---

## Key Metrics Tracked

- ⏱️ Latency (ASR, Intent, Dialogue, TTS, Total)
- 💰 Cost per turn and per conversation
- 🎯 Intent type and confidence
- 😊 Tone emotion and sentiment
- 📊 Urgency and politeness scores

---

## Current Performance

| Component | Target | Actual | Status |
|-----------|--------|--------|--------|
| Total Pipeline | 300ms | ~3000ms | ⚠️ Needs optimization |
| ASR | 200ms | 50ms* | ✅ (stub) |
| Intent | 150ms | ~2000ms | ⚠️ Slowest |
| Dialogue | 200ms | ~900ms | ⚠️ 4x over |
| TTS | 150ms | timeout* | ⚠️ (deployment) |

*Stub mode or deployment limitation

---

## Documentation

- `BATCH_TESTING_GUIDE.md` - Full usage guide
- `METRICS_AND_TESTING_SUMMARY.md` - Implementation summary
- `WEEK3_CARTESIA_TTS_COMPLETE.md` - TTS integration

---

## Troubleshooting

**Error: Cannot find module**
```bash
cd cardealerships-main
npm run test:batch
```

**No API keys**
```bash
ls ../.env.local  # Should exist
```

**Slow in live mode**
- Expected! Use stub mode for quick tests

---

Quick command:
```bash
npm run test:batch -- --conversations 2
```
