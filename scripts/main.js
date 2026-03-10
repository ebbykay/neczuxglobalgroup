/* ===================================================
   NECZUX GLOBAL GROUP — MAIN JAVASCRIPT
   Sticky header · Mobile menu · Smooth scroll · FAQ
   Form handling (Formspree ↔ Airtable dual mode)
   Newsletter · Scroll-to-top · Lazy load · Animations
   Service nav pills · URL param prefill
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===== STICKY HEADER =====
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 80);
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
            this.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });

        // Close menu on nav link click
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
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const menu = this.closest('.dropdown').querySelector('.dropdown-menu');
                if (menu) {
                    menu.classList.toggle('open');
                    this.setAttribute('aria-expanded', menu.classList.contains('open'));
                }
            }
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            if (href.includes('http') || href.includes('mailto:') || href.includes('tel:')) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = header ? header.offsetHeight + 20 : 80;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
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
            scrollBtn.classList.toggle('visible', window.scrollY > 400);
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.gtag) gtag('event', 'scroll_to_top', {
                event_category: 'engagement', event_label: 'Scroll to Top Button'
            });
        });
    }

    // ===== FAQ ACCORDION =====
    // Uses .open class on .faq-answer — matches the CSS in main.css
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer   = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isOpen = answer.classList.contains('open');

            // Close all open answers first
            document.querySelectorAll('.faq-answer.open').forEach(a => {
                a.classList.remove('open');
                const q = a.closest('.faq-item').querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            // Open this one if it was closed
            if (!isOpen) {
                answer.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }

            if (window.gtag) gtag('event', 'faq_toggle', {
                event_category: 'engagement',
                event_label: question.querySelector('h4')?.textContent?.trim(),
                value: !isOpen ? 1 : 0
            });
        });
    });

    // ===== SCROLL ANIMATIONS =====
    if ('IntersectionObserver' in window) {
        const animEls = document.querySelectorAll(
            '.service-card, .benefit-card, .mv-card, .why-card, .testimonial-card, ' +
            '.value-card, .program-card, .category-card, .result-item, .faq-item, ' +
            '.methodology-item, .benefit-item, .format-card, .loop-step-item, ' +
            '.proc-step, .timeline-step, .leader-card'
        );
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        animEls.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';
            el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            io.observe(el);
        });
    }

    // ===== LAZY LOADING IMAGES =====
    const lazyImages = document.querySelectorAll('img.lazy');
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imgObserver.observe(img));
    } else {
        lazyImages.forEach(img => { img.src = img.dataset.src; img.classList.remove('lazy'); });
    }

    // ===== SERVICE NAV PILLS (services.html) =====
    const pills    = document.querySelectorAll('.nav-pill');
    const pillSecs = document.querySelectorAll('.service-pillar');
    if (pills.length > 0) {
        pills.forEach(pill => {
            pill.addEventListener('click', function (e) {
                e.preventDefault();
                pills.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                const target = document.getElementById(this.dataset.service);
                if (target) {
                    const offset = (header ? header.offsetHeight : 80) + 20;
                    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                }
            });
        });
        window.addEventListener('scroll', () => {
            let current = '';
            pillSecs.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
            });
            pills.forEach(p => {
                p.classList.remove('active');
                if (p.dataset.service === current) p.classList.add('active');
            });
        });
    }

    // ===== URL PARAM → PREFILL FORM =====
    const params = new URLSearchParams(window.location.search);
    ['service', 'budget', 'category'].forEach(key => {
        const el = document.getElementById(key);
        if (el && params.get(key)) el.value = params.get(key);
    });

    // =========================================================
    // CONTACT FORM — DUAL MODE
    //
    // Currently uses Formspree (AIRTABLE_MODE = false).
    //
    // SWITCHING TO AIRTABLE (Option B from the automation doc):
    //   1. Set AIRTABLE_MODE = true
    //   2. Paste your Base ID from airtable.com/api
    //   3. Paste your Personal Access Token from
    //      airtable.com/create/tokens
    //
    //   The form will push directly into the "Leads" table
    //   in your Neczux Operating System base, triggering
    //   the Lead → Client → Project automation chain.
    // =========================================================
    const AIRTABLE_MODE    = false;
    const AIRTABLE_BASE_ID = 'YOUR_BASE_ID';    // e.g. appXXXXXXXXXXX
    const AIRTABLE_TOKEN   = 'YOUR_PAT_HERE';   // patXXXXXXXXXXXXXXXX

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            btn.disabled = true;

            try {
                if (AIRTABLE_MODE) {
                    // ── AIRTABLE API (Option B) ────────────────────────
                    // Pushes into Leads table → triggers full automation chain
                    const payload = {
                        fields: {
                            'Full Name':        document.getElementById('name')?.value     || '',
                            'Email':            document.getElementById('email')?.value    || '',
                            'Phone':            document.getElementById('phone')?.value    || '',
                            'Company Name':     document.getElementById('company')?.value  || '',
                            'Service Interest': [document.getElementById('service')?.value || ''],
                            'Budget Range':     document.getElementById('budget')?.value   || '',
                            'Message':          document.getElementById('message')?.value  || '',
                            'Source':           'Website',
                            'Status':           'New'
                        }
                    };
                    const res = await fetch(
                        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        }
                    );
                    if (!res.ok) throw new Error('Airtable error ' + res.status);
                    // ── END AIRTABLE ───────────────────────────────────

                } else {
                    // ── FORMSPREE (current default) ────────────────────
                    const res = await fetch('https://formspree.io/f/mykprola', {
                        method: 'POST',
                        body: new FormData(this),
                        headers: { 'Accept': 'application/json' }
                    });
                    if (!res.ok) throw new Error('Formspree error ' + res.status);
                    // ── END FORMSPREE ──────────────────────────────────
                }

                showNotification('Message sent! We\'ll respond within 24 hours.', 'success');
                contactForm.reset();

                if (window.gtag) gtag('event', 'form_submit', {
                    event_category: 'lead_capture',
                    event_label: 'Contact Form'
                });

            } catch (err) {
                showNotification(
                    'Something went wrong. Email us at <a href="mailto:neczuxglobalgroup@gmail.com" style="color:#fff;text-decoration:underline;">neczuxglobalgroup@gmail.com</a>',
                    'error'
                );
                console.error('Form error:', err);
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        });
    }

    // ===== NEWSLETTER FORMS =====
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput?.value?.trim();
            if (!email || !isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            try {
                const fd = new FormData();
                fd.append('email', email);
                fd.append('_subject', 'Newsletter Signup — Neczux Global Group');
                fd.append('form-type', 'newsletter');
                await fetch('https://formspree.io/f/mykprola', {
                    method: 'POST', body: fd, headers: { 'Accept': 'application/json' }
                });
                showNotification('Subscribed! Welcome to the Neczux community.', 'success');
                if (emailInput) emailInput.value = '';
                if (window.gtag) gtag('event', 'newsletter_signup', { event_category: 'engagement' });
            } catch {
                showNotification('Subscription failed. Please try again.', 'error');
            }
        });
    });

    // ===== UTILITY: TOAST NOTIFICATION =====
    function showNotification(message, type = 'info') {
        document.querySelectorAll('.ngg-toast').forEach(n => n.remove());
        const palette = { success: '#22C55E', error: '#EF4444', info: '#3B82F6' };
        const icons   = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
        const el = document.createElement('div');
        el.className = 'ngg-toast';
        el.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()"
                style="background:none;border:none;color:inherit;cursor:pointer;margin-left:.75rem;font-size:.9rem;line-height:1;">✕</button>
        `;
        Object.assign(el.style, {
            position: 'fixed', top: '1.25rem', right: '1.25rem',
            background: palette[type], color: '#fff',
            padding: '.9rem 1.25rem', borderRadius: '10px',
            boxShadow: '0 8px 28px rgba(0,0,0,.18)',
            zIndex: '99999', display: 'flex', alignItems: 'center', gap: '.6rem',
            fontFamily: "'Poppins',sans-serif", fontSize: '.88rem', fontWeight: '500',
            maxWidth: '390px', transform: 'translateX(120%)',
            transition: 'transform .3s cubic-bezier(.4,0,.2,1)'
        });
        document.body.appendChild(el);
        requestAnimationFrame(() => { el.style.transform = 'translateX(0)'; });
        setTimeout(() => {
            el.style.transform = 'translateX(120%)';
            setTimeout(() => el.remove(), 350);
        }, 5500);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    console.log('Neczux Global Group — System Initialized ✓');
});
