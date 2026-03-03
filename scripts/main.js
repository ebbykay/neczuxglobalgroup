/* ===================================================
   NECZUX GLOBAL GROUP — MAIN JAVASCRIPT (ENHANCED)
   Includes: Sticky header, mobile menu, smooth scroll,
   FAQ accordion, form handling, analytics, scroll to top,
   cookie consent, lazy loading, and tracking
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===== STICKY HEADER =====
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===== MOBILE MENU TOGGLE =====
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu   = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            
            // Update ARIA attribute
            const expanded = navMenu.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
        });

        // Close on nav link click
        navMenu.querySelectorAll('.nav-list a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                mobileBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ===== MOBILE DROPDOWN TOGGLE =====
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const menu = this.closest('.dropdown').querySelector('.dropdown-menu');
                if (menu) {
                    menu.classList.toggle('open');
                    
                    // Update ARIA
                    const expanded = menu.classList.contains('open');
                    this.setAttribute('aria-expanded', expanded);
                }
            }
        });
    });

    // ===== SMOOTH SCROLL FOR ANCHORS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            if (href.includes('http') || href.includes('mailto:') || href.includes('tel:')) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = header ? header.offsetHeight + 20 : 80;
                window.scrollTo({ 
                    top: target.offsetTop - offset, 
                    behavior: 'smooth' 
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    mobileBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // ===== SCROLL TO TOP BUTTON =====
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
            
            // Track scroll to top click
            if (window.gtag) {
                gtag('event', 'scroll_to_top', {
                    'event_category': 'engagement',
                    'event_label': 'Scroll to Top Button'
                });
            }
        });
    }

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer   = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = answer.classList.contains('open');
                answer.classList.toggle('open');
                
                // Update ARIA
                question.setAttribute('aria-expanded', !isOpen);
                
                // Track FAQ interaction
                if (window.gtag) {
                    gtag('event', 'faq_toggle', {
                        'event_category': 'engagement',
                        'event_label': question.textContent.trim(),
                        'value': !isOpen ? 1 : 0
                    });
                }
            });
        }
    });

    // ===== LAZY LOADING IMAGES =====
    const lazyImages = document.querySelectorAll('img.lazy');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }

});