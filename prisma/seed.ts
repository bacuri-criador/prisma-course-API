import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi definida.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.module.deleteMany();

  const [module1, module2, module3, module4] = await Promise.all([
    prisma.module.create({
      data: {
        title: "Introdução ao Node.js",
        description: "Fundamentos do ambiente Node.js e criação de APIs."
      }
    }),
    prisma.module.create({
      data: {
        title: "TypeScript",
        description: "Tipagem estática, interfaces, tipos e boas práticas."
      }
    }),
    prisma.module.create({
      data: {
        title: "Prisma ORM",
        description: "Modelagem, consultas, relacionamentos e migrations."
      }
    }),
    prisma.module.create({
      data: {
        title: "PostgreSQL e Docker",
        description: "Banco relacional PostgreSQL executado em container Docker."
      }
    })
  ]);

  await prisma.course.create({
    data: {
      title: "Backend com Node.js e Prisma",
      description: "Curso prático para desenvolvimento de APIs com Node.js, TypeScript e Prisma.",
      modules: {
        create: [
          { module: { connect: { id: module1.id } } },
          { module: { connect: { id: module2.id } } },
          { module: { connect: { id: module3.id } } },
          { module: { connect: { id: module4.id } } }
        ]
      }
    }
  });

  await prisma.course.create({
    data: {
      title: "Banco de Dados para Desenvolvedores",
      description: "Conceitos de banco de dados relacionais e integração com aplicações.",
      modules: {
        create: [
          { module: { connect: { id: module3.id } } },
          { module: { connect: { id: module4.id } } }
        ]
      }
    }
  });

  console.log("Seed executado com sucesso!");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
