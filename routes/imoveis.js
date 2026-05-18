import express from "express";
import { getImoveis, createImovel, updateImovel, deleteImovel } from "../controllers/imovel.js";

const router = express.Router();

router.get("/", getImoveis);
router.post("/", createImovel);
router.put("/:id", updateImovel);
router.delete("/:id", deleteImovel);

export default router;
