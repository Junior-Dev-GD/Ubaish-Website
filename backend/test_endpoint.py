"""
Quick test script to verify backend is running
Run: python test_endpoint.py
"""
import requests
import sys

try:
    # Test the root endpoint
    response = requests.get("http://localhost:8000/")
    print(f"✓ Root endpoint: {response.status_code}")
    print(f"  Response: {response.json()}")
    
    # Test the register endpoint (should return method not allowed for GET)
    response = requests.get("http://localhost:8000/api/auth/register/")
    print(f"✓ Register endpoint exists: {response.status_code}")
    if response.status_code == 405:
        print("  ✓ Endpoint exists (405 = Method Not Allowed, which is expected for GET)")
    else:
        print(f"  Response: {response.text[:200]}")
        
except requests.exceptions.ConnectionError:
    print("✗ Backend server is not running!")
    print("  Start it with: cd backend && python manage.py runserver")
    sys.exit(1)
except Exception as e:
    print(f"✗ Error: {e}")
    sys.exit(1)

print("\n✓ Backend is running correctly!")

