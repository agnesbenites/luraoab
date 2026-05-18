import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth';
import perfilRoutes from './src/routes/perfil';
import assinaturaRoutes from './src/routes/assinatura';

dotenv.config();
const app = express();

// CORREÇÃO: Configuração robusta de CORS aceitando o cabeçalho anti-phishing do VS Code
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'bypass-tunnel-reminder',
    'X-Tunnel-Skip-Anti-Phishing-Page' // Permitido explicitamente aqui
  ],
  credentials: true
}));

app.use(express.json());

// Middleware para garantir que respostas tratem o bypass do Dev Tunnel
app.use((req, res, next) => {
  res.setHeader('bypass-tunnel-reminder', 'true');
  next();
});

app.use('/auth', authRoutes);
app.use('/perfil', perfilRoutes);
app.use('/assinatura', assinaturaRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Lura backend rodando na porta ${PORT}`));