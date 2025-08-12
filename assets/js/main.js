const mapboxgl.accessToken = "pk.eyJ1IjoidHlyeXgiLCJhIjoiY21lOHZ1eThvMGQ0MjJqcjBrbTR4eXd3NiJ9.xm7g9EZyYl9dnJWOSc7NlA";

const map = new mapboxgl.Map({
  container: 'map', // id of the div
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-0.1276, 51.5074], // Example: London coords
  zoom: 5
});

L.tileLayer(
  `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
  {
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    attribution:
      '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
).addTo(map);

const infoPanel = document.getElementById("info");

function updateInfo(location) {
  infoPanel.innerHTML = `
    <h3>${location.title}</h3>
    <p>${location.description}</p>
    ${
      location.image
        ? `<img src="${location.image}" alt="${location.title}" />`
        : ""
    }
    ${
      location.link
        ? `<p><a href="${location.link}" target="_blank">Learn more</a></p>`
        : ""
    }
  `;
}

fetch('data/technologies.json')
  .then(response => response.json())
  .then(locations => {
    locations.forEach(location => {
      const marker = L.marker(location.coords).addTo(map);
      marker.on("click", () => updateInfo(location));
    });
  })
  .catch(error => console.error('Error loading data:', error));
