# 🧪 Portfolio Projects

Seven standalone projects that sit alongside the weekly lessons. Each is longer and
messier than a lesson on purpose — lessons teach one idea, these ask you to hold several
at once, which is what the work actually feels like.

They're ordered by the curriculum week they belong to, not by difficulty.

---

## The projects

| # | Project | Week | What you actually build |
|---|---------|------|-------------------------|
| 1 | [Model Performance Reporter](Phase-1-Foundations/Week-1-Python-Basics/Project-Model-Performance-Reporter.ipynb) | 1 | Evaluation + reporting tool for comparing several models |
| 2 | [Fraud Detection on Imbalanced Data](Phase-2-Machine-Learning/Week-10-Ensemble-Methods/Project-Fraud-Detection-Imbalanced.ipynb) | 10 | Classifier for a 1:1000 class ratio, with threshold tuning |
| 3 | [CV Edge Deployment](Phase-3-Deep-Learning/Week-13-CNNs-Computer-Vision/Project-CV-Edge-Deployment.ipynb) | 13 | MobileNetV3 → quantized → ONNX, benchmarked |
| 4 | [RAG Chatbot](Phase-3-Deep-Learning/Week-16-Transformers-Attention/Project-RAG-Chatbot.ipynb) | 16 | Chunking → embeddings → vector search → grounded answers |
| 5 | [MLOps Pipeline](Phase-4-Advanced-AI/Week-19-MLOps-Deployment/Project-Production-MLOps-Pipeline.ipynb) | 19 | Training → MLflow → FastAPI → Prometheus, in Docker |
| 6 | [LLM Agent System](Phase-4-Advanced-AI/Week-21-Industry-Critical-Skills/Project-LLM-Agent-System.ipynb) | 21 | ReAct loop with tool dispatch and validated output |
| 7 | [Recommendation Engine](Phase-4-Advanced-AI/Week-22-Job-Critical-Skills/Project-Recommendation-Engine.ipynb) | 22 | Hybrid recommender held to a latency budget |

---

## What runs for free, and what doesn't

Everything runs on Colab's free tier. Two caveats worth knowing before you start:

| Project | Needs | Note |
|---------|-------|------|
| RAG Chatbot | ~1GB download | Pulls `all-MiniLM-L6-v2` and `flan-t5-base` on first run. CPU is fine, just slow. |
| LLM Agent | Nothing | **Partly stubbed — see below.** |
| CV Edge | Nothing | Downloads pretrained MobileNetV3 weights. |
| The rest | Nothing | Synthetic data, generated in-notebook. |

**The LLM Agent notebook is the one exception to "it works."** Its schemas, ReAct loop and
tool dispatch are real, but the tools return canned strings and the model's turns are
hardcoded so it runs without an API key. The notebook says so at the top and marks the two
lines you need to change. Swap those before you show it to anyone as an agent.

The other six do real work — real training, real ONNX export, real vector search, real
MLflow runs. The *data* is synthetic in several of them, which is a different thing from
the *code* being fake.

---

## Running them

```bash
git clone https://github.com/gouthamgo/Learn-AI.git
cd Learn-AI
pip install jupyter
jupyter notebook
```

Or open any notebook directly in Colab — no install at all.

Generated files (models, Dockerfiles, ONNX exports, reports) are written to `artifacts/`,
which is gitignored, so running a notebook won't dirty your working tree.

---

## Turning one into a portfolio piece

A notebook you ran once is not a portfolio piece. What makes the difference:

1. **Move it out of the notebook.** Split it into modules with a `main.py`. Notebooks
   demonstrate; repos get read.
2. **Deploy one.** A working URL beats a thousand lines nobody will clone. HuggingFace
   Spaces, Railway and Render all have free tiers.
3. **Write down what you chose and why.** A short `DECISIONS.md` — why ChromaDB and not
   Pinecone, why you picked that chunk size, what you tried that didn't work. This is the
   part most people skip, and the part that reads as experience.
4. **Put real numbers in the README.** "p95 latency 43ms on 4 vCPU", "recall 0.71 at a 0.3
   threshold". Specific and measured beats "high performance".
5. **Swap the synthetic data for real data.** Kaggle, HuggingFace Datasets, a public API.
   Real data misbehaves in ways generated data won't, and handling that is the skill.

Three projects taken this far are worth more than seven left as notebooks.

---

## A note on scope

These projects are teaching scaffolds — they're built to be read and modified, so they
favour clarity over completeness. Things a real production system would have and these
deliberately don't: authentication, rate limiting, retries with backoff, secrets
management, integration tests, cost controls on model calls.

That's not a defect, it's the tradeoff. But know the gap is there, and don't claim
otherwise on a résumé.
