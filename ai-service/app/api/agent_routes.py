from typing import Optional
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from app.agents.doctor_copilot import DoctorCopilotAgent

router = APIRouter(prefix="/agent", tags=["Hospital AI Agent"])

class MedicalChatRequest(BaseModel):
    message: str
    doctor_id: Optional[str] = None
    role: str = "DoctorAssistant"  # 'DoctorAssistant', 'PatientTriage', 'BillingAuditor'

@router.post("/chat")
async def chat_with_hospital_agent(
    req: MedicalChatRequest,
    x_hospital_id: str = Header(..., description="Multi-tenant Hospital UUID")
):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Query message cannot be empty")

    agent = DoctorCopilotAgent(hospital_id=x_hospital_id, role=req.role, doctor_id=req.doctor_id)
    response = agent.process_query(req.message)
    return response

@router.get("/health")
async def agent_health_check():
    return {
        "status": "healthy",
        "service": "Hospital AI Microservice",
        "supported_roles": ["DoctorAssistant", "PatientTriage", "BillingAuditor"]
    }
