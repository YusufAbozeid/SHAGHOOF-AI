from fastapi import FastAPI

app = FastAPI(title="Shaghoof Backend")

@app.get("/")
@app.get("/health")
@app.get("/api/v1/health")
def health():
    return {"status": "ok", "message": "Shaghoof AI Backend is live on Vercel!"}
