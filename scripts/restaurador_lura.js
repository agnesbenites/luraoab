const fs = require('fs');
const path = require('path');

const arquivos = fs.readdirSync(__dirname).filter(f => f.endsWith('_PROVA.json'));

arquivos.forEach(arquivo => {
    if (arquivo === 'XVI_PROVA.json' || arquivo === 'XXX_PROVA.json') return;

    const caminho = path.join(__dirname, arquivo);
    try {
        const bruto = JSON.parse(fs.readFileSync(caminho, 'utf-8'));
        let questoes = [];

        // Se o arquivo era um array puro
        if (Array.isArray(bruto)) {
            questoes = bruto;
        } 
        // Se o script anterior criou chaves "0", "1", etc.
        else if (typeof bruto === 'object') {
            questoes = Object.keys(bruto)
                .filter(key => !isNaN(key))
                .map(key => bruto[key]);
        }

        if (questoes.length > 0) {
            const nomeBase = arquivo.split('_')[0];
            const novoConteudo = {
                exame: bruto.exame || `${nomeBase} EXAME DE ORDEM UNIFICADO`,
                questoes: questoes
            };

            fs.writeFileSync(caminho, JSON.stringify(novoConteudo, null, 2), 'utf-8');
            console.log(`✅ ${arquivo} restaurado!`);
        }
    } catch (e) {
        console.log(`❌ Falha ao processar ${arquivo}: ${e.message}`);
    }
});
