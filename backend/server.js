import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken"; // 💡 CORREÇÃO 1: Importado aqui!
import bcrypt from "bcrypt"; 

const app = express();

// --- CONFIGURAÇÃO INICIAL ---

// Middleware
app.use(cors());
app.use(express.json());

// 🔐 CHAVE SECRETA DO JWT (Use uma chave forte e em variáveis de ambiente!)
// NOTA: Para ambientes de desenvolvimento, você pode usar uma string fixa.
const JWT_SECRET = process.env.JWT_SECRET || "joaogabrielpintomatozinhos";
const SALT_ROUNDS = 10; 

// Conexão MongoDB
const MONGODB_URI = "mongodb://localhost:27017/cone-finance";
mongoose.connect(MONGODB_URI);

// Mensagem de conexão e ERRO DE CONEXÃO
mongoose.connection.once('open', () => {
    console.log("Conectado ao MongoDB com sucesso!");
});
mongoose.connection.on('error', (err) => {
    console.error("❌ ERRO GRAVE NA CONEXÃO COM MONGODB. Verifique se o MongoDB está ativo:", err.message);
});

// --- SCHEMAS E MODELS ---

// Schema do Usuário
const UsuarioSchema = new mongoose.Schema({
    nome: String,
    sobrenome: String,
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    renda: Number,
});
const Usuario = mongoose.model("Usuario", UsuarioSchema);

// Schema da Transação
const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Usuario' },
    tipo: { type: String, required: true, enum: ['entrada', 'saida'] },
    valor: { type: Number, required: true },
    dataHora: { type: Date, default: Date.now },
});
const Transaction = mongoose.model("Transaction", TransactionSchema);

// Schema do Dashboard
const DashboardSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        unique: true,
        ref: 'Usuario'
    },
    layoutConfig: { type: String, default: 'default-layout' },
    periodoVisualizado: { type: String, default: '30dias' },
}, { timestamps: true });

const Dashboard = mongoose.model("Dashboard", DashboardSchema);

// --- MIDDLEWARE ---

// MIDDLEWARE DE AUTENTICAÇÃO REAL (JWT)
const authMiddleware = (req, res, next) => {
    // 1. Tenta extrair o token do cabeçalho 'Authorization'
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Erro 401: Cabeçalho de Autorização ausente ou mal formatado.');
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verifica o token usando a mesma chave secreta
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Se for válido, anexa o ID do usuário à requisição
        // 🚨 O ID do usuário é armazenado como req.userId (usado nas rotas)
        req.userId = decoded.userId; 
        next(); // Continua para a próxima função da rota
    } catch (error) {
        // Captura e trata erros comuns de JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado.' });
        }
        if (error.name === 'JsonWebTokenError') {
            console.log('Erro de Token JWT:', error.message);
            return res.status(401).json({ error: 'Token inválido.' });
        }
        // Erro genérico
        return res.status(401).json({ error: 'Não autorizado.' });
    }
};

// --- ROTAS GERAIS ---
// 💡 Rota de teste para verificar se o servidor está ativo
app.get('/', (req, res) => {
    res.status(200).send('Servidor Cone-Finance está ativo na porta 3000!');
});

// --- ROTAS DE USUÁRIO ---

// 1. Rota para CADASTRAR 
app.post("/api/usuarios", async (req, res) => {
    try {
        const { nome, sobrenome, email, senha, renda } = req.body;
        
        // CRUCIAL: Hashing da senha antes de salvar
        const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);
        
        const novoUsuario = new Usuario({
            nome,
            sobrenome,
            email,
            senha: hashedPassword, 
            renda
        });
        
        await novoUsuario.save();
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        if (err.code === 11000) { 
            return res.status(409).json({ error: "E-mail já cadastrado." });
        }
        console.error("❌ Erro ao cadastrar usuário:", err);
        res.status(400).json({ error: "Erro ao cadastrar usuário.", details: err.message });
    }
});

// 2. Rota para LOGIN 
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ message: 'E-mail não encontrado.' });
        }

        // Compara a senha fornecida com o hash salvo
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        // 🏆 SUCESSO: Gera o Token JWT e inclui o ID do usuário
        const token = jwt.sign(
            { userId: usuario._id }, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        res.status(200).json({ 
            message: 'Login bem-sucedido', 
            token: token,
            userName: usuario.nome 
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor durante o login.' });
    }
});


// 3. Rota para BUSCAR DADOS DO USUÁRIO POR EMAIL
app.get('/api/usuario/:email', async (req, res) => {
    const encodedEmail = req.params.email;
    const email = decodeURIComponent(encodedEmail);
    
    try {
        const usuario = await Usuario.findOne({ email: email }).select('-senha'); 

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.status(200).json(usuario);

    } catch (err) {
        console.error("❌ Erro no backend ao buscar usuário:", err);
        res.status(500).json({ error: 'Erro interno do servidor. Consulte o log do servidor para detalhes.' });
    }
});

// 4. Rota para ATUALIZAR DADOS DO USUÁRIO POR EMAIL
app.put('/api/usuario/:email', async (req, res) => {
    const encodedEmail = req.params.email;
    const email = decodeURIComponent(encodedEmail);
    
    const { newPassword, ...dadosDeUsuario } = req.body; 
    let updatePayload = { ...dadosDeUsuario };
    
    try {
        // Se a senha foi alterada, faça o hash
        if (newPassword) {
            updatePayload.senha = await bcrypt.hash(newPassword, SALT_ROUNDS);
        }

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
        console.error("❌ Erro no backend ao atualizar usuário:", err);
        res.status(500).json({ error: 'Erro ao processar a atualização no servidor.' });
    }
});


// --- ROTAS DE TRANSAÇÃO ---

// 5. Rota para CADASTRAR NOVA TRANSAÇÃO (POST /api/transacoes)
app.post('/api/transacoes', authMiddleware, async (req, res) => { 
    const { tipo, valor, dataHora } = req.body;
    const userId = req.userId; // <-- ID OBTIDO CORRETAMENTE PELO TOKEN

    if (!tipo || !valor) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }

    try {
        const novaTransacao = new Transaction({
            userId: userId, 
            tipo,
            valor,
            dataHora: dataHora || new Date()
        });

        const transacaoSalva = await novaTransacao.save();
        res.status(201).json(transacaoSalva);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar transação.', details: error.message });
    }
});

// 6. Rota para BUSCAR todas as transações do usuário logado
app.get('/api/transacoes', authMiddleware, async (req, res) => { 
    const userId = req.userId; // <-- ID OBTIDO CORRETAMENTE PELO TOKEN
    
    try {
        const transacoes = await Transaction.find({ userId: userId }).sort({ dataHora: -1 });
        res.status(200).json(transacoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar transações.', details: error.message });
    }
});

// --- ROTAS DE DASHBOARD ---

// 7. Rota para BUSCAR o Dashboard do Usuário
app.get("/api/dashboard", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // 💡 Deve ser req.userId
        
        let dashboard = await Dashboard.findOne({ userId: userId });

        if (!dashboard) {
             dashboard = new Dashboard({ userId: userId });
             await dashboard.save();
        }
        
        res.status(200).json(dashboard);

    } catch (error) {
        console.error("❌ Erro ao buscar dashboard:", error.message);
        res.status(500).json({ message: "Falha ao buscar configurações do dashboard", error: error.message });
    }
});

// 8. Rota para SALVAR/ATUALIZAR o Dashboard do Usuário
app.put("/api/dashboard", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // 💡 Deve ser req.userId
        const updatePayload = req.body; 

        const dashboardAtualizado = await Dashboard.findOneAndUpdate(
            { userId: userId },
            { $set: updatePayload }, 
            { new: true, upsert: true }
        );
        
        res.status(200).json({ 
            message: "Configurações do Dashboard salvas com sucesso!",
            dashboard: dashboardAtualizado
        });

    } catch (error) {
        console.error("❌ Erro ao salvar dashboard:", error.message);
        res.status(500).json({ message: "Falha ao salvar configurações do dashboard", error: error.message });
    }
});


// --- INICIAR SERVIDOR ---

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor da Cone-Finance rodando com sucesso🚀📊 (Porta ${PORT})`);
});