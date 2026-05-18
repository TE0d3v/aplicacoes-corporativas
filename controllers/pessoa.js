import { db } from "../db.js"

export const getPessoas = (_, res) => {
    const q = "SELECT * FROM tbPessoas"

    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar pessoas:", err)
            return res.status(500).json({ error: "Erro ao buscar pessoas.", details: err.message })
        }
        return res.status(200).json(data)
    })
}

export const createPessoa = (req, res) => {
    const usuarioId = req.headers['x-user-id'] || 1;
    const q = "INSERT INTO tbPessoas(`nome`, `cpf`, `nascimento`, `telefone`, `pessoa_tipo_id`, `atualizado_por`, `atualizado_em`) VALUES(?)"

    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.nascimento,
        req.body.telefone,
        req.body.pessoa_tipo_id,
        usuarioId,
        new Date() // atualizado_em
    ]

    db.query(q, [values], (err) => {
        if (err) {
            console.error("Erro ao criar pessoa:", err)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "CPF já cadastrado no sistema." })
            }
            if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
                return res.status(400).json({ error: "Erro de referência (FK): " + err.message })
            }
            return res.status(500).json({ error: "Erro interno no servidor.", details: err.message })
        }
        return res.status(201).json("Pessoa cadastrada com sucesso.")
    })
}

export const updatePessoa = (req, res) => {
    const usuarioId = req.headers['x-user-id'] || 1;
    const q = "UPDATE tbPessoas SET `nome` = ?, `cpf` = ?, `nascimento` = ?, `telefone` = ?, `pessoa_tipo_id` = ?, `atualizado_por` = ?, `atualizado_em` = ? WHERE `pessoa_id` = ?"

    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.nascimento,
        req.body.telefone,
        req.body.pessoa_tipo_id,
        usuarioId,
        new Date(), // atualizado_em
    ]

    db.query(q, [...values, req.params.id], (err, data) => {
        if (err) {
            console.error("Erro ao atualizar pessoa:", err)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "CPF já cadastrado por outra pessoa." })
            }
            if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
                return res.status(400).json({ error: "Erro de referência (FK): " + err.message })
            }
            return res.status(500).json({ error: "Erro interno no servidor.", details: err.message })
        }

        if (data.affectedRows === 0) {
            return res.status(404).json("Pessoa não encontrada.")
        }

        return res.status(200).json("Pessoa atualizada com sucesso.")
    })
}

export const deletePessoa = (req, res) => {
    const q = "DELETE FROM tbPessoas WHERE `pessoa_id` = ?"

    db.query(q, [req.params.id], (err, data) => {
        if (err) {
            console.error("Erro ao excluir pessoa:", err)
            if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
                return res.status(400).json({ error: "Não é possível excluir esta pessoa pois ela está vinculada a um imóvel." })
            }
            return res.status(500).json({ error: "Erro interno no servidor.", details: err.message })
        }

        if (data.affectedRows === 0) {
            return res.status(404).json("Pessoa não encontrada.")
        }

        return res.status(200).json("Pessoa excluída com sucesso.")
    })
}
