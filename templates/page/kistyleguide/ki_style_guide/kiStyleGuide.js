function removeElement(button) {
    button.parentElement.remove();
}

//InsBranch.twig Page
document.addEventListener("DOMContentLoaded", function () {
    var industryButtons = document.querySelectorAll(".industryButton");
    var otherButton = document.getElementById("otherButton");
    var businessBranchInput = document.getElementById("branch");

    industryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var selectedIndustry = this.dataset.industry;
            businessBranchInput.value = selectedIndustry;
            businessBranchInput.style.display = "none";

            // Remove active class from all other buttons
            industryButtons.forEach(function (btn) {
                if (btn !== button) {
                    btn.classList.remove("active");
                }
            });

            // Toggle active class on the clicked button
            button.classList.toggle("active");
        });
    });

    otherButton.addEventListener("click", function () {
        businessBranchInput.value = "";
        businessBranchInput.style.display = "block";

        // Remove active class from all buttons
        industryButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });
    });
});

//InsInspirationalImages.twig Page
document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll('.imageContainer');
    const input = document.getElementById('inspirationalImageDescription');

    images.forEach(image => {
        image.addEventListener('click', () => {
            const isActive = image.classList.contains('active');
            images.forEach(img => img.classList.remove('active'));

            if (!isActive) {
                image.classList.add('active');
                const description = image.getAttribute('data-description');
                input.value = description;
            } else {
                image.classList.remove('active');
                input.value = "";
            }
        });
    });
});

function showLoadingButton(e){
    e = e || window.event;
    e.preventDefault();
    console.log('here');
    var elem = document.getElementById("saveBtn");
    elem.innerText = "Generating...";
    elem.disabled = true;
    document.getElementById("slideshow").submit();
}