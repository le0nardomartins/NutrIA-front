import axios from 'axios';

// Função para converter a imagem em base64
const imageToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remover o prefixo "data:image/jpeg;base64," para obter apenas o base64
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Falha ao converter imagem para base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

// Interface para a resposta da API
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Interface para os dados do perfil do usuário
interface UserProfileData {
  birthDate?: string;
  age?: number | null;
  weight?: string;
  height?: string;
  healthIssues?: Array<{
    id: string;
    name: string;
    selected: boolean;
  }>;
  nutritionalInfo?: string;
  goal?: string;
}

/**
 * Envia uma imagem para a API da OpenAI junto com um prompt
 * @param imageFile - Arquivo de imagem carregado pelo usuário
 * @param userProfile - Dados do perfil do usuário (opcional)
 * @returns Resposta da análise da imagem
 */
export const analyzeImage = async (imageFile: File, userProfile?: UserProfileData): Promise<string> => {
  try {
    // Verificar se o arquivo é uma imagem válida
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('O arquivo enviado não é uma imagem válida');
    }

    // Verificar o tamanho da imagem (limite de 20MB)
    if (imageFile.size > 20 * 1024 * 1024) {
      throw new Error('A imagem deve ter no máximo 20MB');
    }

    // Converter a imagem para base64
    const base64Image = await imageToBase64(imageFile);

<<<<<<< HEAD
    // Obter a chave da API do ambiente
    // Nota: Para produção, a chave deve ser armazenada em variáveis de ambiente no servidor
    const apiKey = import.meta.env.API_KEY;
    
    // Prompt para a análise nutricional
    const aiPrompt = `
        Você é Nutria, uma Inteligência Artificial especializada em análise nutricional de refeições a partir de imagens.

        **Contexto:**
        - Recebe imagens de pratos via front-end (arquivo ou webcam).
        - Retorna um JSON contendo:
        - \`calorias\`: número aproximado de calorias.
        - \`macronutrientes\`: \`{ carboidratos_g, proteinas_g, gorduras_g }\`.
        - \`micronutrientes\` (opcional): vitaminas e minerais principais.
        - \`ingredientes_est\`. (opcional): lista provável de componentes do prato.
        - \`recomendacoes\`: sugestões como ajustes, substituições, alertas (ex.: alto teor de sódio).
        - Pode utilizar informações do usuário (idade, peso, objetivo) para personalizar recomendações.

        **Tarefas da Nutria:**
        1. **Analisar** a imagem e identificar alimentos presentes.
        2. **Estimar** porções e calcular valores nutricionais.
        3. **Gerar recomendações** baseadas no perfil do usuário.
        4. Responder com JSON estruturado coerente.

        **Formato de resposta (obrigatório):**
        \`\`\`json
        {
        "calorias": 525,
        "macronutrientes": {
            "carboidratos_g": 60,
            "proteinas_g": 25,
            "gorduras_g": 22
        },
        "micronutrientes": {
            "vitamina_c_mg": 28,
            "ferro_mg": 2.1
        },
        "ingredientes": ["arroz branco", "feijão preto", "ovo frito", "salada de alface"],
        "recomendacoes": [
            "Reduzir 1 colher de sopa de óleo no preparo",
            "Adicionar uma fonte extra de proteínas (ex: peito de frango)",
            "Cuidado: alta quantidade de gordura saturada"
        ],

        "comentario_nutria": "Ótimo prato! Você combinou proteína, fibras e bons carboidratos. A couve refogada é excelente, só cuidado com o excesso de óleo. Que tal adicionar uma laranja depois do almoço? Isso ajuda seu corpo a aproveitar melhor o ferro do feijão 😉"
        }
        \`\`\`
        `;

    if (!apiKey) {
      throw new Error('Chave da API OpenAI não encontrada. Configure a variável de ambiente VITE_OPENAI_API_KEY.');
=======
    // Obter as variáveis de ambiente
    const apiKey = import.meta.env.API_KEY;
            const aiPrompt = `
                Você é Nutria, uma Inteligência Artificial especializada em análise nutricional de refeições a partir de imagens.

                **Contexto:**
                - Recebe imagens de pratos via front-end (arquivo ou webcam).
                - Retorna um JSON contendo:
                - \`calorias\`: número aproximado de calorias.
                - \`macronutrientes\`: \`{ carboidratos_g, proteinas_g, gorduras_g }\`.
                - \`micronutrientes\` (opcional): vitaminas e minerais principais.
                - \`ingredientes_est\`. (opcional): lista provável de componentes do prato.
                - \`recomendacoes\`: sugestões como ajustes, substituições, alertas (ex.: alto teor de sódio).
                - Pode utilizar informações do usuário (idade, peso, objetivo) para personalizar recomendações.

                **Tarefas da Nutria:**
                1. **Analisar** a imagem e identificar alimentos presentes.
                2. **Estimar** porções e calcular valores nutricionais.
                3. **Gerar recomendações** baseadas no perfil do usuário.
                4. Responder com JSON estruturado coerente.

                **Formato de resposta (obrigatório):**
                \`\`\`json
                {
                "calorias": 525,
                "macronutrientes": {
                    "carboidratos_g": 60,
                    "proteinas_g": 25,
                    "gorduras_g": 22
                },
                "micronutrientes": {
                    "vitamina_c_mg": 28,
                    "ferro_mg": 2.1
                },
                "ingredientes": ["arroz branco", "feijão preto", "ovo frito", "salada de alface"],
                "recomendacoes": [
                    "Reduzir 1 colher de sopa de óleo no preparo",
                    "Adicionar uma fonte extra de proteínas (ex: peito de frango)",
                    "Cuidado: alta quantidade de gordura saturada"
                ],

                "comentario_nutria": "Ótimo prato! Você combinou proteína, fibras e bons carboidratos. A couve refogada é excelente, só cuidado com o excesso de óleo. Que tal adicionar uma laranja depois do almoço? Isso ajuda seu corpo a aproveitar melhor o ferro do feijão 😉"
                }
                \`\`\`
                `;

    if (!apiKey) {
      throw new Error('API_KEY não encontrada nas variáveis de ambiente');
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
    }

    // Preparar informações do usuário para incluir no prompt
    let userInfo = '';
    if (userProfile) {
      userInfo = 'Informações do usuário:\n';
      
      if (userProfile.age) {
        userInfo += `- Idade: ${userProfile.age} anos\n`;
      }
      
      if (userProfile.weight) {
        userInfo += `- Peso: ${userProfile.weight} kg\n`;
      }
      
      if (userProfile.height) {
        userInfo += `- Altura: ${userProfile.height} cm\n`;
      }
      
      if (userProfile.goal) {
        const objetivos = {
          'perder': 'Perder peso',
          'manter': 'Manter peso',
          'ganhar': 'Ganhar peso',
          'ganhar_muscular': 'Ganhar massa muscular',
          'saude': 'Melhorar saúde geral'
        };
        userInfo += `- Objetivo: ${objetivos[userProfile.goal as keyof typeof objetivos] || userProfile.goal}\n`;
      }
      
      if (userProfile.healthIssues && userProfile.healthIssues.length > 0) {
        const problemasSaude = userProfile.healthIssues
          .filter(issue => issue.selected)
          .map(issue => issue.name);
        
        if (problemasSaude.length > 0) {
          userInfo += `- Problemas de saúde/restrições: ${problemasSaude.join(', ')}\n`;
        }
      }
      
      if (userProfile.nutritionalInfo) {
        userInfo += `- Informações nutricionais adicionais: ${userProfile.nutritionalInfo}\n`;
      }
    }

<<<<<<< HEAD
    console.log('Enviando imagem para análise na API da OpenAI...');

=======
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
    // Configurar a requisição para a API da OpenAI
    const response = await axios.post<OpenAIResponse>(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-vision-preview', // Modelo com suporte a visão
        messages: [
          {
            role: 'system',
<<<<<<< HEAD
            content: aiPrompt
=======
            content: aiPrompt || 'Analise esta imagem e forneça informações detalhadas sobre ela.'
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
          },
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: `Analise esta imagem de alimento:${userInfo ? '\n\n' + userInfo : ''}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                }
              }
            ]
          }
        ],
<<<<<<< HEAD
        max_tokens: 1000
=======
        max_tokens: 500
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

<<<<<<< HEAD
    console.log('Resposta recebida da API da OpenAI');
    
=======
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
    // Retornar a resposta da API
    return response.data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição para a API da OpenAI:', error.response?.data || error.message);
      throw new Error(`Erro ao analisar a imagem: ${error.response?.data?.error?.message || error.message}`);
    } else {
      console.error('Erro ao analisar a imagem:', error);
      throw new Error(`Erro ao analisar a imagem: ${(error as Error).message}`);
    }
  }
}; 