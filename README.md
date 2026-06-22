# ConnectUS Quest

ConnectUS Quest é um Mini App gamificado de impacto social. Pessoas completam missões simples, ganham XP, evoluem sua jornada, desbloqueiam conquistas e acompanham o progresso em comunidade.

A experiência principal é simples: missões, XP, níveis, conquistas, comunidade e impacto social. A tecnologia Celo fica nos bastidores para preparar identidade segura, progresso salvo e futuras recompensas sem exigir conhecimento técnico do usuário final.

## Visão do produto

Muitas ações positivas em comunidades, educação e impacto social passam despercebidas. O ConnectUS Quest transforma pequenas ações em progresso visível, ajudando pessoas a criarem hábito, reconhecerem sua evolução e fortalecerem a comunidade.

## Funcionalidades do MVP

- Onboarding mobile-first com escolha de identidade, objetivo e primeira missão.
- Missões de impacto social com XP e estado de conclusão.
- Sistema de níveis, títulos de jornada e progresso visual.
- Conquistas humanas desbloqueáveis.
- Métricas de impacto pessoal.
- Comunidade com ranking leve e inspiracional.
- Perfil com jornada, conquistas e conta segura.
- Persistência local com `localStorage`.
- Login social opcional com Privy.
- Preparação para Celo como infraestrutura discreta.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Privy
- Viem
- Celo
- LocalStorage no MVP

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env.local` na raiz do projeto com:

```bash
NEXT_PUBLIC_PRIVY_APP_ID=SEU_APP_ID_PRIVY
```

Rode o app:

```bash
npm run dev
```

Abra `http://localhost:3000`.

O app continua navegável sem login. Com o App ID configurado, o usuário pode entrar com uma conta social para salvar sua jornada.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | App ID público do Privy usado para entrada social opcional. |

## Status do MVP

Pronto para demonstração e deploy inicial. O produto já comunica impacto social, progresso pessoal e comunidade, mantendo a complexidade técnica invisível para o usuário final.

## Roadmap

- Backend real para perfil persistente.
- Integração com Ready Player Me.
- Avatar por selfie.
- Recompensas futuras com tecnologia Celo.
- Registros verificáveis de conquistas.
- Painel para instituições e comunidades.

## Deploy sugerido na Vercel

1. Conectar o repositório na Vercel.
2. Configurar `NEXT_PUBLIC_PRIVY_APP_ID` nas variáveis de ambiente.
3. Rodar o build.
4. Publicar.
5. Copiar a URL final para `SUBMISSION.md`.

## Observação de produto

A blockchain deve permanecer invisível para o usuário final. A interface usa linguagem humana como conta, jornada, progresso salvo, registro seguro e tecnologia Celo nos bastidores.
