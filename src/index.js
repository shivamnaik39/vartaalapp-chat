const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const generateMessage = require("./utils/message");
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Bot name
const botName = "Vartaalapp Bot";

// New client connection
io.on("connection", (socket) => {
	socket.on("join", ({ username, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, username, room });

		// check for error
		if (error) {
			return callback(error);
		}

		// join the user to appropriate room
		socket.join(user.room);

		// Welcome message for new user
		socket.emit(
			"message",
			generateMessage(botName, `Welcome to ${user.room} room!!`)
		);

		// Broadcast to other users about new user
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				generateMessage(botName, `${user.username} has joined the chat...`)
			);

		// Send room data
		io.to(user.room).emit("RoomData", {
			room: user.room,
			users: getUsersInRoom(user.room),
		});

		callback();
	});

	// Listen to sendMessage event
	socket.on("sendMessage", (message, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit("message", generateMessage(user.username, message));
		callback();
	});

	// Inform everyone that user has left the chat (Disconnect)
	socket.on("disconnect", () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit(
				"message",
				generateMessage(botName, `${user.username} has left the chat..`)
			);

			// Send room data
			io.to(user.room).emit("RoomData", {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
		}
	});
});

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

// set static folder
app.use(express.static(publicPath));

server.listen(PORT, () => console.log(`Server is running at port ${PORT}...`));
