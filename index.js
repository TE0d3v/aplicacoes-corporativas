import express from "express";
import userRoutes from "./routes/users.js";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", userRoutes)

const port = process.env.PORT || 8800;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
