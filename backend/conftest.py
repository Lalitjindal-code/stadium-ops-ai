import os
import sys

# Ensure GEMINI_API_KEY is present for pytest test suites regardless of CWD
if not os.environ.get("GEMINI_API_KEY"):
    os.environ["GEMINI_API_KEY"] = "test_gemini_api_key_mock_for_pytest"

# Add the backend directory to sys.path so 'app' can be imported natively by pytest
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
