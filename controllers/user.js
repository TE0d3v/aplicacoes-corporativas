import { db } from "../db.js"

export const getUsers = (_, res) => {
    const q = "SELECT * FROM tbUsuarios"

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(data)
    })
}

export const signup = (req, res) => {
    const q = "INSERT INTO tbUsuarios(`nome`, `login`, `senha`) VALUES(?)"

    const values = [
        req.body.nome,
        req.body.login,
        req.body.senha,
    ]

    db.query(q, [values], (err) => {
        if (err) return res.status(500).json(err)
        return res.status(201).json("Usuário criado com sucesso.")
    })
}

export const login = (req, res) => {
    const q = "SELECT * FROM tbUsuarios WHERE login = ? AND senha = ?"

    db.query(q, [req.body.login, req.body.senha], (err, data) => {
        if (err) return res.status(500).json(err)
        
        if (data.length > 0) {
            return res.status(200).json({ message: "Login bem-sucedido!", user: data[0] })
        } else {
            return res.status(401).json("email ou senha incorretos.")
        }
    })
}

export const getStats = (_, res) => {
    // Dados fictícios para o Dashboard conforme esperado pelo frontend
    const stats = [
        { label: "Consumo Hoje", value: "42 kWh", color: "text-ws-accent-blue" },
        { label: "Custo Estimado", value: "R$ 124,50", color: "text-ws-accent-amber" },
        { label: "Economia", value: "12%", color: "text-ws-accent-green" },
    ]
    return res.status(200).json(stats)
}

export const updateUser = (req, res) => {
    let q = "UPDATE tbUsuarios SET `nome` = ?, `login` = ?"
    const values = [req.body.nome, req.body.login]

    if (req.body.senha) {
        q += ", `senha` = ?"
        values.push(req.body.senha)
    }

    q += " WHERE `usuario_id` = ?"
    values.push(req.params.id)

    db.query(q, values, (err) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json("Usuário atualizado com sucesso.")
    })
}


export const deleteUser = (req, res) => {
    const q = "DELETE FROM tbUsuarios WHERE `usuario_id` = ?"

    console.log("Tentando excluir usuário com ID:", req.params.id);

    db.query(q, [req.params.id], (err, data) => {
        if (err) {
            console.error("Erro ao excluir usuário no banco:", err);
            return res.status(500).json({ 
                error: "Erro interno no banco de dados.", 
                details: err.message,
                sql: err.sql 
            });
        }
        
        if (data.affectedRows === 0) {
            return res.status(404).json("Usuário não encontrado.");
        }

        return res.status(200).json("Usuário excluído com sucesso.");
    })
}

