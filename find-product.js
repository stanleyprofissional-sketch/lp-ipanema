// find-product.js
const API_KEY = "ODFmNzI2MmQtNGNmMi00YmVjLWI0YjYtNzY1NjQ1MTlmZTA3OmFOUHpjK1kzQ3pwclM4N1dpTFNBSkE9PQ==";
const PROJECT_ID = "81f7262d-4cf2-4bec-b4b6-76564519fe07";

async function findProducts() {
    console.log(`Buscando produtos do projeto: ${PROJECT_ID}`);
    // Tenta listar produtos via API. O endpoint exato pode variar.
    // Baseado na documentação GitBook de APIs RESTful genéricas, tentarei /products
    const url = `https://app.bolten.io/product/api/v1/products`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });

        if (!response.ok) {
            console.error("Erro ao buscar produtos:", await response.text());
            return;
        }

        const data = await response.json();
        console.log("PRODUTOS ENCONTRADOS:");
        const products = data.items || data || [];
        products.forEach(p => {
            console.log(`- Nome: ${p.name} | ID: ${p.id}`);
        });
    } catch (e) {
        console.error("Erro:", e.message);
    }
}

findProducts();
