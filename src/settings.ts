export function setApiEndpoint(endpoint: string): void {
    localStorage.setItem("api_endpoint", endpoint);
}
export function getApiEndpoint(): string {
    return localStorage.getItem("api_endpoint") ?? "http://192.168.204.217:8000";
}

export function setUseRasterTiles(use: boolean): void {
    localStorage.setItem("raster_tiles", use.toString());
}
export function getUseRasterTiles(): boolean {
    return localStorage.getItem("raster_tiles") === "true";
}
