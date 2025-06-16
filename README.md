# NutrIA - Análise Nutricional Inteligente

NutrIA é uma aplicação web moderna que permite aos usuários analisar o conteúdo nutricional de suas refeições através de fotos. Com uma interface elegante e intuitiva, os usuários podem tirar fotos de seus pratos ou fazer upload de imagens para obter informações nutricionais detalhadas.

## Funcionalidades

- **Autenticação de Usuários**: Sistema completo de login e registro
- **Tela de Boas-vindas**: Interface personalizada com dicas nutricionais
- **Análise de Alimentos**: Captura de fotos via webcam ou upload de imagens
- **Informações Nutricionais**: Visualização detalhada de calorias e nutrientes
- **Design Responsivo**: Interface adaptável para dispositivos móveis e desktop
- **Animações Elegantes**: Transições suaves utilizando Framer Motion

## Tecnologias Utilizadas

- React com TypeScript
- Vite como bundler
- React Router para navegação
- Tailwind CSS para estilização
- Framer Motion para animações
- React Webcam para captura de imagens
- Styled Components para componentes estilizados
<<<<<<< HEAD
- OpenAI API para análise de imagens
=======
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c

## Como Executar

1. Clone este repositório
2. Instale as dependências:
   ```
   npm install
   ```
<<<<<<< HEAD
3. Configure as variáveis de ambiente (veja seção abaixo)
4. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```
5. Acesse a aplicação em `http://localhost:5173`
=======
3. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```
4. Acesse a aplicação em `http://localhost:5173`
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c

## Estrutura do Projeto

- `/src/pages`: Páginas principais da aplicação
- `/src/layouts`: Layouts compartilhados
- `/src/components`: Componentes reutilizáveis
- `/src/assets`: Recursos estáticos
<<<<<<< HEAD
- `/src/services`: Serviços para comunicação com APIs externas

## Configurando a API da OpenAI

Para que a funcionalidade de análise de imagens funcione corretamente, você precisa configurar sua chave da API da OpenAI:

1. Crie uma conta na [OpenAI](https://platform.openai.com/) caso ainda não tenha
2. Obtenha sua chave de API no painel da OpenAI
3. Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:
   ```
   VITE_OPENAI_API_KEY=sua_chave_api_da_openai
   ```

**Importante**: 
- Nunca compartilhe sua chave de API ou inclua o arquivo `.env.local` no controle de versão
- O arquivo `.env.local` já está incluído no `.gitignore` para evitar compartilhamento acidental
- Para o Vite, todas as variáveis de ambiente que devem estar disponíveis no frontend precisam começar com `VITE_`

## Formato de Resposta da API

A API da OpenAI retornará uma análise nutricional no seguinte formato JSON:

=======

## Configurando o .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
API_KEY=sua_chave_api_da_openai
AI_PROMPT="""
Você é Nutria, uma Inteligência Artificial especializada em análise nutricional de refeições a partir de imagens.

**Contexto:**
- Recebe imagens de pratos via front-end (arquivo ou webcam).
- Retorna um JSON contendo:
  - `calorias`: número aproximado de calorias.
  - `macronutrientes`: `{ carboidratos_g, proteinas_g, gorduras_g }`.
  - `micronutrientes` (opcional): vitaminas e minerais principais.
  - `ingredientes_est`. (opcional): lista provável de componentes do prato.
  - `recomendacoes`: sugestões como ajustes, substituições, alertas (ex.: alto teor de sódio).
- Pode utilizar informações do usuário (idade, peso, objetivo) para personalizar recomendações.

**Tarefas da Nutria:**
1. **Analisar** a imagem e identificar alimentos presentes.
2. **Estimar** porções e calcular valores nutricionais.
3. **Gerar recomendações** baseadas no perfil do usuário.
4. Responder com JSON estruturado coerente.

**Formato de resposta (obrigatório):**
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
```json
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
<<<<<<< HEAD
```

## Implantação

Para implantar a aplicação em produção:

1. Crie uma build otimizada:
   ```
   npm run build
   ```
2. O diretório `dist` conterá os arquivos estáticos para implantação
3. Configure as variáveis de ambiente no seu provedor de hospedagem

---

Tecnologia do Grupo Lumina
=======
"""
```

**Importante**: Para o Vite, todas as variáveis de ambiente que devem estar disponíveis no frontend precisam começar com `VITE_`. Por isso, utilizamos `VITE_API_KEY` e `VITE_AI_PROMPT` em vez de `API_KEY` e `AI_PROMPT`.

---
>>>>>>> 596b56b88272d7fa850d6b51d7fcf486161b053c
