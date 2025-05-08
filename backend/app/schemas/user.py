from pydantic import BaseModel
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: str


class User(UserBase):
    id: int
    created_at: datetime

    model_config = {
        "arbitrary_types_allowed": True,
        "from_attributes": True
    }
