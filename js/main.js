// Main UI and Animated Slide Controller for Priyanshu's Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const slides = Array.from(document.querySelectorAll('.slide'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const indicatorDots = Array.from(document.querySelectorAll('.indicator-dot'));
    const btnPrev = document.getElementById('btn-prev-slide');
    const btnNext = document.getElementById('btn-next-slide');
    const counterText = document.getElementById('slide-counter-num');
    const progressBar = document.getElementById('slide-progress-fill');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const contactForm = document.getElementById('portfolio-contact-form');
    const toast = document.getElementById('toast');

    const totalSlides = slides.length;
    let currentSlide = 0;
    let isTransitioning = false;
    const transitionDuration = 750; // ms

    // 2. Slide Navigation Engine
    function goToSlide(targetIndex) {
        if (targetIndex < 0 || targetIndex >= totalSlides) return;
        if (targetIndex === currentSlide && slides[currentSlide].classList.contains('active')) return;
        if (isTransitioning) return;

        isTransitioning = true;

        const previousIndex = currentSlide;
        currentSlide = targetIndex;

        // Slide element animation classes
        slides.forEach((slide, idx) => {
            slide.classList.remove('active', 'prev-slide');
            if (idx === previousIndex) {
                slide.classList.add('prev-slide');
            } else if (idx === currentSlide) {
                slide.classList.add('active');
                slide.scrollTop = 0; // Reset scroll position inside slide
            }
        });

        // Update Navbar Active State
        navLinks.forEach((link, idx) => {
            link.classList.toggle('active', idx === currentSlide);
        });

        // Update Side Indicators
        indicatorDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });

        // Update Counter & Progress Bar
        if (counterText) {
            counterText.textContent = `0${currentSlide + 1} / 0${totalSlides}`;
        }
        if (progressBar) {
            const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }

        // Update Controls Disabled State
        if (btnPrev) btnPrev.disabled = currentSlide === 0;
        if (btnNext) btnNext.disabled = currentSlide === totalSlides - 1;

        // Synchronize 3D Background Camera & Geometry
        if (typeof window.setSlide3DState === 'function') {
            window.setSlide3DState(currentSlide);
        }

        setTimeout(() => {
            isTransitioning = false;
        }, transitionDuration);
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Initialize first slide
    goToSlide(0);

    // 3. Button Click Listeners
    if (btnNext) btnNext.addEventListener('click', nextSlide);
    if (btnPrev) btnPrev.addEventListener('click', prevSlide);

    // Side Indicators Click
    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Navbar Links Click
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(index);
            if (navLinksContainer) {
                navLinksContainer.classList.remove('nav-open');
                if (menuToggle) menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    });

    // In-page CTA buttons (e.g. "Explore Portfolio", "View Achievements", "Get In Touch")
    document.querySelectorAll('[data-goto-slide]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = parseInt(btn.getAttribute('data-goto-slide'), 10);
            if (!isNaN(target)) {
                goToSlide(target);
            }
        });
    });

    // 4. Keyboard Navigation
    window.addEventListener('keydown', (e) => {
        // Ignore if user is currently typing in a form input
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            return;
        }

        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
        }
    });

    // 5. Mouse Wheel Navigation with Debouncing
    let wheelCooldown = false;
    window.addEventListener('wheel', (e) => {
        // If the current slide has scrollable overflowing content, check scroll bounds first
        const activeSlide = slides[currentSlide];
        if (activeSlide) {
            const hasVerticalOverflow = activeSlide.scrollHeight > activeSlide.clientHeight + 10;
            if (hasVerticalOverflow) {
                // If scrolling down and not yet at bottom of slide, let normal scroll happen
                if (e.deltaY > 0 && activeSlide.scrollTop + activeSlide.clientHeight < activeSlide.scrollHeight - 15) {
                    return;
                }
                // If scrolling up and not at top of slide, let normal scroll happen
                if (e.deltaY < 0 && activeSlide.scrollTop > 15) {
                    return;
                }
            }
        }

        if (wheelCooldown || isTransitioning) return;

        if (e.deltaY > 35) {
            wheelCooldown = true;
            nextSlide();
            setTimeout(() => { wheelCooldown = false; }, 900);
        } else if (e.deltaY < -35) {
            wheelCooldown = true;
            prevSlide();
            setTimeout(() => { wheelCooldown = false; }, 900);
        }
    }, { passive: false });

    // 6. Touch Swipe Detection for Mobile Devices
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const swipeDistance = touchEndY - touchStartY;
        if (Math.abs(swipeDistance) < 55) return; // ignore tiny taps

        if (swipeDistance < 0) {
            // Swiped up -> Next slide
            nextSlide();
        } else {
            // Swiped down -> Prev slide
            prevSlide();
        }
    }

    // 7. Mobile Menu Toggle
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-open');
            const isOpen = navLinksContainer.classList.contains('nav-open');
            menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });
    }

    // 8. 3D Card Tilt Micro-Interaction
    const tiltCards = document.querySelectorAll('.glass-card, .hero-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    // 9. Toast Notification Helper
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // 10. Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const senderName = document.getElementById('name').value;
            showToast(`Thank you, ${senderName}! Your feedback has been sent.`);
            contactForm.reset();
        });
    }

    // 11. Copy Email Helper
    window.copyEmail = function() {
        const email = 'priyanshu@jecrc.ac.in';
        navigator.clipboard.writeText(email).then(() => {
            showToast('📋 Copied email: ' + email);
        }).catch(() => {
            showToast('Contact: ' + email);
        });
    };
});
