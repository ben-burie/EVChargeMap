from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import csv
import os

app = Flask(__name__)
CORS(app)

STATIONS = []

def load_stations(filename='us_stations_test.csv'):
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
                        station_name = row[0] if len(row) > 0 else 'Unknown'
                        STATIONS.append({
                            'lat': station_lat,
                            'lng': station_lng,
                            'name': station_name
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

@app.route('/api/calculate-stations', methods=['POST'])
def calculate_stops():
    """
    Receive start and end coordinates, calculate intermediate stops,
    and return all points.
    """
    try:
        data = request.json
        
        start_lat = float(data.get('start_lat'))
        start_lng = float(data.get('start_lng'))
        end_lat = float(data.get('end_lat'))
        end_lng = float(data.get('end_lng'))
        
        # Calculate intermediate points
        stops = calculate_intermediate_points(
            start_lat, start_lng, end_lat, end_lng
        )
        
        return jsonify({
            'success': True,
            'stops': stops,
            'total_stops': len(stops)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    load_stations('us_stations_test.csv')
    app.run(debug=True, port=5000)