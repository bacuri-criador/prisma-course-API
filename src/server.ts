import "dotenv/config";
import express from "express";
import courseRoutes from "./routes/course.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import { prisma } from "./lib/prisma.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3333);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Prisma Course API",
    description: "API acadêmica com Node.js, TypeScript, Prisma e PostgreSQL",
    endpoints: {
      courses: "/courses",
      modules: "/modules",
      health: "/health"
    }
  });
});

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: "ok", database: "connected" });
  } catch {
    return res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.use("/courses", courseRoutes);
app.use("/modules", moduleRoutes);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor." });
});

const server = app.listen(PORT, () => {
  console.log(`API disponível em http://localhost:${PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
