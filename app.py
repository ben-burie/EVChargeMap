from flask import Flask, request, jsonify
from flask_cors import CORS

# Import helper scripts
import tripStop

app = Flask(__name__)
CORS(app)

@app.route('/api/calculate-stations', methods=['POST'])
def calculate_stops():
    """
    Receive start and end coordinates, calculate intermediate stations,
    and return all points.
    """
    try:
        data = request.json
        
        start_lat = float(data.get('start_lat'))
        start_lng = float(data.get('start_lng'))
        end_lat = float(data.get('end_lat'))
        end_lng = float(data.get('end_lng'))
        
        # Calculate intermediate points
        stops = tripStop.calculate_intermediate_points(
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
    tripStop.load_stations('us_stations_test.csv')
    app.run(debug=True, port=5000)