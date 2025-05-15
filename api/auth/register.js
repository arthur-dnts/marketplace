const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();

const User = require("../../models/User");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      const dbUser = process.env.DB_USER;
      const dbPassword = process.env.DB_PASSWORD;
      await mongoose.connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tbfjbrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log("Conexão ao MongoDB Atlas bem-sucedida.");
    }
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB Atlas:", err);
    throw new Error("Erro ao conectar ao banco de dados");
  }
};

module.exports = async (req, res) => {
  const corsOptions = {
    origin: [
      "https://fusionx-digitalstudio.vercel.app", // Substitua pelo domínio do Vercel
      "http://localhost:3000",
      "http://localhost:5500"
    ],
    methods: ["POST"],
    allowedHeaders: ["Content-Type"]
  };
  cors(corsOptions)(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ msg: "Método não permitido" });
    }

    const { name, surname, email, telefone, password, confirmPassword } = req.body;

    if (!name) return res.status(422).json({ msg: "O nome é obrigatório!" });
    if (name.length > 50) return res.status(422).json({ msg: "Nome muito longo (Máx. 50 caracteres)." });
    if (name.length < 2) return res.status(422).json({ msg: "Nome muito curto (Mín. 2 caracteres)." });

    if (!surname) return res.status(422).json({ msg: "O sobrenome é obrigatório!" });
    if (surname.length > 50) return res.status(422).json({ msg: "Sobrenome muito longo (Máx. 50 caracteres)." });
    if (surname.length < 2) return res.status(422).json({ msg: "Sobrenome muito curto (Mín. 2 caracteres)." });

    if (!email) return res.status(422).json({ msg: "O e-mail é obrigatório!" });
    if (email.length > 100) return res.status(422).json({ msg: "E-mail muito longo (Máx. 100 caracteres)." });
    if (email.length < 6) return res.status(422).json({ msg: "E-mail muito curto (Mín. 6 caracteres)." });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(422).json({ msg: "E-mail inválido!" });

    if (!telefone) return res.status(422).json({ msg: "O telefone é obrigatório!" });
    if (telefone.length !== 15) return res.status(422).json({ msg: "Número de telefone inválido (Padrão (99) 91234-5678)." });
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) return res.status(422).json({ msg: "Formato de telefone inválido! Use (99) 91234-5678." });

    if (!password) return res.status(422).json({ msg: "A senha é obrigatória!" });
    if (password.length > 128) return res.status(422).json({ msg: "Senha muito longa (Máx. 128 caracteres)." });
    if (password.length < 8) return res.status(422).json({ msg: "Senha muito curta (Mín. 8 caracteres)." });
    if (password !== confirmPassword) return res.status(422).json({ msg: "As senhas devem ser iguais!" });

    try {
      await connectDB();
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(422).json({ msg: "E-mail já cadastrado. Tente outro e-mail válido." });

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        surname,
        email,
        telefone,
        password: passwordHash,
      });

      await user.save();
      console.log("Usuário criado com sucesso: ", user);
      res.status(201).json({ msg: "Usuário criado com sucesso!" });
    } catch (error) {
      console.error("Erro ao processar /auth/register:", error);
      res.status(500).json({ msg: "Ocorreu um erro com o servidor, tente novamente mais tarde." });
    }
  });
};
