require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: true 
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Connection Failed:", err));

// **Job Schema**
const JobSchema = new mongoose.Schema({
    title: String,
    description: String,
});
const Job = mongoose.model('Job', JobSchema);

// **Applicant Schema**
const ApplicantSchema = new mongoose.Schema({
    name: String,
    email: String,
    resume: String,
    appliedFor: { type: String, default: "General" }
});
const Applicant = mongoose.model('Applicant', ApplicantSchema);

// **Multer for File Uploads**
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// **User Schema**
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

// **Contact Schema** ✅ NEW
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    date: { type: Date, default: Date.now }
});

// **GET All Jobs**
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// **POST a New Job**
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

// **POST General Job Application**
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

// **POST Apply for Specific Job**
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

// **GET All Applicants (Admin)**
app.get('/applicants', async (req, res) => {
    try {
        const applicants = await Applicant.find();
        res.json(applicants);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch applicants" });
    }
});

// **Register API**
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// Contact Schema
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Failed:", err));

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ Fix Backend Route
app.post("/contact", async (req, res) => {
    console.log("📩 Received Contact Request:", req.body); // Debugging line

    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();
        res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Function to Send Email Notification (Optional)
function sendEmailNotification(name, email, phone, message) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "your-email@example.com",
        subject: "New Contact Form Submission",
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ Email not sent:", error);
        } else {
            console.log("📧 Email sent:", info.response);
        }
    });
}
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

// **✅ Contact Form API**
app.post('/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();
        res.json({ message: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
});

// **GET All Contact Messages (For Admin)**
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

