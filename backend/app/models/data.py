from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class CrowdDataRow(BaseModel):
    gateId: str = Field(..., description="ID of the gate")
    count: int = Field(..., ge=0, description="Crowd count at the gate")
    timestamp: datetime = Field(..., description="Time of the reading")


class CrowdDataPayload(BaseModel):
    rows: List[CrowdDataRow] = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Between 1 and 500 crowd data rows",
    )


class UploadMetadata(BaseModel):
    uploadId: str
    uploadedBy: Optional[str] = (
        None  # Fixed: was str — crashes when Firebase uid is None
    )
    rowCount: int
    status: str
    createdAt: datetime
