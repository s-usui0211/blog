from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import articles, auth
from models import models
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS設定
origins = [
    "http://localhost:3000",  # 開発環境用
    # 本番環境用のドメインを追加
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # 必要なメソッドのみを許可
    allow_headers=["Content-Type", "Authorization"],  # 必要なヘッダーのみを許可
    expose_headers=["Content-Type"],  # クライアントに公開するヘッダー
    max_age=3600,  # プリフライトリクエストのキャッシュ時間（1時間）
)

app.include_router(auth.router, prefix="/api/auth")
app.include_router(articles.router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Welcome to Blog API"}
