/* ==========================================================================
   Giving Grace – main script
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       Sticky header
    ------------------------------------------------------------------ */
    const header = document.getElementById('header');

    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 50);
        highlightActiveNavLink();
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ------------------------------------------------------------------
       Mobile menu toggle
    ------------------------------------------------------------------ */
    const menuToggle = document.getElementById('menuToggle');
    const mainNav    = document.getElementById('mainNav');

    menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('active');
        menuToggle.innerHTML = isOpen
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    /* ------------------------------------------------------------------
       Scroll-spy – highlight active nav link
    ------------------------------------------------------------------ */
    const sections  = document.querySelectorAll('section[id], div[id]');
    const navLinks  = document.querySelectorAll('.nav-links a');

    function highlightActiveNavLink() {
        let currentId = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                currentId = sec.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + currentId
            );
        });
    }

    /* ------------------------------------------------------------------
       Scroll-reveal animations via IntersectionObserver
    ------------------------------------------------------------------ */
    const animatedEls = document.querySelectorAll(
        '.fade-in-up, .slide-in-left, .slide-in-right'
    );

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatedEls.forEach(el => revealObserver.observe(el));

    /* ------------------------------------------------------------------
       Animated counters in stats bar
    ------------------------------------------------------------------ */
    const counterEls = document.querySelectorAll('.stat-number[data-count]');
    let countersStarted = false;

    const counterObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !countersStarted) {
                countersStarted = true;
                counterEls.forEach(animateCounter);
                counterObserver.disconnect();
            }
        },
        { threshold: 0.5 }
    );

    if (counterEls.length) {
        counterObserver.observe(counterEls[0].closest('.stats-bar'));
    }

    function animateCounter(el) {
        const target   = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start    = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    /* ------------------------------------------------------------------
       Amount-button selection (giving cards)
    ------------------------------------------------------------------ */
    document.querySelectorAll('.amount-buttons').forEach(group => {
        group.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    /* ------------------------------------------------------------------
       Hero Ken-Burns effect trigger
    ------------------------------------------------------------------ */
    const hero = document.querySelector('.hero');
    if (hero) {
        setTimeout(() => hero.classList.add('loaded'), 100);
    }

    /* ------------------------------------------------------------------
       Form submissions (demo – shows a success message)
    ------------------------------------------------------------------ */
    function handleForm(formId, statusId) {
        const form   = document.getElementById(formId);
        const status = document.getElementById(statusId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled    = true;
            btn.textContent = 'Sending…';

            // Simulate async submission
            setTimeout(() => {
                status.textContent = '✓ Thank you! We\'ll be in touch soon.';
                status.className   = 'form-status success';
                form.reset();
                btn.disabled    = false;
                btn.textContent = btn.dataset.label || 'Submit';

                setTimeout(() => {
                    status.textContent = '';
                    status.className   = 'form-status';
                }, 6000);
            }, 1200);
        });

        // Cache original button text
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.dataset.label = btn.textContent;
    }

    handleForm('contactForm',   'contactStatus');
    handleForm('volunteerForm', 'volunteerStatus');

    /* ------------------------------------------------------------------
       Smooth-scroll for anchor links (fallback for older browsers)
    ------------------------------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = header.offsetHeight + 16;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth',
            });
        });
    });

})();
