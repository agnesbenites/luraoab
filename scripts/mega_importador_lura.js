require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function definirMateria(n) {
    if (n <= 8) return 'Ética Profissional';
    if (n <= 10) return 'Filosofia do Direito';
    if (n <= 16) return 'Direito Constitucional';
    if (n <= 18) return 'Direitos Humanos';
    if (n <= 20) return 'Direito Internacional';
    if (n <= 26) return 'Direito Tributário';
    if (n <= 32) return 'Direito Administrativo';
    if (n <= 34) return 'Direito Ambiental';
    if (n <= 41) return 'Direito Civil';
    if (n <= 43) return 'ECA';
    if (n <= 45) return 'Consumidor';
    if (n <= 50) return 'Direito Empresarial';
    if (n <= 57) return 'Processo Civil';
    if (n <= 63) return 'Direito Penal';
    if (n <= 69) return 'Processo Penal';
    if (n <= 75) return 'Direito do Trabalho';
    return 'Processo do Trabalho';
}

async function processarTudo() {
    const scriptsDir = __dirname;
    const arquivos = fs.readdirSync(scriptsDir).filter(f => f.endsWith('_PROVA.json'));
    
    console.log(`🚀 Iniciando processamento de ${arquivos.length} provas...`);

    for (const arquivo of arquivos) {
        const conteudo = JSON.parse(fs.readFileSync(path.join(scriptsDir, arquivo), 'utf-8'));
        console.log(`⏳ Subindo: ${conteudo.exame}...`);

        const formatadas = conteudo.questoes.map(q => ({
            enunciado: q.enunciado,
            alternativa_a: q.alternativas.A,
            alternativa_b: q.alternativas.B,
            alternativa_c: q.alternativas.C,
            alternativa_d: q.alternativas.D,
            resposta_correta: q.resposta_correta,
            origem: conteudo.exame,
            disciplina: definirMateria(q.numero),
            nexo_ia: "Conteúdo validado para o ecossistema Lura."
        }));

        const { error } = await supabase.from('questoes').insert(formatadas);
        if (error) console.error(`❌ Erro no ${arquivo}:`, error.message);
    }
    console.log('✨ Missão cumprida! Banco de dados do Lura OAB está alimentado e categorizado.');
}

processarTudo();
