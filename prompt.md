---
  Você é um engenheiro frontend sênior. Sua tarefa é integrar o frontend com uma API REST já existente em NestJS. 

  ---

  # HEALTH ANSWERS (Perguntas iniciais sobre saúde do veículo)

  Usado quando o usuário não tem histórico de manutenções e responde perguntas sobre o estado atual do carro.     

  ## POST /vehicles/:vehicleId/health-answers
  Faz upsert das respostas (substitui se já existir para aquele tipo).

  Body:
  {
    answers: [
      {
        type: string,    // um dos tipos abaixo ↓
        answer: string   // um dos valores abaixo ↓
      }
    ]
  }

  Tipos aceitos (type):
  - "engine_oil"
  - "brakes"
  - "tires"
  - "timing_belt"
  - "cooling_system"

  Valores aceitos (answer):
  - "recent"       → feito recentemente
  - "while"        → faz um tempo
  - "over_year"    → faz mais de um ano
  - "never"        → nunca fez / não sabe
  - "no_timing_belt" → veículo não tem correia dentada (apenas para type = "timing_belt")

  O backend converte as respostas em km e datas estimadas automaticamente usando o odômetro atual do veículo.     

  ## GET /vehicles/:vehicleId/health-answers
  Retorna todas as respostas salvas do veículo.

  Resposta: array de:
  {
    id: string,
    vehicleId: string,
    type: string,
    answer: string,
    estimatedKm: number | null,
    estimatedDate: string | null,
    createdAt: string,
    updatedAt: string
  }

  # REPORTS

  ## GET /reports/vehicle/:id
  Retorna relatório de manutenções do veículo com estatísticas.

  # FLUXO SUGERIDO

  1. Quando o usuário adicionar um veiculo deve aparecer o modal das perguntas

  ---