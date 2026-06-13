document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animation observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // Dark/Light Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggleIcon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('light-theme');
        themeToggleIcon.className = 'fas fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeToggleIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            themeToggleIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Contact Form Action using FormSubmit AJAX (handles file:// protocol CORS fallback)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        if (window.location.protocol === 'file:') {
            contactForm.action = 'https://formsubmit.co/sangeetadhami359@gmail.com';
            contactForm.method = 'POST';
        }

        contactForm.addEventListener('submit', (e) => {
            // If running locally on file:// protocol, bypass AJAX fetch to prevent CORS block
            if (window.location.protocol === 'file:') {
                return; 
            }

            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                const submitBtn = contactForm.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';

                // Submit to FormSubmit AJAX endpoint
                fetch('https://formsubmit.co/ajax/sangeetadhami359@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Send Message';

                    // Show success feedback
                    const formContainer = document.querySelector('.contact-container');
                    contactForm.style.display = 'none';
                    
                    const successMsg = document.createElement('div');
                    successMsg.className = 'card fade-in visible';
                    successMsg.style.padding = '2.5rem';
                    successMsg.style.textAlign = 'center';
                    successMsg.style.marginTop = '2rem';
                    
                    successMsg.innerHTML = `
                        <i class="fas fa-check-circle" style="color: var(--accent-cyan); font-size: 3rem; margin-bottom: 1.5rem;"></i>
                        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Thank You, ${name}!</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Your message has been successfully sent. I will get back to you at ${email} as soon as possible.</p>
                        <button id="reset-form-btn" class="cta-btn" style="padding: 0.8rem 1.5rem; font-size: 0.9rem;">Send Another Message</button>
                    `;
                    
                    formContainer.appendChild(successMsg);
                    
                    document.getElementById('reset-form-btn').addEventListener('click', () => {
                        successMsg.remove();
                        contactForm.reset();
                        contactForm.style.display = 'block';
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Send Message';
                    alert('Oops! There was a problem sending your message. Please try again.');
                });
            }
        });
    }
});
