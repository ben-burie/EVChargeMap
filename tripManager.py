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
        1, # Mock user ID
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