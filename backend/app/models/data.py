from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class CrowdDataRow(BaseModel):
    gateId: str = Field(..., description="ID of the gate")
    count: int = Field(..., ge=0, description="Crowd count at the gate")
    timestamp: datetime = Field(..., description="Time of the reading")


class CrowdDataPayload(BaseModel):
    rows: List[CrowdDataRow]


class UploadMetadata(BaseModel):
    uploadId: str
    uploadedBy: str
    rowCount: int
    status: str
    createdAt: datetime
