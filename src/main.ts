import "./main.css";
import L from "leaflet";
import "@maplibre/maplibre-gl-leaflet";
import "maplibre-gl/dist/maplibre-gl.css";
import "leaflet/dist/leaflet.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { getApiEndpoint, getUseRasterTiles } from "./settings";

document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    if (mapElement) {
        const map = L.map("map").setView([51.9481, 10.2651], 6);
        if (getUseRasterTiles()) {
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);
        } else {
            L.maplibreGL({
                style: `${getApiEndpoint()}/styles/basic-preview/style.json`,
            }).addTo(map);
        }
    }
});
