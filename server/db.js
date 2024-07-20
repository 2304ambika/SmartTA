// const mongoose = require('mongoose');

// const mongoURI = 'mongodb://127.0.0.1:27017/smartTA';

// mongoose.connect(mongoURI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.error('Failed to connect to MongoDB', err);
//   });

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // const mongoURI = 'mongodb://127.0.0.1:27017/smartTA';
    const mongoURI = "mongodb+srv://root:root@smartta.eiadrmb.mongodb.net/?retryWrites=true&w=majority&appName=smartTA";
    // const options =  {
    //   useNewUrlParser: true,
    //   useunifiedTopology: true
    // };
    // await mongoose.connect(mongoURI, options);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
};

module.exports = connectDB;