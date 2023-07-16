const express = require('express');
const router = express.Router();
const { ReadJsonDataFromFile, WriteJsonDataToFile } = require('../services/FileService');
const filePath = './data/videos.json';
const { v4: uuidv4 } = require('uuid');

//Note: I am mimicking endpoints from https://project-2-api.herokuapp.com/

//GET videos (in the response only get id, title, channel, image)
router.get('/', (req, res) => {
    ReadJsonDataFromFile(filePath)
        .then((data) => {
            const videos = (JSON.parse(data));
            if (!videos) {
                res.status(404).send('No video found!');
                return;
            }
            const video = videos.map((video) => ({
                id: video.id,
                title: video.title,
                channel: video.channel,
                image: video.image
            }))
            res.send(video);
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
        .catch((error) => {
            res.status(500).send({
                message: "Error reading data the video!" + error.message
            })
        });
});


//POST video 
router.post('/', (req, res) => {

    const newVideo = req.body;

    //need to find the way to validate req.body

    ReadJsonDataFromFile(filePath)
        .then((data) => {
            const videos = JSON.parse(data);
            const uploadedVideo = {
                id: uuidv4(),
                ...newVideo,
                views: '0',
                likes: "0",
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
        .catch((error) => {
            res.status(400).send({
                message: "Error uploading new video." + error.message
            })
        });
})

//PUT (like Video)
router.put('/:videoId/likes', (req, res) => {
    const videoId = req.params.videoId;

    ReadJsonDataFromFile(filePath)
        .then((data) => {
            const videos = JSON.parse(data);

            const video = videos.find((video) => video.id === videoId);

            if (!video) {
                res.status(404).send('Video not found.');
                return;
            }
            const likes = video.likes ? parseInt(video.likes.replaceAll(",", '')) + 1 : 1;
            video.likes = Intl.NumberFormat('en-US').format(likes);
            // Update the video.json file with the updated video data
            WriteJsonDataToFile(filePath, JSON.stringify(videos))
                .then(() => {
                    res.send(video);
                })
                .catch((error) => {
                    res.status(500).send({
                        message: "Error updating like count! " + error.message 
                    });
                });
        })
});

//POST comment
router.post('/:videoId/comments', (req, res) => {
    const videoId = req.params.videoId;
    const newComment = req.body; //newComment contains name, comment parameters

    //need to find the way to validate req.body 

    ReadJsonDataFromFile(filePath)
        .then((data) => {
            const videos = JSON.parse(data);
            const video = videos.find((video) => video.id === videoId);

            //when video not found
            if (!video) {
                res.status(404).send('Video not found!');
                return;
            }

            const postedComment = {
                id: uuidv4(),
                ...newComment,
                likes: "",
                timestamp: Date.now(),
            }

            video.comments.push(postedComment);

            WriteJsonDataToFile(filePath, JSON.stringify(videos))
                .then(() => {
                    res.send(postedComment);
                })
                .catch((err) => {
                    res.status(500).send({
                        message: "Error posing new comment! " + err.message
                    })
                });

        })

})


//DELETE comment
router.delete('/:videoId/comments/:commentId', (req, res) => {
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;

    ReadJsonDataFromFile(filePath)
    .then((data) => {
        const videos = JSON.parse(data);
        const video = videos.find((video) => video.id === videoId);
        if(!video) {
            res.status(404).send('Video not found!');
            return;
        }

        const deletedComment = video.comments.filter((comment) => comment.id === commentId);
        const updatedComments = video.comments.filter((comment) => comment.id !== commentId);

        if (!video.comments || video.comments.length === 0 || 
            updatedComments.length === video.comments.length) {
            res.status(404).send('Comment not found!');
            return;
          }

        video.comments = updatedComments;

        WriteJsonDataToFile(filePath, JSON.stringify(videos))
        .then(() => {
            res.send(deletedComment);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error deleting comment! " + err.message
            })
        });
    })

    
})


module.exports = router;