from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth, firestore

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify the Firebase ID token and return the decoded token.
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e


def get_current_user_with_role(role: str):
    """
    Dependency generator to check if the authenticated user has the required role.
    We fetch the role from the Firestore `users` collection.
    """

    def role_checker(decoded_token: dict = Depends(get_current_user)):
        uid = decoded_token.get("uid")

        try:
            db = firestore.client()
            user_ref = db.collection("users").document(uid)
            user_doc = user_ref.get()

            if not user_doc.exists:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User profile not found",
                )

            user_data = user_doc.to_dict()
            if user_data.get("role") != role:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Forbidden: insufficient permissions",
                )

            return user_data
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error verifying user role: {str(e)}",
            ) from e

    return role_checker


# Convenience dependencies for routes
require_organizer = Depends(get_current_user_with_role("organizer"))
require_volunteer = Depends(get_current_user_with_role("volunteer"))
