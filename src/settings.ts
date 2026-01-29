export function getApiEndpoint(): string {
    return localStorage.getItem("api_endpoint") ?? "http://moepserver:8000";
}

export function getUseRasterTiles(): boolean {
    return localStorage.getItem("raster_tiles") === "true" ?? false;
}
