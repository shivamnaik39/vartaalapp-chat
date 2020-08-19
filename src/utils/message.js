const generateMessage = (username, text) => {
	return {
		username,
		text,
		time: new Date().getTime(),
	};
};

module.exports = generateMessage;
