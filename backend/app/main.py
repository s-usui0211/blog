from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import articles
from models import models
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(articles.router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Welcome to Blog API"}
