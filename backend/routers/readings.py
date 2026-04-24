from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import User, ReadingLog
from routers.auth import get_current_user
from pydantic import BaseModel
from datetime import date

# Router and request schema
router = APIRouter()

class ReadingRequest(BaseModel):
    passage: str
    date_read: date

# Log a reading
@router.post("/")
def log_reading(request: ReadingRequest, current_user: User = Depends(get_current_user), session: Session = depends(get_session)):
    reading = ReadingLog(user_id=current_user.id, passage=request.passage, date_read=request.date_read)
    session.add(reading)
    session.commit()
    session.refresh(reading)
    return reading

# Get all readings
@router.get("/")
def get_readings(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    readings = session.exec(select(ReadingLog).where(ReadingLog.user_id == current_user.id)).all()
    return readings

# Delete a reading
@router.delete("/{reading_id}")
def delete_reading(reading_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    reading = session.get(ReadingLog, reading_id)
    if not reading:
        raise HTTPException(status_code=404, detail="Reading not found")
    if reading.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your reading")
    session.delete(reading)
    session.commit()
    return {"message": "Reading deleted"}

