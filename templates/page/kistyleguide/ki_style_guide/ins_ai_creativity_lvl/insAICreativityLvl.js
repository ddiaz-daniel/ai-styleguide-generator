document.addEventListener("DOMContentLoaded", function () {
    var sliderAICreativity = document.getElementById("aiCreativityRangeSlider");
    var outputAICreativity = document.getElementById("aiCreativityRangeValue");

    sliderAICreativity.oninput = function () {
        outputAICreativity.textContent = sliderAICreativity.value + "%";
        outputAICreativity.style.left = sliderAICreativity.value + "%";
    }
});