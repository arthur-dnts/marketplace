// api/auth/login.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

// Função serverless para o endpoint /auth/login
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Método não permitido' });
  }

  const { email, password } = req.body;

  // Validação do email
  if (!email) return res.status(422).json({ msg: 'O e-mail é obrigatório!' });

  // Validação da senha
  if (!password) return res.status(422).json({ msg: 'A senha é obrigatória!' });

  try {
    // Conectar ao MongoDB
    await connectDB();

    // Verifica se o usuário já existe no banco
    const user = await User.findOne({ email: email });
    if (!user) return res.status(422).json({ msg: 'Usuário não cadastrado.' });

    // Verifica se a senha é a mesma do banco
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(422).json({ msg: 'Senha inválida.' });

    // Gera o token JWT
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: user._id }, secret);

    res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token });
  } catch (error) {
    console.error('Erro ao processar /auth/login:', error);
    res.status(500).json({ msg: 'Ocorreu um erro com o servidor, tente novamente mais tarde.' });
  }
};
