const express = require('express');
const router = express.Router();
const { ReadJsonDataFromFile, WriteJsonDataToFile } = require('../services/FileService');
const filePath = './data/videos.json';
const { v4: uuidv4 } = require('uuid');

//GET videos
router.get('/', (req, res) => {
    ReadJsonDataFromFile(filePath)
        .then((data) => {
            res.send(JSON.parse(data));
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error reading data for videos!"
            })
        });
});

//GET video for a specific video ID
router.get('/:videoId', (req, res) => {

    const videoId = req.params.videoId;

    ReadJsonDataFromFile(filePath)
        .then((data) => {
            const videos = JSON.parse(data);
            const video = videos.find((video) => video.id === videoId);

            if (!video) {
                res.status(404).send('Video not found!');
            } else {
                res.send(video);
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error reading data the video!"
            })
        });
});


//POST video 
router.post('/', (req, res) => {

        const newVideo = req.body;

    ReadJsonDataFromFile(filePath)
        .then((data) => {
            const videos = JSON.parse(data);
            const uploadedVideo = {
                id: uuidv4(),
                ...newVideo,
                timestamp: Date.now(),
                comments: []
            }

            videos.push(uploadedVideo);

            WriteJsonDataToFile(filePath, JSON.stringify(videos))
                .then((videos) => {
                    res.send(uploadedVideo);
                })
                .catch((error) => {
                    res.status(400).send({
                        message: "Error uploading new video! " + error.message
                    })
                })

        })
        .catch((err) => {
            res.status(400).send({
                message: "Error uploading new video." + err.message
            })
        });
})

module.exports = router;