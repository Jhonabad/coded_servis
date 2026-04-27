// Script for basic interactions
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            // Basic toggle, can be improved with CSS classes
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = '#fff';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form submission to Node Backend
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';

            try {
                // Ensure this matches the port your Node server runs on (3000)
                const response = await fetch('http://localhost:3000/api/contacto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, email, asunto, mensaje })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message || 'Mensaje enviado correctamente');
                    contactForm.reset();
                } else {
                    alert(data.error || 'Hubo un error al enviar el mensaje');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo conectar con el servidor. ¿Está Node.js corriendo?');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
            }
        });
    }
});
