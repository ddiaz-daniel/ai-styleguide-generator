// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Get the slideshow container
    var slideshowContainer = document.getElementById("slideshow");

    // Get all the slides inside the slideshow
    var slides = slideshowContainer.getElementsByClassName("slide");

    // Set initial slide index
    var currentSlide = 0;

    // Function to display the current slide
    function showSlide() {
        // Hide all slides
        for (var i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        // Display the current slide
        slides[currentSlide].style.display = "block";
        showNavigationButtons();
        updateLoadingBar();
    }

    // display navigation buttons depending on current slide
    function showNavigationButtons() {
        if (currentSlide == 0) {
            document.getElementById("prevBtn").classList.add('hide');
        } else {
            document.getElementById("prevBtn").classList.remove('hide');
        }
        if (currentSlide == slides.length - 1) {
            document.getElementById("nextBtn").classList.add('hide');
            document.getElementById("saveBtn").classList.remove('hide');
        } else {
            document.getElementById("nextBtn").classList.remove('hide');
            document.getElementById("saveBtn").classList.add('hide');
        }
    }

    function updateFooter() {
        const footer = $("footer");
        $(footer).removeClass('fixedBottom');
        if (footer && footer.length > 0) {
            const offsetBottom = footer[0].offsetTop + footer[0].clientHeight;
            if (window.innerHeight > offsetBottom) {
                $(footer).addClass('fixedBottom');
            } else {
                $(footer).removeClass('fixedBottom');
            }
        }
    }

    // Function to go to the next slide
    function nextSlide() {
        if(currentSlide == 0 && !checkBranchFilled()){
            document.getElementById('inputBranchWarning').style.visibility = 'visible';
        }else {
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
            showSlide();
            updateSegments();
            updateFooter();
        }
    }

    // Function to go to the previous slide
    function prevSlide() {
        if(currentSlide == 0 && !checkBranchFilled()){
            document.getElementById('inputBranchWarning').style.visibility = 'visible';
        }else {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }
            showSlide();
            updateSegments();
            updateFooter();
        }
    }

    // Function to update the active segment indicator
    function updateSegments() {
        var segments = document.getElementsByClassName("segment");
        for (var i = 0; i < segments.length; i++) {
            segments[i].classList.remove("active");
        }
        segments[currentSlide].classList.add("active");
    }

    // Function to update the loading bar width
    // Function to update the loading bar width and position
    function updateLoadingBar() {
        var segments = document.getElementsByClassName("segment");
        var segmentWidth = 100 / (segments.length - 1);
        // var loadingBar = document.getElementsByClassName("loading-bar")[0];
        var movingBar = document.getElementsByClassName("moving-bar")[0];
        var dots = document.getElementsByClassName("dot");

        movingBar.style.width = currentSlide * segmentWidth + '%';
        //movingBar.style.transform = `translateX(-${currentSlide * segmentWidth}%)`;

        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }
        dots[currentSlide].classList.add("active");
    }

    function checkBranchFilled() {
        const input = document.getElementById('branch');
        if (input.value === null || input.value === '') {
            return false;
        } else {
            return true;
        }
    }


    // Add click event listeners to the next and previous buttons
    document.getElementById("nextBtn").addEventListener("click", nextSlide);
    document.getElementById("prevBtn").addEventListener("click", prevSlide);

    // Add click event listeners to the segments and dots for direct navigation
    var segments = document.getElementsByClassName("segment");
    var dots = document.getElementsByClassName("dot");

    for (var i = 0; i < segments.length; i++) {
        segments[i].addEventListener("click", function () {
            if(currentSlide == 0 && !checkBranchFilled()){
                document.getElementById('inputBranchWarning').style.visibility = 'visible';
            }else{
                currentSlide = Array.prototype.indexOf.call(segments, this);
                showSlide();
                updateSegments();
                updateLoadingBar();
            }
        });

        dots[i].addEventListener("click", function () {
            if(currentSlide == 0 && !checkBranchFilled()){
                document.getElementById('inputBranchWarning').style.visibility = 'visible';
            }else{
                currentSlide = Array.prototype.indexOf.call(dots, this);
                showSlide();
                updateSegments();
                updateLoadingBar();
            }
        });

        segments[i].addEventListener("mouseover", function () {
            var segmentIndex = Array.prototype.indexOf.call(segments, this);
            for (var j = 0; j < dots.length; j++) {
                if (j === segmentIndex) {
                    dots[j].classList.add("active");
                } else {
                    dots[j].classList.remove("active");
                }
            }
        });

        segments[i].addEventListener("mouseout", function () {
            var segmentIndex = Array.prototype.indexOf.call(segments, this);
            if (segmentIndex !== currentSlide) {
                dots[segmentIndex].classList.remove("active");
            }
        });
    }


    // Show the initial slide
    showSlide();
    updateSegments();
});
