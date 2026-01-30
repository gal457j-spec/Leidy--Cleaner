/**
 * Chatbot Service
 * Processamento de linguagem natural e respostas automáticas
 */

class ChatbotService {
  constructor() {
    this.intents = require('./intents.json').intents;
  }

  /**
   * Processar mensagem do usuário
   */
  async processMessage(userMessage) {
    try {
      // Normalizar mensagem
      const normalized = userMessage.toLowerCase().trim();

      // Buscar intent correspondente
      const intent = this.findMatchingIntent(normalized);

      if (!intent) {
        return {
          response: 'Desculpa, não entendi. Pode reformular a pergunta?',
          confidence: 0,
        };
      }

      // Gerar resposta
      const response = await this.generateResponse(intent);

      return {
        response,
        intent: intent.name,
        confidence: 1.0,
      };
    } catch (error) {
      console.error('Erro no chatbot:', error);
      return {
        response: 'Ocorreu um erro. Por favor, tente novamente.',
        confidence: 0,
      };
    }
  }

  /**
   * Encontrar intent que corresponde
   */
  findMatchingIntent(message) {
    for (const intent of this.intents) {
      for (const pattern of intent.patterns) {
        if (message.includes(pattern.toLowerCase())) {
          return intent;
        }
      }
    }
    return null;
  }

  /**
   * Gerar resposta contextual
   */
  async generateResponse(intent) {
    let response = intent.response;

    // Adicionar contexto específico conforme necessário
    if (intent.name === 'schedule_cleaning') {
      response += '\n\nTemos os seguintes serviços:\n';
      response += '1. Limpeza Padrão - R$ 80\n';
      response += '2. Limpeza Profunda - R$ 120\n';
      response += '3. Limpeza de Mudança - R$ 150';
    }

    return response;
  }

  /**
   * Conversa com contexto
   */
  async conversationFlow(message, context = {}) {
    const result = await this.processMessage(message);

    // Manter histórico de conversa
    if (!context.history) {
      context.history = [];
    }

    context.history.push({
      user: message,
      bot: result.response,
      intent: result.intent,
    });

    return {
      ...result,
      context,
    };
  }
}

module.exports = new ChatbotService();
