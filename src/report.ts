import './report.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@mdi/font/css/materialdesignicons.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  const map = L.map('map').setView([51.9481, 10.2651], 6);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let currentMarker: L.Marker | null = null;
  let userLocationDot: L.CircleMarker | null = null;

  const latInput = document.getElementById('lat-input') as HTMLInputElement;
  const lonInput = document.getElementById('lng-input') as HTMLInputElement;

  function updateMarker(lon: number, lat: number, updateInputs = false) {
    if (currentMarker) {
      currentMarker.setLatLng([lat, lon]);
    } else {
      currentMarker = L.marker([lat, lon], { draggable: true }).addTo(map);
      
      currentMarker.on('dragend', function(event) {
        const position = event.target.getLatLng();
        updateInputsFromMarker(position.lng, position.lat);
      });
    }

    if (updateInputs && latInput && lonInput) {
      lonInput.value = lon.toFixed(6);
      latInput.value = lat.toFixed(6);
    }
  }

  function updateInputsFromMarker(lon: number, lat: number) {
    if (latInput && lonInput) {
      lonInput.value = lon.toFixed(6);
      latInput.value = lat.toFixed(6);
    }
  }

  map.on('click', function(e) {
    updateMarker(e.latlng.lng, e.latlng.lat, true);
  });

  function handleInputChange() {
    if (!latInput || !lonInput) return;
    
    const lon = parseFloat(lonInput.value);
    const lat = parseFloat(latInput.value);

    if (!isNaN(lon) && !isNaN(lat)) {
      updateMarker(lon, lat, false);
      map.panTo([lat, lon]);
    }
  }

  if (latInput && lonInput) {
    latInput.addEventListener('input', handleInputChange);
    lonInput.addEventListener('input', handleInputChange);
  }

  map.locate({ watch: true });
  map.on('locationfound', function(e) {
    if (userLocationDot) {
      userLocationDot.setLatLng(e.latlng);
    } else {
      userLocationDot = L.circleMarker(e.latlng, {
        radius: 8,
        fillColor: "#3388ff",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);
      map.setView(e.latlng, 13);
    }
  });
});
