// Importando as dependências
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDb = require("./src/database");
const checkJwt = require("./MiddlewareAuth0");
const path = require("path");
// Importando o modelo do usuário
const User = require("./src/models/user.model");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Configurando o aplicativo Express
app.use(express.static(path.join("../", "client", "build")));

// Rota para servir o index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve("../", "client", "build", "index.html"));
});
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    "your-secret-key",
    { algorithm: "HS256" },
    (err, decoded) => {
      if (err) {
        console.error("Error decoding token:", err);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

      req.userId = decoded.userId;
      next();
    }
  );
};

// Rota para obter todos os usuários
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rota para obter todos os usuários com informações limitadas
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(
      {},
      { name: 1, email: 1, balance: 1, transactions: 1 }
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rota para obter informações detalhadas de um usuário específico
app.get("/api/users/:email", verifyToken, async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rota para registrar um novo usuário
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Request Body:", req.body);
  try {
    // Verificar se o e-mail já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Criptografar a senha antes de salvar no banco de dados
    console.log("Password:", password);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar um novo usuário
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const user = await User.findOne({ email });
    const token = jwt.sign(
      { userId: user._id },
      "your-secret-key",
      { algorithm: "HS256" },
      {
        expiresIn: "1h",
      }
    );
    res.json({ token, user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rota para autenticar o usuário
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    // Verificar se o usuário existe no banco de dados
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Gerar um token de autenticação
    const token = jwt.sign(
      { userId: user._id },
      "your-secret-key",
      { algorithm: "HS256" },
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rota para realizar um depósito
app.post("/api/deposit/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  console.log(email);
  const { amount } = req.body;
  console.log(amount);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.balance += parseFloat(amount);
    user.transactions.push({ type: "Deposit", amount: parseFloat(amount) });
    await user.save();

    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rota para realizar um saque
app.post("/api/withdraw/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  const { amount } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.balance < parseFloat(amount)) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    user.balance -= parseFloat(amount);
    user.transactions.push({ type: "Withdraw", amount: parseFloat(amount) });
    await user.save();

    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Auth0
app.post("/api/auth0-login", async (req, res) => {
  try {
    // Extrair informações relevantes do token Auth0
    const { email, nickname } = req.body;

    // Verificar se o usuário já existe no seu banco de dados
    let user = await User.findOne({ email });
    let isNewUser = false;
    if (!user) {
      // Se não existe, crie um novo usuário no seu banco de dados
      user = new User({ email, name: nickname });
      await user.save();
      isNewUser = true;
    }

    // Gerar token para o usuário
    const token = jwt.sign(
      { userId: user._id },
      "your-secret-key",
      { algorithm: "HS256" },
      { expiresIn: "1h" }
    );

    // Retornar usuário e token
    res.status(200).json({
      message: isNewUser
        ? "Novo usuário registrado com sucesso"
        : "Usuário existente",
      user,
      token,
    });
  } catch (error) {
    console.error("Erro durante o login com Auth0:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Conectar ao banco de dados
connectDb()
  .then(() => {
    console.log("Connected to the database");
    // Inicializar o servidor
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
