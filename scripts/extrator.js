require('dotenv').config();
const fs = require('fs');
// Exemplo usando a biblioteca oficial da OpenAI
const { OpenAI } = require('openai'); 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function processarProva(textoBruto) {
  const prompt = `
    Aja como uma especialista em Direito e Exame da OAB. 
    Converta o texto da prova abaixo em um array JSON.
    Para cada questão, identifique:
    - disciplina, assunto, enunciado, alternativas A a D, resposta_correta.
    - id_artigo_planalto: a lei e o artigo que fundamenta.
    - url_planalto: o link direto do site do planalto.
    - nexo_ia: uma explicação curta (2 frases) sobre por que a FGV cobrou isso.
    
    TEXTO: ${textoBruto}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return response.choices[0].message.content;
}