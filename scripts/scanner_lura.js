const fs = require('fs');
const path = require('path');

const arquivos = fs.readdirSync(__dirname).filter(f => f.endsWith('_PROVA.json'));

console.log(`🔍 Escaneando ${arquivos.length} arquivos JSON...\n`);

arquivos.forEach(arquivo => {
    try {
        const conteudo = JSON.parse(fs.readFileSync(path.join(__dirname, arquivo), 'utf-8'));
        
        if (!conteudo.exame) {
            console.log(`⚠️  ${arquivo}: Faltando a chave "exame".`);
        } else if (!conteudo.questoes || !Array.isArray(conteudo.questoes)) {
            console.log(`❌ ${arquivo}: Chave "questoes" não encontrada ou não é uma lista.`);
        } else {
            console.log(`✅ ${arquivo}: Estrutura correta (${conteudo.questoes.length} questões).`);
        }
    } catch (e) {
        console.log(`🚨 ${arquivo}: Erro de Sintaxe (Provável vírgula ou aspas faltando) -> ${e.message}`);
    }
});
