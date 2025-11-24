import mysql.connector
import pandas as pd
import os

# Read CSV file
df = pd.read_csv(r'C:\Users\benbu\OneDrive\Desktop\Semester 5 UWW Docs\COMPSCI 366\Project\charging_station_data_prepared.csv')

# Connect to MySQL
connection = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)

cursor = connection.cursor()

# Insert data in batches
batch_size = 1000
for i in range(0, len(df), batch_size):
    batch = df.iloc[i:i+batch_size]
    
    for index, row in batch.iterrows():
        sql = "INSERT INTO stations (station_ID, name, city, country_code, state, latitude, longitude, number_of_ports, power_kw, power_class, is_fast_dc) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        val = (row['station_ID'], row['name'], row['city'], row['country_code'], row['state'], row['latitude'], row['longitude'], row['number_of_ports'], row['power_kw'], row['power_class'], row['is_fast_dc'])
        cursor.execute(sql, val)
    
    connection.commit()
    print(f"Inserted {i + len(batch)} records...")

cursor.close()
connection.close()
print("All data inserted successfully!")