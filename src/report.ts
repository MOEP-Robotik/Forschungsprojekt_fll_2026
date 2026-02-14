import "./globals.css";
import "./report.css";
import L from "leaflet";
import "@maplibre/maplibre-gl-leaflet";
import "maplibre-gl/dist/maplibre-gl.css";
import "leaflet/dist/leaflet.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { getApiEndpoint, getUseRasterTiles } from "./settings";

document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const map = L.map("map").setView([51.9481, 10.2651], 6);
    if (getUseRasterTiles()) {
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);
    } else {
        L.maplibreGL({
            style: `${getApiEndpoint()}/styles/osm-liberty/style.json`,
        }).addTo(map);
    }

    let currentMarker: L.Marker | null = null;
    let userLocationDot: L.CircleMarker | null = null;

    const latInput = document.getElementById("lat-input") as HTMLInputElement;
    const lonInput = document.getElementById("lng-input") as HTMLInputElement;

    function updateMarker(lon: number, lat: number, updateInputs = false) {
        if (currentMarker) {
            currentMarker.setLatLng([lat, lon]);
        } else {
            currentMarker = L.marker([lat, lon], { draggable: true }).addTo(
                map,
            );

            currentMarker.on("dragend", function (event: L.DragEndEvent) {
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

    map.on("click", function (e: L.LeafletMouseEvent) {
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
        latInput.addEventListener("input", handleInputChange);
        lonInput.addEventListener("input", handleInputChange);
    }

    map.locate({ watch: true });
    map.on("locationfound", function (e: L.LocationEvent) {
        if (userLocationDot) {
            userLocationDot.setLatLng(e.latlng);
        } else {
            userLocationDot = L.circleMarker(e.latlng, {
                radius: 8,
                fillColor: "#3388ff",
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
            }).addTo(map);
            map.setView(e.latlng, 13);
        }
    });

    const isLoggedIn = !!localStorage.getItem("jwt_token");
    const isGuestAccount = !!localStorage.getItem("is_guest_account");
    const form = document.getElementById("report-form");
    const guestFields = document.getElementById("guest-fields");

    if (form) {
        if (!isLoggedIn && !isGuestAccount) {
            form.innerHTML = `
        <h2>Du musst eingeloggt sein, um einen Fund abzusenden!</h2>
        <a href="account.html" class="back-link">
            <button type="button" class="account-button">
                <span class="mdi mdi-account-outline" name="account-mdi"></span>
                Login
            </button>                            
        </a>

      `;
        } else if (isGuestAccount && guestFields) {
            guestFields.style.display = "block";
            const guestInputs = guestFields.querySelectorAll("input");
            guestInputs.forEach((input) => input.setAttribute("required", ""));
        }
        form.addEventListener("submit", sendReport);
    }
});

async function sendReport(event: Event) {
    event.preventDefault();
    const readItInput = document.getElementById(
        "readItInput",
    ) as HTMLInputElement;
    if (!readItInput.checked) {
        alert(
            "Die Datenschutzerklärung und die AGB müssen gelesen und akzeptiert werden",
        );
        return;
    }

    const dateInput = document.getElementById("date") as HTMLInputElement;
    const lonInput = document.getElementById("lng-input") as HTMLInputElement;
    const latInput = document.getElementById("lat-input") as HTMLInputElement;
    const imageInput = document.getElementById("image") as HTMLInputElement;
    const materialInput = document.getElementById(
        "material",
    ) as HTMLSelectElement;
    const datierungsInput = document.getElementById(
        "datierung",
    ) as HTMLSelectElement;
    const commentInput = document.getElementById("comment") as HTMLInputElement;
    const lengthInput = document.getElementById("length") as HTMLInputElement;
    const widthInput = document.getElementById("width") as HTMLInputElement;
    const heightInput = document.getElementById("height") as HTMLInputElement;
    const weightInput = document.getElementById("weight") as HTMLInputElement;

    const isGuestAccount = !!localStorage.getItem("is_guest_account");
    const guestVornameInput = document.getElementById(
        "guest-vorname",
    ) as HTMLInputElement;
    const guestNachnameInput = document.getElementById(
        "guest-nachname",
    ) as HTMLInputElement;
    const guestEmailInput = document.getElementById(
        "guest-email",
    ) as HTMLInputElement;
    const guestPlzInput = document.getElementById(
        "guest-plz",
    ) as HTMLInputElement;
    const guestTelefonnummerInput = document.getElementById(
        "guest-telefonnummer",
    ) as HTMLInputElement;

    if (
        !lonInput?.value ||
        !latInput?.value ||
        !materialInput?.value ||
        !lengthInput?.value ||
        !widthInput?.value ||
        !heightInput?.value ||
        !weightInput?.value
    ) {
        alert("Bitte alle Pflichtfelder ausfüllen (Koordinaten, Maße, usw.)");
        return;
    }

    if (isGuestAccount) {
        if (
            !guestVornameInput?.value ||
            !guestNachnameInput?.value ||
            !guestEmailInput?.value ||
            !guestPlzInput?.value ||
            !guestTelefonnummerInput?.value
        ) {
            alert(
                "Bitte alle Pflichtfelder ausfüllen (Vorname, Nachname, E-Mail, PLZ, Telefonnummer)",
            );
            return;
        }
    }

    const lon = parseFloat(lonInput.value);
    const lat = parseFloat(latInput.value);

    if (isNaN(lon) || isNaN(lat)) {
        alert("Bitte gültige Koordinaten eingeben");
        return;
    }

    // FormData erstellen für Datei-Uploads
    const formData = new FormData();
    formData.append("coordinate[lon]", lon.toString());
    formData.append("coordinate[lat]", lat.toString());

    const size = {
        length: parseFloat(lengthInput.value),
        width: parseFloat(widthInput.value),
        height: parseFloat(heightInput.value),
        weight: parseFloat(weightInput.value),
    };

    formData.append("size", JSON.stringify(size));
    formData.append("material", materialInput.value);
    formData.append("datierung", datierungsInput.value);
    formData.append("comment", commentInput.value);
    if (dateInput.value) {
        formData.append("date", dateInput.value);
    }

    if (isGuestAccount) {
        formData.append("guest[vorname]", guestVornameInput.value);
        formData.append("guest[nachname]", guestNachnameInput.value);
        formData.append("guest[email]", guestEmailInput.value);
        formData.append("guest[plz]", guestPlzInput.value);
        formData.append("guest[telefonnummer]", guestTelefonnummerInput.value);
    }

    // Bilder hinzufügen
    if (imageInput?.files && imageInput.files.length > 0) {
        for (let i = 0; i < imageInput.files.length; i++) {
            formData.append("images[]", imageInput.files[i]);
        }
    }

    try {
        const response = await fetch(`${getApiEndpoint()}/api/submissions`, {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("jwt_token") ?? "",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response
                .json()
                .catch(() => ({ message: "Unknown error" }));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`,
            );
        }

        const result = await response.json();
        console.log("Report sent successfully:", result);

        const form = document.getElementById("report-form") as HTMLFormElement;
        if (form) {
            //form.reset();
        }
    } catch (error) {
        console.error("Error sending report:", error);
        alert(
            `Fehler beim Senden der Meldung: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
        );
    }
}
