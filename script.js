/**
 * Main theme JavaScript file.
 */

( function( $ ) {
	'use strict';

// Document ready
$( document ).ready( function() {
    const $imageContainer = $('.image-container');
    const $images = $('.hover-image');
    const $mainImage = $('.main-image');
    const $overlayImages = $('.overlay-image');
    const imagePositions = [];
    const numTrails = 5; // Number of trailing images

    // Check if elements exist
    if (!$imageContainer.length || !$images.length || !$mainImage.length || !$overlayImages.length) {
        console.error('Required elements not found');
        return;
    }

    // Initialize image positions array
    for (let i = 0; i < numTrails; i++) {
        imagePositions.push({ x: 0, y: 0 });
    }

    // Initialize GSAP
    gsap.set($overlayImages, {
        opacity: 0,
        scale: 0.8,
        position: 'absolute',
        transformOrigin: 'center center',
        pointerEvents: 'none'
    });

    let isMoving = false;
    let moveTimeout;
    let mouseX = 0;
    let mouseY = 0;
    let frame = 0;

    // Animation loop
    function updateImages() {
        frame = requestAnimationFrame(updateImages);

        // Update positions array
        for (let i = imagePositions.length - 1; i > 0; i--) {
            imagePositions[i].x = imagePositions[i - 1].x;
            imagePositions[i].y = imagePositions[i - 1].y;
        }
        imagePositions[0].x = mouseX;
        imagePositions[0].y = mouseY;

        // Update image positions with trail effect
        $overlayImages.each(function(index) {
            if (index < imagePositions.length) {
                const position = imagePositions[index];
                const delay = index * 0.08;
                const scale = 1 - (index * 0.1);
                const opacity = 1 - (index * 0.15);

                gsap.to($(this), {
                    duration: 0.4,
                    x: position.x,
                    y: position.y,
                    scale: scale,
                    opacity: opacity,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });
    }

    // Track mouse movement
    $imageContainer.on('mousemove', function(e) {
        const rect = $imageContainer[0].getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        if (!isMoving) {
            isMoving = true;
            frame = requestAnimationFrame(updateImages);
        }

        // Clear previous timeout
        clearTimeout(moveTimeout);

        // Show images
        gsap.to($overlayImages, {
            duration: 0.3,
            visibility: 'visible',
            ease: "power2.out"
        });

        // Set timeout for stopping
        moveTimeout = setTimeout(function() {
            isMoving = false;
            cancelAnimationFrame(frame);
            fallDown();
        }, 100);
    });

    // Mouse leave effect
    $imageContainer.on('mouseleave', function() {
        isMoving = false;
        cancelAnimationFrame(frame);
        
        gsap.to($overlayImages, {
            duration: 0.4,
            opacity: 0,
            scale: 0.5,
            stagger: {
                each: 0.1,
                from: "end"
            },
            ease: "power2.in"
        });
    });

    // Fall down effect
    function fallDown() {
        $overlayImages.each(function(index) {
            if ($(this).css('opacity') > 0) {
                const randomX = gsap.utils.random(-150, 150);
                const randomRotation = gsap.utils.random(-180, 180);
                const randomDelay = index * 0.1;

                gsap.to($(this), {
                    duration: 1,
                    y: '+=400',
                    x: '+=' + randomX,
                    rotation: randomRotation,
                    opacity: 0,
                    scale: 0,
                    delay: randomDelay,
                    ease: "power2.in",
                    onComplete: function() {
                        gsap.set($(this), { clearProps: "all" });
                    }
                });
            }
        });
    }
} );

} )( jQuery );