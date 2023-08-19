document.addEventListener("DOMContentLoaded", function() {
    var sliderCompetitorsSimilarity = document.getElementById("competitorsSimilaritySlider");
    var outputCompetitorsSimilarity = document.getElementById("competitorsSimilarityValue");

    sliderCompetitorsSimilarity.oninput = function () {
        outputCompetitorsSimilarity.textContent = sliderCompetitorsSimilarity.value + "% similar to competitors";
        outputCompetitorsSimilarity.style.left = sliderCompetitorsSimilarity.value + "%";
    }
});

function addCompetitorInputField() {
    let container = document.getElementById('competitors')

    var input = document.createElement("input");
    input.type = "text";
    input.name = "competitors[]";
    input.placeholder = "www.example.com";

    var removeButton = document.createElement("button");
    removeButton.classList = ["remove-button"];
    removeButton.addEventListener('click', function () {
        removeElement(this)
    });
    removeButton.textContent = "X";

    var label = document.createElement("label");
    label.classList = ["element"];
    label.appendChild(input);
    label.appendChild(removeButton);

    container.appendChild(label);
}