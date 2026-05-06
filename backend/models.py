# 2 models for the database: User and Reading log 
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    hashed_password: str
    name: str

class ReadingLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    passage: str
    date_read: date = Field(sa_column_kwargs={"name": "date"})
    notes: Optional[str] = None

class UserPreferences(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    goal: str
    experience: str
    days_per_week: int
    bible_version: str
    minutes_per_day: int
    time_of_day: str