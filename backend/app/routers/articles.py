from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models import models
from database import get_db
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class ArticleBase(BaseModel):
    title: str
    content: str


class ArticleCreate(ArticleBase):
    pass


class Article(ArticleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    author_id: int

    class Config:
        orm_mode = True


@router.get("/articles/", response_model=List[Article])
def get_articles(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    articles = db.query(models.Article).offset(skip).limit(limit).all()
    return articles


@router.get("/articles/{article_id}", response_model=Article)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("/articles/", response_model=Article)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    db_article = models.Article(**article.dict(), author_id=1)  # 仮のauthor_id
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article
