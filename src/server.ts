import "dotenv/config";
import express from "express";
import { userRoutes } from "./routes/user.routes";

const app = express();
const port = Number(process.env.PORT) || 3000;

// Permite que a API receba JSON no corpo das requisições.
app.use(express.json());

// Disponibiliza os arquivos HTML, CSS e JS da pasta public.
// Ao acessar http://localhost:3000, o Express entrega public/index.html.
app.use(express.static("public"));

// Rotas da API de usuários.
app.use("/users", userRoutes);

// Rota simples para verificar se a API está online sem conflitar com o frontend.
app.get("/api/status", (_req, res) => {
  res.json({
    message: "API de usuários funcionando!",
    database: "PostgreSQL",
    endpoints: "/users"
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Frontend: http://localhost:${port}`);
  console.log(`API: http://localhost:${port}/users`);
});