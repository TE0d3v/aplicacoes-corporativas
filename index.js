import express from "express";
import userRoutes from "./routes/users.js";
import imoveisRoutes from "./routes/imoveis.js";
import pessoasRoutes from "./routes/pessoas.js";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", userRoutes)
app.use("/imoveis", imoveisRoutes)
app.use("/pessoas", pessoasRoutes)

const port = process.env.PORT || 8800;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
