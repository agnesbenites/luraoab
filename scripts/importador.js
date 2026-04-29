require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function importar() {
  console.log('🚀 Lendo arquivo JSON...');
  const rawData = fs.readFileSync('./base_questoes.json');
  const questoes = JSON.parse(rawData);

  console.log(`📦 Preparando para importar ${questoes.length} questões...`);
  
  const { data, error } = await supabase
    .from('questoes')
    .upsert(questoes);

  if (error) {
    console.error('❌ Erro no Supabase:', error.message);
  } else {
    console.log('✅ Tudo pronto! O banco do Lura foi alimentado.');
  }
}

importar();