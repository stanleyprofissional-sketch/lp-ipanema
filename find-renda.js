// find-renda.js
const API_KEY = "ODFmNzI2MmQtNGNmMi00YmVjLWI0YjYtNzY1NjQ1MTlmZTA3OmFOUHpjK1kzQ3pwclM4N1dpTFNBSkE9PQ==";
const MODULES = [
    { name: "Contatos", id: "7e26b6a5-fcad-4425-a011-20d894df5259", type: "contact" },
    { name: "Funil de Vendas", id: "b2cc4ed3-fc6d-4493-8af1-41b4ae42db1b", type: "kanban" }
];

async function findRendaField() {
    for (const mod of MODULES) {
        console.log(`\n--- Buscando no módulo: ${mod.name} ---`);
        const url = `https://app.bolten.io/${mod.type}/api/v1/${mod.id}/schema`;
        try {
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            const fields = data.attributes || data.items || [];
            fields.forEach(f => {
                console.log(`- ${f.name} (Tipo: ${f.content_type}) | ID/Name: ${f.field_name || f.id}`);
                if (f.name.toLowerCase().includes("renda") || f.name.toLowerCase().includes("faturamento")) {
                    console.log(`>>> ENCONTRADO CAMPO DE RENDA: ${f.name} | Usar: ${f.field_name || f.id}`);
                }
            });
        } catch (e) {
            console.error(`Erro em ${mod.name}:`, e.message);
        }
    }
}

findRendaField();
