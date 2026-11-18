# Hospital Management & AI Healthcare SaaS System

Enterprise Multi-Tenant Healthcare Management Platform designed with modern architecture:
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, shadcn/ui.
- **AI Microservice**: Python FastAPI, Google Gemini LLM (`google-genai`), Multi-Tenant Context Engine.
- **Core Hospital Backend**: ASP.NET Core (.NET 8) Web API with Multi-Tenant isolation middleware.

---

## 🏛️ System Architecture

```
                               ┌────────────────────────────────────────────────┐
                               │       Frontend (React + Vite + Tailwind)       │
                               │  Hospital AI Copilot / Patients / Vitals UI   │
                               └───────────────────────┬────────────────────────┘
                                                       │
                           ┌───────────────────────────┴───────────────────────────┐
                           │                                                       │
                           ▼                                                       ▼
       ┌───────────────────────────────────────┐               ┌───────────────────────────────────────┐
       │     .NET 8 Core Web API (C#)          │               │      Python FastAPI AI Service        │
       │         `/backend-dotnet`             │               │            `/ai-service`              │
       │  (Port 5000 / Multi-Tenant Core)      │               │  (Port 8000 / Gemini + DoctorCopilot) │
       └───────────────────┬───────────────────┘               └───────────────────┬───────────────────┘
                           │                                                       │
                           │ ────── Multi-Tenant Data Layer (X-Hospital-Id) ────── │
                           │                                                       │
                           ▼                                                       ▼
       ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
       │                                  Hospital Multi-Tenant Store                                  │
       │                   Isolated by Tenant ID (hosp-main-tenant-001, etc.)                          │
       └───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### 1. Frontend Setup (Port 5173)
```powershell
cmd /c npm install
cmd /c npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. .NET 8 Core Web API (Port 5000)
```powershell
cd backend-dotnet
dotnet run --urls=http://localhost:5000
```
- Base API: `http://localhost:5000/api/v1/patients`
- Multi-Tenant Header: `X-Hospital-Id: hosp-main-tenant-001`

### 3. Python AI Microservice (Port 8000)
```powershell
cd ai-service
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- Interactive Swagger API Documentation: **[http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)**
- Agent Chat Route: `POST http://localhost:8000/api/v1/agent/chat`

---

## 🏢 Multi-Tenant SaaS Features
- **Tenant Switcher**: TopBar dropdown allows switching between hospital branches (e.g. *Metro General Hospital*, *Apollo Specialty*, *Fortis Institute*).
- **Tenant Isolation**: Every database record and AI prompt carries `hospital_id` to strictly isolate hospital data.
- **AI Roles**:
  - `DoctorAssistant`: Clinical reasoning and pharmacology checks.
  - `PatientTriage`: Emergency acuity scoring and department recommendation.
  - `BillingAuditor`: Medical ICD-10 diagnostic review.
