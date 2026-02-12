const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const leadData = JSON.parse(event.body);
        const BOLTEN_API_KEY = process.env.BOLTEN_API_KEY;

        if (!BOLTEN_API_KEY) {
            console.error("ERRO: BOLTEN_API_KEY não configurada nas variáveis de ambiente.");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Configuração do CRM ausente." })
            };
        }

        // Bolten API endpoint (standard opportunities endpoint)
        // Note: The specific domain/endpoint might vary, but usually it's api.bolten.io/v1/opportunities
        const BOLTEN_ENDPOINT = 'https://api.bolten.io/api/v1/opportunities';

        console.log("Enviando lead para Bolten:", leadData.name || leadData.email || leadData.phone);

        // Map frontend fields (if necessary) to Bolten fields
        // Bolten fields are dynamic, so we send the object as is, assuming field names match
        const response = await fetch(BOLTEN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOLTEN_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(leadData)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Erro Bolten API:", result);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "Erro ao sincronizar com CRM", details: result })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Lead sincronizado com sucesso!", id: result.id })
        };

    } catch (error) {
        console.error("Erro na Function bolten-proxy:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro interno no servidor" })
        };
    }
};
