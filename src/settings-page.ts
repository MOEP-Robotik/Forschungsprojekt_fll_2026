import "./main.css";
import "./settings.css";
import "@mdi/font/css/materialdesignicons.min.css";
import {
    getApiEndpoint,
    setApiEndpoint,
    getUseRasterTiles,
    setUseRasterTiles,
} from "./settings";

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
            alert("API-Endpunkt wurde gespeichert.");
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

    const settingsForms = document.getElementById("settings-forms");
    if (settingsForms) {
        settingsForms.style.display = "";
    }
});
