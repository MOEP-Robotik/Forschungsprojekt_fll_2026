import "./finds.css";
import "@mdi/font/css/materialdesignicons.min.css";
import getApiEndpoint from "./settings";

document.addEventListener("DOMContentLoaded", async () => {
    const fundliste = document.getElementById("fundliste");
    if (!fundliste) {
        return;
    }
    const funde = await getFunde();
    funde.forEach((fund) => {
        let fundHTML: HTMLElement;
        fundHTML = document.createElement("li");
        fundHTML.innerHTML = `
            
        `
        fundliste.appendChild(fundHTML);
    })
});

interface Fund {
    title: string;
    //noch nicht vollständig!!!
}

async function getFunde(): Promise<Array<Fund>> {
    try {
        const res = await fetch(`${getApiEndpoint()}/api/submissions`, {
            method: "GET",
            headers: { "Content-Type": "application/json", 
                "Authorization": localStorage.getItem("jwt_token") ?? ''
            }
        });

        const data = await res.json();

        if (data.success) {
            console.log(data);
        } else {
            console.log("Get unsuccessful: ", data);
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
    return new Array<Fund>();
}
