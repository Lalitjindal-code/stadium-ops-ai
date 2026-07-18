import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Set

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect

logger = logging.getLogger("realtime_router")
router = APIRouter(prefix="/ws", tags=["realtime"])


class ConnectionManager:
    """Manages active WebSocket connections with broadcast support."""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WS client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.discard(websocket)
        logger.info(f"WS client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict) -> None:
        """Broadcast JSON message to all connected clients."""
        if not self.active_connections:
            return
        payload = json.dumps(message, default=str)
        dead: Set[WebSocket] = set()
        for connection in list(self.active_connections):
            try:
                await connection.send_text(payload)
            except Exception:
                dead.add(connection)
        for conn in dead:
            self.active_connections.discard(conn)

    async def send_to(self, websocket: WebSocket, message: dict) -> None:
        """Send message to a single client."""
        await websocket.send_text(json.dumps(message, default=str))

    @property
    def connection_count(self) -> int:
        return len(self.active_connections)


# Global singleton manager
manager = ConnectionManager()


@router.websocket("/crowd-updates")
async def crowd_updates_websocket(
    websocket: WebSocket,
    token: str = Query(default=None, description="Firebase ID token for authentication"),
):
    """
    Real-time WebSocket endpoint for live crowd data updates.
    Clients connect here to receive pushed crowd status events without polling.

    Authentication: Pass Firebase ID token as `?token=<firebase_id_token>` query param.
    Message types pushed by server:
      - `connection_ack`: Sent on successful connection
      - `crowd_update`: Pushed when new crowd data is analyzed
      - `incident_alert`: Pushed when a new critical incident is reported
      - `ping`: Keepalive every 30s
    """
    # ── Optional: Verify token ───────────────────────────────────────────────
    # In hackathon mode, we allow unauthenticated WS for demo purposes.
    # Uncomment below to enforce auth:
    # if token:
    #     try:
    #         from firebase_admin import auth
    #         decoded = auth.verify_id_token(token)
    #         user_uid = decoded.get("uid")
    #     except Exception:
    #         await websocket.close(code=4001, reason="Invalid token")
    #         return

    await manager.connect(websocket)
    try:
        # Send initial connection acknowledgement
        await manager.send_to(websocket, {
            "type": "connection_ack",
            "message": "Connected to Stadium Operations real-time feed.",
            "connections": manager.connection_count,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })

        # Keepalive loop — send ping every 30 seconds
        # Also listens for incoming client messages (e.g., subscribe requests)
        while True:
            try:
                # Wait for a client message with 30s timeout
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                client_msg = json.loads(data)

                # Echo back for now; extend with subscribe/unsubscribe logic
                await manager.send_to(websocket, {
                    "type": "echo",
                    "received": client_msg,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                })

            except asyncio.TimeoutError:
                # Send keepalive ping
                await manager.send_to(websocket, {
                    "type": "ping",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "connections": manager.connection_count,
                })

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)


async def broadcast_crowd_update(analysis_result: dict) -> None:
    """
    Called from analysis router after a new analysis is complete.
    Pushes the result to all connected WebSocket clients.
    """
    await manager.broadcast({
        "type": "crowd_update",
        "data": analysis_result,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })


async def broadcast_incident_alert(incident: dict) -> None:
    """
    Called from incidents router when a new critical incident is reported.
    Pushes alert to all connected dashboard clients.
    """
    await manager.broadcast({
        "type": "incident_alert",
        "data": incident,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
