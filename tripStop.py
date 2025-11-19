import math
import csv
import os

STATIONS = []

def load_cars(): # Change this function with SQL
    cars = ["Tesla Model 3", "Nissan Leaf", "Chevrolet Bolt EV", "Ford Mustang Mach-E", "Test"]
    return cars

def load_stations(filename='us_stations_test.csv'): # Change this function with SQL
    """Load all stations from CSV file once at startup"""
    global STATIONS
    if os.path.exists(filename):
        try:
            with open(filename, mode='r') as file:
                csv_reader = csv.reader(file)
                for row in csv_reader:
                    try:
                        station_lat = float(row[5])
                        station_lng = float(row[6])
                        station_name = row[1] if len(row) > 1 else 'Unknown'
                        station_city = row[2] if len(row) > 2 else 'Unknown'
                        station_state = row[4] if len(row) > 4 else 'Unknown'
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
            print(f"Loaded {len(STATIONS)} stations")
        except Exception as e:
            print(f"Error loading stations: {e}")

def distance_point_to_line(point_lat, point_lng, line_start_lat, line_start_lng, line_end_lat, line_end_lng):
    km_per_degree = 111.0
    
    # Convert to cartesian coordinates
    px = (point_lng - line_start_lng) * km_per_degree * math.cos(math.radians((line_start_lat + point_lat) / 2))
    py = (point_lat - line_start_lat) * km_per_degree
    
    x1 = 0
    y1 = 0
    x2 = (line_end_lng - line_start_lng) * km_per_degree * math.cos(math.radians((line_start_lat + line_end_lat) / 2))
    y2 = (line_end_lat - line_start_lat) * km_per_degree
    
    # Calculate distance from point to line segment
    if x2 == 0 and y2 == 0:
        return math.sqrt(px**2 + py**2)
    
    # Parameter t represents position along line (0 = start, 1 = end)
    t = max(0, min(1, (px * x2 + py * y2) / (x2**2 + y2**2)))
    
    # Closest point on line segment
    closest_x = t * x2
    closest_y = t * y2
    
    # Distance from point to closest point on line
    distance = math.sqrt((px - closest_x)**2 + (py - closest_y)**2)
    
    return distance

def calculate_intermediate_points(start_lat, start_lng, end_lat, end_lng):
    points = []
    
    # Add start point
    points.append({
        'lat': start_lat,
        'lng': start_lng,
        'type': 'start',
        'name': 'Start'
    })

    for station in STATIONS:
        distance = distance_point_to_line(
            station['lat'], station['lng'],
            start_lat, start_lng, end_lat, end_lng
        )
        if distance < 100:  # 100 km search radius (can change this if needed)
            points.append({
                'lat': station['lat'],
                'lng': station['lng'],
                'type': 'station',
                'name': station['name'],
                'city': station['city'],
                'state': station['state'],
                'id': station['id'],
                'distance': round(distance, 2)
            })

    
    # Add end point
    points.append({
        'lat': end_lat,
        'lng': end_lng,
        'type': 'end',
        'name': 'End'
    })

    return points