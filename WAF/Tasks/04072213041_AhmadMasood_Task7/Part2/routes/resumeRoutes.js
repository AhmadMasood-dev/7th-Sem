const express = require('express');
const router = express.Router();
const Resume = require('../models/resume');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

function parseListField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(s => s.trim()).filter(Boolean);
  return value.split(',').map(s => s.trim()).filter(Boolean);
}


router.get('/', async (req, res) => {
  const resumes = await Resume.find().sort({ createdAt: -1 });
  res.render('home', { resumes });
});

router.get('/addNew', (req, res) => {
  res.render('newCV', { resume: {} });
});

router.post('/', upload.array('documents'), async (req, res) => {
  try {
    const body = req.body;
    const resume = new Resume({
      fullname: body.fullname,
      contactNumber: body.contactNumber,
      email: body.email,
      summary: body.summary,
      qualifications: parseListField(body.qualifications),
      certifications: parseListField(body.certifications),
      skills: parseListField(body.skills),
      languages: parseListField(body.languages),
      hobbies: parseListField(body.hobbies),
      researchStatement: body.researchStatement,
      professionalExperience: []
    });


    if (body.experience) {
      const lines = Array.isArray(body.experience) ? body.experience : body.experience.split('\n');
      lines.forEach(line => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2 && parts[0]) {
          resume.professionalExperience.push({
            company: parts[0] || '',
            role: parts[1] || '',
            startDate: parts[2] || '',
            endDate: parts[3] || '',
            description: parts[4] || ''
          });
        }
      });
    }


    if (req.files && req.files.length) {
      resume.documents = req.files.map(f => ({ filename: f.filename, originalname: f.originalname, path: `/uploads/${f.filename}` }));
    }

    await resume.save();
    res.redirect('/resumes');
  } catch (err) {
    console.error(err);
    res.status(400).send('Error creating resume: ' + err.message);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.redirect('/resumes');
    res.render('details', { resume });
  } catch (err) {
    res.redirect('/resumes');
  }
});


router.get('/:id/edit', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.redirect('/resumes');
    res.render('edit', { resume });
  } catch (err) {
    res.redirect('/resumes');
  }
});


router.patch('/:id', upload.array('documents'), async (req, res) => {
  try {
    const body = req.body;
    const updates = {
      fullname: body.fullname,
      contactNumber: body.contactNumber,
      email: body.email,
      summary: body.summary,
      qualifications: parseListField(body.qualifications),
      certifications: parseListField(body.certifications),
      skills: parseListField(body.skills),
      languages: parseListField(body.languages),
      hobbies: parseListField(body.hobbies),
      researchStatement: body.researchStatement
    };


    updates.professionalExperience = [];
    if (body.experience) {
      const lines = Array.isArray(body.experience) ? body.experience : body.experience.split('\n');
      lines.forEach(line => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2 && parts[0]) {
          updates.professionalExperience.push({
            company: parts[0] || '',
            role: parts[1] || '',
            startDate: parts[2] || '',
            endDate: parts[3] || '',
            description: parts[4] || ''
          });
        }
      });
    }


    if (req.files && req.files.length) {
      const files = req.files.map(f => ({ filename: f.filename, originalname: f.originalname, path: `/uploads/${f.filename}` }));
      updates.$push = { documents: { $each: files } };

      await Resume.findByIdAndUpdate(req.params.id, updates, { new: true });
    } else {
      await Resume.findByIdAndUpdate(req.params.id, updates, { new: true });
    }

    res.redirect(`/resumes/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(400).send('Error updating resume: ' + err.message);
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const r = await Resume.findByIdAndDelete(req.params.id);
    if (r && r.documents && r.documents.length) {
      r.documents.forEach(doc => {
        const fp = path.join(uploadDir, doc.filename);
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
      });
    }
    res.redirect('/resumes');
  } catch (err) {
    console.error(err);
    res.redirect('/resumes');
  }
});

module.exports = router;
