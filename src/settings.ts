import "./main.css";
import "./settings.css";

document.addEventListener("DOMContentLoaded", () => {
    const apiInput = document.getElementById(
        "api-endpoint-input",
    ) as HTMLInputElement;
    const apiForm = document.getElementById(
        "api-endpoint-form",
    ) as HTMLFormElement;
    if (apiInput && apiForm) {
        apiInput.value = getApiEndpoint();
        apiForm.addEventListener("submit", (e) => {
            e.preventDefault();
            setApiEndpoint(apiInput.value);
            alert("API Endpoint für API-Endpoint gespeichert.");
        });
    }

    const rasterCheckbox = document.getElementById(
        "raster-tiles-checkbox",
    ) as HTMLInputElement;
    const rasterForm = document.getElementById(
        "raster-tiles-form",
    ) as HTMLFormElement;
    if (rasterCheckbox && rasterForm) {
        rasterCheckbox.checked = getUseRasterTiles();
        rasterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            setUseRasterTiles(rasterCheckbox.checked);
            alert("Einstellung für Raster Tiles gespeichert.");
        });
    }

    document.getElementById("settings-forms")!.style.display = "";
});

export function setApiEndpoint(endpoint: string): void {
    localStorage.setItem("api_endpoint", endpoint);
}
export function getApiEndpoint(): string {
    return localStorage.getItem("api_endpoint") ?? "http://moepserver:8000";
}

export function setUseRasterTiles(use: boolean): void {
    localStorage.setItem("raster_tiles", use.toString());
}
export function getUseRasterTiles(): boolean {
    return localStorage.getItem("raster_tiles") === "true";
}
