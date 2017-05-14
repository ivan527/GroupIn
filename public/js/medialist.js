function updateProgress() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let jsonResponseText = JSON.parse(this.responseText);
			document.getElementById("progress_content").innerHTML = jsonResponseText[1];
		}
	};
	let location = window.location.href;
	let locationArray = location.split("/");
	xhttp.open("GET", "/medialist/" + locationArray[locationArray.length - 1] + "/progress", true);
	xhttp.send();
}1