const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const Resume = require('./models/resume');

dotenv.config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB Atlas');
  saveToDatabase();
}).catch(err => console.log(err));

const saveToDatabase = async () => {
  try {
    const count = await Resume.countDocuments();
    if (count === 0) {
      const rawData = fs.readFileSync(path.join(__dirname, 'resumesData.json'), 'utf-8');
      const jsonData = JSON.parse(rawData);

      const normalized = jsonData.map(item => {
        const toArray = v => {
          if (!v) return [];
          if (Array.isArray(v)) return v;
          if (typeof v === 'string') return [v];
          return [];
        };

        const docs = (item.documents && Array.isArray(item.documents)) ? item.documents : (item.documents && typeof item.documents === 'object' ? [item.documents] : []);

        return {
          fullname: item.fullname || item.fullName || item.name || '',
          contactNumber: item.contactNumber || item.contact_number || item.contact || '',
          email: item.email || item.Email || '',
          summary: item.summary || item.Summary || '',
          qualifications: toArray(item.qualifications || item.quals || item.Qualifications),
          certifications: toArray(item.certifications || item.certs || item.Certifications),
          professionalExperience: Array.isArray(item.professionalExperience) ? item.professionalExperience : [],
          skills: toArray(item.skills || item.skillSet),
          languages: toArray(item.languages),
          hobbies: toArray(item.hobbies),
          researchStatement: item.researchStatement || item.research || '',
          documents: docs.map(d => ({
            filename: d.filename || d.fileName || d.name || '',
            originalname: d.originalname || d.originalName || d.original || d.name || '',
            path: d.path || (d.filename ? `/uploads/${d.filename}` : '')
          }))
        };
      });

      // Insert into resumes collection
      await Resume.insertMany(normalized);
      console.log('Seeded resumes into MongoDB');
    } else {
      console.log('Resumes already exist in MongoDB Atlas');
    }
  } catch (err) {
    console.error('Error seeding resumes:', err.message);
  }
};

// mount routes
const resumeRoutes = require('./routes/resumeRoutes');
app.use('/resumes', resumeRoutes);

app.get('/', (req, res) => res.redirect('/resumes'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Task7 server running on port ${PORT}`));
