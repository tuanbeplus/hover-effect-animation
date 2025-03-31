document.addEventListener('DOMContentLoaded', () => {
    const imageWrapper = document.querySelector('.image-wrapper');
    const imagesArray = Array.from(imageWrapper.children);
    const images = document.querySelectorAll('.floating-image');
    let isMoving = false;
    let moveTimeout;
    let lastX = 0;
    let lastY = 0;    
    let currentImageIndex = 0;
    let shuffleInterval; // Store interval ID

    // Hide all images initially
    gsap.set(images, {
        opacity: 0,
        scale: 1,
        y: 0
    });

    const getNextImage = () => {
        const img = images[currentImageIndex];
        currentImageIndex = (currentImageIndex + 1) % images.length;
        return img;
    };

    const handleMouseMove = (e) => {
        clearTimeout(moveTimeout);
        isMoving = true;
        lastX = e.clientX;
        lastY = e.clientY;

        gsap.to(images, {
            opacity: 1,
            scale: 1,
            duration: 0
        });

        const nextImg = getNextImage();
        gsap.to(nextImg, {
            x: e.clientX - (nextImg.offsetWidth / 2),
            y: e.clientY - (nextImg.offsetHeight / 2),
            opacity: 1,
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
        });

        // Start shuffling images if not already started
        if (!shuffleInterval) {
            shuffleInterval = setInterval(shuffleImages, 200);
        }

        moveTimeout = setTimeout(() => {
            isMoving = false;
            handleCursorStop();
        }, 200);
    };

    const handleCursorStop = () => {
        // Stop shuffling when the mouse stops
        clearInterval(shuffleInterval);
        shuffleInterval = null; // Reset interval ID

        images.forEach((img, index) => {
            img.style.zIndex = 0;
            gsap.fromTo(img, 
                {
                    x: lastX - (img.offsetWidth / 2),
                    y: lastY - (img.offsetHeight / 2),
                    opacity: 1,
                    scale: 1
                },
                {
                    y: window.innerHeight + 100,
                    opacity: 0,
                    scale: 0.5,
                    duration: 0.3 + (index * 0.2),
                    ease: "power2.in",
                    delay: index * 0.05
                }
            );
        });
    };

    function shuffleImages() {
        for (let i = imagesArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [imagesArray[i], imagesArray[j]] = [imagesArray[j], imagesArray[i]];
        }
        imagesArray.forEach(img => imageWrapper.appendChild(img));
    }

    document.addEventListener('mousemove', handleMouseMove);
});