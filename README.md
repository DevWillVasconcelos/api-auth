# API de Autenticação

Uma API robusta e escalável para autenticação e gerenciamento de usuários, construída com as melhores práticas de desenvolvimento Node.js.

[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express.js Version](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB Version](https://img.shields.io/badge/MongoDB-7.x-brightgreen.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Sobre o Projeto

Esta API foi desenvolvida para fornecer uma solução completa de autenticação e gerenciamento de usuários, pronta para ser integrada em aplicações web, mobile ou qualquer outro tipo de sistema que necessite de controle de acesso e gestão de usuários.

**Principais características:**
- ✅ Código limpo e bem estruturado
- ✅ Documentação interativa com Swagger
- ✅ Segurança em múltiplas camadas
- ✅ Pronto para produção
- ✅ Fácil integração
- ✅ Testes automatizados

## Funcionalidades

### Usuários
- Registro de novos usuários
- Login com email e senha
- Atualização de perfil
- Exclusão de conta
- Recuperação de dados do perfil

### Administração
- Listagem de todos os usuários
- Busca de usuário por ID
- Atualização de qualquer usuário
- Exclusão de qualquer usuário
- Gerenciamento de papéis (roles)

### Segurança
- Senhas criptografadas com bcrypt
- Tokens JWT com expiração
- Rate limiting contra ataques de força bruta
- Headers de segurança com Helmet
- Validação de dados de entrada
- Proteção contra injeção de dados

### Documentação
- Swagger UI interativo
- Exemplos de requisições
- Schemas de resposta
- Teste direto pela interface

## Tecnologias

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-------------|
| Node.js | 18.x | Runtime JavaScript |
| Express | 4.x | Framework web |
| MongoDB | 7.x | Banco de dados NoSQL |
| Mongoose | 7.x | ODM para MongoDB |

### Autenticação & Segurança
| Tecnologia | Descrição |
|------------|-------------|
| JWT | Tokens de autenticação |
| bcryptjs | Hash de senhas |
| Helmet | Headers de segurança |
| express-rate-limit | Limitação de requisições |

### Documentação & Testes
| Tecnologia | Descrição |
|------------|-------------|
| Swagger | Documentação interativa |
| Jest | Framework de testes |
| Supertest | Testes de API |
| Axios | Cliente HTTP para testes |

## Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (local ou Atlas)
- [Git](https://git-scm.com/) (opcional)
- [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) (para testar)

