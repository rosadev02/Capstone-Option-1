const mongoose = require("mongoose");

const connectDb = async () => {
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
