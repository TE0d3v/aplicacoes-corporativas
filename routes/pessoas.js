import express from "express";
import { getPessoas, createPessoa, updatePessoa, deletePessoa } from "../controllers/pessoa.js";

const router = express.Router();

router.get("/", getPessoas);
router.post("/", createPessoa);
router.put("/:id", updatePessoa);
router.delete("/:id", deletePessoa);

export default router;
