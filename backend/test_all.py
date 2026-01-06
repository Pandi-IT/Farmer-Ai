import requests
import json

base_url = "http://localhost:5000/api"

def test_endpoint(name, url, method="POST", data=None):
    print(f"\n--- Testing {name} ---")
    try:
        response = requests.post(url, json=data) if method == "POST" else requests.get(url)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("SUCCESS")
            try:
                print(json.dumps(response.json(), indent=2)[:500] + "...")
            except:
                pass
        else:
            print("FAILED")
            print(response.text[:200])
    except Exception as e:
        print(f"Error: {e}")

# Test Data
ask_twin_data = {"doubt": "Hello", "context": "Greeting", "language": "en"}
emotion_data = {"text": "I am happy", "language": "en"}
what_if_data = {"decision": "Sell", "context": "Price $100", "language": "en", "stress_level": "Low"}

test_endpoint("Ask Twin", f"{base_url}/ask-twin", "POST", ask_twin_data)
test_endpoint("Analyze Emotion", f"{base_url}/analyze-emotion", "POST", emotion_data)
test_endpoint("What-If View", f"{base_url}/what-if-view", "POST", what_if_data)
