require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("DB Connection Error:", err));

// Database Schemas
const propertySchema = new mongoose.Schema({
    title: String, price: String, category: String, location: String,
    sellerPhone: String, desc: String, image: String,
    date: { type: Date, default: Date.now },
    sellerName: String, sellerPic: String, sellerLocation: String,
    status: { type: String, default: 'active' }
});
const Property = mongoose.model('Property', propertySchema);

const userSchema = new mongoose.Schema({
    name: String, email: { type: String, unique: true },
    password: String, location: String, profilePic: String
});
const User = mongoose.model('User', userSchema);

// --- CLOUDINARY ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'viwanja_v3', allowed_formats: ['jpg', 'png', 'webp'] }
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 604800000 }
}));

// --- ROUTES ---
app.post('/api/auth/register', upload.single('profilePic'), async (req, res) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ ...req.body, password: hashed, profilePic: req.file ? req.file.path : '' });
        await newUser.save();
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Register failed" }); }
});

app.post('/api/auth/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.adminId = user._id;
        return res.json({ success: true });
    }
    res.status(401).send();
});

app.get('/api/admin/check', async (req, res) => {
    if (!req.session.adminId) return res.json({ loggedIn: false });
    const user = await User.findById(req.session.adminId);
    res.json({ loggedIn: true, user });
});

app.get('/api/properties', async (req, res) => {
    const props = await Property.find().sort({ date: -1 });
    res.json(props);
});

app.post('/api/properties', upload.single('media'), async (req, res) => {
    if (!req.session.adminId) return res.status(401).send();
    const agent = await User.findById(req.session.adminId);
    const newPost = new Property({
        ...req.body,
        image: req.file ? req.file.path : '',
        sellerName: agent.name, sellerPic: agent.profilePic, sellerLocation: agent.location
    });
    await newPost.save();
    res.json({ success: true });
});

app.post('/api/properties/sold/:id', async (req, res) => {
    const p = await Property.findById(req.params.id);
    p.status = p.status === 'sold' ? 'active' : 'sold';
    await p.save();
    res.json({ success: true });
});

app.delete('/api/properties/:id', async (req, res) => {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(3000, () => console.log('Viwanja Cloud Engine Online'));