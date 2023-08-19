var allPromptButtons = document.getElementsByClassName("prompt-button");
localStorage.clear();
var reviewInputValues = JSON.parse(localStorage.getItem("reviewInputValues"));
if (!reviewInputValues) {
    reviewInputValues = {
        "identity": "",
        "color": "",
        "typography": "",
        "communication": "",
        "position": "",
        "competitors": ""
    };
    localStorage.setItem("reviewInputValues", JSON.stringify(reviewInputValues));
}

function handleSubmit(section) {
    var inputContainer = document.getElementById("prompt-input-container-" + section);
    var promptInput = document.getElementById("prompt-input-" + section);

    inputContainer.style.display = "none";
    reviewInputValues[section] = promptInput.value;
    localStorage.setItem("reviewInputValues", JSON.stringify(reviewInputValues));

    removeActiveClass();
}

function handleCancel(section) {
    var inputContainer = document.getElementById("prompt-input-container-" + section);
    var promptInput = document.getElementById("prompt-input-" + section);

    inputContainer.style.display = "none";
    promptInput.value = reviewInputValues[section];

    removeActiveClass();
}

function removeActiveClass() {
    for (var i = 0; i < allPromptButtons.length; i++) {
        var button = allPromptButtons[i];
        button.classList.remove("active");
    }
}
