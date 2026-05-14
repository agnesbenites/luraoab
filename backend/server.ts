import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth';
import perfilRoutes from './src/routes/perfil';
import assinaturaRoutes from './src/routes/assinatura';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/perfil', perfilRoutes);
app.use('/assinatura', assinaturaRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Lura backend rodando na porta ${PORT}`));
