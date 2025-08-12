const mapboxToken = "pk.eyJ1IjoidHlyeXgiLCJhIjoiY21lOHZ1eThvMGQ0MjJqcjBrbTR4eXd3NiJ9.xm7g9EZyYl9dnJWOSc7NlA";

// Initialize map with Mapbox Satellite Tiles
const map = L.map("map").setView([30, 0], 2);

const satelliteTiles = L.tileLayer(
  `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
  {
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    attribution:
      '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
);

satelliteTiles.addTo(map);

const infoPanel = document.getElementById("info");

// Function to update side panel content
function updateInfo(location) {
  infoPanel.innerHTML = `
    <h3>${location.title}</h3>
    <p>${location.description}</p>
    ${location.image ? `<img src="${location.image}" alt="${location.title}"/>` : ""}
    ${location.link ? `<p><a href="${location.link}" target="_blank">Learn more</a></p>` : ""}
  `;
}

// Add markers to map and bind click event to update side panel
locations.forEach(location => {
  const marker = L.marker(location.coords).addTo(map);
  marker.on("click", () => updateInfo(location));
});

