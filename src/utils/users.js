const users = [];

// add user, remove, getUser, getUsersinRoom

const addUser = ({ id, username, room }) => {
	//clean the data
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	// vallidate the data
	if (!username || !room) {
		return {
			error: "username and room are required!",
		};
	}

	// check existing user
	const existingUserr = users.find((user) => {
		return user.room === room && user.username === username;
	});

	// validate username
	if (existingUserr) {
		return {
			error: "Username is in use!",
		};
	}

	// store the user
	const user = { id, username, room };
	users.push(user);
	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
};
