// test-bolten.js
const API_KEY = "ODFmNzI2MmQtNGNmMi00YmVjLWI0YjYtNzY1NjQ1MTlmZTA3OmFOUHpjK1kzQ3pwclM4N1dpTFNBSkE9PQ==";
const COMPONENT_ID = "b2cc4ed3-fc6d-4493-8af1-41b4ae42db1b"; // Funil de Vendas

async function testSchema() {
    console.log(`Consultando Schema para o Componente: ${COMPONENT_ID}`);
    const url = `https://app.bolten.io/kanban/api/v1/${COMPONENT_ID}/schema`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
        });
        const result = await response.json();
        console.log("CAMPOS DISPONÍVEIS:");
        const fields = result.attributes || result.items || [];
        fields.forEach(f => {
            console.log(`- Nome: ${f.name} | ID: ${f.id} | Tipo: ${f.content_type}`);
        });
    } catch (e) {
        console.error("Erro:", e.message);
    }
}

testSchema();
