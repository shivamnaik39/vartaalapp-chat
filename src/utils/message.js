const moment = require("moment");

const generateMessage = (username, text) => {
	return {
		username,
		text,
		time: moment().format("h:mm a"),
	};
};

module.exports = generateMessage;
