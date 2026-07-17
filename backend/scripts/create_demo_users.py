import os
import sys

# Add the parent directory to sys.path so we can import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from firebase_admin import auth, firestore

from app.core.firebase import init_firebase


def create_user(email: str, password: str, role: str, name: str):
    print(f"Creating user {email} with role {role}...")
    try:
        user = auth.get_user_by_email(email)
        print(f"User {email} already exists in Firebase Auth. Updating password.")
        auth.update_user(user.uid, password=password)
        uid = user.uid
    except auth.UserNotFoundError:
        user = auth.create_user(email=email, password=password, display_name=name)
        uid = user.uid
        print(f"Created new user in Firebase Auth with UID: {uid}")

    db = firestore.client()
    user_ref = db.collection("users").document(uid)
    user_ref.set(
        {
            "uid": uid,
            "email": email,
            "name": name,
            "role": role,
            "createdAt": firestore.SERVER_TIMESTAMP,
        },
        merge=True,
    )
    print(f"Set role '{role}' in Firestore for UID: {uid}\n")


if __name__ == "__main__":
    init_firebase()
    print("Firebase initialized. Creating demo users...\n")

    # Create an organizer
    create_user(
        email="organizer@demo.com",
        password="password123",
        role="organizer",
        name="Demo Organizer",
    )

    # Create a volunteer
    create_user(
        email="volunteer@demo.com",
        password="password123",
        role="volunteer",
        name="Demo Volunteer",
    )

    print("Done. You can now log in using these credentials.")
