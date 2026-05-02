require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function limparBanco() {
  console.log('🧹 Iniciando limpeza de questões inválidas...');

  // Deleta questões que não têm a alternativa B (provavelmente lixo de conversão ou 2ª fase)
  const { data, error } = await supabase
    .from('questoes')
    .delete()
    .or('alternativa_b.eq."",alternativa_b.is.null');

  if (error) {
    console.error('❌ Erro na limpeza:', error.message);
  } else {
    console.log('✅ Banco limpo! Apenas questões de múltipla escolha preservadas.');
  }
}

limparBanco();
