// list-components.js
const API_KEY = "ODFmNzI2MmQtNGNmMi00YmVjLWI0YjYtNzY1NjQ1MTlmZTA3OmFOUHpjK1kzQ3pwclM4N1dpTFNBSkE9PQ==";
const PROJECT_ID = "81f7262d-4cf2-4bec-b4b6-76564519fe07";

async function listComponents() {
    console.log(`Listando componentes do projeto: ${PROJECT_ID}`);
    // Baseado na estrutura de outros endpoints, tentamos listar os componentes
    const url = `https://app.bolten.io/api/v1/projects/${PROJECT_ID}/components`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });

        if (!response.ok) {
            console.error("Erro ao buscar componentes:", await response.text());
            return;
        }

        const components = await response.json();
        console.log("COMPONENTES ENCONTRADOS:");
        components.forEach(c => {
            console.log(`- Nome: ${c.name} | ID: ${c.id} | Tipo: ${c.type}`);
        });
    } catch (e) {
        console.error("Erro:", e.message);
    }
}

listComponents();
