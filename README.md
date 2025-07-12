# Sobriety Compass - Sistema de Acompanhamento de Recuperação

## Project info

**URL**: https://lovable.dev/projects/5e608e5c-879f-44d6-ab45-cfd8b91f71fb

## Visão Geral

O Sobriety Compass é uma aplicação web para acompanhamento de jornadas de recuperação de vícios, oferecendo ferramentas de monitoramento, apoio psicológico e insights sobre progresso.

## Principais Funcionalidades

### 🎯 Dashboard de Progresso
- **Total de Dias Limpos**: Soma de todos os dias de todas as jornadas ativas
- **Melhor Sequência**: Maior streak registrado entre todas as jornadas
- **Dinheiro Economizado**: Cálculo automático baseado no custo diário configurado
- **Jornadas Ativas**: Contador de jornadas em andamento

### 📊 Gráficos e Visualizações
- **Progresso de Streaks**: Comparação entre streak atual e melhor streak
- **Economia Acumulada**: Visualização da economia total por jornada
- **Histórico de Humor**: Tracking do estado emocional ao longo do tempo

### 🤖 Chat IA Integrado
- Assistente de IA para apoio psicológico
- Sistema de conversas individuais com histórico
- **Novas funcionalidades**:
  - ✅ Exclusão individual de conversas
  - ✅ Limpeza completa de conversa (remove do banco de dados)
  - ✅ Criação de novas conversas
  - ✅ Indicação visual da conversa ativa

### 📱 Interface Responsiva
- Design adaptativo para desktop e mobile
- PWA (Progressive Web App) preparado
- Dark/Light mode support

## Arquitetura Técnica

### Frontend
- **React 18** + TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **Recharts** para visualizações
- **TanStack Query** para cache de dados

### Backend
- **Supabase** como Backend-as-a-Service
- **PostgreSQL** como banco de dados
- **Row Level Security (RLS)** para segurança
- **Real-time subscriptions** para atualizações em tempo real

### Estrutura do Banco de Dados

#### Tabelas Principais

**sobriety_records**
- `id`: UUID (chave primária)
- `user_id`: UUID (referência ao usuário)
- `addiction_type_id`: UUID (tipo de vício)
- `start_date`: Data de início da jornada
- `current_streak_days`: Dias limpos atuais
- `best_streak_days`: Melhor sequência já alcançada
- `daily_cost`: Custo diário do vício (para cálculos de economia)
- `is_active`: Se a jornada está ativa
- `total_relapses`: Número total de recaídas
- `motivation_reason`: Razão da motivação
- `personal_goal`: Meta pessoal

**daily_progress** (nova tabela)
- `id`: UUID (chave primária)
- `sobriety_record_id`: UUID (referência à jornada)
- `user_id`: UUID (referência ao usuário)
- `date`: Data do registro
- `day_clean`: Boolean indicando se o dia foi limpo
- `daily_savings`: Economia do dia
- `streak_day`: Dia do streak
- `notes`: Anotações do dia

**chat_conversations**
- `id`: UUID (chave primária)
- `conversation_id`: String identificadora única
- `user_id`: UUID (referência ao usuário)
- `created_at`: Timestamp de criação

**chat_messages**
- `id`: UUID (chave primária)
- `conversation_id`: UUID (referência à conversa)
- `user_id`: UUID (referência ao usuário)
- `role`: 'user' ou 'assistant'
- `content`: Conteúdo da mensagem
- `message_type`: Tipo da mensagem (text, crisis, encouragement)
- `emotion_detected`: Emoção detectada (opcional)
- `crisis_level`: Nível de crise (1-5, opcional)

## Principais Correções Implementadas

### 🔧 Cálculos do Dashboard
- **Corrigido**: Cálculo de "Total de Dias" agora soma corretamente todas as jornadas ativas
- **Corrigido**: "Melhor Sequência" busca o maior valor entre todas as jornadas do usuário
- **Corrigido**: "Dinheiro Economizado" calcula precisamente com base no custo diário × dias limpos
- **Melhorado**: Todos os cálculos são atualizados em tempo real após ações do usuário

### 📊 Gráficos e Visualizações
- **Corrigido**: Gráficos agora refletem dados atualizados após ações (+1 Dia, Recair, etc.)
- **Melhorado**: Dados são filtrados para mostrar apenas jornadas ativas
- **Corrigido**: Problemas de sincronização entre estado e visualização

### 🤖 Chat IA
- **Adicionado**: Funcionalidade de excluir conversas individualmente
- **Corrigido**: Limpeza de conversa agora remove mensagens do banco de dados
- **Melhorado**: Interface com sidebar de conversas e indicação visual da conversa ativa
- **Adicionado**: Botão para criar nova conversa

### 🔄 Sincronização de Dados
- **Melhorado**: Hook `useSobriety` com melhor gestão de estado
- **Adicionado**: Registro automático de progresso diário
- **Corrigido**: Problemas de inconsistência entre frontend e backend

## Como usar localmente

### Pré-requisitos
- Node.js 18+ com npm
- Conta no Supabase (para backend)

### Instalação

```sh
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 4. Execute o servidor de desenvolvimento
npm run dev
```

### Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrations SQL fornecidas no diretório `supabase/migrations/`
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Deploy

### Vercel (Recomendado)
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras plataformas
O projeto é compatível com qualquer plataforma que suporte React/Vite:
- Netlify
- Railway
- Render
- AWS Amplify

## Tecnologias Utilizadas

### Core
- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e desenvolvimento
- **Tailwind CSS** - Framework CSS

### UI/UX
- **Shadcn/ui** - Biblioteca de componentes
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações

### Backend/Database
- **Supabase** - Backend como serviço
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança de dados

### Desenvolvimento
- **ESLint** - Linting
- **Prettier** - Formatação de código
- **Husky** - Git hooks

## Roadmap

### 🔜 Próximas Features
- [ ] Sistema de notificações push
- [ ] Backup automático de dados
- [ ] Modo offline
- [ ] Gamificação avançada
- [ ] Integração com wearables

### 🚀 Melhorias Técnicas
- [ ] Testes automatizados (Vitest + Testing Library)
- [ ] CI/CD pipeline
- [ ] Monitoramento e analytics
- [ ] Performance optimization
- [ ] Auditoria de segurança

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do projeto Lovable.
