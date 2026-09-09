import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

function parseId(id: string): number | null {
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, age } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Informe um nome válido." });
    }

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return res.status(400).json({ error: "Informe um e-mail válido." });
    }

    if (age !== undefined && (!Number.isInteger(age) || age < 0)) {
      return res.status(400).json({ error: "A idade deve ser um número inteiro positivo." });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: age ?? null
      }
    });

    return res.status(201).json(user);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({ error: "Este e-mail já está cadastrado." });
    }

    console.error(error);
    return res.status(500).json({ error: "Erro interno ao cadastrar usuário." });
  }
}

export async function listUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" }
    });

    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao listar usuários." });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao buscar usuário." });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const { name, email, age } = req.body;

    if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
      return res.status(400).json({ error: "Informe um nome válido." });
    }

    if (email !== undefined && (typeof email !== "string" || !isValidEmail(email))) {
      return res.status(400).json({ error: "Informe um e-mail válido." });
    }

    if (age !== undefined && age !== null && (!Number.isInteger(age) || age < 0)) {
      return res.status(400).json({ error: "A idade deve ser um número inteiro positivo ou null." });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(email !== undefined && { email: email.trim().toLowerCase() }),
        ...(age !== undefined && { age })
      }
    });

    return res.json(user);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({ error: "Este e-mail já está cadastrado." });
    }

    console.error(error);
    return res.status(500).json({ error: "Erro interno ao atualizar usuário." });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao excluir usuário." });
  }
}
