from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.services.championship_service import ChampionshipService

router = APIRouter(prefix="/championship", tags=["Championship & Academic Rigor Suite"])

class PodcastRequest(BaseModel):
    topic: str = Field(..., example="Backpropagation and Gradient Descent")
    language: str = Field("ar", example="ar")
    dialect: bool = Field(True, example=True)

class FeynmanRequest(BaseModel):
    topic: str = Field(..., example="Backpropagation")
    student_explanation: str = Field(..., min_length=5, example="تخيل إن الموديل زي طفل بيتعلم...")
    language: str = Field("ar", example="ar")

@router.post("/podcast/generate")
def generate_podcast(req: PodcastRequest):
    """
    Generate NotebookLM-style two-speaker conversational podcast overview.
    """
    try:
        return ChampionshipService.generate_podcast_dialogue(
            topic=req.topic,
            language=req.language,
            dialect=req.dialect
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rag/benchmark")
def get_rag_benchmark():
    """
    Returns quantitative RAG Triad & Ragas standard scientific benchmark metrics.
    """
    try:
        return ChampionshipService.get_rag_benchmark_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feynman/evaluate")
def evaluate_feynman(req: FeynmanRequest):
    """
    Evaluates student's plain-language explanation of a complex course concept.
    """
    try:
        return ChampionshipService.evaluate_reverse_feynman(
            topic=req.topic,
            student_explanation=req.student_explanation,
            language=req.language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/graph/concepts")
def get_concept_graph(course_id: Optional[str] = Query("default")):
    """
    Returns nodes and edges for 3D/Force-directed Knowledge Graph visualization.
    """
    try:
        return ChampionshipService.get_course_knowledge_graph(course_id=course_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
