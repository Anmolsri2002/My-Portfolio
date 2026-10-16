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
    // 6. INTERACTIVE PROJECT FILTER TABS
    // -------------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter || category === 'all') {
                        card.classList.remove('is-hidden');
                    } else {
                        card.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    // -------------------------------------------------------------------------
    // 7. CV PREVIEW MODAL CONTROLS & COPY RESUME LINK
    // -------------------------------------------------------------------------
    const cvModal = document.getElementById('cv-modal');
    const closeCvModalBtn = document.getElementById('close-cv-modal');
    const cvModalTriggers = [
        document.getElementById('open-cv-modal-btn'),
        document.getElementById('hero-cv-btn'),
        document.getElementById('banner-cv-preview-btn')
    ];

    function openCvModal() {
        if (!cvModal) return;
        cvModal.classList.add('active');
        cvModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeCvModal() {
        if (!cvModal) return;
        cvModal.classList.remove('active');
        cvModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    cvModalTriggers.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openCvModal();
            });
        }
    });

    if (closeCvModalBtn) {
        closeCvModalBtn.addEventListener('click', closeCvModal);
    }

    if (cvModal) {
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                closeCvModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cvModal && cvModal.classList.contains('active')) {
            closeCvModal();
        }
    });

    // Copy Resume Link Buttons
    const copyCvLinkBtns = [
        document.getElementById('copy-cv-url-btn'),
        document.getElementById('modal-copy-link-btn')
    ];

    const resumePdfUrl = new URL('./Anmol_Srivastava_Resume.pdf', window.location.href).href;

    copyCvLinkBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(resumePdfUrl).then(() => {
                        showToast('Resume link copied to clipboard!');
                    }).catch(() => {
                        showToast('Direct Resume link: ' + resumePdfUrl);
                    });
                } else {
                    showToast('Direct Resume link: ' + resumePdfUrl);
                }
            });
        }
    });

    // -------------------------------------------------------------------------
    // 8. TOAST NOTIFICATION UTILITY
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

    // -------------------------------------------------------------------------
    // 9. THREE.JS 3D INTERACTIVE HERO BACKGROUND ENGINE
    // -------------------------------------------------------------------------
    function initHero3DCanvas() {
        const canvas = document.getElementById('hero-3d-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const container = canvas.parentElement;
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 40;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create 3D Floating Geometries (Icosahedrons & Nodes)
        const geometryGroup = new THREE.Group();
        scene.add(geometryGroup);

        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const primaryColor = isDark ? 0x10b981 : 0x059669;
        const secondaryColor = isDark ? 0x06b6d4 : 0x0891b2;

        // Central Wireframe 3D Polyhedron
        const icoGeo = new THREE.IcosahedronGeometry(15, 1);
        const icoMat = new THREE.MeshBasicMaterial({
            color: primaryColor,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const icoMesh = new THREE.Mesh(icoGeo, icoMat);
        geometryGroup.add(icoMesh);

        // Inner Core 3D Wireframe
        const innerGeo = new THREE.OctahedronGeometry(8, 0);
        const innerMat = new THREE.MeshBasicMaterial({
            color: secondaryColor,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        geometryGroup.add(innerMesh);

        // 3D Particles Constellation Field
        const particleCount = 180;
        const particlesGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 120;
            positions[i + 1] = (Math.random() - 0.5) * 90;
            positions[i + 2] = (Math.random() - 0.5) * 80;
        }

        particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMat = new THREE.PointsMaterial({
            color: primaryColor,
            size: 1.5,
            transparent: true,
            opacity: 0.65
        });

        const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particlesMesh);

        // Mouse Parallax movement
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        window.addEventListener('mousemove', (e) => {
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;
            mouseX = (e.clientX - windowHalfX) * 0.0008;
            mouseY = (e.clientY - windowHalfY) * 0.0008;
        });

        function animate() {
            requestAnimationFrame(animate);

            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            icoMesh.rotation.x += 0.003;
            icoMesh.rotation.y += 0.005;

            innerMesh.rotation.x -= 0.005;
            innerMesh.rotation.y -= 0.003;

            particlesMesh.rotation.y += 0.001;

            geometryGroup.rotation.y = targetX * 1.5;
            geometryGroup.rotation.x = targetY * 1.5;

            camera.position.x += (targetX * 10 - camera.position.x) * 0.05;
            camera.position.y += (-targetY * 10 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    initHero3DCanvas();

    // -------------------------------------------------------------------------
    // 10. DYNAMIC 3D PERSPECTIVE CARD TILT EFFECT
    // -------------------------------------------------------------------------
    const tiltCards = document.querySelectorAll(
        '.profile-card, .project-card, .skill-category-card, .timeline-card, .credential-card, .cv-showcase-card'
    );

    tiltCards.forEach(card => {
        // Add glare overlay element if absent
        if (!card.querySelector('.card-glare-overlay')) {
            const glare = document.createElement('div');
            glare.className = 'card-glare-overlay';
            card.appendChild(glare);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
            card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
            card.classList.add('is-hovered-3d');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.classList.remove('is-hovered-3d');
        });
    });

    // -------------------------------------------------------------------------
    // 11. INTERACTIVE 3D TECH CUBE FULL 360° ROTATION ENGINE
    // -------------------------------------------------------------------------
    const techCube = document.getElementById('tech-cube-3d');
    const cubeShowcase = document.querySelector('.tech-cube-showcase');

    if (techCube && cubeShowcase) {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let currentRotX = -20;
        let currentRotY = 25;

        // Smooth mouse move across container mapping to 360 degrees
        cubeShowcase.addEventListener('mousemove', (e) => {
            if (isDragging) return;
            const rect = cubeShowcase.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const normX = (mouseX / rect.width) - 0.5;
            const normY = (mouseY / rect.height) - 0.5;

            const targetY = normX * 360;
            const targetX = -normY * 180;

            techCube.style.transform = `rotateX(${targetX.toFixed(1)}deg) rotateY(${targetY.toFixed(1)}deg)`;
        });

        // Mouse Drag for continuous manual 360° spin
        cubeShowcase.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
            techCube.style.transition = 'none';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };

            currentRotY += deltaMove.x * 0.9;
            currentRotX -= deltaMove.y * 0.9;

            techCube.style.transform = `rotateX(${currentRotX.toFixed(1)}deg) rotateY(${currentRotY.toFixed(1)}deg)`;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                techCube.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        });

        // Touch support for mobile devices
        cubeShowcase.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                techCube.style.transition = 'none';
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;

            const deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x,
                y: e.touches[0].clientY - previousMousePosition.y
            };

            currentRotY += deltaMove.x * 0.9;
            currentRotX -= deltaMove.y * 0.9;

            techCube.style.transform = `rotateX(${currentRotX.toFixed(1)}deg) rotateY(${currentRotY.toFixed(1)}deg)`;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                techCube.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        });

        cubeShowcase.addEventListener('mouseleave', () => {
            if (!isDragging) {
                techCube.style.transition = 'transform 0.8s ease';
                techCube.style.transform = '';
            }
        });
    }


    // -------------------------------------------------------------------------
    // 12. 3D SCROLL ENTRANCE INTERSECTION OBSERVER
    // -------------------------------------------------------------------------
    const revealElements = document.querySelectorAll(
        '.highlight-item, .timeline-item, .skill-category-card, .project-card, .credential-card, .contact-card, .cv-showcase-card, .about-grid'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal-3d');
    });

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }
});

