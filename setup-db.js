// setup-db.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
    console.log('========================================');
    console.log('CONFIGURANDO BANCO DE DADOS');
    console.log('========================================\n');

    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
        console.error('ERRO: MONGODB_URI nao encontrada no arquivo .env');
        console.log('\nAdicione no arquivo .env:');
        console.log('MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/app-auth');
        process.exit(1);
    }

    console.log('Conectando ao MongoDB...');
    console.log(`URI: ${MONGODB_URI.replace(/\/\/.*@/, '//****:****@')}\n`);

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log('✓ Conexao estabelecida com sucesso!');
        console.log(`  Host: ${mongoose.connection.host}`);
        console.log(`  Database: ${mongoose.connection.name}\n`);

        // Definir Schema do Usuario
        const userSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, enum: ['user', 'admin'], default: 'user' },
            isActive: { type: Boolean, default: true },
            lastLogin: { type: Date },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now }
        });

        userSchema.pre('save', async function(next) {
            if (!this.isModified('password')) return next();
            this.password = await bcrypt.hash(this.password, 10);
            this.updatedAt = Date.now();
            next();
        });

        const User = mongoose.model('User', userSchema);

        console.log('✓ Schema do usuario criado\n');

        // Criar colecoes
        console.log('Criando colecoes...');
        
        try {
            await mongoose.connection.createCollection('users');
            console.log('✓ Colecao "users" criada');
        } catch (error) {
            console.log('  Colecao "users" ja existe');
        }

        console.log('\n========================================');
        console.log('VERIFICANDO USUARIOS EXISTENTES');
        console.log('========================================\n');

        const userCount = await User.countDocuments();
        console.log(`Total de usuarios no banco: ${userCount}\n`);

        // Listar usuarios existentes
        if (userCount > 0) {
            const users = await User.find().select('-password');
            console.log('Usuarios cadastrados:');
            users.forEach((user, index) => {
                console.log(`  ${index + 1}. ${user.name} - ${user.email} (${user.role})`);
            });
            console.log();
        }

        // Criar usuario admin se nao existir
        console.log('========================================');
        console.log('CRIANDO USUARIO ADMIN');
        console.log('========================================\n');

        const adminExists = await User.findOne({ email: 'admin@admin.com' });
        
        if (!adminExists) {
            const adminUser = new User({
                name: 'Administrador',
                email: 'admin@admin.com',
                password: 'admin123',
                role: 'admin',
                isActive: true
            });
            
            await adminUser.save();
            console.log('✓ Usuario ADMIN criado com sucesso!');
            console.log('  Email: admin@admin.com');
            console.log('  Senha: admin123');
            console.log('  Role: admin\n');
        } else {
            console.log('✓ Usuario ADMIN ja existe');
            console.log(`  Email: ${adminExists.email}`);
            console.log(`  Role: ${adminExists.role}\n`);
        }

        // Criar usuario comum de exemplo
        console.log('========================================');
        console.log('CRIANDO USUARIO COMUM (EXEMPLO)');
        console.log('========================================\n');

        const userExists = await User.findOne({ email: 'usuario@teste.com' });
        
        if (!userExists) {
            const normalUser = new User({
                name: 'Usuario Teste',
                email: 'usuario@teste.com',
                password: '123456',
                role: 'user',
                isActive: true
            });
            
            await normalUser.save();
            console.log('✓ Usuario comum criado com sucesso!');
            console.log('  Email: usuario@teste.com');
            console.log('  Senha: 123456');
            console.log('  Role: user\n');
        } else {
            console.log('✓ Usuario comum ja existe\n');
        }

        // Testar conexao com operacao de leitura/escrita
        console.log('========================================');
        console.log('TESTANDO OPERACOES DO BANCO');
        console.log('========================================\n');

        // Teste de escrita
        const testUser = await User.findOne({ email: 'teste-operacao@temp.com' });
        if (!testUser) {
            const tempUser = new User({
                name: 'Teste Temporario',
                email: 'teste-operacao@temp.com',
                password: 'temp123',
                role: 'user'
            });
            await tempUser.save();
            console.log('✓ Teste de escrita: OK');
            await User.deleteOne({ email: 'teste-operacao@temp.com' });
            console.log('✓ Teste de delecao: OK');
        }
        console.log();

        // Estatisticas finais
        console.log('========================================');
        console.log('RESUMO FINAL');
        console.log('========================================\n');
        
        const finalCount = await User.countDocuments();
        const admins = await User.countDocuments({ role: 'admin' });
        const users = await User.countDocuments({ role: 'user' });
        
        console.log(`Total de usuarios: ${finalCount}`);
        console.log(`  - Administradores: ${admins}`);
        console.log(`  - Usuarios comuns: ${users}`);
        console.log();

        console.log('========================================');
        console.log('CONFIGURACAO CONCLUIDA COM SUCESSO!');
        console.log('========================================\n');
        
        console.log('Para iniciar a API, execute:');
        console.log('  npm run dev\n');
        
        console.log('Para testar a API:');
        console.log('  Login admin: admin@admin.com / admin123');
        console.log('  Login user: usuario@teste.com / 123456');
        console.log('  Swagger: http://localhost:3000/api-docs\n');

        await mongoose.connection.close();
        console.log('Conexao fechada.\n');
        
        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERRO NA CONFIGURACAO:');
        console.error(`  ${error.message}\n`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('SOLUCOES:');
            console.log('1. Verifique se o MongoDB esta rodando: net start MongoDB');
            console.log('2. Ou use MongoDB Atlas (nuvem)');
            console.log('3. Verifique a string de conexao no arquivo .env\n');
        }
        
        if (error.message.includes('authentication')) {
            console.log('SOLUCOES:');
            console.log('1. Verifique usuario e senha no .env');
            console.log('2. Crie um usuario no MongoDB Atlas\n');
        }
        
        process.exit(1);
    }
}

setupDatabase();