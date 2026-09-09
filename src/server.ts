import "dotenv/config";

import express from "express";

import { userRoutes } from "./routes/user.routes.js";


const app = express();

const port =
  Number(process.env.PORT) || 3000;


// Permite receber JSON
app.use(
  express.json()
);


// Serve os arquivos do frontend
app.use(
  express.static("public")
);


// Rotas da API
app.use(
  "/users",
  userRoutes
);


// Rota de teste
app.get(
  "/api/status",
  (_req, res) => {

    res.json({
      message: "API de usuários funcionando!",
      database: "PostgreSQL",
      endpoints: "/users"
    });

  }
);


// Rota não encontrada
app.use(
  (_req, res) => {

    res
      .status(404)
      .json({
        error: "Rota não encontrada."
      });

  }
);


// Executa listen apenas localmente
if (
  process.env.NODE_ENV !== "production"
) {

  app.listen(
    port,
    () => {

      console.log(
        `Servidor rodando em http://localhost:${port}`
      );

      console.log(
        `Frontend: http://localhost:${port}`
      );

      console.log(
        `API: http://localhost:${port}/users`
      );

    }
  );

}


// Exporta para a Vercel
export default app;