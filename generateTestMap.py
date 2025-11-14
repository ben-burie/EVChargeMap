import folium

# Create a Folium map
m = folium.Map(
    location=[45.5236, -122.6750],  # Center coordinates (lat, lng)
    zoom_start=13
)

# Save the map as an HTML file
m.save('testMap.html')