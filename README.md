
# DebtMap — Migration Advisor

##  Overview

DebtMap is an AI-powered tool that helps developers detect deprecated API usage and generate migration guidance with updated code.

## Problem

Modern applications rely on third-party APIs that evolve rapidly. Developers struggle to:

* Identify outdated APIs
* Understand migration steps
* Refactor code safely

## Solution

DebtMap:

* Scans code for deprecated APIs
* Explains why they are outdated
* Generates step-by-step migration guidance
* Provides updated code snippets

##  Architecture

1. Detection Engine (Rule-based scanner)
2. AI Layer (Generates explanation & fixes)
3. Backend (FastAPI)
4. Frontend (Simple UI)

##  Tech Stack

* Python (FastAPI)
* OpenAI API
* HTML/CSS/JS (Frontend)

##  Team

* Person A — Detection Engine
* Person B — AI Layer
* Person C — Backend
* Person D — Frontend

## 🛠️ Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

Open `frontend/index.html` in browser

##  Demo

Paste code → Detect issues → Get migration plan

##  Limitations

* Supports limited APIs (demo version)
* Rule-based detection
* Not suitable for large codebases

## 🔮 Future Scope

* GitHub integration
* Multi-language support
* Auto-fix PR generation

## OpenClaw Integration

This project follows an OpenClaw-inspired agent architecture:

- SOUL.md → defines agent behavior
- SKILL.md → defines task execution
- HEARTBEAT.md → defines activation logic

The AI agent processes detected deprecated APIs and generates structured migration guidance using an LLM backend.