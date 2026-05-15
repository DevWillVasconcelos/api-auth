const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar novo usuario
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: Usuario registrado com sucesso
 *       400:
 *         description: Dados invalidos
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Fazer login
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais invalidas
 */
router.post('/login', login);

router.use(protect);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Obter perfil do usuario atual
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *       401:
 *         description: Nao autorizado
 */
router.get('/me', getMe);

/**
 * @swagger
 * /me:
 *   put:
 *     summary: Atualizar perfil do usuario atual
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       401:
 *         description: Nao autorizado
 */
router.put('/me', updateUser);

/**
 * @swagger
 * /me:
 *   delete:
 *     summary: Deletar conta do usuario atual
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conta deletada com sucesso
 *       401:
 *         description: Nao autorizado
 */
router.delete('/me', deleteUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuarios (Admin apenas)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtida com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get('/users', authorize('admin'), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obter usuario por ID (Admin apenas)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario nao encontrado
 */
router.get('/users/:id', authorize('admin'), getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuario por ID (Admin apenas)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario atualizado com sucesso
 *       404:
 *         description: Usuario nao encontrado
 */
router.put('/users/:id', authorize('admin'), updateUserById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletar usuario por ID (Admin apenas)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario deletado com sucesso
 *       404:
 *         description: Usuario nao encontrado
 */
router.delete('/users/:id', authorize('admin'), deleteUserById);

module.exports = router;