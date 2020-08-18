// ui variables
const $hamburger = document.querySelector("#main-header #hamburger");
const $sidebar = document.querySelector("#chat-sidebar");

$hamburger.addEventListener("click", () => {
	console.log("object");

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
