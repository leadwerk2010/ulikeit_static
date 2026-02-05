document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Image Slider logic (if present)
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        let scrollAmount = 0;
        const speed = 1; // Speed of scroll

        function autoScroll() {
            scrollAmount += speed;
            if (scrollAmount >= sliderContainer.scrollWidth / 2) {
                scrollAmount = 0;
            }
            sliderContainer.scrollLeft = scrollAmount;
            requestAnimationFrame(autoScroll);
        }
        // Duplicate images for seamless loop
        const images = sliderContainer.innerHTML;
        sliderContainer.innerHTML += images; // Append duplicate set

        autoScroll();
    }

    // Custom Video Player Logic
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function () {
            const videoId = this.getAttribute('data-video-id');
            const iframe = document.createElement('iframe');

            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;

            // Clear placeholder and append iframe
            this.innerHTML = '';
            this.appendChild(iframe);
            // Remove click listener to prevent re-triggering (optional but good practice)
            this.style.pointerEvents = 'none';
        });
    });
});
