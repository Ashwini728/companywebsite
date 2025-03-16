require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const esportsRoutes = require('./routes/esportsRoutes');
const Event = require('./models/Event');
const Match = require('./models/Match');




dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

connectDB();

app.use('/api', esportsRoutes);



mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: true 
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Connection Failed:", err));

  const JobSchema = new mongoose.Schema({
    title: String,
    description: String,
});

const Job = mongoose.model('Job', JobSchema);

// Applicant Schema
const ApplicantSchema = new mongoose.Schema({
    name: String,
    email: String,
    resume: String, // Path to uploaded file
    appliedFor: { type: String, default: "General" }
});

const Applicant = mongoose.model('Applicant', ApplicantSchema);

// Multer Storage for Resumes
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// **API to Get All Jobs**
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// **API to Add a New Job (Admin)**
app.post('/jobs', async (req, res) => {
    const { title, description } = req.body;

    try {
        const newJob = new Job({ title, description });
        await newJob.save();
        res.json({ message: "Job posted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to post job" });
    }
});

// **API for General Job Applications**
app.post('/apply', upload.single('resume'), async (req, res) => {
    const { name, email } = req.body;
    const resumePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newApplicant = new Applicant({ name, email, resume: resumePath });
        await newApplicant.save();
        res.json({ message: "Application submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit application" });
    }
});

// **API for Applying to Specific Jobs**
app.post('/apply/:jobId', upload.single('resume'), async (req, res) => {
    const { name, email } = req.body;
    const { jobId } = req.params;
    const resumePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ error: "Job not found" });

        const newApplicant = new Applicant({ name, email, resume: resumePath, appliedFor: job.title });
        await newApplicant.save();
        res.json({ message: `Applied for ${job.title} successfully!` });
    } catch (error) {
        res.status(500).json({ error: "Failed to apply for job" });
    }
});

// **API to Get All Applicants (For Admin)**
app.get('/applicants', async (req, res) => {
    try {
        const applicants = await Applicant.find();
        res.json(applicants);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch applicants" });
    }
});
// User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

// **Register API**
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// **Login API**
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

