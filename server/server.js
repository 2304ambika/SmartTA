const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const PPTX = require('pptxgenjs');
const connectDB = require('./db'); // Import the database connection
const Question = require('./models/Question');
const User = require('./models/User');
const Poll = require('./models/Poll');
const Score = require('./models/Score');
const PasswordResetToken = require('./models/PasswordResetToken'); 
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');  // Import uuidv4
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const OpenAI = require('openai');
const { PDFDocument } = require('pdf-lib');
const axios = require('axios');
const { Document, Packer, Paragraph, TextRun } = require('docx'); // Import from docx package
const http = require('http');
const socketIo = require('socket.io');
// const { url_backend } = require('./constant');
require('dotenv').config();

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

// console.log("openai",process.env.REACT_APP_OPENAI_API_KEY);
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
connectDB();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});


//score
app.post('/api/scores', async (req, res) => {
  const { sessionId, email, score, totalQuestions, timeTaken } = req.body;
  const newScore = new Score({ sessionId, email, score, totalQuestions, timeTaken });
  await newScore.save();
  res.status(201).json(newScore);
});

app.get('/api/scores/:sessionId', async (req, res) => {
  const scores = await Score.find({ sessionId: req.params.sessionId });
  res.json(scores);
});


//login & signup
const CLIENT_ID = '396963304688-pk3nkgsbr3ud9deoasm9qlc82i8kejmq.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

app.post('/signup', async (req, res) => {
  const { name, department, email, password, role } = req.body;

  try {
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      department,
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send('Error signing up');
  }
});

app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('Please signup');
    }
    // console.log("inside login password",password);
    // console.log("inside login compare",await bcrypt.compare(password, user.password));
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send('Incorrect password');
    }
    res.status(200).send({ role: user.role, email: user.email, name: user.name });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.post('/google-login', async (req, res) => {
  const { token, role } = req.body;

  console.log("Token", token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });

    console.log("Ticket", ticket);
    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name: payload.name,
        role,
        password: '' // Google users don't need a password
      });

      await user.save();
    }

    res.status(200).send({ role: user.role, email: user.email,name: user.name });
  } catch (error) {
    console.error('Error logging in with Google:', error);
    res.status(500).send('Error logging in with Google');
  }
});

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '2304ambika.gupta@gmail.com',
    pass: 'ymzv uxve ebsb sxqf'
  }
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('Email id not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 300000; // 5 minutes
    const resetToken = new PasswordResetToken({
      userId: user._id,
      token,
      expires
    });

    await resetToken.save();

    const resetLink =`http://localhost:5000/reset/${encodeURIComponent(token)}?expires=${expires}`;

    const mailOptions = {
      to: user.email,
      from: '2304ambika.gupta@gmail.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetLink}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).send('Error sending email');
      }
      res.status(200).send('Password reset link sent to your email');
    });
  } catch (error) {
    console.error('Error processing forgot password request:', error);
    res.status(500).send('Server error');
  }
});

// app.post('/reset/:token', async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).send('Password reset token is invalid or has expired');
//     }

//     // user.password = await bcrypt.hash(password, 10);
//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.status(200).send('Password has been updated');
//   } catch (error) {
//     console.error('Error resetting password:', error);
//     res.status(500).send('Server error');
//   }
// });

app.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const resetToken = await PasswordResetToken.findOne({
      token,
      expires: { $gt: Date.now() }
    });

    if (!resetToken) {
      return res.status(400).send('Password reset token is invalid or has expired');
    }

    const user = await User.findById(resetToken.userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await PasswordResetToken.findByIdAndDelete(resetToken._id);

    res.status(200).send('Password has been updated');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Server error');
  }
});


//quiz-generation
// Serve static files from the "data" directory
app.use('/data', express.static(path.join(__dirname, 'data')));

const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};


//Create Poll Routes

pollFormat=`
          [
            {
              "question": "What is the highest achievement of the Indian national football team in the AFC Asian Cup?",
              "options": ["Winners", "Runners-up", "Semi-finalists", "Quarter-finalists"],
              "answer": "Winners",
              "hint": "Think about the historical tournaments where India made significant progress in Asian football."
            },
            {
              "question": "Who is considered one of the most legendary players of the Indian football team, often referred to as the 'Bhaichung Bhutia of the modern era'?",
              "options": ["Sunil Chhetri", "Gurpreet Singh Sandhu", "Sandesh Jhingan", "Jeje Lalpekhlua"],
              "answer":"Sunil Chhetri"
              "hint": "He is among the world's top international goal-scorers and is a current icon in Indian football."
            }
          ]
        `
// Create a new poll
const generatePolls = async (prompt, count) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a Poll creator.' },
      { role: 'user', content: `Generate ${count} poll questions with options, answer and hints based on the following topic: ${prompt}. The output should be in following format: ${pollFormat}.` },
    ],
    max_tokens: 500,
  });
  console.log(formatQues(response.choices[0].message.content));
    let questions;

  try {
    questions = formatQues(response.choices[0].message.content); // Parse the JSON string into an object
  } catch (e) {
    console.error('Failed to parse content:', e);
  }

  const pollQuestions = questions.map((question) => {
    // Parse the response to extract questions, options, and hints
    return {
      question: question.question,
      options: question.options,
      correctAnswer: question.answer,
      hints: question.hint,
    };
  });
  console.log("PollQuestions",pollQuestions);
  return pollQuestions;
};

app.post('/generate-poll', async (req, res) => {
  const { prompt, count } = req.body;

  try {
    const pollQuestions = await generatePolls(prompt, count);
    
    // Save each question in the database
    const polls = await Promise.all(pollQuestions.map(async (q) => {
      const poll = new Poll({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        hints: q.hints,
        responses: {
          A: 0,
          B: 0,
          C: 0,
          D: 0
        },
        status: 'active',
      });
      return poll.save();
    }));

    io.emit('pollCreated', polls);
    res.json({ polls });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/latest-polls', async (req, res) => {
  try {
    const polls = await Poll.find({ status: 'active' });
    res.json(polls);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/submit-response', async (req, res) => {
  const { pollId, selectedOption } = req.body;
  const poll = await Poll.findById(pollId);
  console.log("poll",poll);
  if (!poll) {
    return res.status(404).send('Poll not found');
  }

  // Find the key corresponding to the selected option value
  const optionKey = Object.keys(poll.options).find(key => poll.options[key] === selectedOption);
  const numericOptionKey = optionKey !== undefined ? parseInt(optionKey, 10) : 0;
  console.log('optionKey value:', numericOptionKey);
  console.log('optionKey', String.fromCharCode(65 + numericOptionKey));

  if (optionKey && String.fromCharCode(65 + numericOptionKey) in poll.responses){
    poll.responses[String.fromCharCode(65 + numericOptionKey)] += 1;
    console.log("response",poll.responses[String.fromCharCode(65 + numericOptionKey)]);
    await poll.save();
    io.emit('pollUpdated', poll); // Emit event to all clients
    res.json({ poll });
  } else {
    res.status(400).send('Invalid option');
  }
});



app.get('/poll/:pollId', async (req, res) => {
  const poll = await Poll.findById(req.params.pollId);
  if (!poll) {
    return res.status(404).send('Poll not found');
  }
  res.json({ poll });
});

app.post('/end-poll', async (req, res) => {
  const { pollId } = req.body;
  await Poll.findByIdAndUpdate(pollId, { status: 'ended' });
  io.emit('pollEnded', pollId); // Emit event to all clients
  res.status(200).send('Poll ended');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
app.post('/save-questions', async (req, res) => {
  const { questions, purpose, title } = req.body;

  if (!purpose) {
    return res.status(400).send('Purpose is required');
  }
  try {
    const sessionId = uuidv4();
    const currentDate = formatDate(new Date());
    const questionDocs = questions.map(question => ({
      questions: question,
      purpose,
      sessionId,
      title:title,
      date: currentDate
    }));

    const savedQuestions = await Question.insertMany(questionDocs);

    res.status(200).send({ sessionId, questions: savedQuestions });
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    res.status(500).send('Error saving to MongoDB');
  }
});

app.post('/fetch-questions', async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

const ObjectId = mongoose.Types.ObjectId;

app.put('/accept-question/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndUpdate(id, { status: 'accepted' });
    res.status(200).json({ message: 'Question accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept question' });
  }
});

app.put('/reject-question/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).send('Question not found');
    
    question.status = 'rejected';
    await question.save();
    res.status(200).send('Question rejected');
  } catch (error) {
    console.error('Error rejecting question:', error);
    res.status(500).send('Error rejecting question');
  }
});

app.put('/replace-question/:id', async (req, res) => {
  const { question, options, correct_options } = req.body;
  
  try {
    const questionDoc = await Question.findById(req.params.id);
    if (!questionDoc) return res.status(404).send('Question not found');
    
    questionDoc.questions = { question, options, correct_options };
    questionDoc.status = 'none';
    console.log("Questions",question);
    console.log("QuestionDoc",questionDoc);
    await questionDoc.save();
    res.status(200).send({questions:questionDoc.questions});
  } catch (error) {
    console.error('Error replacing question:', error);
    res.status(500).send('Error replacing question');
  }
});

app.put('/edit-questions', async (req, res) => {
  const updatedQuestions = Array.isArray(req.body) ? req.body : [req.body];  // Ensure req.body is an array
  console.log("New Questions:", updatedQuestions[0].questions);

  try {
    const processedQuestions = updatedQuestions.map(question => {
      // Capitalize correct_options before updating
      if (question.correct_options && Array.isArray(question.correct_options)) {
        question.correct_options = question.correct_options.map(ans => ans.toUpperCase());
      } else {
        question.correct_options = []; // Handle cases where correct_options is undefined or not an array
      }
      // question.correct_options = question.correct_options.map(ans => ans.toUpperCase());
      return question;
    });
    console.log('processedQuestions',processedQuestions);
    const promises = processedQuestions.map(async (updatedQuestion) => {
      const { _id, ...questions } = updatedQuestion;
      try {
        const question = await Question.findByIdAndUpdate(_id, questions, { new: true });
        if (!question) {
          throw new Error(`Question with ID ${_id} not found`);
        }
        console.log(`Updated question with ID ${_id}:`, question);
        return question;
      } catch (error) {
        console.error(`Error updating question with ID ${_id}:`, error);
        throw error; // Propagate the error up to Promise.all()
      }
    });

    const updatedResults = await Promise.all(promises);
    console.log("Updated Questions:", updatedResults[0].questions);
    res.json({ message: 'Questions edited successfully', updatedQuestions: updatedResults });
  } catch (error) {
    console.error('Error editing questions in database:', error);
    res.status(500).json({ error: 'Failed to edit questions' });
  }
});


app.post('/add-question', async (req, res) => {
  try {
    const { questions, sessionId, purpose,title } = req.body;
    // console.log(questions);
    // Create an array to store saved questions
    const savedQuestions = [];
    const currentDate = formatDate(new Date());
    // Loop through each question in the array
    for (const q of questions) {
      // Create a new instance of the Question model for each question
      const newQuestion = new Question({
        questions: {
                  question: q.question,
                  options: q.options,
                  correct_options: q.correct_options
                },
        status: 'none',
        sessionId: sessionId,
        purpose: purpose,
        title:title,
        date: currentDate
      });

      // Save the question to the database
      const savedQuestion = await newQuestion.save();
      savedQuestions.push(savedQuestion);
    }
    console.log(savedQuestions);
    res.status(200).json(savedQuestions);
  } catch (error) {
    console.error('Error adding questions:', error);
    res.status(500).send('Internal Server Error');
  }
});

const formatQues = (text) => {
  text = text.replace("```json", "").replace("```", "");
  const data = JSON.parse(text);
  return data;
};


const selectRandom = (allQuestions, numQuestions) => {
  const finalList = [];
  while (finalList.length < numQuestions) {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const randomElement = allQuestions[randomIndex];
    if (!finalList.includes(randomElement)) {
      finalList.push(randomElement);
    }
  }
  return finalList;
};

const exampleQuestions = [
  {
    question: "Which of the following statements are true about data science?",
    options: [
      "Data science integrates domain knowledge from various application domains.",
      "Data science is the same as computer science and information science.",
      "Data science uses techniques and theories from fields like mathematics, statistics, and computer science.",
      "Data science is limited to structured data only"
    ],
    correct_options: [
      "A",
      "C"
    ]
  },{
    question: "Which of the following statements are true about cloud computing?",
    options: [
      "Cloud computing means a type of Internet-based computing.",
      "Clusters are a combination of traditional IT and public or private clouds.",
      "Kubernetes is an open-source platform for managing containerized workloads and services.",
      "IaaS delivers computer infrastructure on an outsourced basis."
    ],
    correct_options: [
      "A",
      "C",
      "D"
    ]
  },
  {
    question: "What is the capital of France?",
    options: [
      "Berlin",
      "Madrid",
      "Paris",
      "Lisbon"
    ],
    correct_options: [
      "C"
    ]
  }
];

const createQues=async (text,file,numQuestions,questionTypes) => {
  let fileText = text;
  let finalQuestions=[];
  // Parse questionTypes to ensure it is an array
  let parsedQuestionTypes;
  try {
    parsedQuestionTypes = JSON.parse(questionTypes);
    if (!Array.isArray(parsedQuestionTypes)) {
      throw new Error('Invalid questionTypes format');
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid questionTypes format' });
  }

  if (file) {
    try {
      if (file.mimetype === 'application/pdf') {
        const data = await pdfParse(file.buffer);
        fileText = data.text;
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword') {
        const data = await extractTextAndImagesFromDocx(file.buffer);
        fileText = data.text;
        // console.log("fileText",fileText);
      } else {
        return res.status(400).send('Unsupported file type.');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      return res.status(500).send('Error processing file.');
    }
  }

  try {
    const chunks = chunkText(fileText, 2000);
    let allQuestions = [];

    for (const chunk of chunks) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `You are an expert MCQ maker who generates all questions with answers of specific question type(s).Output is given in JSON format with keys named as question, options, and correct_options.` },
          { role: 'user', content: `Generate ${Math.ceil(numQuestions / chunks.length)} questions along with answers from the following text:\n${chunk}\nQuestion types: ${parsedQuestionTypes}` },
          { role: 'assistant', content: `Format the questions according to exampleQuestions. In exampleQuestions the first and second elements are example for Multiple Choice and third element is for Single Choice format.\n exampleQuestions:\n${JSON.stringify(exampleQuestions, null, 2)}. Format the questions accordingly`}
        ],
        max_tokens: 1500,
        temperature: 0.6,
      });
      const questions = formatQues(response.choices[0].message.content);
      allQuestions = allQuestions.concat(questions);
    }

    finalQuestions = selectRandom(allQuestions, numQuestions);
    console.log("finalQues",finalQuestions);  
  }catch(error) {
      console.error('Error processing file:', error);
      return res.status(500).send('Error generating questions.');
      return [];
  }
  return finalQuestions;
};


app.post('/generate-quiz', upload.single('file'), async (req, res) => {
  const { text, numQuestions, questionTypes, title, purpose } = req.body;
  const file = req.file;
  try {
    const finalQuestions = await createQues(text, file, numQuestions, questionTypes);

    // Check if finalQuestions is an array
    if (!Array.isArray(finalQuestions)) {
      throw new Error('finalQuestions is not an array');
    }

    try {
      const response = await axios.post('http://localhost:5000/save-questions', {
        questions: finalQuestions,
        purpose,
        title
      });
      res.json({ questions: response.data.questions, sessionId: response.data.sessionId });
    } catch (error) {
      console.error('Error saving questions:', error);
      res.status(500).send('Error saving questions.');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).send('Error generating questions.');
  }
});

app.post('/generate-question', upload.single('file'), async (req, res) => {
  const { text, numQuestions, questionTypes, title, purpose,sessionId } = req.body;
  const file = req.file;
  try {
    const finalQuestions = await createQues(text, file, numQuestions, questionTypes);

    // Check if finalQuestions is an array
    if (!Array.isArray(finalQuestions)) {
      throw new Error('finalQuestions is not an array');
    }

    try {
      const response = await axios.post('http://localhost:5000/add-question', {
        questions: finalQuestions.map(q => ({ ...q, sessionId })),
        sessionId,
        purpose,
        title
      });

      console.log("Response", response);

      // Transform the response data
      const transformedData = response.data.map(item => ({
        questions: item.questions,
        purpose: item.purpose,
        title: item.title,
        status: item.status,
        sessionId: item.sessionId,
        date: item.date,
        _id: item._id,
        __v: item.__v
      }));

      res.json({ questions: transformedData, sessionId: sessionId });
    } catch (error) {
      console.error('Error saving questions:', error);
      res.status(500).send('Error saving questions.');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).send('Error generating questions.');
  }
});


app.get('/download-questions/:sessionId', async (req, res) => {
  try {
    const questions = await Question.find({ sessionId: req.params.sessionId, status: { $in: ['accepted', 'none'] } });
    console.log(questions);
    if (!questions.length) return res.status(404).send('No questions found');
    
    // Initialize PPTX instance
    const pptx = new PPTX();

    // // Iterate through each question document
    // questions.forEach((questionDoc, index) => {
    //   const question = questionDoc.questions[0]; // Assuming questions is an array of objects
    //   const slide = pptx.addSlide();
      
    //   // Add question text
    //   slide.addText(`Q${index+1}) ${question.question}`, { x: 0.5, y: 0.5, fontSize: 24, color: '363636' });
      
    //   // Add options if they exist
    //   if (question.options && Array.isArray(question.options)) {
    //     question.options.forEach((option, optIndex) => {
    //       slide.addText(`${String.fromCharCode(65 + optIndex)}. ${option}`, { x: 0.5, y: 1 + optIndex * 0.5, fontSize: 20 });
    //     });
    //   } else {
    //     console.warn(`Options missing or not an array for question: ${question.question}`);
    //   }
      
    //   // Add correct answer if it exists
    //   if (question.correct_options) {
    //     slide.addText(`Answer: ${question.correct_options}`, { x: 0.5, y: 3.5, fontSize: 20, color: '00CC00' });
    //   } else {
    //     console.warn(`Correct answer missing for question: ${question.question}`);
    //   }
    // });

    // Add cover slide
  const coverSlide = pptx.addSlide();
  coverSlide.addText(`Quiz Presentation: ${questions[0].title}`, { x: 1.5, y: 2, fontSize: 32, color: '000000' });
  coverSlide.addText(`Total Questions: ${questions.length}`, { x: 1.5, y: 3.5, fontSize: 24, color: '333333' });
  // coverSlide.addText(`Date: ${new Date().toLocaleDateString()}`, { x: 1.5, y: 4, fontSize: 24, color: '333333' });

  questions.forEach((questionDoc, index) => {
    const question = questionDoc.questions[0]; // Assuming questions is an array of objects
    const slide = pptx.addSlide();

    // Calculate text heights
    const questionHeight = 0.5 + (Math.ceil(question.question.length / 90) * 0.5); // Estimate height based on character length
    let currentY = questionHeight;

    // Add question text
    slide.addText(`Q${index + 1}) ${question.question}`, { x: 0.5, y: 0.5, fontSize: 24, color: '363636' });

    // Add options if they exist
    if (question.options && Array.isArray(question.options)) {
      question.options.forEach((option, optIndex) => {
        const optionHeight = Math.ceil(option.length / 90) * 0.5;
        slide.addText(`${String.fromCharCode(65 + optIndex)}. ${option}`, { x: 0.5, y: currentY, fontSize: 20 });
        currentY += optionHeight;
      });
    } else {
      console.warn(`Options missing or not an array for question: ${question.question}`);
    }

    // Add correct answer if it exists
    if (question.correct_options) {
      slide.addText(`Answer: ${question.correct_options}`, { x: 0.5, y: currentY + 0.5, fontSize: 20, color: '00CC00' });
    } else {
      console.warn(`Correct answer missing for question: ${question.question}`);
    }
  });

    // Generate PPT file and send as response
    const pptBuffer = await pptx.write('base64');
    const pptData = Buffer.from(pptBuffer, 'base64');
    
    // Set response headers for PPT file
    res.type('application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.send(pptData);
  } catch (error) {
    console.error('Error generating PPT:', error);
    res.status(500).send('Error generating PPT');
  }
});

app.get('/api/quizzes', async (req, res) => {
  console.log("Fetch quiz");
  try {
    const quizzes = await Question.find({status: { $in: ['accepted', 'none'] } });
    // console.log(quizzes);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quizzes' });
  }
});

app.get('/api/quizzes/:sessionId', async (req, res) => {
  try {
    const quiz = await Question.findOne({ sessionId: req.params.sessionId, status: { $in: ['accepted', 'none'] } });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quiz details' });
  }
});

app.post('/api/quizzes', async (req, res) => {
  try {
    const newQuiz = new Question(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(400).json({ error: 'Error creating quiz' });
  }
});

app.get('/play-questions/:sessionId', async (req, res) => {
  try {
    const questions = await Question.find({ sessionId: req.params.sessionId, status: { $in: ['accepted', 'none'] } });
    
    if (!questions.length) return res.status(404).send('No questions found');

    res.status(200).send(questions.map(q => q.questions));
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Error fetching questions');
  }
});

//content-creation

const extractImagesFromPDF = async (pdfBuffer) => {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  const images = [];

  for (const page of pages) {
    const xObjects = page.node.Resources.XObject;
    if (xObjects) {
      const xObjectKeys = Object.keys(xObjects);
      for (const key of xObjectKeys) {
        const xObject = xObjects[key];
        if (xObject && xObject.data) {
          const imageBuffer = xObject.data;
          images.push(imageBuffer);
        }
      }
    }
  }
  return images;
};

const extractTextAndImagesFromDocx = async (buffer) => {
  const result = await mammoth.convertToHtml({ buffer });
  const text = result.value.replace(/<[^>]+>/g, ''); // Extract raw text and remove HTML tags
  const images = result.messages
    .filter(msg => msg.type === 'image')
    .map(imgMsg => imgMsg.image);
  return { text, images };
};

const chunkText = (text, maxChunkSize) => {
  let chunks = [];
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.substring(i, i + maxChunkSize));
  }
  return chunks;
};

//summary
const generateSummaryContent = async (chunks, prompt) => {
  let summaryContent = '';

  for (const chunk of chunks) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a summarizer.' },
        { role: 'user', content: `Summarize the following text:\n\n${chunk}\n\n in the word limit of ${prompt}. The format of the output should be in bullet points with their respective headings in bold and each bullet point in next line.` },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });
    
    summaryContent += response.choices[0].message.content + '\n';
  }
  console.log(summaryContent);
  return summaryContent;
};

app.post('/summary-creation', upload.single('file'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;
  
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  let fileText = '';

  try {
    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      fileText = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const data = await extractTextAndImagesFromDocx(file.buffer);
      fileText = data.text;
    } else {
      return res.status(400).send('Unsupported file type.');
    }

    const chunks = chunkText(fileText, 4000);
    console.log("Chunks len",chunks.length);
    
    const summaryContent = await generateSummaryContent(chunks, prompt);
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Summary:',
                  bold: true,
                  break: 1,
                }),
                new TextRun({
                  text: summaryContent,
                  break: 1,
                }),
              ],
            }),
          ],
        },
      ],
    });
    console.log("doc1",doc);
    // Generate a buffer containing the Word document
    const buffer = await Packer.toBuffer(doc);

    const filePath = path.join(__dirname, 'summary.docx');
    fs.writeFileSync(filePath, buffer);

    // Send the extracted text and the download link
    res.json({
      summary: summaryContent,
      downloadLink: `http://localhost:5000/download/summary.docx`,
    });
    // res.json({ summary: summaryContent });
    
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).send('Failed to generate content. Please try again.');
  }
});


//ppt
const MAX_SIMILARITY = 0.7; // Threshold for considering two topics as similar

const generateSlides = async (fileText, images, pptx,max_slides) => {
  console.log("Max_slides",max_slides);
  const chunks = chunkText(fileText, 4000);
  const summaries = await extractAndSummarizeTopics(chunks,max_slides);
  
  await createSlidesForSummaries(summaries, images, pptx,max_slides);
};

const getSimilarity = (text1, text2) => {
  const set1 = new Set(text1.split(' '));
  const set2 = new Set(text2.split(' '));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
};

const extractAndSummarizeTopics = async (chunks,max_slides) => {
  let summaries = [];
  let uniqueSummaries = new Set();

  for (const chunk of chunks) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a PPT content creator and an expert summarizer.' },
        { role: 'user', content: `Identify the main topics and provide a concise summary for each topic to create a ppt of ${max_slides} slides in the following text \n\nText: ${chunk}. Use the format: \n\n**Slide [slide_number]:**\n**Topic:** [topic]\n**Summary:** [summary]` },
      ],
      max_tokens: 1500,
      temperature: 0.5,
    });

    const chunkSummaries = response.choices[0].message.content.split('\n').filter(line => line.trim());
    console.log("chunkSummaries",chunkSummaries);

    let topic = '';
    let summary = '';

    for (let i = 0; i < chunkSummaries.length; i++) {
      if (chunkSummaries[i].startsWith('**Topic:**')) {
        topic = chunkSummaries[i].replace('**Topic:**', '').trim();
      } else if (chunkSummaries[i].startsWith('**Summary:**')) {
        summary = chunkSummaries[i].replace('**Summary:**', '').trim();
        // Check if the next lines are part of the summary
        let j = i + 1;
        while (j < chunkSummaries.length && !chunkSummaries[j].startsWith('**Slide') && !chunkSummaries[j].startsWith('**Topic:**') && !chunkSummaries[j].startsWith('**Summary:**')) {
          summary += ' ' + chunkSummaries[j].trim();
          j++;
        }
        i = j - 1; // Update i to skip the processed summary lines

        const combinedSummary = `**Topic:** ${topic}\n**Summary:** ${summary}`;

        let isUnique = true;
        for (const existingSummary of uniqueSummaries) {
          if (getSimilarity(combinedSummary, existingSummary) > MAX_SIMILARITY) {
            isUnique = false;
            break;
          }
        }

        if (isUnique) {
          summaries.push(combinedSummary);
          uniqueSummaries.add(combinedSummary);
        }
      }
    }
  }

  // console.log()
  console.log("Summary",summaries);
  if(summaries.length>max_slides) summaries.slice(0, max_slides);
  return summaries; // Limit to max_slides unique summaries
};

const createSlidesForSummaries = async (summaries, images, pptx, max_slides) => {
  let slideCount = 0;

  for (const summary of summaries) {
    if (slideCount >= max_slides) break;

    const lines = summary.split('\n').filter(line => line.trim());
    let currentSlide = pptx.addSlide();
    let slideText = '';
    let slideHeight = 1;

    for (const [index, line] of lines.entries()) {
      slideText += `${line}\n`;
      if (slideText.length > 400 || index === lines.length - 1) {
        currentSlide.addText(slideText, {
          x: 0.5, y: slideHeight, w: '90%', h: 1, fontSize: 18, color: '363636', valign: 'top', isTextBox: true
        });
        slideText = '';
        slideHeight += 1.5;
        if (slideHeight >= 7.5) {
          currentSlide = pptx.addSlide();
          slideHeight = 1;
        }
      }
    }

    if (images.length > 0 && slideHeight < 7.5) {
      const imageBuffer = images[slideCount % images.length]; // Cycle through images
      const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(imageBlob);
      currentSlide.addImage({
        path: imageUrl, x: 0.5, y: slideHeight, w: 6, h: 4, sizing: { type: 'contain', w: 6, h: 4 }
      });
    }

    slideCount++;
  }
};


app.post('/ppt-creation', upload.single('file'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;
  
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  let fileText = '';
  let images = [];

  try {
    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      fileText = data.text;
      images = await extractImagesFromPDF(file.buffer);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const data = await extractTextAndImagesFromDocx(file.buffer);
      fileText = data.text;
      images = data.images;
    } else {
      return res.status(400).send('Unsupported file type.');
    }

    const chunks = chunkText(fileText, 4000);
    console.log("Chunks len",chunks.length);

    const pptx = new PPTX();

    // Create a title slide
    const coverSlide = pptx.addSlide();
    coverSlide.background = { color: 'FFFFFF' };
    coverSlide.addText('Presentation Title', { x: 1.5, y: 1.5, fontSize: 36, color: '000000', bold: true });
    // coverSlide.addText(`Total Questions: ${summaries.length}`, { x: 1.5, y: 3.5, fontSize: 24, color: '333333' });
    // coverSlide.addText(`Date: ${new Date().toLocaleDateString()}`, { x: 1.5, y: 4, fontSize: 24, color: '333333' });
    
    await generateSlides(fileText, images, pptx,prompt);
    
    const pptxFilePath = path.join(__dirname, 'data', 'generated_ppt');
    if (!fs.existsSync(pptxFilePath)) fs.mkdirSync(pptxFilePath, { recursive: true });
    const pptFileName = `${Date.now()}.pptx`;
    const pptFilePath = path.join(pptxFilePath, pptFileName);

    await pptx.writeFile(pptFilePath);
    res.status(200).send({
      message: 'PPT generated successfully',
      pptUrl: `/data/generated_ppt/${pptFileName}`
    });

  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).send('Failed to generate content. Please try again.');
  }
});

//whiteboard

// Function to read and encode an image file in base64
const readImageFile = (buffer) => {
  return buffer.toString('base64');
};

const prompt = `
You are an AI assistant that helps in analyzing images of whiteboards. The images may contain text, tables, and diagrams. Please analyze the given image and provide the extracted content in a structured format. If the image contains tabular data, display it as a table. If it contains diagrams, describe them. Provide the content in the following format:

### Extracted Content

#### Text:
<Extracted text here or 'None' if no text is present>

#### Table:
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
or 'None' if no table is present

#### Diagram:
Description of the diagram here or 'None' if no diagram is present.

Here is an example:

### Extracted Content

#### Text:
Server virtualization is used to improve resource management.

#### Table:
| Type        | Description                          |
|-------------|--------------------------------------|
| Full        | Requires a hypervisor.               |
| Para        | Aware of the hypervisor but with fewer needs. |
| OS-level    | No need for a hypervisor. Uses the physical server OS. |

#### Diagram:
A diagram showing the distribution of tasks to virtual servers from a physical server.

If the image does not contain any text, table, or diagram, please indicate 'None' for the respective sections.

Now, analyze the following image and provide the content in the same format:
`;

// Endpoint to upload the image
app.post('/upload', upload.single('whiteboardImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    // Read and encode the image file in base64
    const encodedImage = readImageFile(req.file.buffer);

    // Create the message payload with the encoded image
    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${encodedImage}`,
            },
          },
        ],
      }
    ];

    // Call OpenAI API to analyze the image and extract text
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Hypothetical model name with vision capabilities
      messages: messages,
      max_tokens: 300,
    });

    const extractedText = response.choices[0].message.content;
    console.log(extractedText);

    // Split the extracted text by newline characters
    const textLines = extractedText.split('\n');

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Extracted Text:',
                  bold: true,
                  break: 1,
                }),
                ...textLines.map(line => new TextRun({ text: line, break: 1 })),
              ],
            }),
          ],
        },
      ],
    });
    console.log("doc1",doc);
    // Generate a buffer containing the Word document
    const buffer = await Packer.toBuffer(doc);

    const filePath = path.join(__dirname, 'extracted_text.docx');
    fs.writeFileSync(filePath, buffer);

    // Send the extracted text and the download link
    res.json({
      extractedText,
      downloadLink: `http://localhost:5000/download/extracted_text.docx`,
    });
    // res.json({
    //   extractedText,
    // });
  } catch (error) {
    console.error(`Error processing image: ${error}`);
    res.status(500).send('Server error');
  }
});

// Endpoint to download the Word file
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error(`Error downloading file: ${err}`);
      res.status(500).send('Server error');
    }
  });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log("server running");
});


