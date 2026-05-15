const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    console.log('Conectando ao MongoDB...');
    console.log(`URI: ${process.env.MONGODB_URI}`);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('MongoDB conectado com sucesso');
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  
  const app = require('./src/app');
  const PORT = process.env.PORT || 3000;
  
  const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`API: http://localhost:${PORT}/api/v1`);
  });
  
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Porta ${PORT} já está em uso. Use uma porta diferente.`);
      process.exit(1);
    }
  });
};

startServer();