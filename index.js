// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

// Configurar CORS
app.use(cors({
  origin: [
    "https://fusionx-digitalstudio.vercel.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, ".")));
app.use(express.static("css"));
app.use(express.static("script"));
app.use(express.static("assets"));
app.use(express.static("pages"));

// Rotas estáticas
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/cursos", (req, res) => res.sendFile(path.join(__dirname, "pages/courses.html")));
app.get("/produtos", (req, res) => res.sendFile(path.join(__dirname, "pages/products.html")));
app.get("/log-in", (req, res) => res.sendFile(path.join(__dirname, "pages/log-in.html")));
app.get("/sign-in", (req, res) => res.sendFile(path.join(__dirname, "pages/sign-in.html")));
app.get("/cart", (req, res) => res.sendFile(path.join(__dirname, "pages/cart.html")));
app.get("/perfil", (req, res) => res.sendFile(path.join(__dirname, "pages/profile.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "pages/dashboard.html")));

// Modelos
const User = require("./models/User");
const Ebook = require("./models/Ebook");
const Product = require("./models/Product");

// Conexão com MongoDB
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@fusiondata.znak36d.mongodb.net/FusionData?retryWrites=true&w=majority&appName=FusionData`, {
    useNewUrlParser: true,
    useUnifiedTopology: true  
  })
  .then(() => {
    console.log("Conexão ao MongoDB Atlas bem-sucedida.");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB Atlas:", error);
    process.exit(1);
  });

// Rota de registro (/auth/register)
app.post("/auth/register", async (req, res) => {
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
    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao processar /auth/register:", error);
    res.status(500).json({ msg: "Ocorreu um erro com o servidor, tente novamente mais tarde." });
  }
});

// Rota de login (/auth/login)
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(422).json({ msg: "O e-mail é obrigatório!" });
  if (!password) return res.status(422).json({ msg: "A senha é obrigatória!" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(422).json({ msg: "Usuário não cadastrado." });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(422).json({ msg: "Senha inválida." });

    const secret = process.env.SECRET;
    const token = jwt.sign({ id: user._id }, secret);

    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    console.error("Erro ao processar /auth/login:", error);
    res.status(500).json({ msg: "Ocorreu um erro com o servidor, tente novamente mais tarde." });
  }
});

// Rota privada (/user/:id)
app.get("/user/:id", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    const id = req.params.id;

    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ msg: "Token inválido!" });
  }
});

// Rota para adicionar novos ebooks ou produtos ao banco
app.post("/insert", async (req, res) => {
  const { title, category, price, type } = req.body;

  // Validações dos campos
  const itemType = type.toLowerCase();
  if (!["ebook", "product"].includes(itemType)) {
    return res.status(422).json({ msg: "Tipo inválido! Use 'ebook' ou 'product'." });
  }
  if (!title) {
    return res.status(422).json({ msg: "O campo 'Título' é obrigatório para Ebooks!" });
  }
  if (!category) {
    return res.status(422).json({ msg: "O campo 'Categoria' é obrigatório!" });
  }
  if (!price) {
    return res.status(422).json({ msg: "O campo 'Preço' é obrigatório!" });
  }

  // Normaliza o preço
  let normalizedPrice;
  try {
    normalizedPrice = parseFloat(price.toString().replace(",", ".").replace(/[^\d.]/g, ""));
    if (isNaN(normalizedPrice) || normalizedPrice < 0) {
      return res.status(422).json({ msg: "Preço inválido! Use um número positivo." });
    }
  } catch (error) {
    return res.status(422).json({ msg: "Erro ao processar o preço!" });
  }

  try {
    let item;
    const Model = itemType === "ebook" ? Ebook : Product;
    const typeLabel = itemType === "ebook" ? "Ebook" : "Produto";

    const data = {
      title,
      category,
      price: normalizedPrice,
    };

    item = new Model(data);
    await item.save();
    res.status(201).json({ msg: `${typeLabel} criado com sucesso!` });
  } catch (error) {
    console.error(`Erro ao processar /insert (${itemType}):`, error);
    res.status(500).json({ msg: "Ocorreu um erro com o servidor, tente novamente mais tarde." });
  }
});
