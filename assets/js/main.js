mapboxgl.accessToken = "pk.eyJ1IjoidHlyeXgiLCJhIjoiY21lOTFxeWl2MG1kODJtcjN2NTdoa3NrZCJ9.uM0thTuU2XaQ7jK-71U3vA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/tyryx/cme91nqal00cc01qwavt6cgwu",
  center: [0, 30],  // adjust initial center as you want
  zoom: 2,
});

const infoPanel = document.getElementById("info");

function updateInfo(location) {
  infoPanel.innerHTML = `
    <h3>${location.title}</h3>
    <p>${location.description}</p>
    ${
      location.image
        ? `<img src="${location.image}" alt="${location.title}" style="max-width:100%;" />`
        : ""
    }
    ${
      location.link
        ? `<p><a href="${location.link}" target="_blank" rel="noopener noreferrer">Learn more</a></p>`
        : ""
    }
  `;
}

// Load JSON data and add markers
fetch("data/technologies.json")
  .then((response) => response.json())
  .then((locations) => {
    locations.forEach((location) => {
      // Create a simple blue circle div element for the marker
      const el = document.createElement("div");
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.backgroundColor = "red";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      // Create the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coords) // [lng, lat]
        .addTo(map);

      // On marker click, update the info panel
      el.addEventListener("click", () => {
        updateInfo(location);
      });
    });
  })
  .catch((error) => {
    console.error("Error loading data:", error);
    infoPanel.innerHTML = "<p>Failed to load location data.</p>";
  });
