import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

STATIONS = []

connection = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)

cursor = connection.cursor()

cursor.callproc('LoadAllUSStations')

for result in cursor.stored_results():
    print(result)
    rows = result.fetchall()
    for row in rows:
        try:
            station_lat = float(row[4])
            station_lng = float(row[5])
            station_name = row[1] if len(row) > 1 else 'Unknown'
            station_city = row[2] if len(row) > 2 else 'Unknown'
            station_state = row[3] if len(row) > 4 else 'Unknown'
            station_id = row[0] if len(row) > 0 else 'Unknown'
            STATIONS.append({
                'lat': station_lat,
                'lng': station_lng,
                'name': station_name,
                'city': station_city,
                'state': station_state,
                'id': station_id
            })
        except (ValueError, IndexError):
            continue

print(f"Loaded {len(STATIONS)} stations from database")