mapboxgl.accessToken = 'pk.eyJ1IjoidHlyeXgiLCJhIjoiY21lOHZ1eThvMGQ0MjJqcjBrbTR4eXd3NiJ9.xm7g9EZyYl9dnJWOSc7NlA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 30],
  zoom: 2,
});

const infoPanel = document.getElementById('info');

function updateInfo(location) {
  infoPanel.innerHTML = `
    <h3>${location.title}</h3>
    <p>${location.description}</p>
    ${location.image ? `<img src="${location.image}" alt="${location.title}">` : ''}
    ${location.link ? `<p><a href="${location.link}" target="_blank" rel="noopener noreferrer">Learn more</a></p>` : ''}
  `;
}

// Fetch locations and add markers
fetch('data/technologies.json')
  .then(res => res.json())
  .then(locations => {
    locations.forEach(location => {
      const el = document.createElement('div');
      el.className = 'marker';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coords)
        .addTo(map);

      el.addEventListener('click', () => {
        updateInfo(location);
        map.flyTo({ center: location.coords, zoom: 6 });
      });
    });
  })
  .catch(() => {
    infoPanel.innerHTML = '<p>Failed to load location data.</p>';
  });
