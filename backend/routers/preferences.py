from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, SQLModel
from typing import Optional
from database import get_session
from models import User, UserPreferences
from routers.auth import get_current_user

router = APIRouter(prefix="/preferences", tags=["preferences"])

class PreferencesRequest(SQLModel):
    goal: str
    experience: str
    days_per_week: int
    bible_version: str
    minutes_per_day: int
    time_of_day: str

@router.post("/")
def save_preferences(data: PreferencesRequest, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    prefs = UserPreferences(user_id = current_user.id, **data.dict())
    session.add(prefs)
    session.commit()
    session.refresh(prefs)
    return prefs

@router.get("/")
def get_preferences(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    prefs = session.exec(select(UserPreferences).where(UserPreferences.user_id == current_user.id)).first()
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return prefs
