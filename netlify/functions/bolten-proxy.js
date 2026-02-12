// Usando o Global Fetch disponível no Node 18+ da Netlify
exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const leadData = JSON.parse(event.body);
        const BOLTEN_API_KEY = process.env.BOLTEN_API_KEY;

        if (!BOLTEN_API_KEY) {
            console.error("ERRO: BOLTEN_API_KEY não encontrada nas variáveis de ambiente da Netlify.");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Configuração BOLTEN_API_KEY ausente na Netlify." })
            };
        }

        // Endpoint padrão para criação de oportunidades
        const BOLTEN_ENDPOINT = 'https://api.bolten.io/api/v1/opportunities';

        console.log(`[Bolten Sync] Iniciando sincronização para: ${leadData.name || 'Sem Nome'}`);
        console.log(`[Bolten Sync] Endpoint: ${BOLTEN_ENDPOINT}`);

        const response = await fetch(BOLTEN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOLTEN_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(leadData)
        });

        const status = response.status;
        const result = await response.json();

        console.log(`[Bolten Sync] Status da Resposta: ${status}`);

        if (!response.ok) {
            console.error("[Bolten Sync] Erro retornado pela API:", result);
            return {
                statusCode: status,
                body: JSON.stringify({
                    error: "Erro na API do Bolten",
                    status: status,
                    details: result
                })
            };
        }

        console.log("[Bolten Sync] Sucesso:", result);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Lead sincronizado com sucesso!",
                id: result.id || result.opportunity_id
            })
        };

    } catch (error) {
        console.error("[Bolten Sync] Erro crítico na Function:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Erro interno ao processar lead",
                message: error.message
            })
        };
    }
};
