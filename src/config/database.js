const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Erro ao conectar MongoDB: ${error.message}`);
    console.log('\nSolucoes:');
    console.log('1. Verifique se o MongoDB esta rodando: net start MongoDB');
    console.log('2. Instale o MongoDB: https://www.mongodb.com/try/download/community');
    console.log('3. Ou use MongoDB Atlas (nuvem gratuita)');
    process.exit(1);
  }
};

module.exports = connectDB;