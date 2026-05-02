require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function classificar() {
    console.log('🏷️ Classificando matérias do XVI Exame...');

    const mapeamento = [
        { range: [1, 10], materia: 'Ética Profissional' },
        { range: [11, 12], materia: 'Filosofia do Direito' },
        { range: [13, 19], materia: 'Direito Constitucional' },
        { range: [20, 21], materia: 'Direitos Humanos' },
        { range: [22, 24], materia: 'Direito Internacional' },
        { range: [25, 29], materia: 'Direito Tributário' },
        { range: [30, 35], materia: 'Direito Administrativo' },
        { range: [36, 37], materia: 'Direito Ambiental' },
        { range: [38, 44], materia: 'Direito Civil' },
        { range: [45, 46], materia: 'ECA' },
        { range: [47, 48], materia: 'Direito do Consumidor' },
        { range: [49, 53], materia: 'Direito Empresarial' },
        { range: [54, 60], materia: 'Processo Civil' },
        { range: [61, 66], materia: 'Direito Penal' },
        { range: [67, 72], materia: 'Processo Penal' },
        { range: [73, 78], materia: 'Direito do Trabalho' },
        { range: [79, 80], materia: 'Processo do Trabalho' }
    ];

    for (const item of mapeamento) {
        const { data, error } = await supabase
            .from('questoes')
            .update({ disciplina: item.materia })
            .eq('origem', 'XVI EXAME DE ORDEM UNIFICADO')
            .gte('enunciado', `${item.range[0]}.`) // Filtro simples pelo início do texto
            .filter('enunciado', 'ilike', `${item.range[0]} %`);

        if (error) console.error(`Erro em ${item.materia}:`, error.message);
    }

    console.log('✅ Matérias atualizadas com sucesso para o XVI Exame!');
}

classificar();
