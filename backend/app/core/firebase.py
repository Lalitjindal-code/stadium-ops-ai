import json
import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials

load_dotenv()

# The service account file is ignored in git for security.
# It should be placed in the backend folder.
# Example: stadium-ops-ai-firebase-adminsdk-fbsvc-eb99111eeb.json
SERVICE_ACCOUNT_KEY_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
SERVICE_ACCOUNT_KEY_JSON = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

def init_firebase():
    if not firebase_admin._apps:
        if SERVICE_ACCOUNT_KEY_JSON:
            try:
                cred_dict = json.loads(SERVICE_ACCOUNT_KEY_JSON)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                return
            except Exception as e:
                print(f"Warning: Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: {e}")

        if SERVICE_ACCOUNT_KEY_PATH and os.path.exists(SERVICE_ACCOUNT_KEY_PATH):
            cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
            firebase_admin.initialize_app(cred)
        else:
            # Fallback to default credentials or mock for tests
            print(
                f"Warning: Firebase Service account key not found at {SERVICE_ACCOUNT_KEY_PATH} or FIREBASE_SERVICE_ACCOUNT_JSON"
            )
            try:
                firebase_admin.initialize_app()
            except ValueError:
                pass

