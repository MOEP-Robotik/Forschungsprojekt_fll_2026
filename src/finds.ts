import "./finds.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@maplibre/maplibre-gl-leaflet";
import "maplibre-gl/dist/maplibre-gl.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { getApiEndpoint, getUseRasterTiles } from "./settings";

document.addEventListener("DOMContentLoaded", async () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        return;
    }
    const map: L.Map = L.map("map").setView([51.9481, 10.2651], 6);

    if (getUseRasterTiles()) {
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);
    } else {
        L.maplibreGL({
            style: `${getApiEndpoint()}/styles/osm-liberty/style.json`,
        }).addTo(map);
    }
    const funde = await getFunde();
    funde.forEach((fund) => {
        let marker = L.marker([fund.coordinate.lat, fund.coordinate.lon], {
            title: fund.title,
            riseOnHover: true,
            riseOffset: 500,
        });
        marker.bindPopup(`
            <div class="title">${fund.title}</div>
            <div class="description">${fund.description}</div>
            <div class="date">${fund.timestamp}</div>
        `);
        marker.on("mouseover", () => {
            marker.openPopup();
        });
        marker.on("mouseout", () => {
            marker.closePopup();
        });

        /*const fundliste = document.getElementById("fundliste");
        if (!fundliste) {
            return;
        };
        marker.on('click', () => {
            fundliste.innerHTML = `
                <div class="title">${fund.title}</div>
                <div class="description">${fund.description}</div>
                <div class="date">${fund.timestamp}</div>
                <div class="coordinate">${fund.coordinate.lon + " " + fund.coordinate.lat}</div>
            `
        });*/
        marker.addTo(map);
    });
});

interface coordinate {
    lon: number;
    lat: number;
}

interface Fund {
    title: string;
    coordinate: coordinate;
    timestamp: string;
    description: string;
    //noch nicht vollständig!!!
}

async function getFunde(): Promise<Array<Fund>> {
    try {
        const res = await fetch(`${getApiEndpoint()}/api/submissions`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("jwt_token") ?? "",
            },
        });

        const data = await res.json();

        if (data.success) {
            return data.data as Array<Fund>;
        } else {
            console.error("Get unsuccessful: ", data);
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
    return new Array<Fund>();
}
