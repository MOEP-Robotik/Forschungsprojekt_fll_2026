import './main.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    const map = L.map('map').setView([51.9481, 10.2651], 6);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  }

  const loginElement = document.getElementById("login-container") as HTMLDivElement;
  const loggedIn = localStorage.getItem("jwt_token") !== "";
  
  if (loggedIn) {
    // TODO: Add logic for logging out
    loginElement.innerHTML = `
      <button type="button" class="login-button">
        Log out
      </button>
    `;
  } else {
    loginElement.innerHTML = `
      <a href="src/login.html" style="text-decoration:none;">
        <button type="button" class="login-button">
          Log in
        </button>
      </a>
    `;
  }

});
