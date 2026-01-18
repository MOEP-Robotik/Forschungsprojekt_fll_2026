export default function getApiEndpoint(): string {
    return localStorage.getItem("api_endpoint") ?? "http://moepserver:8000";
}