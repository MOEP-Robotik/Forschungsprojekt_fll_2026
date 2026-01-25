import "./main.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@mdi/font/css/materialdesignicons.min.css";

document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    if (mapElement) {
        const map = L.map("map").setView([51.9481, 10.2651], 6);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
    }
});
