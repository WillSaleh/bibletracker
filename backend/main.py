# Entry point for the backend application. The file that starts the server and wires everything together.

from fastapi import FastAPI
from database import create_db
from routers import auth, readings

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(readings.router, prefix="/readings", tags=["readings"])

@app.get("/")
def read_root():
    return {"message": "Bible Tracker API is running!"}
