// Your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoidHlyeXgiLCJhIjoiY21lOHZ1eThvMGQ0MjJqcjBrbTR4eXd3NiJ9.xm7g9EZyYl9dnJWOSc7NlA';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [0, 30], // starting position [lng, lat]
  zoom: 2 // starting zoom
});

// Reference to the info panel div
const infoPanel = document.getElementById('info');

// Function to update the info panel content
function updateInfo(location) {
  infoPanel.innerHTML = `
    <h3>${location.title}</h3>
    <p>${location.description}</p>
    ${location.image ? `<img src="${location.image}" alt="${location.title}" style="max-width:100%;">` : ''}
    ${location.link ? `<p><a href="${location.link}" target="_blank" rel="noopener noreferrer">Learn more</a></p>` : ''}
  `;
}

// Load your JSON data and add markers
fetch('data/technologies.json')
  .then(response => response.json())
  .then(locations => {
    locations.forEach(location => {
      // Create a DOM element for each marker
      const el = document.createElement('div');
      el.className = 'marker';

      // Create the marker at the given coordinates
      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coords) // coords should be [lng, lat]
        .addTo(map);

      // Add click event to update info panel
      marker.getElement().addEventListener('click', () => {
        updateInfo(location);
        // Optionally, fly to the marker
        map.flyTo({ center: location.coords, zoom: 6 });
      });
    });
  })
  .catch(error => {
    console.error('Error loading data:', error);
    infoPanel.innerHTML = '<p>Error loading location data.</p>';
  });
