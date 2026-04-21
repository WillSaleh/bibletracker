# Sets up connection between python and database

from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./reading_log.db"
engine = create_engine(DATABASE_URL, echo=True)

def create_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
