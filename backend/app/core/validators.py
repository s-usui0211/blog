import re
from fastapi import HTTPException, status


def validate_password(password: str) -> None:
    """
    パスワードの強度を検証します
    - 最小8文字
    - 少なくとも1つの大文字
    - 少なくとも1つの小文字
    - 少なくとも1つの数字
    - 少なくとも1つの特殊文字
    """
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="パスワードは8文字以上である必要があります"
        )

    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="パスワードには少なくとも1つの大文字が必要です"
        )

    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="パスワードには少なくとも1つの小文字が必要です"
        )

    if not re.search(r"\d", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="パスワードには少なくとも1つの数字が必要です"
        )

    if not re.search(r"[!@#$%^&*(),.?\":{|}|<>]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="パスワードには少なくとも1つの特殊文字が必要です"
        )


def validate_username(username: str) -> None:
    """
    ユーザー名を検証します
    - 3-20文字
    - 英数字とアンダースコアのみ
    """
    if not 3 <= len(username) <= 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ユーザー名は3-20文字である必要があります"
        )

    if not re.match(r"^[a-zA-Z0-9_]+$", username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ユーザー名には英数字とアンダースコアのみ使用できます"
        )
