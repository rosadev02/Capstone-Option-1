const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = async () => {
  console.log(process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Outras opções do mongoose, se necessário
    });
    console.log("Conectado ao MongoDB!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    // Pode adicionar lógica para lidar com o erro, como tentar reconectar
    // ou encerrar o aplicativo
    process.exit(1);
  }
};

module.exports = connectDb;
