import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão MongoDB
mongoose.connect("mongodb://localhost:27017/financas", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const UsuarioSchema = new mongoose.Schema({
  nome: String,
  sobrenome: String,
  email: String,
  senha: String,
  renda: Number,
});

// Model
const Usuario = mongoose.model("Usuario", UsuarioSchema);

// 1. Rota para CADASTRAR (URL CORRIGIDA para /api/usuarios)
app.post("/api/usuarios", async (req, res) => {
  try {
    const novoUsuario = new Usuario(req.body);
    await novoUsuario.save();
    res.json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao salvar!" });
  }
});

// 2. Rota para LOGIN (Implementação de autenticação e retorno do nome)
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    // 1. Encontrar o usuário pelo email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // 2. Verificar a senha (Lembrete: Usar bcrypt/hash em produção!)
    if (usuario.senha !== senha) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 3. Login bem-sucedido
    res.json({ 
        message: "Login realizado com sucesso!",
        // 🚀 CORRIGIDO: Retorna o nome do usuário do banco de dados
        userName: usuario.nome 
    });

  } catch (err) {
    // Erro de servidor ou de conexão com o banco
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});
app.get('/api/usuario/:email', async (req, res) => {
    const email = req.params.email; // Pega o email da URL
    try {
        // Supondo que você tenha um modelo 'Usuario' do Mongoose
        const usuario = await Usuario.findOne({ email: email }).select('-senha'); 
        // .select('-senha') evita retornar a senha (boa prática de segurança)

        if (!usuario) {
            // Retorna 404 se não encontrar
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Retorna os dados do usuário (o frontend espera 'data.nome', 'data.sobrenome', etc.)
        res.status(200).json(usuario);

    } catch (err) {
        console.error("Erro no backend ao buscar usuário:", err);
        // Retorna 500 para erro interno do servidor
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});
// Exemplo de rota PUT em Express/Node.js para atualizar usuário por email
app.put('/api/usuario/:email', async (req, res) => {
    const email = req.params.email; // Pega o email da URL
    const dadosAtualizados = req.body; // Pega o payload (nome, senha, renda, etc.)

    try {
        // Lógica de atualização (Exemplo com Mongoose):
        const usuarioAtualizado = await Usuario.findOneAndUpdate(
            { email: email },
            { $set: dadosAtualizados }, // Use $set ou monte o objeto de atualização
            { new: true, runValidators: true }
        ).select('-senha'); // Retorna o objeto atualizado, sem a senha

        if (!usuarioAtualizado) {
            return res.status(404).json({ error: 'Usuário não encontrado para atualização.' });
        }

        // 🚨 O PONTO CRÍTICO: Retornar uma resposta JSON de sucesso
        res.status(200).json({ 
            message: 'Dados do usuário atualizados com sucesso!',
            userEmail: usuarioAtualizado.email // Útil caso o email tenha mudado
        });

    } catch (err) {
        console.error("Erro no backend ao atualizar usuário:", err);
        res.status(500).json({ error: 'Erro ao processar a atualização no servidor.' });
    }
});
// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor da Cone-Finance rodando com sucesso🚀📊");
});