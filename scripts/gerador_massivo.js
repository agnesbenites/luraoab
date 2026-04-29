require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Função para extrair questões do texto bruto
function extrairQuestoes(texto) {
  // Regex para separar blocos que começam com "Questão X" ou números seguidos de ponto
  const blocos = texto.split(/Questão\s+\d+|^\d+[\)\.]/gm).filter(b => b.trim().length > 100);
  
  return blocos.map(bloco => {
    const linhas = bloco.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Tenta encontrar as alternativas A), B), C), D)
    const indexA = linhas.findIndex(l => l.startsWith('A)') || l.startsWith('a)'));
    const indexB = linhas.findIndex(l => l.startsWith('B)') || l.startsWith('b)'));
    const indexC = linhas.findIndex(l => l.startsWith('C)') || l.startsWith('c)'));
    const indexD = linhas.findIndex(l => l.startsWith('D)') || l.startsWith('d)'));

    return {
      disciplina: "Direito (Revisar)", // Você define a disciplina depois ou via script
      enunciado: linhas.slice(0, indexA).join(' '),
      alternativa_a: linhas[indexA],
      alternativa_b: linhas[indexB],
      alternativa_c: linhas[indexC],
      alternativa_d: linhas[indexD],
      resposta_correta: "A", // Placeholder: você ajusta conforme o gabarito
      nexo_ia: "Análise baseada no histórico da FGV. Foco na lei seca.",
      peso_incidencia: 5
    };
  });
}

async function processar() {
  console.log('📄 Lendo prova_bruta.txt...');
  const texto = fs.readFileSync('./prova_bruta.txt', 'utf-8');
  const questoes = extrairQuestoes(texto);

  console.log(`🔍 Encontradas ${questoes.length} questões. Enviando para o Supabase...`);

  const { error } = await supabase.from('questoes').insert(questoes);

  if (error) console.error('❌ Erro:', error.message);
  else console.log('✅ Sucesso! O banco foi alimentado com a prova bruta.');
}

processar();