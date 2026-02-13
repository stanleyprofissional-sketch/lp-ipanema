// list-opportunities.js
const API_KEY = "ODFmNzI2MmQtNGNmMi00YmVjLWI0YjYtNzY1NjQ1MTlmZTA3OmFOUHpjK1kzQ3pwclM4N1dpTFNBSkE9PQ==";
const COMPONENT_ID = "b2cc4ed3-fc6d-4493-8af1-41b4ae42db1b"; // Funil de Vendas

async function listOpps() {
    console.log(`Listando oportunidades do componente: ${COMPONENT_ID}`);
    const url = `https://app.bolten.io/kanban/api/v1/${COMPONENT_ID}/opportunities`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });

        if (!response.ok) {
            console.error("Erro ao buscar oportunidades:", await response.text());
            return;
        }

        const data = await response.json();
        console.log("OPORTUNIDADES ENCONTRADAS:");
        const items = data.items || data || [];
        items.slice(0, 5).forEach(o => {
            console.log(`- ID: ${o.id} | Atributos: ${JSON.stringify(o.attributes)}`);
        });
    } catch (e) {
        console.error("Erro:", e.message);
    }
}

listOpps();
