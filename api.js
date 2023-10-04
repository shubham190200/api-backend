



const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 7000;

// Connect to MongoDB (Assuming you have MongoDB running locally on the default port)
mongoose.connect('mongodb+srv://shubhamkr19:messi123@cluster0.e1v5mwe.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Doctor and Appointment models
const doctorSchema = new mongoose.Schema({
  name: String,
  // Add other doctor-related fields here
});

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientName: String,
  appointmentDate: Date,
  // Add other appointment-related fields here
});

const Doctor = mongoose.model('Doctor', doctorSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

app.use(bodyParser.json());

// List Doctors
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Doctor Detail
app.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book Appointment
app.post('/appointments', async (req, res) => {
  try {
    const { doctorId, patientName, appointmentDate } = req.body;
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if the doctor's schedule allows for appointments on this date (e.g., evenings)
    // You should implement this logic as per your requirements

    const appointment = new Appointment({
      doctor: doctorId,
      patientName,
      appointmentDate,
    });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port localhost://${PORT}`);
});
