// Logo selection script
document.addEventListener("DOMContentLoaded", function () {
    var logoButtons = document.querySelectorAll(".logoButton");
    var selectedLogo = "";

    logoButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Toggle active class on the clicked button
            logoButtons.forEach(b => b.classList.remove("active"))
            button.classList.toggle("active");
            selectedLogo = this.dataset.logo;

            document.getElementById("selectedLogo").value = selectedLogo;
        });
    });
});

function updateCustomNameValue() {
    var customNameInput = document.getElementById("customNameInput");
    var customNameRadio = document.getElementById("customName");

    customNameRadio.value = customNameInput.value;
}

function showLoadingButtonNames(e){
    e = e || window.event;
    e.preventDefault();
    var elem = document.getElementById("genNamesBtn");
    elem.innerText = "Generating...";
    elem.disabled = true;
    disableAllButtons();
    document.getElementById("logoForm").action = "/regenerateNames";
    document.getElementById("logoForm").submit();
}

function showLoadingButtonLogos(e){
    e = e || window.event;
    e.preventDefault();
    var elem = document.getElementById("genLogosBtn");
    elem.innerText = "Generating...";
    elem.disabled = true;
    disableAllButtons();
    document.getElementById("logoForm").action = "/regenerateLogos";
    document.getElementById("logoForm").submit();
}

function showLoadingButtonSave(e){
    e = e || window.event;
    e.preventDefault();
    var elem = document.getElementById("saveBtn");
    elem.innerText = "Generating...";
    elem.disabled = true;
    disableAllButtons();
    document.getElementById("logoForm").action = "/generatedStyleguideReview";
    document.getElementById("logoForm").submit();
}

function disableAllButtons(){
    var logosB = document.getElementById("genLogosBtn");
    logosB.disabled = true;
    var namesB = document.getElementById("genNamesBtn");
    namesB.disabled = true;
    var saveB = document.getElementById("saveBtn");
    saveB.disabled = true;
}