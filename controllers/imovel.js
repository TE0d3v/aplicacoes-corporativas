import { db } from "../db.js";

// READ - Listar todos os imóveis
export const getImoveis = async (req, res) => {
    try {
        const q = "SELECT * FROM tblimovel";
        db.query(q, (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).json(data);
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
};

// CREATE - Criar novo imóvel
export const createImovel = async (req, res) => {
    // O ID do usuário será recebido automaticamente pelo header 'x-user-id'
    const usuarioId = req.headers['x-user-id'] || 1;

    try {
        // Utilizamos CURRENT_TIMESTAMP para preencher a data no momento da inserção
        const q = `
            INSERT INTO tblimovel 
            (endereco, valor, area, proprietario_id, imovel_tipo_id, atualizado_por, atualizado_em) 
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        const values = [
            req.body.endereco,
            req.body.valor,
            req.body.area,
            req.body.proprietario_id, // Recebido explicitamente do corpo
            req.body.imovel_tipo_id,
            usuarioId // Usuário logado que realizou a ação
        ];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(201).json({ message: "Imóvel cadastrado com sucesso.", id: data.insertId });
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
};

// UPDATE - Atualizar dados do imóvel
export const updateImovel = async (req, res) => {
    // Na atualização, capturamos o ID de quem está editando para manter o registro
    const usuarioId = req.headers['x-user-id'] || 1;

    try {
        // Atualiza os dados e define atualizado_em para a data/hora atual
        const q = `
            UPDATE tblimovel 
            SET endereco = ?, valor = ?, area = ?, proprietario_id = ?, imovel_tipo_id = ?, atualizado_por = ?, atualizado_em = CURRENT_TIMESTAMP
            WHERE imovel_id = ?
        `;

        const values = [
            req.body.endereco,
            req.body.valor,
            req.body.area,
            req.body.proprietario_id,
            req.body.imovel_tipo_id,
            usuarioId, // Registrado automaticamente
            req.params.id
        ];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            if (data.affectedRows === 0) return res.status(404).json({ error: "Imóvel não encontrado." });
            return res.status(200).json({ message: "Imóvel atualizado com sucesso." });
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
};

// DELETE - Remover imóvel
export const deleteImovel = async (req, res) => {
    try {
        const q = "DELETE FROM tblimovel WHERE imovel_id = ?";

        db.query(q, [req.params.id], (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            if (data.affectedRows === 0) return res.status(404).json({ error: "Imóvel não encontrado." });
            return res.status(200).json({ message: "Imóvel excluído com sucesso." });
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
};
