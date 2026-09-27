import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listCourses(_req: Request, res: Response) {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: { module: true }
      }
    },
    orderBy: { id: "asc" }
  });

  return res.json(courses);
}

export async function getCourse(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "ID do curso inválido." });
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: { module: true }
      }
    }
  });

  if (!course) {
    return res.status(404).json({ message: "Curso não encontrado." });
  }

  return res.json(course);
}

export async function createCourse(req: Request, res: Response) {
  const { title, description, moduleIds = [] } = req.body as {
    title?: string;
    description?: string;
    moduleIds?: number[];
  };

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "O campo title é obrigatório." });
  }

  if (!Array.isArray(moduleIds) || moduleIds.some((id) => !Number.isInteger(id))) {
    return res.status(400).json({ message: "moduleIds deve ser um array de números inteiros." });
  }

  const course = await prisma.course.create({
    data: {
      title,
      description,
      modules: {
        create: moduleIds.map((moduleId) => ({
          module: { connect: { id: moduleId } }
        }))
      }
    },
    include: {
      modules: {
        include: { module: true }
      }
    }
  });

  return res.status(201).json(course);
}

export async function updateCourse(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "ID do curso inválido." });
  }

  const { title, description, moduleIds } = req.body as {
    title?: string;
    description?: string;
    moduleIds?: number[];
  };

  const courseExists = await prisma.course.findUnique({ where: { id } });

  if (!courseExists) {
    return res.status(404).json({ message: "Curso não encontrado." });
  }

  const course = await prisma.$transaction(async (tx) => {
    if (Array.isArray(moduleIds)) {
      await tx.courseModule.deleteMany({ where: { courseId: id } });
    }

    return tx.course.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(Array.isArray(moduleIds)
          ? {
              modules: {
                create: moduleIds.map((moduleId) => ({
                  module: { connect: { id: moduleId } }
                }))
              }
            }
          : {})
      },
      include: {
        modules: {
          include: { module: true }
        }
      }
    });
  });

  return res.json(course);
}

export async function deleteCourse(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "ID do curso inválido." });
  }

  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) {
    return res.status(404).json({ message: "Curso não encontrado." });
  }

  await prisma.course.delete({ where: { id } });

  return res.status(204).send();
}
