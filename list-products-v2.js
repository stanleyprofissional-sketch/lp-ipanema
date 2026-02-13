// list-products-v2.js
const API_KEY = "ODFmNzI2MmQtNGNmMi00YmVjLWI0YjYtNzY1NjQ1MTlmZTA3OmFOUHpjK1kzQ3pwclM4N1dpTFNBSkE9PQ==";
const PROJECT_ID = "81f7262d-4cf2-4bec-b4b6-76564519fe07";

async function listProducts() {
    // Tentamos o padrão /{tipo}/api/v1/{id}/items ou similar
    // Testamos contato: /contact/api/v1/{module_id}/contacts
    // Testamos kanban: /kanban/api/v1/{module_id}/opportunities
    // Vamos tentar /product/api/v1/{project_id}/products
    const url = `https://app.bolten.io/product/api/v1/${PROJECT_ID}/products`;

    console.log(`Buscando em: ${url}`);
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });
        const data = await response.json();
        console.log("RESPOSTA:");
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Erro:", e.message);
    }
}

listProducts();
