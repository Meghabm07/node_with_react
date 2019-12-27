const express = require('express');
const connectDB = require('./config/db.js');

const app = express();

//connect db
connectDB();

// initialise middleware

app.use(express.json({
    extended: false
}));

//Define Routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));

const PORT = process.eventNames.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));