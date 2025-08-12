// main.js
let map = L.map('map').setView([31.5, 34.5], 8);

// Use OpenStreetMap tiles with attribution
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markersGroup = L.layerGroup().addTo(map);
let technologies = [];
let fuse; // search

// load data
fetch('data/technologies.json')
  .then(r => r.json())
  .then(data => {
    technologies = data;
    initFilters(data);
    initSearch(data);
    renderList(data);
    addMarkers(data);
  });

// add markers
function addMarkers(items) {
  markersGroup.clearLayers();
  items.forEach(item => {
    if (!item.lat || !item.lng) return;
    let marker = L.marker([item.lat, item.lng]);
    let popupHtml = `<strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.description || '')}`;
    if (item.image) popupHtml += `<br><img src="${item.image}" alt="" style="max-width:180px;">`;
    if (item.audio) popupHtml += `<br><audio controls src="${item.audio}"></audio>`;
    popupHtml += `<br><a href="${item.sources ? item.sources[0] : '#'}" target="_blank">Source</a>`;
    marker.bindPopup(popupHtml);
    markersGroup.addLayer(marker);
  });
}

// render textual list
function renderList(items) {
  let list = document.getElementById('list');
  list.innerHTML = '';
  items.forEach(item => {
    let div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `<h3>${escapeHtml(item.title)}</h3>
      <div>${escapeHtml(item.category || '')} | ${escapeHtml(item.conflicts ? item.conflicts.join(', ') : '')}</div>
      <p>${escapeHtml(item.description || '').substring(0,300)}...</p>
      ${item.image ? `<img src="${item.image}" alt="">` : ''}
      ${item.audio ? `<audio controls src="${item.audio}"></audio>` : ''}`;
    list.appendChild(div);
  });
}

// search using Fuse.js
function initSearch(data) {
  const options = { keys: ['title', 'category', 'bio_inspiration', 'description'] , threshold: 0.3};
  fuse = new Fuse(data, options);
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', e => {
    const q = e.target.value.trim();
    const results = q ? fuse.search(q).map(r => r.item) : technologies;
    applyFilterAndRender(results);
  });
}

function initFilters(data) {
  const categories = Array.from(new Set(data.map(d => d.category).filter(Boolean)));
  const filter = document.getElementById('filter');
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
  filter.addEventListener('change', () => {
    applyFilterAndRender();
  });
}

// combine filter and current search results
function applyFilterAndRender(currentSearchResults) {
  const filterVal = document.getElementById('filter').value;
  let items = currentSearchResults || technologies;
  if (filterVal && filterVal !== 'all') {
    items = items.filter(i => i.category === filterVal);
  }
  renderList(items);
  addMarkers(items);
}

// tiny helper to escape HTML
function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
}

