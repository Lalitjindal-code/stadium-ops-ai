import os
import sys

# Add the backend directory to sys.path so 'app' can be imported natively by pytest
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
