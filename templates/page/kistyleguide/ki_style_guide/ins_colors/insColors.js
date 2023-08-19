// Logo selection script
document.addEventListener("DOMContentLoaded", function () {
    var logoInputButtons = document.querySelectorAll(".logoInputButton");
    var selectedLogoInput = "";

    logoInputButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            // Toggle active class on the clicked button
            logoInputButtons.forEach(b => b.classList.remove("active"))
            button.classList.toggle("active");
            selectedLogoInput = this.dataset.logoInput;

            document.getElementById("selectedLogoInput").value = selectedLogoInput;
        });
    });
});

function previewLogo() {
    const logoInput = document.getElementById('logoInput');
    const fieldsetLegend = document.getElementById('fieldsetLegend');
    const colors = document.getElementById('colors');
    const file = logoInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Create an image element for the preview
            const logoPreview = document.createElement('img');
            logoPreview.src = e.target.result;
            logoPreview.classList.add('logoPreview');

            // Remove existing logo preview if any
            const existingPreview = document.querySelector('.logoPreview');
            if (existingPreview) {
                existingPreview.remove();
            }

            // Append the logo preview to the fieldset
            //colors.appendChild(logoPreview);
            colors.insertBefore(logoPreview, fieldsetLegend);
        }

        reader.readAsDataURL(file);
        //fieldsetLegend.textContent = "{{ i18n.kiStyleguide.colors.colorExplanationWithLogo }}";
    } else {
        // Remove existing logo preview if any
        const existingPreview = document.querySelector('.logoPreview');
        if (existingPreview) {
            existingPreview.remove();
        }

        //fieldsetLegend.textContent = "{{ i18n.kiStyleguide.colors.colorExplanationWithoutLogo }}";
    }
}

function colorHexCodeChange() {
    const colorHexCodes = Array.from(document.querySelectorAll('input[name^="colorHexCode"]')).map(input => input.value);
    const colorPickers = document.querySelectorAll('input[name^="colorSelector"]');

    colorPickers.forEach((colorPicker, index) => {
        colorPicker.value = colorHexCodes[index] || '#000000';
    });
}

function colorPickerChange() {
    const colorPickers = document.querySelectorAll('input[name^="colorSelector"]');
    const colorHexCodes = document.querySelectorAll('input[name^="colorHexCode"]');

    colorPickers.forEach((colorPicker, index) => {
        colorHexCodes[index].value = colorPicker.value || '#000000';
    });
}

function addColorInputField() {
    let container = document.getElementById('colors');

    ////Option 1

    // var colorSelector = document.createElement("input");
    // colorSelector.type = "color";
    // colorSelector.name = "colorSelectors[]";
    // colorSelector.classList = ["color-selector"];
    // colorSelector.addEventListener('change', colorPickerChange);
    //
    // var colorHexCode = document.createElement("input");
    // colorHexCode.type = "text";
    // colorHexCode.name = "colorHexCodes[]";
    // colorHexCode.pattern = "^#([A-Fa-f0-9]{6})$";
    // colorHexCode.value = "#000000";
    // colorHexCode.placeholder = "Hexcode";
    // colorHexCode.addEventListener('change', colorHexCodeChange);
    //
    // var colorSelectWrapper = document.createElement("div");
    // colorSelectWrapper.classList = ["color-select-wrapper"];
    // colorSelectWrapper.appendChild(colorSelector);
    // colorSelectWrapper.appendChild(colorHexCode);
    //
    // var removeButton = document.createElement("button");
    // removeButton.classList = ["remove-button"];
    // removeButton.addEventListener('click', function () {
    //     removeElement(this)
    // });
    // removeButton.textContent = "X";
    //
    // var label = document.createElement("label");
    // label.classList = ["element third"];
    // label.appendChild(colorSelectWrapper);
    // label.appendChild(removeButton);
    //
    // container.appendChild(label);

    ////Option 2

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('element', 'fifth');

    const squareDiv = document.createElement('div');
    squareDiv.classList.add('square-div');

    const colorSelector = document.createElement('input');
    colorSelector.type = 'color';
    colorSelector.name = 'colorSelectors[]';
    colorSelector.classList.add('square-content');
    colorSelector.addEventListener('change', colorPickerChange);

    squareDiv.appendChild(colorSelector);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');

    const innerLabel = document.createElement('label');
    innerLabel.classList.add('inner');

    const colorHexCode = document.createElement('input');
    colorHexCode.type = 'text';
    colorHexCode.name = 'colorHexCodes[]';
    colorHexCode.placeholder = 'Hexcode';
    colorHexCode.maxLength = 7;
    colorHexCode.pattern = '^#([A-Fa-f0-9]{6})$';
    colorHexCode.value = '#000000';
    colorHexCode.addEventListener('change', colorHexCodeChange);

    var removeButton = document.createElement("button");
    removeButton.classList = ["remove-button"];
    removeButton.addEventListener('click', function () {
        removeElement(descriptionDiv)
    });
    removeButton.textContent = "X";

    innerLabel.appendChild(colorHexCode);
    innerLabel.appendChild(removeButton);

    descriptionDiv.appendChild(innerLabel);

    parentDiv.appendChild(squareDiv);
    parentDiv.appendChild(descriptionDiv);

    container.appendChild(parentDiv);
}