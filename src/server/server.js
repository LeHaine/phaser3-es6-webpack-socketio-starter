const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

io.on("connection", function(socket) {
    console.log("a user connected");
    socket.on("disconnect", function() {
        console.log("user disconnected");
    });
});

app.set("port", 8080);
server.listen(app.get("port"), function() {
    console.log(`Listening on ${server.address().port}`);
});
