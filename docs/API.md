# API Documentation - LimpezaPro

## Base URL
```
https://api.limpezapro.com/api
```

**Informações da empresa**

- Nome: Leidy Cleaner
- Telefone: +55 51 98030-3740
- PIX (chave): 51 98033 0422
- Conta: 000827519788-9
- Agência: 0435

## Authentication
Todas as requisições devem incluir o header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### 1. Agendamentos (Bookings)

#### Criar novo agendamento
```http
POST /bookings
Content-Type: application/json

{
  "date": "2024-02-15T10:00:00",
  "services": [
    { "id": 1, "name": "Limpeza Padrão", "price": 80 }
  ],
  "address": "Rua A, 123, São Paulo",
  "cep": "01001-000",
  "notes": "Apto com 100m²",
  "photos": ["file1.jpg","file2.jpg"],
  "location": { "lat": -23.55052, "lng": -46.633308 },
  "metragem": 100,
  "frequencia": "unica",
  "urgencia": "normal"
}
```

**Response (201):**
```json
{
  "success": true,
  "booking": {
    "id": "abc123",
    "status": "pending",
    "totalPrice": 130,
    "createdAt": "2024-01-30T15:00:00"
  }
}
```

#### Obter agendamentos do usuário
```http
GET /bookings/:userId
```

**Response (200):**
```json
{
  "success": true,
  "bookings": [...]
}
```

#### Atualizar agendamento
```http
PUT /bookings/:bookingId
Content-Type: application/json

{
  "date": "2024-02-16T10:00:00",
  "notes": "Mudou para sexta-feira"
}
```

#### Cancelar agendamento
```http
DELETE /bookings/:bookingId

{
  "reason": "Mudança de planos"
}
```

---

### 2. Pagamentos (Payments)

#### Processar pagamento
```http
POST /payments
Content-Type: application/json

{
  "bookingId": "abc123",
  "amount": 130,
  "paymentMethod": "stripe",
  "token": "tok_visa"
}
```

**Response (200):**
```json
{
  "success": true,
  "transaction": {
    "id": "ch_abc123",
    "status": "succeeded"
  }
}

Nota: Também aceitamos pagamento via PIX usando os dados da empresa (Leidy Cleaner). A resposta ao solicitar `paymentMethod: "pix"` retornará um `pix_key`, `qrCode` e os dados bancários (nome, telefone, conta, agência) para confirmação.
```

#### Obter histórico de pagamentos
```http
GET /payments/:userId
```

---

### 3. Avaliações (Reviews)

#### Criar avaliação
```http
POST /reviews
Content-Type: application/json

{
  "bookingId": "abc123",
  "rating": 5,
  "comment": "Excelente serviço!",
  "photos": ["url1", "url2"]
}
```

#### Obter avaliações públicas
```http
GET /reviews?page=1&limit=10&sort=recent
```

#### Obter estatísticas
```http
GET /reviews/stats
```

---

## Error Handling

### Padrão de erro:
```json
{
  "error": "Mensagem de erro",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Status codes:
- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Exemplo de uso (JavaScript/Fetch)

```javascript
const createBooking = async (booking) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch('https://api.limpezapro.com/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(booking)
  });
  
  return response.json();
};
```

---

## Rate Limiting
- 1000 requisições por hora por IP
- 100 requisições por minuto por usuário autenticado

---

## Webhooks

### Webhook de pagamento aprovado
```http
POST /webhooks/stripe
Content-Type: application/json

{
  "type": "charge.succeeded",
  "data": {
    "object": {
      "id": "ch_abc123",
      "amount": 13000,
      "status": "succeeded"
    }
  }
}
```
