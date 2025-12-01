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

def authenticate_user(username, password):
    # Fill in function to authenticate user against database - use stored procedure
    # Return true/false depending on if authentication is successful, also return user_ID for later use, example: (return true, user_ID)
    # If it is, set a user variable to be used for loading proper things later (trips, cars, etc.)




    return

def register_user(username, password):
    # Fill in function to register user in database - use stored procedure




    return