const bcrypt = require("bcrypt")
const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()
const PORT = 3000

// Lista de origens permitidas para o CORS

// Lista de origens permitidas (apenas para desenvolvimento local)
const allowedOrigins = [
    'http://localhost:5500',  // Live Server (desenvolvimento)
    'http://127.0.0.1:5500', // Live Server (desenvolvimento, variação com IP)
    'http://localhost:3000' // Express servindo o front-end localmente
];

// Configurar CORS
app.use(cors({
    origin: (origin, callback) => {
        // Permitir requisições sem origem (ex.: Postman/Local via file://)
        if (!origin) return callback(null, true);
        
        // No ambiente de produção (Vercel)
        // CORS não é necessário. Permitidas todas as origens no Vercel.
        if (process.env.NODE_ENV === 'production') {
            return callback(null, true);
        }

        // Ambiente local, verifica se a origem está na lista de permitidas
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origem não permitida pelo CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configura a resposta em JSON
app.use(express.json())
app.use(express.static(path.join(__dirname, '.')))

// Models
const User = require("./models/User")

// Registrar e validar usuário
app.post("/auth/register", async(req, res) => {

    const {name, surname, email, telefone, password, confirmpassword} = req.body

    // Validação do nome do usuário
    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório!" })
    };

    if (name.length > 50) {
        return res.status(422).json({ msg: "Nome muito longo (Máx. 50 caracteres)." })
    }

    if (name.length < 2) {
        return res.status(422).json({ msg: "Nome muito curto (Mín. 2 caracteres)." })
    }

    // Validação do sobrenome do usuário
    if (!surname) {
        return res.status(422).json({ msg: "O sobrenome é obrigatório!" })
    };

    if (surname.length > 50) {
        return res.status(422).json({ msg: "Sobrenome muito longo (Máx. 50 caracteres)." })
    };
    
    if (surname.length < 2) {
        return res.status(422).json({ msg: "Sobrenome muito curto (Mín. 2 caracteres)." })
    };

    // Validação do e-mail do usuário
    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório!" })
    };

    if (email.length > 100) {
        return res.status(422).json({ msg: "E-mail muito longo (Máx. 100 caracteres)." })
    };

    if (email.length < 6) {
        return res.status(422).json({ msg: "E-mail muito curto (Mín. 6 caracteres)." })
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(422).json({ msg: "E-mail inválido!" });
    }

    // Validação do telefone do usuário
    if (!telefone) {
        return res.status(422).json({ msg: "O telefone é obrigatório!" })
    };

    if (telefone.length !== 15) {
        return res.status(422).json({ msg: "Número de telefone inválido (Padrão (99) 91234-5678)." })
    };

    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
        return res.status(422).json({ msg: "Formato de telefone inválido! Use (99) 91234-5678." });
    }

    // Validação da senha e confirmação da senha do usuário
    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" })
    };
    
    if (password.length > 128) {
        return res.status(422).json({ msg: "Senha muito longa (Máx. 128 caracteres)." })
    };

    if (password.length < 8) {
        return res.status(422).json({ msg: "Senha muito curta (Mín. 8 caracteres)." })
    };

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: "As senhas devem ser iguais!" })
    }

    // Verifica se o usuário já existe no banco

    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({ msg: "E-mail já cadastrado. Tente outro e-mail válido." })
    }

    // Ofuscação da senha do usuário
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Criação do usuário no banco
    const user = new User({
        name,
        surname,
        email,
        telefone,
        password: passwordHash,
    })

    try {
        await user.save()
        res.status(201).json({ msg: "Usuário criado com sucesso!" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Ocorreu um erro com o servidor, tente novamente mais tarde." })
    }

})

// Login e validação do usuário
app.post("/auth/login", async(req, res) => {

    const {email, password} = req.body

    // Validação do email
    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório!" })
    };

    // Validação da senha
    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" })
    };

    // Verifica se o usuário já existe no banco
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(422).json({ msg: "Usuário não cadastrado." })
    }

    // Verifica se a senha é a mesma do banco
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida." })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
            {id: user._id},
            secret,
    )

    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Ocorreu um erro com o servidor, tente novamente mais tarde." })
    }

})

// Credenciais do MongoDB Atlas
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

// Conexão com o MongoDB Atlas
mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.tbfjbrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        app.listen(PORT)
        console.log("Conexão ao MongoDB Atlas bem-sucedida.")
    })
    .catch((err) => console.log("Erro ao conectar ao MongoDB Atlas:", err))

// Rota pública
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API!" })
});

// Rota privada
app.get("/user/:id", checkToken, async (req, res) => {
    
    const id = req.params.id

    // Verifica se o usuário existe no banco
    const user = await User.findById(id, "-password")

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" })
    }

    res.status(200).json({ user })

})

// Função para verificação do token
function checkToken(req, res, next) {

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado!" })
    }

    try {
        
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)
        req.user = decoded
        next()

    } catch (error) {
        res.status(400).json({ msg: "Token inválido!" })
    }

}
