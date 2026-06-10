# Job App AI Agent

A small job application assistant with a FastAPI backend and a Next.js frontend. The current UI lets you upload a resume PDF, paste a job description, and generate a cover letter.

## Stack

- Backend: FastAPI
- Frontend: Next.js
- LLM client: OpenAI Python SDK pointed at a local OpenAI-compatible endpoint

## Prerequisites

- Python 3.9+
- `uv`
- Node.js 20+ and `npm`
- A local OpenAI-compatible model server running on `http://localhost:11434/v1/`
  - The current code is configured for Ollama by default.

## LLM setup

Start Ollama and run a model you want the app to use. Example:

```bash
ollama serve
ollama run deepseek-r1:latest
```

Create a `.env` file in the project root:

```env
OPENAI_MODEL=deepseek-r1:latest
```

Note: the current backend implementation in [app/services/llm_service.py](/Users/nirob/Nirob/projects/Job-App-AI-Agent/app/services/llm_service.py:1) is hard-wired to `http://localhost:11434/v1/`, so a hosted OpenAI API key is not used unless that file is changed.

## Run the backend

Install Python dependencies:

```bash
uv sync
```

Start the FastAPI server from the project root:

```bash
uv run fastapi dev main.py
```

Alternative:

```bash
uv run uvicorn main:app --reload
```

Backend URL: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: [http://localhost:3000](http://localhost:3000)

The frontend currently posts uploads to `http://127.0.0.1:8000/analyze_upload`, so the backend should stay on port `8000`.

## How to use

1. Start the local model server.
2. Start the backend.
3. Start the frontend.
4. Open [http://localhost:3000](http://localhost:3000).
5. Upload a PDF resume and paste a job description.

## API endpoints

- `GET /`: simple health-style response
- `POST /analyze`: analyze raw resume text and job description JSON
- `POST /analyze_upload`: upload a resume PDF plus a job description

## Run tests

From the project root:

```bash
uv run python -m unittest discover -s tests
```
