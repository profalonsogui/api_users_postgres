import "dotenv/config";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { userRoutes } from "./routes/user.routes.js";

const app = express();

const port =
  Number(process.env.PORT) || 3000;


// Caminho absoluto da pasta public
const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const publicPath =
  path.join(
    __dirname,
    "../public"
  );


// JSON
app.use(
  express.json()
);


// Arquivos estáticos
app.use(
  express.static(publicPath)
);


// API
app.use(
  "/users",
  userRoutes
);


// Status
app.get(
  "/api/status",
  (_req, res) => {

    res.json({
      message:
        "API de usuários funcionando!",
      database:
        "PostgreSQL",
      endpoints:
        "/users"
    });

  }
);


// Frontend
app.get(
  "/",
  (_req, res) => {

    res.sendFile(
      path.join(
        publicPath,
        "index.html"
      )
    );

  }
);


// 404
app.use(
  (_req, res) => {

    res
      .status(404)
      .json({
        error:
          "Rota não encontrada."
      });

  }
);


// Local
if (
  process.env.NODE_ENV
  !== "production"
) {

  app.listen(
    port,
    () => {

      console.log(
        `Servidor rodando em http://localhost:${port}`
      );

    }
  );

}


export default app;