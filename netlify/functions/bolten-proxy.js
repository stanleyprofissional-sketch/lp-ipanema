// Usando o Global Fetch disponível no Node 18+ da Netlify
exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const leadData = JSON.parse(event.body);

        // TRAVA DE SEGURANÇA: Só processa se tiver dados de qualificação
        if (!leadData.urgency || !leadData.income) {
            console.log(`[Bolten Sync] Ignorando lead (${leadData.name || 'Sem Nome'}): Faltam dados de qualificação (Urgência/Renda).`);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Lead ignorado por falta de qualificação." })
            };
        }

        const BOLTEN_API_KEY = process.env.BOLTEN_API_KEY || "ODFmNzI2MmQtNGNmMi00YmVjLWI0YjYtNzY1NjQ1MTlmZTA3OmFOUHpjK1kzQ3pwclM4N1dpTFNBSkE9PQ==";

        // IDs dos Módulos (obtidos via script de teste)
        const CONTACT_MODULE_ID = "7e26b6a5-fcad-4425-a011-20d894df5259";
        const OPPORTUNITY_MODULE_ID = "b2cc4ed3-fc6d-4493-8af1-41b4ae42db1b";

        console.log(`[Bolten Sync] Iniciando para: ${leadData.name || leadData.phone}`);

        // PASSO 1: Criar ou Atualizar Contato
        // O Bolten identifica por telefone/email se configurado, ou cria novo.
        const contactUrl = `https://app.bolten.io/contact/api/v1/${CONTACT_MODULE_ID}/contacts`;

        const contactPayload = {
            attributes: {
                "Nome": leadData.name,
                "Telefone": leadData.phone,
                "Urgência": leadData.urgency || "Não informado",
                "Renda": leadData.income || "Não informado"
            }
        };

        console.log("[Bolten Sync] Passo 1: Criando/Atualizando Contato...");
        const contactRes = await fetch(contactUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOLTEN_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactPayload)
        });

        const contactResult = await contactRes.json();

        if (!contactRes.ok) {
            console.error("[Bolten Sync] Erro Passo 1 (Contato):", contactResult);
            return { statusCode: contactRes.status, body: JSON.stringify({ error: "Erro ao criar contato", details: contactResult }) };
        }

        const contactId = contactResult.id;
        console.log(`[Bolten Sync] Contato OK. ID: ${contactId}`);

        // PASSO 2: Criar Oportunidade vinculada ao Contato
        const opportunityUrl = `https://app.bolten.io/kanban/api/v1/${OPPORTUNITY_MODULE_ID}/opportunities`;

        const opportunityPayload = {
            attributes: {
                "Contato": contactId,
                "Status": leadData.status || "Novo Lead",
                "Observação": `Origem: ${leadData.source || 'Site'} | Renda: ${leadData.income || 'N/A'}`
            }
        };

        console.log("[Bolten Sync] Passo 2: Criando Oportunidade...");
        const oppRes = await fetch(opportunityUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOLTEN_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(opportunityPayload)
        });

        const oppResult = await oppRes.json();

        if (!oppRes.ok) {
            console.error("[Bolten Sync] Erro Passo 2 (Oportunidade):", oppResult);
            // Mesmo se falhar a oportunidade, o contato foi criado.
            return { statusCode: oppRes.status, body: JSON.stringify({ error: "Contato criado, mas falha na oportunidade", details: oppResult }) };
        }

        console.log("[Bolten Sync] Sucesso Total!");
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Lead e Oportunidade sincronizados!", contact_id: contactId, opportunity_id: oppResult.id })
        };

    } catch (error) {
        console.error("[Bolten Sync] Erro Crítico:", error.message);
        return { statusCode: 500, body: JSON.stringify({ error: "Erro interno", message: error.message }) };
    }
};
