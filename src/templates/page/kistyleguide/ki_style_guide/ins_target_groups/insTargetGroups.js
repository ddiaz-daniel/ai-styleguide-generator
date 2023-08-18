// function displayNewGenderSelection(event){
//     let selectedOptions = Array.from(document.getElementById('kiStyleguideTargetGenders').selectedOptions).map(({ value }) => value);
//     document.getElementById('displaySelectedGenders').innerText = selectedOptions.join(', ');
// }

function displaySelections(displaySelectedElement, selectedOptions) {
    displaySelectedElement.innerHTML = null;
    var fragment = document.createDocumentFragment();

    selectedOptions.forEach(t => {
        var selected = document.createElement("span");
        selected.classList.add("selected-option");
        selected.textContent = t;
        fragment.appendChild(selected);
    });

    displaySelectedElement.appendChild(fragment);
}

function displaySelectionsWithCountryFlag(displaySelectedElement, selectedOptions) {
    displaySelectedElement.innerHTML = null;
    var fragment = document.createDocumentFragment();

    selectedOptions.forEach(t => {
        var flagElement = document.createElement("span");
        flagElement.className = "flag-icon flag-icon-" + t.toLowerCase();
        fragment.appendChild(flagElement);

        var selected = document.createElement("span");
        selected.classList.add("selected-option");
        selected.textContent = t;
        fragment.appendChild(selected);
    });

    displaySelectedElement.appendChild(fragment);
}

function displayNewEducationSelection(event) {
    let displaySelected = document.getElementById('displaySelectedEducations');
    let selectedOptions = Array.from(document.getElementById('kiStyleguideTargetEducations').selectedOptions).map(({value}) => value);
    this.displaySelections(displaySelected, selectedOptions);
}

function displayNewVulnerablePeopleSelection(event) {
    let displaySelected = document.getElementById('displaySelectedVulnerablePeople');
    let selectedOptions = Array.from(document.getElementById('kiStyleguideTargetVulnerablePeople').selectedOptions).map(({value}) => value);
    this.displaySelections(displaySelected, selectedOptions);
}

function displayNewMaritalStatusSelection(event) {
    let displaySelected = document.getElementById('displaySelectedMaritalStatus');
    let selectedOptions = Array.from(document.getElementById('kiStyleguideTargetMaritalStatus').selectedOptions).map(({value}) => value);
    this.displaySelections(displaySelected, selectedOptions);
}

function displayNewCountrySelection(event) {
    let displaySelected = document.getElementById('displaySelectedCountries');
    let selectedOptions = Array.from(document.getElementById('kiStyleguideTargetCountries').selectedOptions).map(({value}) => value);
    this.displaySelectionsWithCountryFlag(displaySelected, selectedOptions);
}

function displayNewLanguageSelection(event) {
    let displaySelected = document.getElementById('displaySelectedLanguages');
    let selectedOptions = Array.from(document.getElementById('kiStyleguideTargetLanguages').selectedOptions).map(({value}) => value);
    this.displaySelections(displaySelected, selectedOptions);
}

// Gender type selection script
document.addEventListener("DOMContentLoaded", function () {
    var genderButtons = document.querySelectorAll(".genderButton");
    var selectedGenders = [];

    genderButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Toggle active class on the clicked button
            button.classList.toggle("active");

            if (button.classList.contains('active')) {
                selectedGenders.push(this.dataset.gender);
            } else {
                selectedGenders = selectedGenders.filter(gender => gender !== this.dataset.gender);
            }

            document.getElementById("selectedGendersInput").value = JSON.stringify(selectedGenders);
        });
    });
});
