import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listModules(_req: Request, res: Response) {
  const modules = await prisma.module.findMany({
    include: {
      courses: {
        include: { course: true }
      }
    },
    orderBy: { id: "asc" }
  });

  return res.json(modules);
}

export async function getModule(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "ID do módulo inválido." });
  }

  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      courses: {
        include: { course: true }
      }
    }
  });

  if (!module) {
    return res.status(404).json({ message: "Módulo não encontrado." });
  }

  return res.json(module);
}

export async function createModule(req: Request, res: Response) {
  const { title, description, courseIds = [] } = req.body as {
    title?: string;
    description?: string;
    courseIds?: number[];
  };

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "O campo title é obrigatório." });
  }

  if (!Array.isArray(courseIds) || courseIds.some((id) => !Number.isInteger(id))) {
    return res.status(400).json({ message: "courseIds deve ser um array de números inteiros." });
  }

  const module = await prisma.module.create({
    data: {
      title,
      description,
      courses: {
        create: courseIds.map((courseId) => ({
          course: { connect: { id: courseId } }
        }))
      }
    },
    include: {
      courses: {
        include: { course: true }
      }
    }
  });

  return res.status(201).json(module);
}

export async function updateModule(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "ID do módulo inválido." });
  }

  const { title, description, courseIds } = req.body as {
    title?: string;
    description?: string;
    courseIds?: number[];
  };

  const moduleExists = await prisma.module.findUnique({ where: { id } });

  if (!moduleExists) {
    return res.status(404).json({ message: "Módulo não encontrado." });
  }

  const module = await prisma.$transaction(async (tx) => {
    if (Array.isArray(courseIds)) {
      await tx.courseModule.deleteMany({ where: { moduleId: id } });
    }

    return tx.module.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(Array.isArray(courseIds)
          ? {
              courses: {
                create: courseIds.map((courseId) => ({
                  course: { connect: { id: courseId } }
                }))
              }
            }
          : {})
      },
      include: {
        courses: {
          include: { course: true }
        }
      }
    });
  });

  return res.json(module);
}

export async function deleteModule(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "ID do módulo inválido." });
  }

  const module = await prisma.module.findUnique({ where: { id } });

  if (!module) {
    return res.status(404).json({ message: "Módulo não encontrado." });
  }

  await prisma.module.delete({ where: { id } });

  return res.status(204).send();
}
