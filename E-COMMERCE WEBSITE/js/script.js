document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        disable: 'mobile'
    });

    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const scrollToTopButton = document.getElementById('scrollToTopBtn');
    const heroTitle = document.querySelector('.hero-title .animate-slide');
    const productCards = document.querySelectorAll('.product-card');
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const cartButton = document.getElementById('cartButton');
    const cartPanel = document.getElementById('cartPanel');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCount = document.querySelector('.cart-count');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    // Debounce function for performance optimization
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

    // Scroll handler
    const handleScroll = debounce(() => {
        const scrollY = window.scrollY;

        // Navbar scroll effect
        navbar.classList.toggle('scrolled', scrollY > 50);

        // Scroll-to-top button visibility
        scrollToTopButton.classList.toggle('visible', scrollY > 300);

        // Parallax effect for floating shapes
        document.querySelectorAll('.floating-shape').forEach((shape, index) => {
            const speed = 0.1 * (index + 1);
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, 10);

    window.addEventListener('scroll', handleScroll);

    // Scroll-to-top functionality
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hero title animation
    if (heroTitle) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    heroTitle.classList.add('animate');
                } else {
                    heroTitle.classList.remove('animate');
                }
            });
        }, { threshold: 0.5 });

        heroObserver.observe(document.querySelector('.hero-section'));
    }

    // Quick view functionality
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const productId = productCard.dataset.productId;
            openQuickView(productId);
        });
    });

    function openQuickView(productId) {
        // Implement quick view logic here
        console.log(`Quick view opened for product ${productId}`);
    }

    // Cart functionality
    let cart = [];

    cartButton.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', closeCartPanel);

    function toggleCart() {
        cartPanel.classList.toggle('open');
    }

    function closeCartPanel() {
        cartPanel.classList.remove('open');
    }

    productCards.forEach(card => {
        const addToCartBtn = card.querySelector('.buy-now-btn');
        addToCartBtn.addEventListener('click', () => addToCart(card));
    });

    function addToCart(productCard) {
        const product = {
            id: productCard.dataset.productId,
            name: productCard.querySelector('.product-title').textContent,
            price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
            quantity: 1
        };

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }

        updateCart();
        toggleCart();
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = createCartItemElement(item);
            cartItems.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function createCartItemElement(item) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
            <button class="remove-item" data-id="${item.id}">Remove</button>
        `;

        itemElement.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));
        return itemElement;
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    checkoutBtn.addEventListener('click', () => {
        // Implement checkout logic here
        console.log('Proceeding to checkout');
        alert('Checkout functionality would be implemented here.');
    });

    // Mobile menu functionality
    hamburger.addEventListener('click', toggleMobileMenu);

    function toggleMobileMenu() {
        hamburger.classList.toggle('is-active');
        mobileMenuOverlay.classList.toggle('is-active');
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.mobile-menu-content a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    function closeMobileMenu() {
        hamburger.classList.remove('is-active');
        mobileMenuOverlay.classList.remove('is-active');
    }

    // Sustainability Tracker Animation
    const sustainabilitySection = document.querySelector('.sustainability-section');
    if (sustainabilitySection) {
        const percentages = sustainabilitySection.querySelectorAll('.percentage');
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

    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission
        console.log('Form submitted:', data);
        showNotification('Form submitted successfully!', 'success');

        // Reset form
        form.reset();
    }

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