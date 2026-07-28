import os
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Path to the saarthi-auth .env file to ensure we use the exact same database
auth_env_path = Path(__file__).parent.parent.parent / "saarthi-auth" / ".env"
load_dotenv(dotenv_path=auth_env_path)

# Local .env fallback for backend specific variables (like GEMINI_API_KEY)
load_dotenv()

# We connect to the exact same database as saarthi-auth
MONGODB_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)

# Mongoose by default connects to the 'test' database when no name is provided in the atlas URI
# So we explicitly use 'test' to share the same DB space as the auth service
db = client.test

# We use the appointments and users collections
appointments_collection = db.get_collection("appointments")
users_collection = db.get_collection("users")
