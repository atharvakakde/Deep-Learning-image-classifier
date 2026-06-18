import requests

# Test prediction endpoint
url = "http://127.0.0.1:8000/predict"
img_path = r"C:\Users\athar\.gemini\antigravity\brain\59c53cd9-1337-436c-9800-dfc99b149fde\cute_pet_hero_1775480545459.png"

with open(img_path, "rb") as f:
    files = {"file": ("test.png", f, "image/png")}
    response = requests.post(url, files=files)

print(response.status_code)
print(response.json())
