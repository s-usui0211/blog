from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models import models
from database import get_db
from pydantic import BaseModel
from datetime import datetime
from .auth import get_current_user
from schemas.user import User

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
    author: User

    model_config = {
        "arbitrary_types_allowed": True,
        "from_attributes": True
    }


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
def create_article(article: ArticleCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_article = models.Article(
        title=article.title,
        content=article.content,
        author=current_user
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article
