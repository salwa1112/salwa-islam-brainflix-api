const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const videosRouter = require('./routes/videos');

const PORT = process.env.PORT || 5051; //Fallback if .env variable doesn't exist

// Using CORS for cross origin requests
app.use(cors());

//Using express json to receive request body in JSON
app.use(express.json());
app.use(express.static('public'));

app.use('/videos', videosRouter);

app.listen(PORT, ()=> {
    console.log('Listening on', PORT);
})