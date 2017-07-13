const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use( '/node_modules', express.static(path.join(__dirname, 'node_modules')) );
app.use( express.static(path.join(__dirname, 'public')) );

let usersList = [];
let postsList = [];

// New connection
io.on('connection', socket => {

    // Initialize empty user & post
    const currentUser = {
        id     : null,
        pseudo : null
    };

    const newPost = {
        pseudo : null,
        title: null,
        img: null,
        text : null,
        date: null
    };

    socket.on('setPseudo', pseudo => {

        currentUser.id     = socket.id;
        currentUser.pseudo = pseudo;
        usersList.push(currentUser);
        socket.emit('usersList', usersList);

        socket.broadcast.emit('newUser', currentUser);
    });


    socket.on('newpost', (post) => {
        newPost.pseudo = currentUser.pseudo;
        newPost.title = post.title;
        newPost.img = post.img;
        newPost.text = post.text;
        newPost.date = post.date;
        postsList.unshift(newPost);
        socket.broadcast.emit('newpost', newPost);

    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected', currentUser);
        usersList = usersList.filter(user => user !== currentUser);
    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Le serveur écoute sur le port ${port}`));
