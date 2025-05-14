const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const PORT = process.env.PORT || 3000
const app = express()

// Lista de origens permitidas para o CORS (Desenvolvimento local)
const allowedOrigins = [
    "http://localhost:5500",               // Live Server (desenvolvimento)
    "http://127.0.0.1:5500",              // Live Server (desenvolvimento, variação com IP)
    "http://localhost:3000",             // Express servindo o front-end localmente
]

// Configurar CORS
app.use(cors({
    origin: (origin, callback) => {
        // Permitir requisições sem origem (ex.: Postman/Local via file://)
        if (!origin) return callback(null, true)
        
        // No ambiente de produção (Vercel)
        // CORS não é necessário. Permitidas todas as origens no Vercel.
        if (process.env.NODE_ENV === 'production') {return callback(null, true)}

        // Ambiente local, verifica se a origem está na lista de permitidas
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Origem não permitida pelo CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Configura a resposta em JSON
app.use(express.json())
app.use(express.static(path.join(__dirname, '.')))

app.use(express.static('css'))
app.use(express.static('script'))
app.use(express.static('assets'))
app.use(express.static('pages'))

// Rotas estáticas
app.get("/", (req, res) => res.sendFile(path.join(__dirname, 'index.html')))
app.get("/cursos", (req, res) => res.sendFile(path.join(__dirname, 'pages/courses.html')))
app.get("/produtos", (req, res) => res.sendFile(path.join(__dirname, 'pages/products.html')))
app.get("/log-in", (req, res) => res.sendFile(path.join(__dirname, 'pages/log-in.html')))
app.get("/sign-in", (req, res) => res.sendFile(path.join(__dirname, 'pages/sign-in.html')))
app.get("/cart", (req, res) => res.sendFile(path.join(__dirname, 'pages/cart.html')))

// Models
const User = require("./models/User")
const { userInfo } = require("os")

// Credenciais do MongoDB Atlas
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

// Conexão com o MongoDB Atlas
console.log("Index.js iniciado em http://localhost:3000/")
console.log("Conectando ao MongoDB Atlas...")
mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.tbfjbrc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        app.listen(PORT)
        console.log('Conexão ao MongoDB Atlas bem-sucedida.');
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MongoDB Atlas:', err);
        process.exit(1);
    })

// Rota pública
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API!" })
})

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
