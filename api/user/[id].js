// api/user/[id].js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Importar o modelo User
const User = require('../../models/User');

// Função para conectar ao MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) { // Verifica se já está conectado
      const dbUser = process.env.DB_USER;
      const dbPassword = process.env.DB_PASSWORD;
      await mongoose.connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tbfjbrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log('Conexão ao MongoDB Atlas bem-sucedida.');
    }
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB Atlas:', err);
    throw new Error('Erro ao conectar ao banco de dados');
  }
};

// Função para verificar o token
const checkToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' });
  }

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return res.status(400).json({ msg: 'Token inválido!' });
  }
};

// Função serverless para o endpoint /user/:id
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ msg: 'Método não permitido' });
  }

  try {
    // Conectar ao MongoDB
    await connectDB();

    // Verificar o token
    const decoded = await checkToken(req, res);
    if (decoded.status) return; // Se houver erro no token, a resposta já foi enviada

    const id = req.query.id; // No Vercel, os parâmetros dinâmicos vêm em req.query

    // Verifica se o usuário existe no banco
    const user = await User.findById(id, '-password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Erro ao processar /user/[id]:', error);
    res.status(500).json({ msg: 'Ocorreu um erro com o servidor, tente novamente mais tarde.' });
  }
};