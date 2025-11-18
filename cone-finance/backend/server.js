import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão MongoDB
// NOTE: Use a porta padrão do MongoDB se não estiver usando autenticação
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

// 1. Rota para CADASTRAR 
app.post("/api/usuarios", async (req, res) => {
 try {
  // 🔑 IMPORTANTE: Em um ambiente de produção real, a senha DEVE ser hasheada (ex: com bcrypt) antes de salvar.
  const novoUsuario = new Usuario(req.body);
  await novoUsuario.save();
  res.json({ message: "Usuário cadastrado com sucesso!" });
 } catch (err) {
 console.error("Erro ao cadastrar usuário:", err);
 res.status(400).json({ error: "Erro ao salvar!" });
 }
});

// 2. Rota para LOGIN 
app.post("/api/login", async (req, res) => {
 const { email, senha } = req.body;
 try {
 // 1. Encontrar o usuário pelo email
 const usuario = await Usuario.findOne({ email });
 if (!usuario) {
 return res.status(404).json({ error: "Usuário não encontrado." });
 }

 // 2. Verificar a senha (Simulação: DEVE ser substituído por hash + comparação)
 if (usuario.senha !== senha) {
  return res.status(401).json({ error: "Credenciais inválidas." });
 }

 // 3. Login bem-sucedido
 res.json({ 
  message: "Login realizado com sucesso!",
  userName: usuario.nome 
 });

 } catch (err) {
res.status(500).json({ error: "Erro interno do servidor." });
 }
});


// 3. Rota para BUSCAR DADOS DO USUÁRIO POR EMAIL
app.get('/api/usuario/:email', async (req, res) => {
 // 🔑 CORREÇÃO APLICADA AQUI: Decodifica o email antes de buscar no banco
 const encodedEmail = req.params.email;
 const email = decodeURIComponent(encodedEmail);
 
 try {
  // Busca pelo email DECODIFICADO
  const usuario = await Usuario.findOne({ email: email }).select('-senha'); 

 if (!usuario) {
 // Agora, se a decodificação falhar, o erro "Usuário não encontrado" será retornado
 return res.status(404).json({ error: 'Usuário não encontrado.' });
 }

 // Retorna os dados do usuário (o frontend espera 'data.nome', 'data.sobrenome', etc.)
 res.status(200).json(usuario);

 } catch (err) {
 console.error("Erro no backend ao buscar usuário:", err);
 res.status(500).json({ error: 'Erro interno do servidor.' });
 }
});

// 4. Rota para ATUALIZAR DADOS DO USUÁRIO POR EMAIL
app.put('/api/usuario/:email', async (req, res) => {
 // 🔑 CORREÇÃO APLICADA AQUI: Decodifica o email antes de atualizar no banco
 const encodedEmail = req.params.email;
 const email = decodeURIComponent(encodedEmail);
 
 const { newPassword, ...dadosDeUsuario } = req.body; 
 let updatePayload = { ...dadosDeUsuario };
 // Se uma nova senha foi fornecida, atualiza o campo 'senha' no payload
 if (newPassword) {
 updatePayload.senha = newPassword; // Em produção, hash a newPassword antes!
 }

 try {
 // Atualiza o usuário usando o email DECODIFICADO
 const usuarioAtualizado = await Usuario.findOneAndUpdate(
  { email: email },
  { $set: updatePayload }, 
  { new: true, runValidators: true }
 ).select('-senha'); 

 if (!usuarioAtualizado) {
 return res.status(404).json({ error: 'Usuário não encontrado para atualização.' });
 }

 res.status(200).json({ 
  message: 'Dados do usuário atualizados com sucesso!',
  userEmail: usuarioAtualizado.email 
 });

 } catch (err) {
console.error("Erro no backend ao atualizar usuário:", err);
res.status(500).json({ error: 'Erro ao processar a atualização no servidor.' });
 }
});

// Iniciar servidor
app.listen(3000, () => {
 console.log("Servidor da Cone-Finance rodando com sucesso🚀📊 (Porta 3000)");
});