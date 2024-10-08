document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with reduced duration and disabled on mobile
    AOS.init({
        duration: 800,
        once: true,
        disable: 'mobile'
    });

    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const scrollToTopButton = document.querySelector('.scroll-to-top');
    const heroTitle = document.querySelector('.hero-title .animate-slide');
    const featureCards = document.querySelectorAll('.feature-card');
    const showcase = document.querySelector('.features-showcase');
    const featureItems = document.querySelectorAll('.feature-item');
    const animatedText = document.querySelector('.animated-text');
    const ctaContainer = document.querySelector('.cta-container');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const productCards = document.querySelectorAll('.product-card');
    const megaMenuLinks = document.querySelectorAll('.mega-menu a');
    const categoryCards = document.querySelectorAll('.category-card');
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    const hamburger = document.querySelector('.hamburger');
    const navbarCollapse = document.getElementById('navbarMegaMenu');

    // Debounce function
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Optimized scroll handler
    const handleScroll = debounce(() => {
        const scrollY = window.scrollY;

        // Navbar scroll effect
        navbar.classList.toggle('scrolled', scrollY > 50);

        // Scroll-to-top button visibility
        scrollToTopButton.classList.toggle('show', scrollY > 200);

        // Parallax effect for floating shapes
        requestAnimationFrame(() => {
            document.querySelectorAll('.floating-shape').forEach((shape, index) => {
                const speed = 0.1 * (index + 1);
                shape.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });

        // Parallax effect for features showcase
        if (showcase) {
            const rect = showcase.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                requestAnimationFrame(() => {
                    const speed = 0.5;
                    showcase.style.backgroundPositionY = `${(rect.top - window.innerHeight) * speed}px`;
                });
            }
        }
    }, 10);

    window.addEventListener('scroll', handleScroll);

    // Scroll-to-top button click event
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 100);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    // Observe elements
    [].concat(...featureItems, animatedText, ctaContainer, ...productCards, ...categoryCards)
      .filter(Boolean)
      .forEach(item => observer.observe(item));

    // Hero title animation
    if (heroTitle) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                heroTitle.style.animation = entry.isIntersecting ? 'slideDown 1.2s ease forwards' : 'none';
            });
        }, { threshold: 0.5 });

        heroObserver.observe(document.querySelector('.hero-section'));
    }

    // Optimized hover effects
    const addHoverEffect = (elements, enterEffect, leaveEffect) => {
        elements.forEach(element => {
            element.addEventListener('mouseenter', enterEffect);
            element.addEventListener('mouseleave', leaveEffect);
        });
    };

    addHoverEffect(testimonialCards, 
        e => e.currentTarget.style.transform = 'translateY(-10px)',
        e => e.currentTarget.style.transform = 'translateY(0)'
    );

    addHoverEffect(featureCards, 
        e => e.currentTarget.querySelector('.feature-icon').style.transform = 'scale(1.2) rotate(10deg)',
        e => e.currentTarget.querySelector('.feature-icon').style.transform = 'scale(1) rotate(0deg)'
    );

    addHoverEffect(megaMenuLinks, 
        e => e.currentTarget.style.transform = 'translateX(5px)',
        e => e.currentTarget.style.transform = 'translateX(0)'
    );

    // Lazy loading images
    if ("IntersectionObserver" in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    observer.unobserve(lazyImage);
                }
            });
        });

        document.querySelectorAll("img.lazy").forEach(lazyImage => lazyImageObserver.observe(lazyImage));
    }

    // Quick view functionality
    const products = {
        1: {
            title: "Ayurvedic Face Cream",
            price: "$29.99",
            rating: 4.5,
            image: "images/8.png/cream (2).jpg",
            description: "Our Ayurvedic Face Cream is formulated with natural ingredients to nourish and rejuvenate your skin. It helps reduce fine lines and improve skin texture."
        }
        // Add more products here
    };

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.closest('.product-card').dataset.productId;
            const product = products[productId];

            // Populate modal with product data
            document.getElementById('modalProductTitle').textContent = product.title;
            document.getElementById('modalProductPrice').textContent = product.price;
            document.getElementById('modalProductImage').src = product.image;
            document.getElementById('modalProductDescription').textContent = product.description;
            document.getElementById('modalProductRating').innerHTML = generateRatingStars(product.rating);

            modal.show();
        });
    });

    function generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);
        
        return `${'<i class="fas fa-star"></i>'.repeat(fullStars)}
                ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
                ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
                <span>(${rating})</span>`;
    }

    // Handle "Add to Cart" button in the modal
    document.getElementById('modalAddToCart').addEventListener('click', function() {
        // Add your "Add to Cart" logic here
        alert('Product added to cart!');
        modal.hide();
    });

    // Hamburger menu functionality
    hamburger.addEventListener('click', function() {
        this.classList.toggle('is-active');
    });

    navbarCollapse.addEventListener('show.bs.collapse', function () {
        hamburger.classList.add('is-active');
    });

    navbarCollapse.addEventListener('hide.bs.collapse', function () {
        hamburger.classList.remove('is-active');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    // Show/hide the button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {  // Show button after 300px of scrolling
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // For smooth scrolling
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const voiceSearchButton = document.querySelector('.voice-search-button');

    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        voiceSearchButton.addEventListener('click', function() {
            recognition.start();
            voiceSearchButton.classList.add('listening');
        });

        recognition.addEventListener('result', function(e) {
            const transcript = e.results[0][0].transcript;
            searchInput.value = transcript;
            voiceSearchButton.classList.remove('listening');
            // Optionally, you can trigger the search here
            // performSearch(transcript);
        });

        recognition.addEventListener('end', function() {
            voiceSearchButton.classList.remove('listening');
        });

        recognition.addEventListener('error', function(e) {
            console.error('Speech recognition error', e);
            voiceSearchButton.classList.remove('listening');
        });
    } else {
        voiceSearchButton.style.display = 'none';
        console.log('Speech recognition not supported');
    }
});

// Function to perform the search (you'll need to implement this based on your search requirements)
function performSearch(query) {
    console.log('Searching for:', query);
    // Implement your search logic here
}

document.addEventListener('DOMContentLoaded', function() {
    // Virtual Consultation Scheduler
    const consultationForm = document.getElementById('consultation-form');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            
            // Simulating an API call
            submitButton.textContent = 'Scheduling...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                console.log(`Consultation scheduled for ${date} at ${time}`);
                
                // Show a success message
                showNotification('Your consultation has been scheduled. We will confirm shortly.', 'success');
                
                // Reset the form
                this.reset();
                submitButton.textContent = 'Schedule Consultation';
                submitButton.disabled = false;
            }, 1500);
        });

        // Add smooth label animation
        const formInputs = consultationForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                if (input.value === '') {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // Sustainability Tracker
    const percentages = document.querySelectorAll('.percentage');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                percentages.forEach(percentage => {
                    const target = parseInt(percentage.getAttribute('data-target'));
                    animateValue(percentage, 0, target, 2000);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const sustainabilitySection = document.querySelector('.sustainability-section');
    if (sustainabilitySection) {
        observer.observe(sustainabilitySection);
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Add hover effect to sustainability items
    const sustainabilityItems = document.querySelectorAll('.sustainability-item');
    sustainabilityItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.03)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginModal = document.getElementById('loginModal');
    const formElements = loginForm.querySelectorAll('.form-control, .btn-primary, .form-check, a');
    
    loginModal.addEventListener('show.bs.modal', function () {
        formElements.forEach((element, index) => {
            element.classList.add('fade-in-up');
            setTimeout(() => {
                element.classList.add('active');
            }, 100 * (index + 1));
        });
    });

    loginModal.addEventListener('hidden.bs.modal', function () {
        formElements.forEach(element => {
            element.classList.remove('active');
        });
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Simulate loading
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            console.log('Login attempt', { email, password, rememberMe });
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Show success message (you can replace this with your actual login logic)
            showNotification('Login successful!', 'success');
            
            // Close the modal
            const modalInstance = bootstrap.Modal.getInstance(loginModal);
            modalInstance.hide();
        }, 2000);
    });

    // Add floating label effect
    const formControls = document.querySelectorAll('#loginModal .form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', () => {
            control.parentElement.classList.add('focused');
        });
        control.addEventListener('blur', () => {
            if (control.value === '') {
                control.parentElement.classList.remove('focused');
            }
        });
    });
});

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}