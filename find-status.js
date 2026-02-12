// find-status.js
const API_KEY = "ODFmNzI2MmQtNGNmMi00YmVjLWI0YjYtNzY1NjQ1MTlmZTA3OmFOUHpjK1kzQ3pwclM4N1dpTFNBSkE9PQ==";
const COMPONENT_ID = "b2cc4ed3-fc6d-4493-8af1-41b4ae42db1b"; // Funil de Vendas

async function findSchema() {
    console.log(`Consultando Schema do Componente: ${COMPONENT_ID}`);
    const url = `https://app.bolten.io/kanban/api/v1/${COMPONENT_ID}/schema`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });

        if (!response.ok) {
            console.error("Erro ao buscar schema:", await response.text());
            return;
        }

        const schema = await response.json();
        console.log("SCHEMA COMPLETO:");
        console.log(JSON.stringify(schema, null, 2));
    } catch (e) {
        console.error("Erro:", e.message);
    }
}

findSchema();
