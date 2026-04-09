/* ===================================================
   NECZUX GLOBAL GROUP — MAIN JAVASCRIPT
   Single DOMContentLoaded · Clean mobile menu
   FAQ: .faq-item.active · Formspree ↔ Airtable
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===== STICKY HEADER =====
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 80);
        }, { passive: true });
    }

    // ===== MOBILE MENU =====
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu   = document.querySelector('.nav-menu');

    function closeMenu() {
        navMenu?.classList.remove('active');
        mobileBtn?.classList.remove('active');
        mobileBtn?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        document.querySelectorAll('.dropdown.open').forEach(d => {
            d.classList.remove('open');
            d.querySelector('.dropdown-menu')?.classList.remove('open');
            d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
    }

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('active');
            this.classList.toggle('active', isOpen);
            this.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
                closeMenu();
            }
        });

        navMenu.querySelectorAll('.nav-list > li > a:not(.dropdown-toggle), .dropdown-menu a')
            .forEach(link => link.addEventListener('click', closeMenu));
    }

    // ===== MOBILE DROPDOWN =====
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = this.closest('.dropdown');
                document.querySelectorAll('.dropdown.open').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('open');
                        d.querySelector('.dropdown-menu')?.classList.remove('open');
                        d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                    }
                });
                const isOpen = dropdown.classList.toggle('open');
                dropdown.querySelector('.dropdown-menu')?.classList.toggle('open', isOpen);
                this.setAttribute('aria-expanded', String(isOpen));
            }
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('http')) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = (header ? header.offsetHeight : 72) + 24;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                closeMenu();
            }
        });
    });

    // ===== SCROLL TO TOP =====
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item.active').forEach(open => {
                open.classList.remove('active');
                open.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    if ('IntersectionObserver' in window) {
        const sel = '.service-card,.benefit-card,.mv-card,.why-card,.testimonial-card,' +
            '.value-card,.program-card,.category-card,.result-item,.faq-item,' +
            '.methodology-item,.benefit-item,.format-card,.loop-step-item,' +
            '.proc-step,.timeline-step,.leader-card,.case-card';
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll(sel).forEach(el => {
            el.style.cssText += 'opacity:0;transform:translateY(18px);transition:opacity .45s ease,transform .45s ease;';
            io.observe(el);
        });
    }

    // ===== LAZY IMAGES =====
    if ('IntersectionObserver' in window) {
        const imgObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    obs.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img.lazy').forEach(img => imgObs.observe(img));
    }

    // ===== SERVICE NAV PILLS =====
    const pills    = document.querySelectorAll('.nav-pill[data-service]');
    const pillSecs = document.querySelectorAll('.service-pillar');
    if (pills.length && pillSecs.length) {
        pills.forEach(pill => {
            pill.addEventListener('click', function (e) {
                e.preventDefault();
                pills.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                const target = document.getElementById(this.dataset.service);
                if (target) {
                    const offset = (header ? header.offsetHeight : 72) + 64;
                    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                }
            });
        });
        window.addEventListener('scroll', () => {
            let current = '';
            pillSecs.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
            });
            pills.forEach(p => p.classList.toggle('active', p.dataset.service === current));
        }, { passive: true });
    }

    // ===== URL PARAM PREFILL =====
    const params = new URLSearchParams(window.location.search);
    ['service', 'budget', 'category', 'training'].forEach(key => {
        const el = document.getElementById(key);
        if (el && params.get(key)) el.value = params.get(key);
    });

    // =========================================================
    // CONTACT FORM — DUAL MODE
    //
    // AIRTABLE_MODE = false  → Formspree (ready now, no config)
    // AIRTABLE_MODE = true   → push to Neczux Operating System
    //                          Leads table → full automation chain
    //
    // To switch to Airtable:
    //   1. Set AIRTABLE_MODE = true
    //   2. airtable.com/create/tokens → create PAT with
    //      scope: data.records:write
    //   3. Paste token in AIRTABLE_TOKEN
    // =========================================================
    const AIRTABLE_MODE    = false;
    const AIRTABLE_BASE_ID = 'app8b0QJBSkgZfyve';  // Neczux Operating System
    const AIRTABLE_TOKEN   = 'YOUR_PAT_HERE';

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            btn.disabled = true;

            try {
                if (AIRTABLE_MODE) {
                    const payload = {
                        fields: {
                            'Full Name':        document.getElementById('name')?.value     || '',
                            'Email':            document.getElementById('email')?.value    || '',
                            'Phone':            document.getElementById('phone')?.value    || '',
                            'Company':          document.getElementById('company')?.value  || '',
                            'Service Interest': [document.getElementById('service')?.value || ''],
                            'Budget Range':     document.getElementById('budget')?.value   || '',
                            'Message':          document.getElementById('message')?.value  || '',
                            'Source': 'Website',
                            'Status': 'New'
                        }
                    };
                    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!res.ok) throw new Error('Airtable ' + res.status);
                } else {
                    const res = await fetch('https://formspree.io/f/mykprola', {
                        method: 'POST',
                        body: new FormData(this),
                        headers: { 'Accept': 'application/json' }
                    });
                    if (!res.ok) throw new Error('Formspree ' + res.status);
                }

                showToast("Message sent! We'll respond within 24 hours.", 'success');
                contactForm.reset();
                if (window.gtag) gtag('event', 'form_submit', { event_category: 'lead_capture' });

            } catch (err) {
                showToast('Something went wrong. WhatsApp us at +233 247 298 881.', 'error');
                console.error(err);
            } finally {
                btn.innerHTML = orig;
                btn.disabled = false;
            }
        });
    }

    // ===== NEWSLETTER =====
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            const email = input?.value?.trim();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            try {
                const fd = new FormData();
                fd.append('email', email);
                fd.append('_subject', 'Newsletter Signup — Neczux Global Group');
                await fetch('https://formspree.io/f/mykprola', {
                    method: 'POST', body: fd, headers: { 'Accept': 'application/json' }
                });
                showToast('Subscribed! Welcome to the Neczux community.', 'success');
                if (input) input.value = '';
            } catch {
                showToast('Subscription failed. Please try again.', 'error');
            }
        });
    });

    // ===== COOKIE CONSENT =====
    (function () {
        if (localStorage.getItem('ngg-cookies-accepted')) return;
        const banner = document.getElementById('cookieConsent');
        if (!banner) return;
        setTimeout(() => banner.classList.add('show'), 1200);
        document.getElementById('acceptCookies')?.addEventListener('click', () => {
            localStorage.setItem('ngg-cookies-accepted', 'true');
            banner.classList.remove('show');
            if (window.gtag) gtag('consent', 'update', { analytics_storage: 'granted' });
        });
        document.getElementById('declineCookies')?.addEventListener('click', () => {
            localStorage.setItem('ngg-cookies-accepted', 'false');
            banner.classList.remove('show');
        });
    })();

    // ===== TOAST =====
    function showToast(message, type = 'info') {
        document.querySelectorAll('.ngg-toast').forEach(n => n.remove());
        const palette = { success: '#22C55E', error: '#EF4444', info: '#3B82F6' };
        const icons   = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
        const el = document.createElement('div');
        el.className = 'ngg-toast';
        el.innerHTML = `<i class="fas fa-${icons[type]}"></i><span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:.5rem;">✕</button>`;
        Object.assign(el.style, {
            position:'fixed',top:'1.25rem',right:'1.25rem',background:palette[type],color:'#fff',
            padding:'.85rem 1.2rem',borderRadius:'10px',boxShadow:'0 8px 28px rgba(0,0,0,.2)',
            zIndex:'99999',display:'flex',alignItems:'center',gap:'.6rem',
            fontFamily:"'Poppins',sans-serif",fontSize:'.88rem',fontWeight:'500',
            maxWidth:'380px',transform:'translateX(120%)',transition:'transform .3s cubic-bezier(.4,0,.2,1)'
        });
        document.body.appendChild(el);
        requestAnimationFrame(() => { el.style.transform = 'translateX(0)'; });
        setTimeout(() => { el.style.transform = 'translateX(120%)'; setTimeout(() => el.remove(), 350); }, 5500);
    }

    console.log('Neczux Global Group — System Initialized ✓');
});