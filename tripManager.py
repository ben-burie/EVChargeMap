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

def saveTrip(trip_data): # Change this function to write trip data to SQL database

    print("Trip car: ", trip_data.get('car'))
    #print("Start location: ", trip_data.get())
    print("Start: ", trip_data.get('start_location').get('location'))
    print("End: ", trip_data.get('end_location').get('location'))

    print("Trip data saved (mock):", trip_data)