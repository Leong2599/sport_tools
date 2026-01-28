// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.tool-card, .blog-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Here you would normally send the data to a server
        // For demo purposes, we'll show a success message
        const formContainer = newsletterForm.parentElement;
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Thank you for subscribing!';
        successMessage.style.color = '#10b981';
        successMessage.style.fontWeight = '600';
        
        newsletterForm.style.display = 'none';
        formContainer.appendChild(successMessage);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            newsletterForm.style.display = 'flex';
            newsletterForm.reset();
            successMessage.remove();
        }, 3000);
    });
}

// Search functionality (for future implementation)
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Search tools...';
    searchInput.className = 'search-input';
    
    // Add search input to navbar (optional enhancement)
    // document.querySelector('.nav-container').appendChild(searchInput);
}

// Tool category filtering
function initCategoryFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    
    if (categoryButtons.length === 0) return;
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            toolCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

// Tool usage tracking (for analytics)
function trackToolUsage(toolName) {
    // In a real application, you would send this to an analytics service
    console.log(`Tool used: ${toolName}`);
    
    // Example: Send to Google Analytics
    // gtag('event', 'tool_usage', {
    //     'tool_name': toolName,
    //     'page_location': window.location.href
    // });
}

// Theme toggle (optional enhancement)
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Add to navbar (optional)
    // document.querySelector('.nav-container').appendChild(themeToggle);
}

// Performance monitoring
function trackPagePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            // Send to analytics if needed
            // gtag('event', 'page_load_time', {
            //     'value': loadTime,
            //     'page_path': window.location.pathname
            // });
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCategoryFiltering();
    trackPagePerformance();
    
    // Initialize optional features
    // initThemeToggle();
    // initSearch();
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send errors to a logging service
});

// Keyboard navigation improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// Lazy loading for images (if implemented)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Utility functions for calculators
const calculatorUtils = {
    // BMI Calculator
    calculateBMI: (weight, height) => {
        const bmi = weight / (height * height);
        return {
            bmi: bmi.toFixed(1),
            category: this.getBMICategory(bmi)
        };
    },
    
    getBMICategory: (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    },
    
    // Heart Rate Calculator
    calculateHeartRateZones: (age) => {
        const maxHR = 220 - age;
        return {
            max: maxHR,
            zones: {
                warmUp: { min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6) },
                fatBurn: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
                cardio: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
                peak: { min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9) }
            }
        };
    },
    
    // Calorie Calculator
    calculateDailyCalories: (weight, height, age, gender, activityLevel) => {
        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9
        };
        
        return Math.round(bmr * activityMultipliers[activityLevel]);
    }
};

// Make utilities available globally for calculator pages
window.calculatorUtils = calculatorUtils;