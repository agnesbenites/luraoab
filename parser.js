const fs = require('fs');

const arquivoInput = './prova_atual.txt';
const arquivoOutput = './base_questoes.json';

function converter() {
    console.log('📖 Lendo prova_atual.txt...');
    if (!fs.existsSync(arquivoInput)) {
        console.error('❌ Erro: O arquivo prova_atual.txt não foi encontrado na pasta scripts!');
        return;
    }

    const texto = fs.readFileSync(arquivoInput, 'utf-8');

    // Separa as questões procurando por números seguidos de ponto (ex: 1., 01., 2.)
    // ou pela palavra Questão
    const questoesBrutas = texto.split(/\n(?=\d{1,2}[\.\-\)])|Questão\s+\d+/g);
    
    const formatadas = questoesBrutas.map(bloco => {
        const linhas = bloco.split('\n').map(l => l.trim()).filter(l => l.length > 2);
        if (linhas.length < 5) return null;

        // Procura os índices das alternativas A, B, C e D
        const indexA = linhas.findIndex(l => /^[A][\)\.\-]/i.test(l));
        const indexB = linhas.findIndex(l => /^[B][\)\.\-]/i.test(l));
        const indexC = linhas.findIndex(l => /^[C][\)\.\-]/i.test(l));
        const indexD = linhas.findIndex(l => /^[D][\)\.\-]/i.test(l));

        if (indexA === -1 || indexB === -1) return null;

        return {
            disciplina: "Revisar",
            assunto: "Geral",
            enunciado: linhas.slice(0, indexA).join(' '),
            alternativa_a: linhas[indexA],
            alternativa_b: linhas[indexB],
            alternativa_c: linhas[indexC],
            alternativa_d: linhas[indexD],
            resposta_correta: "A", // Você ajustará no JSON final
            nexo_ia: "Análise da banca FGV. Foco em lei seca.",
            url_planalto: "https://www.planalto.gov.br/",
            peso_incidencia: 3
        };
    }).filter(q => q !== null);

    fs.writeFileSync(arquivoOutput, JSON.stringify(formatadas, null, 2));
    console.log(`✅ Sucesso! Encontradas ${formatadas.length} questões.`);
    console.log(`📂 O arquivo base_questoes.json foi atualizado.`);
}

converter();
