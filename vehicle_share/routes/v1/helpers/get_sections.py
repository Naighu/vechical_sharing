import sys,json,os,requests
from dotenv import load_dotenv,find_dotenv


cordinates = json.loads(sys.argv[1])["coordinates"]

load_dotenv(find_dotenv())
access_token = os.environ['MAPBOX_ACCESS_TOKEN']

BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places/{},{}.json?types=place&routing=true&worldview=in&limit=1&access_token="+ access_token
sections = set()
section_cords = {}

for index,cord in enumerate(cordinates):
    url = BASE_URL.format(cord[0],cord[1])
    response = requests.get(url,stream=False)
    
    if response.status_code ==200:
        result = response.json()
        if(len(result["features"]) > 0):
            section = result["features"][0]["text"].lower()
            
            if section in section_cords:
               a = section_cords[section]
               a.append(index)
               section_cords[section] = a
            else:
                section_cords[section] = [index] 

            sections.add(section)

print(json.dumps( { "section_name" : list(sections), "section_cord": section_cords}))
