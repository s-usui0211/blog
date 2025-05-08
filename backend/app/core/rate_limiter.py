from fastapi import HTTPException, Request, status
from typing import Dict
from datetime import datetime, timedelta


class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list[datetime]] = {}

    def _clean_old_requests(self, client_ip: str) -> None:
        """1分以上経過したリクエストを削除"""
        if client_ip in self.requests:
            current_time = datetime.now()
            self.requests[client_ip] = [
                req_time for req_time in self.requests[client_ip]
                if current_time - req_time < timedelta(minutes=1)
            ]

    async def check_rate_limit(self, request: Request) -> None:
        """レート制限をチェック"""
        client_ip = request.client.host if request.client else "unknown"

        # 古いリクエストを削除
        self._clean_old_requests(client_ip)

        # 現在のリクエスト数をチェック
        current_time = datetime.now()
        if client_ip not in self.requests:
            self.requests[client_ip] = []

        if len(self.requests[client_ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="リクエスト回数が制限を超えました。しばらく待ってから再試行してください。"
            )

        # 新しいリクエストを追加
        self.requests[client_ip].append(current_time)


# グローバルなレート制限インスタンス
auth_limiter = RateLimiter(requests_per_minute=30)  # 認証エンドポイント用
api_limiter = RateLimiter(requests_per_minute=60)   # 一般的なAPI用
