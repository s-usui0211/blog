# エンジニアブログプラットフォーム 設計書

## 1. システム概要
エンジニア向けの技術ブログプラットフォーム。Qiitaライクな記事投稿・閲覧機能を提供する。

## 2. 技術スタック
### フロントエンド
- React 18.2.0
- Material-UI (MUI) 5.14.15
- React Router DOM 6.17.0
- Axios 1.6.0

### バックエンド
- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- PyMySQL 1.1.0
- python-jose (JWT認証)
- passlib (パスワードハッシュ化)
- bcrypt (パスワードハッシュ化アルゴリズム)

### データベース
- MySQL

## 3. システム構成図
```mermaid
graph TD
    Client[ブラウザ] -->|HTTP| Frontend[Reactフロントエンド]
    Frontend -->|HTTP + JWT| Backend[FastAPI バックエンド]
    Backend -->|SQL| DB[(MySQL)]
    Backend -->|Verify| Auth[認証サービス]
```

## 4. データベース設計
### ER図
```mermaid
erDiagram
    users ||--o{ articles : "作成する"
    users {
        int id PK
        string username UK
        string email UK
        string hashed_password
        datetime created_at
    }
    articles {
        int id PK
        string title
        text content
        datetime created_at
        datetime updated_at
        int author_id FK
    }
```

## 5. APIエンドポイント設計
### 認証関連 API
| メソッド | エンドポイント | 説明 | リクエスト | レスポンス |
|---------|--------------|------|------------|------------|
| POST | /api/auth/register | ユーザー登録 | UserCreate | User |
| POST | /api/auth/login | ログイン | UserLogin | Token |
| GET | /api/auth/me | 現在のユーザー情報取得 | - | User |

### 記事関連 API
| メソッド | エンドポイント | 説明 | リクエスト | レスポンス |
|---------|--------------|------|------------|------------|
| GET | /api/articles/ | 記事一覧取得 | - | Article[] |
| GET | /api/articles/{id} | 記事詳細取得 | - | Article |
| POST | /api/articles/ | 記事作成 | ArticleCreate | Article |

## 6. コンポーネント設計
### フロントエンド
```mermaid
classDiagram
    class App {
        +render()
    }
    class Navbar {
        -isAuthenticated: boolean
        +handleLogout()
        +render()
    }
    class AuthContext {
        -token: string
        -user: User
        +login()
        +logout()
        +register()
    }
    class LoginForm {
        -email: string
        -password: string
        +handleSubmit()
        +render()
    }
    class RegisterForm {
        -username: string
        -email: string
        -password: string
        +handleSubmit()
        +render()
    }
    class ArticleList {
        -articles: Article[]
        +fetchArticles()
        +render()
    }
    class ArticleDetail {
        -article: Article
        +fetchArticle()
        +render()
    }
    class CreateArticle {
        -title: string
        -content: string
        +handleSubmit()
        +render()
    }
    App --> Navbar
    App --> AuthContext
    App --> ArticleList
    App --> ArticleDetail
    App --> CreateArticle
    App --> LoginForm
    App --> RegisterForm
```

### バックエンド
```mermaid
classDiagram
    class User {
        +id: int
        +username: string
        +email: string
        +hashed_password: string
        +created_at: datetime
        +articles: Article[]
        +verify_password()
    }
    class Article {
        +id: int
        +title: string
        +content: text
        +created_at: datetime
        +updated_at: datetime
        +author_id: int
        +author: User
    }
    class AuthHandler {
        -secret_key: string
        +encode_token()
        +decode_token()
        +get_password_hash()
        +verify_password()
    }
    class AuthRouter {
        +register_user()
        +login()
        +get_current_user()
    }
    class ArticleRouter {
        +get_articles()
        +get_article()
        +create_article()
    }
    User "1" -- "*" Article : has
    AuthHandler -- AuthRouter : uses
    AuthRouter -- User : manages
```

## 7. セキュリティ設計
### 認証・認可
- JWTを使用したトークンベースの認証
- パスワードはbcryptでハッシュ化して保存
- 保護されたエンドポイントへのアクセスにはBearer認証が必要
- トークンの有効期限は24時間

### CORS・その他
- CORSの設定により、特定のオリジン（localhost:3000）からのリクエストのみを許可
- SQLAlchemyによるSQLインジェクション対策
- パスワードのハッシュ化にbcryptを使用
- 環境変数による機密情報の管理

## 8. 認証フロー
```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Frontend as フロントエンド
    participant Backend as バックエンド
    participant DB as データベース
    
    % ログインフロー
    Client->>Frontend: ログイン情報入力
    Frontend->>Backend: POST /api/auth/login
    Backend->>DB: ユーザー検索
    DB-->>Backend: ユーザー情報
    Backend->>Backend: パスワード検証
    Backend-->>Frontend: JWTトークン
    Frontend->>Frontend: トークンを保存
    
    % 認証が必要なリクエスト
    Frontend->>Backend: リクエスト + Bearer トークン
    Backend->>Backend: トークン検証
    Backend-->>Frontend: レスポンス
```

## 9. 今後の拡張計画
1. ~~ユーザー認証システムの実装~~
2. 記事の編集・削除機能
3. マークダウン形式での記事作成
4. タグ機能
5. コメント機能
