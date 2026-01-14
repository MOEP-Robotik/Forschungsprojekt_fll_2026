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
      
      currentMarker.on('dragend', function(event: L.DragEndEvent) {
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

  map.on('click', function(e: L.LeafletMouseEvent) {
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
  map.on('locationfound', function(e: L.LocationEvent) {
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

  const form = document.getElementById('report-form');
  if (form) {
    form.addEventListener('submit', sendReport);
  }
});

async function sendReport(event: Event) {
  event.preventDefault();

  // brauchen noch mehr, muss aber noch auf dem backend implementiert werden
  const nameInput = document.getElementById('name') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
  const lonInput = document.getElementById('lng-input') as HTMLInputElement;
  const latInput = document.getElementById('lat-input') as HTMLInputElement;

  if (!nameInput?.value || !emailInput?.value || !descriptionInput?.value || !lonInput?.value || !latInput?.value) {
    alert('Bitte alle Pflichtfelder ausfüllen (Name, E-Mail, Beschreibung, Koordinaten)');
    return;
  }

  const lon = parseFloat(lonInput.value);
  const lat = parseFloat(latInput.value);

  if (isNaN(lon) || isNaN(lat)) {
    alert('Bitte gültige Koordinaten eingeben');
    return;
  }

  // limitieren des Titels auf 100 Zeichen und der Beschreibung auf 1000 Zeichen
  const reportData = {
    title: nameInput.value.substring(0, 100) || 'Fundstück',
    description: descriptionInput.value.substring(0, 1000),
    coordinate: {
      lon: lon,
      lat: lat
    },
    email: emailInput.value
  };

  try {
    const response = await fetch('http://localhost:8000/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Report sent successfully:', result);
    
    const form = document.getElementById('report-form') as HTMLFormElement;
    if (form) {
      //form.reset();
    }
  } catch (error) {
    console.error('Error sending report:', error);
    alert(`Fehler beim Senden der Meldung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}
