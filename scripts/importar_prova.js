import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

function extrairNumeroExame(nomeExame) {
  const romanos = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  const match = nomeExame.match(/^([IVXLCDM]+)/i);
  if (!match) return 999;
  const romano = match[1].toUpperCase();
  let num = 0;
  for (let i = 0; i < romano.length; i++) {
    const curr = romanos[romano[i]];
    const next = romanos[romano[i + 1]];
    num += (next && curr < next) ? -curr : curr;
  }
  return num;
}

function classificarPorNumero(num, numeroExame) {
  if (num >= 1  && num <= 8)  return 'Ética Profissional';
  if (num >= 9  && num <= 10) return 'Filosofia do Direito';
  if (num >= 11 && num <= 16) return 'Direito Constitucional';
  if (num >= 17 && num <= 18) return 'Direitos Humanos';

  if (numeroExame >= 38) {
    if (num >= 19 && num <= 20) return 'Direito Eleitoral';
    if (num >= 21 && num <= 22) return 'Direito Internacional';
    if (num >= 23 && num <= 24) return 'Direito Financeiro';
    if (num >= 25 && num <= 29) return 'Direito Tributário';
    if (num >= 30 && num <= 34) return 'Direito Administrativo';
    if (num >= 35 && num <= 36) return 'Direito Ambiental';
    if (num >= 37 && num <= 42) return 'Direito Civil';
    if (num >= 43 && num <= 44) return 'ECA';
    if (num >= 45 && num <= 46) return 'Direito do Consumidor';
    if (num >= 47 && num <= 50) return 'Direito Empresarial';
    if (num >= 51 && num <= 56) return 'Direito Processual Civil';
    if (num >= 57 && num <= 62) return 'Direito Penal';
    if (num >= 63 && num <= 68) return 'Direito Processual Penal';
    if (num >= 69 && num <= 70) return 'Direito Previdenciário';
    if (num >= 71 && num <= 75) return 'Direito do Trabalho';
    if (num >= 76 && num <= 80) return 'Direito Processual do Trabalho';

  } else if (numeroExame >= 31) {
    if (num >= 19 && num <= 20) return 'Direito Internacional';
    if (num >= 21 && num <= 22) return 'Direito Eleitoral';
    if (num >= 23 && num <= 27) return 'Direito Administrativo';
    if (num >= 28 && num <= 32) return 'Direito Tributário';
    if (num >= 33 && num <= 34) return 'Direito Financeiro';
    if (num >= 35 && num <= 40) return 'Direito Civil';
    if (num >= 41 && num <= 46) return 'Direito Processual Civil';
    if (num >= 47 && num <= 50) return 'Direito Empresarial';
    if (num >= 51 && num <= 56) return 'Direito Penal';
    if (num >= 57 && num <= 62) return 'Direito Processual Penal';
    if (num >= 63 && num <= 67) return 'Direito do Trabalho';
    if (num >= 68 && num <= 72) return 'Direito Processual do Trabalho';
    if (num >= 73 && num <= 74) return 'Direito Ambiental';
    if (num >= 75 && num <= 76) return 'Direito do Consumidor';
    if (num >= 77 && num <= 78) return 'ECA';
    if (num >= 79 && num <= 80) return 'Outras';

  } else {
    if (num >= 19 && num <= 20) return 'Direito Internacional';
    if (num >= 21 && num <= 22) return 'Direito Eleitoral';
    if (num >= 23 && num <= 27) return 'Direito Administrativo';
    if (num >= 28 && num <= 32) return 'Direito Tributário';
    if (num >= 33 && num <= 34) return 'Direito Financeiro';
    if (num >= 35 && num <= 40) return 'Direito Civil';
    if (num >= 41 && num <= 46) return 'Direito Processual Civil';
    if (num >= 47 && num <= 50) return 'Direito Empresarial';
    if (num >= 51 && num <= 56) return 'Direito Penal';
    if (num >= 57 && num <= 62) return 'Direito Processual Penal';
    if (num >= 63 && num <= 71) return 'Direito do Trabalho';
    if (num >= 72 && num <= 80) return 'Direito Processual do Trabalho';
  }

  return 'Ética Profissional';
}

function normalizarProva(arquivo, raw) {
  const p = JSON.parse(raw);

  if (p.exame && Array.isArray(p.questoes)) {
    const questoes = p.questoes.map(q => ({
      ...q,
      questao: q.questao ?? q.numero ?? q.num ?? q.n ?? q.id ?? null,
    }));
    return { exame: p.exame, questoes };
  }

  if (p[0] || p['0']) {
    const nome = arquivo.replace('_PROVA2.json', '').replace('_PROVA.json', '') + ' EXAME DE ORDEM UNIFICADO';
    const questoes = Object.values(p).map(q => ({
      ...q,
      questao: q.questao ?? q.numero ?? q.num ?? q.n ?? q.id ?? null,
    }));
    return { exame: nome, questoes };
  }

  return null;
}

async function importar() {
  const pastaProvas = path.resolve('./provas');
  const arquivos = fs.readdirSync(pastaProvas).filter(f => f.endsWith('.json'));
  console.log(`📂 ${arquivos.length} provas encontradas`);

  for (const arquivo of arquivos) {
    const raw = fs.readFileSync(path.join(pastaProvas, arquivo), 'utf-8');
    const prova = normalizarProva(arquivo, raw);
    if (!prova) { console.log(`  ⚠️ Formato desconhecido: ${arquivo}`); continue; }

    const numeroExame = extrairNumeroExame(prova.exame);
    console.log(`\n📋 Processando: ${prova.exame} (Exame nº ${numeroExame})`);

    const { count } = await supabase
      .from('questoes')
      .select('*', { count: 'exact', head: true })
      .eq('origem', prova.exame);

    if (count > 0) {
      console.log(`  🔄 Atualizando disciplinas (${count} questões)...`);
      for (const q of prova.questoes) {
        const num = q.questao;
        const disciplina = classificarPorNumero(num, numeroExame);
        await supabase
          .from('questoes')
          .update({ disciplina, numero_questao: num })
          .eq('origem', prova.exame)
          .eq('enunciado', q.enunciado);
        console.log(`  ✅ Q${num} → ${disciplina}`);
      }
      continue;
    }

    for (const q of prova.questoes) {
      const num = q.questao;
      const disciplina = classificarPorNumero(num, numeroExame);
      const { error } = await supabase.from('questoes').insert([{
        origem: prova.exame,
        enunciado: q.enunciado,
        alternativa_a: q.alternativas.A,
        alternativa_b: q.alternativas.B,
        alternativa_c: q.alternativas.C,
        alternativa_d: q.alternativas.D,
        resposta_correta: q.resposta_correta ?? q.resposta,
        disciplina,
        numero_questao: num,
      }]);
      if (error) console.error(`  ❌ Q${num}:`, error.message);
      else console.log(`  ✅ Q${num} → ${disciplina}`);
    }
    console.log(`  🎉 ${prova.exame} concluído!`);
  }
  console.log('\n✅ Tudo pronto!');
}

importar().catch(console.error);
