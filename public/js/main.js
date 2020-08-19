// ***************************** Soclet.io *********************************
const socket = io();

//  UI variables
const $messageForm = document.querySelector("#message-form");
const $messageText = $messageForm.querySelector("#message-text");
const $messages = document.querySelector("#chat-window-display");
const $roomName = document.querySelector("#chat-sidebar #room-name");
const $roomUsers = document.querySelector("#chat-sidebar #room-users");

// Get username and room from url
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

// Join Room
socket.emit("join", { username, room }, (error) => {
	if (error) {
		alert(error);
		location.href = "/";
	}
});

// Get room data
socket.on("RoomData", ({ room, users }) => {
	displayRoomName(room);
	displayRoomUsers(users);
});

// Receving the message sent via server and displaying it
socket.on("message", (message) => {
	console.log(message);
	displayMessage(message);

	// scroll down
	$messages.scrollTop = $messages.scrollHeight;

	// clear input and focus on it
});

// Message submision
$messageForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const message = $messageText.value;
	// Emit message to server
	socket.emit("sendMessage", message, (error) => {
		$messageText.value = "";
		$messageText.focus();
		if (error) {
			return alert(error);
		}
		console.log("The message was delivered");
	});
});

// UI function
// display message to DOM
function displayMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `
	<div class="message-details">
								<h4 class="username">${message.username}</h4>
								<small class="time">${moment(message.time).format("h:mm a")}</small>
							</div>
							<div class="message-body">
								<h3>${message.text}</h3>
							</div>

	`;

	$messages.appendChild(div);
}

// display room name
function displayRoomName(room) {
	$roomName.innerHTML = `<h2>${room}</h2>
	<small>members</small>`;
}

// display room users
function displayRoomUsers(users) {
	$roomUsers.innerHTML = `
		${users
			.map((user) => `<div class="user"><h3>${user.username}</h3></div>`)
			.join("")}
	`;
}

// ***************************** UI ************************************************
// ui variables
const $hamburger = document.querySelector("#main-header #hamburger");
const $sidebar = document.querySelector("#chat-sidebar");

$hamburger.addEventListener("click", () => {
	$hamburger.classList.toggle("toggle");
	if ($sidebar.style.transform === "translateX(-100%)") {
		return ($sidebar.style.transform = "translateX(0)");
	}
	return ($sidebar.style.transform = "translateX(-100%)");
});

function showSidebar(x) {
	if (x.matches) {
		// If media query matches
		$sidebar.style.transform = "translateX(0)";
	} else {
		$sidebar.style.transform = "translateX(-100%)";
	}
}

const x = window.matchMedia("(min-width: 600px)");
showSidebar(x); // Call listener function at run time
x.addListener(showSidebar); // Attach listener function on state changes
