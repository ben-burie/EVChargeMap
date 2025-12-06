import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

connection = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)

cursor = connection.cursor()

def saveTrip(trip_data):
    car_id = getCarID(trip_data.get('car'))

    result = cursor.callproc('CreateTrip', [
        trip_data.get('userId'), # user ID
        car_id,
        trip_data.get('name'), # Mock trip name
        trip_data.get('start_location').get('location'), #start location
        trip_data.get('end_location').get('location'), #end location
        0 #out parameter placeholder
    ])

    trip_ID = result[-1]
    saveTripStop(trip_ID, trip_data.get('stops'))

    connection.commit()

def saveTripStop(trip_id, stop_data):
    for stop in stop_data:
        cursor.callproc('AddTripStop', [
            trip_id,
            stop.get('order'), #stop_seq
            stop.get('id') #station id
        ])

        connection.commit()

def getCarID(car_name):
    cursor.callproc('LoadAllCars')
    for result in cursor.stored_results():
        rows = result.fetchall()
        for row in rows:
            if car_name == row[0] + " " + row[1]:
                car_brand = row[0]
                car_model = row[1]
                cursor.callproc('GetCarID', [car_brand, car_model])
                car_id = None
                for result in cursor.stored_results():
                    rows = result.fetchall()
                    if rows:
                        car_id = rows[0][0]
    return car_id

def load_user_trips(userID):
    trips = []

    cursor.callproc('GetUserTrips', [userID])
    for result in cursor.stored_results():
        rows = result.fetchall()
        for row in rows:
            trips.append({
                'id': row[0],
                'name': row[3],
                'startLocation': row[4],
                'endLocation': row[5]
            })

    return trips

def load_trip_stops(tripID):
    stops = []
    car_name = None

    cursor.callproc('GetTripStops', [tripID])
    for result in cursor.stored_results():
        rows = result.fetchall()
        for idx, row in enumerate(rows):
            if idx == 0:
                car_name = row[5] + ' ' + row[6]
            
            stops.append({
                'stopNumber': row[1],
                'stationName': row[2],
                'city': row[3],
                'state': row[4]
            })

    return {
        'carName': car_name or 'Unknown',
        'stops': stops
    }