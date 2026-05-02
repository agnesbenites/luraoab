const fs = require('fs');
const path = require('path');

const arquivoInput = path.join(__dirname, 'prova_atual.txt');
const arquivoOutput = path.join(__dirname, 'base_questoes.json');

function converter() {
    console.log('📖 Iniciando extração profunda das 80 questões...');
    if (!fs.existsSync(arquivoInput)) {
        console.error('❌ Erro: prova_atual.txt não encontrado!');
        return;
    }

    let texto = fs.readFileSync(arquivoInput, 'utf-8');

    // Remove rodapés e cabeçalhos repetitivos para não quebrar o enunciado
    texto = texto.replace(/TIPO 3 – AMARELA – Página \d+/gi, '');
    texto = texto.replace(/39O EXAME DE ORDEM UNIFICADO/gi, '');
    texto = texto.replace(/Ordem dos Advogados do Brasil/gi, '');

    // Divide o texto procurando por um número (1 a 80) no INÍCIO de uma linha
    const blocos = texto.split(/\n(?=\d{1,2}\s+)/g);
    
    const formatadas = blocos.map(bloco => {
        const linhas = bloco.split('\n').map(l => l.trim()).filter(l => l.length > 2);
        
        // Localiza as alternativas independente de onde estão no bloco
        const indexA = linhas.findIndex(l => /^A\s|^A\)/i.test(l));
        const indexB = linhas.findIndex(l => /^B\s|^B\)/i.test(l));
        const indexC = linhas.findIndex(l => /^C\s|^C\)/i.test(l));
        const indexD = linhas.findIndex(l => /^D\s|^D\)/i.test(l));

        if (indexA === -1 || indexB === -1) return null;

        const enunciado = linhas.slice(0, indexA).join(' ').trim();
        
        // Pega apenas os primeiros caracteres do enunciado para extrair o número
        const numeroMatch = enunciado.match(/^\d+/);
        const numero = numeroMatch ? numeroMatch[0] : null;

        return {
            numero: numero,
            disciplina: "Revisar",
            enunciado: enunciado,
            alternativa_a: linhas[indexA],
            alternativa_b: linhas[indexB],
            alternativa_c: linhas[indexC],
            alternativa_d: linhas[indexD],
            resposta_correta: "A", 
            nexo_ia: "Foco no padrão FGV identificado.",
            url_planalto: "https://www.planalto.gov.br/",
            peso_incidencia: 5
        };
    }).filter(q => q !== null && q.enunciado.length > 50);

    // Salva o JSON
    fs.writeFileSync(arquivoOutput, JSON.stringify(formatadas, null, 2));
    console.log(`✅ Sucesso! O Lura identificou ${formatadas.length} questões.`);
    
    if (formatadas.length < 80) {
        console.log('⚠️ Dica: Se faltarem questões, veja se no .txt o número da questão está colado no texto anterior.');
    }
}

converter();
