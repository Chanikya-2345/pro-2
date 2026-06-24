// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]:nth-of-type(1)').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelector('input[type="text"]:nth-of-type(2)') ? contactForm.querySelector('input[type="text"]:nth-of-type(2)').value : '';
        const message = contactForm.querySelector('textarea').value;
        
        if (name && email && message) {
            // Show success message
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '✓ Message Sent Successfully!';
            submitBtn.style.backgroundColor = '#4caf50';
            
            // Reset form
            contactForm.reset();
            
            // Restore button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }
    });
}

// Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const originalText = button.textContent;
        button.textContent = '✓ Added!';
        button.style.backgroundColor = '#4caf50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    });
});

// Smooth scroll enhancement
document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-in-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Observe feature cards
const features = document.querySelectorAll('.feature');
features.forEach((feature, index) => {
    feature.style.opacity = '0';
    feature.style.animationDelay = `${index * 0.1}s`;
    observer.observe(feature);
});

// Observe info items
const infoItems = document.querySelectorAll('.info-item');
infoItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// CTA Button functionality
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const productsSection = document.getElementById('products');
        productsSection.scrollIntoView({ behavior: 'smooth' });
    });
}

console.log('Layali Lumina website loaded successfully! 🕯️ Illuminate your space with luxury.');

// ============================================================
// LAYALI LUMINA - INTERACTIVE ORDERING SYSTEM (WHATSAPP METHOD)
// ============================================================

// 1. YOUR CONFIGURATION
// Replace XXXXXXXXXX with your actual 10-digit WhatsApp phone number (include country code without +)
// Example for India: "919876543210"
const YOUR_WHATSAPP_NUMBER = "919490466386"; 

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. MOBILE NAVIGATION HAMBURGER MENU TOGGLE
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }

    // 3. CAPTURE ORDER DETAILS ON "ADD TO CART" CLICK
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            // Find the specific card where the button was clicked
            const productCard = event.target.closest(".product-card");
            
            if (productCard) {
                // Extract item details dynamically from the HTML text content
                const productName = productCard.querySelector("h3").innerText.trim();
                const productPrice = productCard.querySelector(".price").innerText.trim();
                
                // Trigger the secure order sequence
                sendOrderToWhatsApp(productName, productPrice);
            }
        });
    });
});

// 4. FORMAT AND SEND THE MESSAGES SECURELY
function sendOrderToWhatsApp(name, price) {
    // Construct a beautiful professional message layout for your phone screen
    const message = `✨ *New Order Request - Layali Lumina* ✨\n\n` +
                    `Hello! I am visiting your website and would love to purchase this premium candle:\n\n` +
                    `📦 *Product:* ${name}\n` +
                    `💰 *Price:* ${price}\n\n` +
                    `Please let me know the available payment methods and delivery details to confirm my order! Thank you.`;

    // Safely encode text characters for a web URL string
    const encodedMessage = encodeURIComponent(message);
    
    // Construct the standard clean WhatsApp API link structure
    const whatsAppLink = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open the user's WhatsApp directly in a new window/app tab
    window.open(whatsAppLink, "_blank");
}
