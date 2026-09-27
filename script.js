/**
 * Anmol Srivastava - Portfolio Interactive Script
 * Clean, modular Vanilla JS for theme toggle, mobile nav, copy-to-clipboard,
 * scroll spy, and contact handling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. THEME TOGGLING (DARK / LIGHT) WITH LOCAL STORAGE
    // -------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark) {
        htmlElement.setAttribute('data-theme', 'light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            showToast(`Switched to ${nextTheme} mode`);
        });
    }

    // -------------------------------------------------------------------------
    // 2. MOBILE NAVIGATION DRAWER
    // -------------------------------------------------------------------------
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggleBtn && navMenu) {
        mobileToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileToggleBtn.classList.toggle('active');
        });

        // Close when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggleBtn.classList.remove('active');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggleBtn.classList.remove('active');
            }
        });
    }

    // -------------------------------------------------------------------------
    // 3. SCROLL SPY (ACTIVE NAVIGATION HIGHLIGHT)
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });

    // -------------------------------------------------------------------------
    // 4. COPY EMAIL TO CLIPBOARD
    // -------------------------------------------------------------------------
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailToCopy = 'anmol282002@gmail.com';

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(emailToCopy).then(() => {
                    showToast('Email copied to clipboard!');
                }).catch(() => {
                    fallbackCopyTextToClipboard(emailToCopy);
                });
            } else {
                fallbackCopyTextToClipboard(emailToCopy);
            }
        });
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Email copied to clipboard!');
        } catch (err) {
            showToast('Could not copy automatically. Email: anmol282002@gmail.com');
        }
        document.body.removeChild(textArea);
    }

    // -------------------------------------------------------------------------
    // 5. CONTACT FORM SUBMISSION (WITH MAILTO FALLBACK)
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                if (formStatus) {
                    formStatus.textContent = 'Please fill in all required fields.';
                    formStatus.className = 'form-status error';
                }
                return;
            }

            // Create mailto link for seamless local dispatch
            const mailtoUrl = `mailto:anmol282002@gmail.com?subject=${encodeURIComponent(subject || 'Message from Portfolio')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

            window.location.href = mailtoUrl;

            if (formStatus) {
                formStatus.textContent = 'Opening your email client to send message...';
                formStatus.className = 'form-status success';
            }

            showToast('Opening email client to send message...');
            contactForm.reset();
        });
    }

    // -------------------------------------------------------------------------
    // 6. TOAST NOTIFICATION UTILITY
    // -------------------------------------------------------------------------
    let toastTimeout;
    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
});
