import sys,json,os,requests
from dotenv import load_dotenv,find_dotenv


cordinates = json.loads(sys.argv[1])["coordinates"]

load_dotenv(find_dotenv())
access_token = os.environ['MAPBOX_ACCESS_TOKEN']

BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places/{},{}.json?types=place&routing=true&worldview=in&limit=1&access_token="+ access_token
sections = set()
for cord in cordinates:
    url = BASE_URL.format(cord[0],cord[1])
    response = requests.get(url,stream=False)
    if response.status_code ==200:
        result = response.json()
        if(len(result["features"]) > 0):
            sections.add(result["features"][0]["text"].lower())

print(json.dumps({"sections":list(sections)}))
