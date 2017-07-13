angular
    .module('timelineApp', [])
    .controller('TimelineController', function ($scope) {
        var timeline = this;

        timeline.isDisconnected = true;

        timeline.users = [];
        timeline.posts = [];
        // set default values
        timeline.pseudo = '';
        timeline.postText = '';
        timeline.postTitle = '';
        timeline.postImg = '';
        timeline.postDate = new Date();

        timeline.loginUser = function () {

            timeline.isDisconnected = false;
            timeline.socket = io('ws://localhost:3000');
            timeline.socket.emit('setPseudo', timeline.pseudo);
            timeline.socket.on('newpost', function (post) {
                timeline.posts.push(post);
                $scope.$apply(); // update view
            });
        };

        timeline.sendPost = function () {
            if (timeline.postText.trim() === '' || timeline.postTitle.trim() === '') return;

            var postContent = {
              // set values
                pseudo: timeline.pseudo,
                text: timeline.postText,
                title: timeline.postTitle,
                img: timeline.postImg,
                date: timeline.postDate
            };

            timeline.posts.push(postContent);
            timeline.socket.emit('newpost', postContent);

            // reset values to nothing
            timeline.postText     = '';
            timeline.postTitle    = '';
            timeline.postImg      = '';
            timeline.postDate     = '';
        };

        timeline.deletePost = function (item) {
            timeline.posts.splice(timeline.posts.indexOf(item), 1);
        }

    });
