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
- Registro seguro de conquistas no contrato `ConnectUSImpactRegistry` na Celo Mainnet.

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
NEXT_PUBLIC_CONNECTUS_IMPACT_REGISTRY_ADDRESS=0xfB3a03DF68A5dc2ca5474C8198A96B3b5a8Ccb7c
```

Rode o app:

```bash
npm run dev
```

Abra `http://localhost:3000`.

O app continua navegável sem login. Com o App ID configurado, o usuário pode entrar com uma conta social para salvar sua jornada e registrar conquistas seguras.

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
| `NEXT_PUBLIC_CONNECTUS_IMPACT_REGISTRY_ADDRESS` | Endereço público do contrato `ConnectUSImpactRegistry` na Celo Mainnet. Se não for definido, o frontend usa `0xfB3a03DF68A5dc2ca5474C8198A96B3b5a8Ccb7c`. |

## Integração Celo

- O app usa Privy para login social opcional.
- O usuário pode usar o app sem login.
- A Celo aparece como infraestrutura segura nos bastidores.
- O frontend pode registrar conquistas no contrato `ConnectUSImpactRegistry` na Celo Mainnet.
- A função chamada pelo app é `registerImpact(string missionTitle, uint256 xpReward, uint256 userLevel)`.
- O último registro seguro fica salvo no `localStorage` em `connectus_last_celo_record_tx`.
- Não há token próprio nesta etapa.
- Não há pagamento nesta etapa.

Para testar o registro seguro em produção, a conta usada precisa estar na Celo Mainnet e ter saldo suficiente para a taxa da rede.

## Smart Contract

O contrato `ConnectUSImpactRegistry` registra impactos e conquistas como uma camada inicial de prova de impacto na Celo. Ele não é token, não guarda dinheiro, não faz pagamento e não implementa marketplace.

Contrato na Celo Mainnet:

- Endereço: `0xfB3a03DF68A5dc2ca5474C8198A96B3b5a8Ccb7c`
- Explorer: `https://celoscan.io/address/0xfB3a03DF68A5dc2ca5474C8198A96B3b5a8Ccb7c`

O deploy final já foi feito para a submissão no Talent. Os passos abaixo servem apenas para uma futura republicação controlada.

1. Criar `.env.local` na raiz do projeto.
2. Adicionar `PRIVATE_KEY` da conta de deploy.
3. Garantir saldo CELO na conta de deploy.
4. Rodar `npm run compile:contracts`.
5. Rodar `npm run deploy:celo`.
6. Copiar o endereço gerado para `NEXT_PUBLIC_CONNECTUS_IMPACT_REGISTRY_ADDRESS`.
7. Atualizar o `SUBMISSION.md` com endereço e link do explorer.

Nunca commite `.env.local` ou qualquer chave privada real.

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
3. Configurar `NEXT_PUBLIC_CONNECTUS_IMPACT_REGISTRY_ADDRESS`, ou usar o fallback do frontend.
4. Rodar o build.
5. Publicar.
6. Copiar a URL final para `SUBMISSION.md`.

## Observação de produto

A blockchain deve permanecer invisível para o usuário final. A interface usa linguagem humana como conta, jornada, progresso salvo, registro seguro e tecnologia Celo nos bastidores.
