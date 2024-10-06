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

