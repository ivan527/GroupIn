(function () {

    function isPalindrome(text) {
        if (!text) throw "No text provided";
        
        var formattedText = text.replace(/[^\w]/g, "").toLowerCase();
        var len = formattedText.length;
        for (var i = 0; i < len / 2; i++) {
            if (formattedText[i] !== formattedText[len - i - 1]) {
                return false;
            }
        }
        return true;
    }

    const staticForm = document.getElementById("static-form");

    if (staticForm) {
        const textElement = document.getElementById("potential_palindrome");

        const errorContainer = document.getElementById("error-container");
        const errorTextElement = errorContainer.getElementsByClassName("text-goes-here")[0];

        const resultContainer = document.getElementById("result-container");
        const resultTextElement = resultContainer.getElementsByClassName("text-goes-here")[0];

        var listElement = document.getElementById("checked_list");

        // We can take advantage of functional scoping; our event listener has access to its outer functional scope
        // This means that these variables are accessible in our callback
        staticForm.addEventListener("submit", (event) => {
            event.preventDefault();

            try {
                // hide containers by default
                errorContainer.classList.add("hidden");
                resultContainer.classList.add("hidden");

                const textValue = textElement.value;

                const result = isPalindrome(textValue);

                var newItem = document.createElement("LI");
                newItem.appendChild(document.createTextNode(textValue));
                listElement.appendChild(newItem);

                if (result) {
                    newItem.setAttribute("class", "is-palindrome");
                    resultTextElement.textContent = "That's a palindrome!";
                } else {
                    newItem.setAttribute("class", "not-palindrome");
                    resultTextElement.textContent = "Sorry, but that's not a palindrome.";
                }

                resultContainer.classList.remove("hidden");
            } catch (e) {
                const message = typeof e === "string" ? e : e.message;
                errorTextElement.textContent = e;
                errorContainer.classList.remove("hidden");
            }
        });
    }
})();