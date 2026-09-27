# Prisma Course API

Projeto prático desenvolvido para a atividade de **Prisma ORM**, utilizando **Node.js, TypeScript, Prisma ORM, PostgreSQL e Docker**.

O projeto demonstra a modelagem de cursos e módulos com relacionamento **muitos-para-muitos (N:N)** por meio da tabela intermediária `CourseModule`.

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM 7.10
- PostgreSQL 16
- Docker e Docker Compose
- Prisma Migrate

## Estrutura do projeto

```text
prisma-course-api/
├── prisma/
│   ├── migrations/
│   │   └── 20260927180000_init/
│   │       └── migration.sql
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── controllers/
│   │   ├── course.controller.ts
│   │   └── module.controller.ts
│   ├── lib/
│   │   └── prisma.ts
│   ├── routes/
│   │   ├── course.routes.ts
│   │   └── module.routes.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── prisma.config.ts
├── README.md
└── tsconfig.json
```

## Modelo de dados

```text
Course 1 --- N CourseModule N --- 1 Module
```

Cada curso pode possuir vários módulos e cada módulo pode participar de vários cursos.

### Entidades

**Course**
- `id`
- `title`
- `description`
- `createdAt`
- `updatedAt`

**Module**
- `id`
- `title`
- `description`
- `createdAt`
- `updatedAt`

**CourseModule**
- `courseId`
- `moduleId`

A chave primária composta de `CourseModule` evita a criação da mesma associação duas vezes.

## Pré-requisitos

Instale:

- Node.js 20.19+ ou superior
- Docker Desktop
- Git

## 1. Instalação

Clone o repositório e entre na pasta:

```bash
git clone SEU_REPOSITORIO_AQUI
cd prisma-course-api
```

Instale as dependências:

```bash
npm install
```

## 2. Configuração do ambiente

Copie o arquivo `.env.example` para `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

O conteúdo padrão é:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prisma_courses?schema=public"
PORT=3333
```

## 3. Inicie o PostgreSQL com Docker

```bash
docker compose up -d
```

Confira o container:

```bash
docker compose ps
```

## 4. Gere o Prisma Client

```bash
npm run db:generate
```

## 5. Execute as migrations

Para criar/aplicar a estrutura do banco em desenvolvimento:

```bash
npm run db:migrate -- --name init
```

O projeto já contém uma migration inicial versionada em `prisma/migrations`.

Em um ambiente em que a migration já está criada e apenas precisa ser aplicada:

```bash
npm run db:deploy
```

## 6. Popule o banco

```bash
npm run db:seed
```

O seed cria cursos e módulos e demonstra o relacionamento N:N.

## 7. Execute a API

Modo desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3333
```

## Endpoints

### Cursos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/courses` | Lista cursos com módulos |
| GET | `/courses/:id` | Busca um curso |
| POST | `/courses` | Cria um curso |
| PUT | `/courses/:id` | Atualiza um curso |
| DELETE | `/courses/:id` | Remove um curso |

### Módulos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/modules` | Lista módulos com cursos |
| GET | `/modules/:id` | Busca um módulo |
| POST | `/modules` | Cria um módulo |
| PUT | `/modules/:id` | Atualiza um módulo |
| DELETE | `/modules/:id` | Remove um módulo |

### Health check

```text
GET /health
```

Retorna o status da API e da conexão com PostgreSQL.

## Exemplos de requisições

### Criar módulo

```json
{
  "title": "REST APIs",
  "description": "Construção de APIs REST com Node.js"
}
```

### Criar curso com módulos

```json
{
  "title": "Desenvolvimento Backend",
  "description": "Curso completo de backend",
  "moduleIds": [1, 2, 3]
}
```

### Atualizar curso e seus módulos

```json
{
  "title": "Desenvolvimento Backend com Prisma",
  "moduleIds": [1, 3, 4]
}
```

## Prisma Studio

Para visualizar as tabelas graficamente:

```bash
npm run db:studio
```

## Comandos úteis

```bash
npm run dev
npm run build
npm start
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:studio
npm run db:reset
npm run check
```

## Como publicar no GitHub

Crie um repositório público no GitHub e depois execute:

```bash
git init
git add .
git commit -m "feat: create Prisma Course API"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/prisma-course-api.git
git push -u origin main
```

> Não publique o arquivo `.env`. Ele está no `.gitignore`. O arquivo `.env.example` serve apenas como modelo.

## Objetivo acadêmico

O projeto atende ao desafio proposto no fórum ao demonstrar:

1. Criação de uma aplicação Node.js com TypeScript.
2. Utilização do Prisma ORM.
3. Modelagem de `Course` e `Module`.
4. Implementação de relacionamento N:N com `CourseModule`.
5. Uso do Prisma Migrate.
6. Substituição do SQLite por PostgreSQL.
7. Execução do PostgreSQL em container Docker.
8. Operações de criação, consulta, atualização e exclusão.
9. Seed para popular o banco com dados de demonstração.

## Resposta sugerida para o fórum

Durante o desenvolvimento do projeto utilizando Node.js, TypeScript, Prisma ORM, PostgreSQL e Docker, uma das principais dificuldades foi configurar corretamente a conexão entre a aplicação e o banco de dados PostgreSQL executado em um container Docker. Também foi necessário compreender o funcionamento do Prisma Migrate e a definição do relacionamento muitos-para-muitos entre as entidades `Course` e `Module`.

Outro ponto importante foi a adaptação da estrutura para utilizar PostgreSQL em vez de SQLite, principalmente na configuração da variável `DATABASE_URL`, no Docker Compose e na execução das migrations.

Na minha visão, utilizar um ORM como o Prisma é importante porque facilita a comunicação entre a aplicação e o banco de dados, permitindo trabalhar com os dados de maneira mais organizada e com tipagem. O Prisma também facilita a criação e o controle das migrations, a definição dos relacionamentos e a realização de consultas, reduzindo código repetitivo e contribuindo para a manutenção do projeto.

O uso conjunto do Prisma com PostgreSQL e Docker também torna o ambiente de desenvolvimento mais padronizado e facilita a reprodução do projeto em outras máquinas.

**Repositório:**

`COLE AQUI O LINK DO SEU REPOSITÓRIO NO GITHUB`

## Licença

Este projeto foi desenvolvido para fins acadêmicos.
