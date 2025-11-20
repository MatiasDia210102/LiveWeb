const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schedule = require('./models/Schedule.js');
const User = require('./models/User.js');
const authMiddleware = require('./middleware/auth.js'); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_portfolio_db';
const JWT_SECRET = process.env.JWT_SECRET || 'TU_SECRETO_SEGURO_LOCAL'; 
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsOptions = {
    origin: FRONTEND_URL, 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB conectado exitosamente.'))
    .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

app.get('/api/users', authMiddleware.verifyToken, authMiddleware.verifyAdminOrJefe, async (req, res) => {
    try {
        const usersDB = await User.find({_id: { $ne: req.user.userId }}).select('-password').lean();
        const usersFrontend = usersDB.map(user => ({userId: user._id, username: user.username, role: user.role}));
        res.json(usersFrontend);
    } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener usuarios." });
    }
});

app.post('/api/register', async (req, res) => {

    try {

        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, password: hashedPassword, role: 'espectador'});
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id, role: newUser.role, username: newUser.username }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, userId: newUser._id, username: newUser.username, role: newUser.role});
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: 'Error interno del servidor durante el registro.' });
    }
});

app.post('/api/login', async (req, res) => {

    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, username: user.username }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({ token, userId: user._id, username: user.username, role: user.role });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: 'Error interno del servidor durante el inicio de sesión.' });
    }
});

app.get('/api/schedule', async (req, res) => {
    try {
        const scheduleData = await Schedule.find({}); 
        res.json(scheduleData);
    } catch (error) {
        console.error("Error al obtener el calendario:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener el calendario." });
    }
});

app.put('/api/schedule', authMiddleware.verifyToken, authMiddleware.verifyAdminOrJefe, async (req, res) => {
    const nuevoCalendario = req.body;

    try {
        await Schedule.deleteMany({});
        const result = await Schedule.insertMany(nuevoCalendario);

        res.status(200).json({ 
            message: 'Calendario guardado permanentemente.',
            insertedCount: result.length
        });
    } catch (error) {
        console.error("Error al actualizar el calendario:", error);
        res.status(500).json({ message: "Error interno del servidor al guardar el calendario." });
    }
});

app.put('/api/users/:userId/role', authMiddleware.verifyToken, authMiddleware.verifyAdminOrJefe, async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['jefe', 'administrador', 'espectador'].includes(role)) {
        return res.status(400).json({ message: "Rol inválido." });
    }

    try {

        if (req.user.userId === userId && role !== req.user.role) {
            return res.status(403).json({ message: "No puedes modificar tu propio rol a uno inferior." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { role: role }, 
            { new: true, select: 'username role' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.status(200).json({ 
            message: `Rol de ${updatedUser.username} actualizado a ${updatedUser.role}.`,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error al actualizar el rol:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend del Streaming ejecutándose en ${MONGODB_URI.includes('localhost') ? `http://localhost:${PORT}` : 'Render'}`);
});