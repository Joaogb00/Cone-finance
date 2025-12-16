import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcrypt"; 

const app = express();

// --- CONFIGURAÇÃO INICIAL ---
app.use(cors({
    origin: '*', // Permite qualquer origem (para desenvolvimento)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permite todos os métodos HTTP necessários
    allowedHeaders: ['Content-Type', 'Authorization'], // Permite o Content-Type e o Token JWT (Authorization)
}));
app.use(express.json());

// É altamente recomendável armazenar o JWT_SECRET em variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || "joaogabrielpintomatozinhos";
const SALT_ROUNDS = 10; 

const MONGODB_URI = "mongodb://localhost:27017/cone-finance";
mongoose.connect(MONGODB_URI);

mongoose.connection.once('open', () => {
    console.log("Conectado ao MongoDB com sucesso!");
});
mongoose.connection.on('error', (err) => {
    console.error("❌ ERRO GRAVE NA CONEXÃO COM MONGODB. Verifique se o MongoDB está ativo:", err.message);
});

// --- SCHEMAS E MODELS (Mantidos) ---
const UsuarioSchema = new mongoose.Schema({
    nome: String,
    sobrenome: String,
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    renda: Number,
});
const Usuario = mongoose.model("Usuario", UsuarioSchema);

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Usuario' },
    tipo: { type: String, required: true, enum: ['entrada', 'saida'] },
    valor: { type: Number, required: true },
    dataHora: { type: Date, default: Date.now },
});
const Transaction = mongoose.model("Transaction", TransactionSchema);

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

// --- MIDDLEWARE (Mantido) ---
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; 
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado.' });
        }
        return res.status(401).json({ error: 'Token inválido ou não autorizado.' });
    }
};

// --- ROTAS GERAIS ---
app.get('/', (req, res) => {
    res.status(200).send('Servidor Cone-Finance está ativo na porta 3000!');
});

// --- ROTAS DE USUÁRIO ---
// 1. Rota para CADASTRAR 
app.post("/api/usuarios", async (req, res) => {
    try {
        let { nome, sobrenome, email, senha, renda } = req.body;
        email = email.trim().toLowerCase(); // Limpa e força e-mail para minúsculo
        
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
        res.status(400).json({ error: "Erro ao cadastrar usuário.", details: err.message });
    }
});

// 2. Rota para LOGIN (Com correção de case/trim e inclusão do userId)
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const cleanEmail = email.trim().toLowerCase(); 
        const usuario = await Usuario.findOne({ email: cleanEmail }); 
        
        if (!usuario) {
            return res.status(404).json({ message: 'E-mail não encontrado.' });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        const token = jwt.sign(
            { userId: usuario._id }, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        // 🚀 CORREÇÃO APLICADA AQUI: INCLUÍDO userId na resposta
        res.status(200).json({ 
            message: 'Login bem-sucedido', 
            token: token,
            userName: usuario.nome,
            userId: usuario._id // <-- AGORA O FRONTEND PODE SALVAR ESTE ID
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor durante o login.' });
    }
});

// 3. Rota para BUSCAR USUÁRIO LOGADO (NOVA ROTA MELHORADA E PROTEGIDA)
app.get('/api/me', authMiddleware, async (req, res) => {
    try {
        // Busca o usuário usando o ID do token, excluindo o campo 'senha'
        const usuario = await Usuario.findById(req.userId).select('-senha'); 
        
        if (!usuario) {
            // Este caso só acontece se o token tiver um ID que não existe mais
            return res.status(404).json({ error: 'Dados do usuário não encontrados.' });
        }

        res.status(200).json(usuario);
        
    } catch (error) {
        console.error("Erro ao buscar dados do usuário logado:", error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// 4. Rota para ATUALIZAR USUÁRIO (Ajustada para usar o ID do token)
app.put('/api/usuario', authMiddleware, async (req, res) => { 
    const userId = req.userId; // Obtido do token
    const { nome, sobrenome, email, renda, newPassword } = req.body;

    try {
        const updates = { 
            nome, 
            sobrenome, 
            email: email.trim().toLowerCase(), 
            renda 
        };

        if (newPassword && newPassword.length > 0) {
            updates.senha = await bcrypt.hash(newPassword, SALT_ROUNDS);
        }

        const usuarioAtualizado = await Usuario.findByIdAndUpdate(userId, updates, { new: true }).select('-senha');

        if (!usuarioAtualizado) {
            return res.status(404).json({ error: 'Usuário não encontrado para atualização.' });
        }

        // Se o e-mail foi alterado, o frontend deve atualizar o localStorage
        res.status(200).json({ message: "Dados atualizados com sucesso!", usuario: usuarioAtualizado });

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        if (error.code === 11000) {
             return res.status(409).json({ error: "E-mail já cadastrado por outro usuário." });
        }
        res.status(500).json({ error: 'Erro ao atualizar dados.' });
    }
});


// 5. ROTAS DE TRANSAÇÃO (Mantidas)
app.post('/api/transacoes', authMiddleware, async (req, res) => { 
    const { tipo, valor, dataHora } = req.body;
    const userId = req.userId; 

    if (!tipo || !valor) {
        return res.status(400).json({ error: 'Dados incompletos (tipo ou valor faltando).' });
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

app.get('/api/transacoes', authMiddleware, async (req, res) => { 
    const userId = req.userId; 
    
    try {
        const transacoes = await Transaction.find({ userId: userId }).sort({ dataHora: -1 }); 
        res.status(200).json(transacoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar transações.', details: error.message });
    }
});


// --- INICIAR SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor da Cone-Finance rodando com sucesso🚀📊 (Porta ${PORT})`);
});