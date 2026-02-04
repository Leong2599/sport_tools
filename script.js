// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
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

// Search functionality
class SportsToolsSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchResults = document.getElementById('searchResults');
        this.searchResultsList = document.getElementById('searchResultsList');
        this.searchCount = document.getElementById('searchCount');
        this.clearSearchBtn = document.getElementById('clearSearch');
        this.highlightedIndex = -1;
        
        this.tools = this.extractToolsFromPage();
        this.initializeEventListeners();
    }

    extractToolsFromPage() {
        const tools = [];
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach((card, index) => {
            const title = card.querySelector('h4')?.textContent.trim() || '';
            const description = card.querySelector('p')?.textContent.trim() || '';
            const link = card.querySelector('.tool-link')?.getAttribute('href') || '';
            const categoryElement = card.closest('.category-section')?.querySelector('h3');
            const category = categoryElement?.textContent.trim().replace(/[^\w\s]/gi, '').trim() || 'Other';
            
            if (title && link) {
                tools.push({
                    id: index,
                    title: title.toLowerCase(),
                    originalTitle: title,
                    description: description.toLowerCase(),
                    originalDescription: description,
                    category: category.toLowerCase(),
                    originalCategory: category,
                    link: link,
                    element: card
                });
            }
        });
        
        return tools;
    }

    initializeEventListeners() {
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchBtn.addEventListener('click', () => this.handleSearch(this.searchInput.value));
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
        
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.highlightNextResult();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.highlightPreviousResult();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.selectHighlightedResult();
            } else if (e.key === 'Escape') {
                this.clearSearch();
            }
        });

        document.addEventListener('click', (e) => {
            if (!this.searchInput.closest('.search-container').contains(e.target)) {
                this.clearSearch();
            }
        });
    }

    handleSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();
        
        if (trimmedQuery === '') {
            this.clearSearch();
            this.showAllTools();
            return;
        }

        const filteredTools = this.tools.filter(tool => 
            tool.title.includes(trimmedQuery) ||
            tool.description.includes(trimmedQuery) ||
            tool.category.includes(trimmedQuery)
        );

        this.displaySearchResults(filteredTools, trimmedQuery);
        this.filterToolsDisplay(filteredTools);
    }

    displaySearchResults(tools, query) {
        this.searchResultsList.innerHTML = '';
        
        if (tools.length === 0) {
            this.searchResultsList.innerHTML = `
                <div class="search-no-results">
                    No tools found for "${query}". Try searching for calculators, activities, or sports.
                </div>
            `;
        } else {
            tools.forEach((tool, index) => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.dataset.index = index;
                
                const highlightedTitle = this.highlightText(tool.originalTitle, query);
                const highlightedDescription = this.highlightText(tool.originalDescription, query);
                
                resultItem.innerHTML = `
                    <div class="search-result-title">${highlightedTitle}</div>
                    <div class="search-result-category">${tool.originalCategory}</div>
                    <div class="search-result-description">${highlightedDescription}</div>
                `;
                
                resultItem.addEventListener('click', () => {
                    window.location.href = tool.link;
                });
                
                resultItem.addEventListener('mouseenter', () => {
                    this.highlightedIndex = index;
                    this.updateHighlight();
                });
                
                this.searchResultsList.appendChild(resultItem);
            });
        }
        
        this.searchCount.textContent = `${tools.length} result${tools.length !== 1 ? 's' : ''}`;
        this.searchResults.classList.remove('hidden');
        this.highlightedIndex = -1;
    }

    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    filterToolsDisplay(filteredTools) {
        const allToolCards = document.querySelectorAll('.tool-card');
        const categorySections = document.querySelectorAll('.category-section');
        
        allToolCards.forEach(card => {
            card.style.display = 'none';
        });
        
        filteredTools.forEach(tool => {
            if (tool.element) {
                tool.element.style.display = 'block';
            }
        });

        categorySections.forEach(section => {
            const visibleTools = section.querySelectorAll('.tool-card:not([style*="display: none"])');
            if (visibleTools.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
    }

    showAllTools() {
        const allToolCards = document.querySelectorAll('.tool-card');
        const categorySections = document.querySelectorAll('.category-section');
        
        allToolCards.forEach(card => {
            card.style.display = 'block';
        });
        
        categorySections.forEach(section => {
            section.style.display = 'block';
        });
    }

    highlightNextResult() {
        const results = this.searchResultsList.querySelectorAll('.search-result-item');
        if (results.length === 0) return;
        
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, results.length - 1);
        this.updateHighlight();
    }

    highlightPreviousResult() {
        const results = this.searchResultsList.querySelectorAll('.search-result-item');
        if (results.length === 0) return;
        
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
        this.updateHighlight();
    }

    updateHighlight() {
        const results = this.searchResultsList.querySelectorAll('.search-result-item');
        results.forEach((item, index) => {
            item.classList.toggle('highlighted', index === this.highlightedIndex);
        });
        
        if (this.highlightedIndex >= 0) {
            results[this.highlightedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    selectHighlightedResult() {
        const results = this.searchResultsList.querySelectorAll('.search-result-item');
        if (this.highlightedIndex >= 0 && results[this.highlightedIndex]) {
            results[this.highlightedIndex].click();
        }
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchResults.classList.add('hidden');
        this.highlightedIndex = -1;
        this.showAllTools();
    }
}

// Add fade-in class to elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize search functionality
    new SportsToolsSearch();
    
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
            category: calculatorUtils.getBMICategory(bmi)
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
    calculateDailyCalories: (weight, height, age, gender, activityLevel, weightUnit, heightUnit) => {
        let weightKg = weight;
        if (weightUnit === 'lbs') {
            weightKg = weight * 0.453592;
        }

        let heightCm = height;
        if (heightUnit === 'ft') {
            const feet = Math.floor(height);
            const inches = Math.round((height - feet) * 10);
            heightCm = (feet * 12 + inches) * 2.54;
        }
        
        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
        }
        
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9
        };
        
        return Math.round(bmr * activityMultipliers[activityLevel]);
    },

    // Tool usage tracking
    trackToolUsage: function(toolName) {
        // In a real application, you would send this to an analytics service
        console.log(`Tool used: ${toolName}`);
        
        // Example: Send to Google Analytics
        // gtag('event', 'tool_usage', {
        //     'tool_name': toolName,
        //     'page_location': window.location.href
        // });
    }
};

// Make utilities available globally for calculator pages
window.calculatorUtils = calculatorUtils;

// Helper function to get float value from input
function getInputValue(element) {
    return element ? parseFloat(element.value) : NaN;
}

// Helper function to get selected unit from select element
function getSelectedUnit(element) {
    return element ? element.value : '';
}

// Helper function to set required attribute
function setRequired(element, isRequired) {
    if (element) {
        if (isRequired) {
            element.setAttribute('required', 'required');
        } else {
            element.removeAttribute('required');
        }
    }
}

// Helper function to toggle height input fields based on unit selection
function toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput) {
    if (heightUnitSelect.value === 'cm') {
        heightCmInput.style.display = 'block';
        heightCmInput.required = true;
        heightFeetInput.style.display = 'none';
        heightFeetInput.required = false;
        heightInchesInput.style.display = 'none';
        heightInchesInput.required = false;
    } else { // ft/in
        heightCmInput.style.display = 'none';
        heightCmInput.required = false;
        heightFeetInput.style.display = 'block';
        heightFeetInput.required = true;
        heightInchesInput.style.display = 'block';
        heightInchesInput.required = true;
    }
}

// Helper function to handle radio button styling
function setupRadioStyling(radioGroupName) {
    const radios = document.querySelectorAll(`input[name="${radioGroupName}"]`);
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            radios.forEach(siblingRadio => {
                siblingRadio.closest('label').classList.remove('radio-selected');
            });
            if (radio.checked) {
                radio.closest('label').classList.add('radio-selected');
            }
        });
    });
    // Set initial 'radio-selected' class for pre-checked radios
    document.querySelectorAll(`input[name="${radioGroupName}"]:checked`).forEach(radio => {
        radio.closest('label').classList.add('radio-selected');
    });
}

// Initialize One Rep Max Calculator
function initOneRepMaxCalculator() {
    const oneRepMaxForm = document.getElementById('oneRepMaxForm');
    if (oneRepMaxForm) {
        oneRepMaxForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const weight = getInputValue(document.getElementById('weight'));
            const reps = getInputValue(document.getElementById('reps'));
            const weightUnit = getSelectedUnit(document.getElementById('weightUnit'));
            const formula = getSelectedUnit(document.getElementById('formula'));

            if (isNaN(weight) || weight <= 0 || isNaN(reps) || reps <= 0 || reps > 15) {
                alert('Please enter valid weight (greater than 0) and repetitions (1-15).');
                return;
            }

            let oneRM;
            switch(formula) {
                case 'epley':
                    oneRM = weight * (1 + (reps / 30));
                    break;
                case 'brzycki':
                    oneRM = weight / (1.0278 - (0.0278 * reps));
                    break;
                case 'lander':
                    oneRM = (100 * weight) / (101.3 - 2.671 * reps);
                    break;
                case 'lombardi':
                    oneRM = weight * Math.pow(reps, 0.10);
                    break;
                case 'mcglothin':
                    oneRM = (100 * weight) / (101.3 - 2.671 * reps); // Same as Lander
                    break;
                case 'okane':
                    oneRM = weight * (1 + 0.025 * reps);
                    break;
                case 'wathan':
                    oneRM = (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps));
                    break;
                default:
                    oneRM = 0;
            }

            document.getElementById('oneRepMaxResult').textContent = oneRM.toFixed(1);
            document.getElementById('resultUnit').textContent = weightUnit;
            document.getElementById('resultsCard').classList.add('show');

            // Generate Rep Max Table
            const repMaxTable = document.getElementById('repMaxTable');
            repMaxTable.innerHTML = ''; // Clear previous table

            const ul = document.createElement('ul');
            ul.className = 'rep-max-list';

            for (let i = 1; i <= 12; i++) {
                let percentage = 100 * Math.pow(i, -0.10); // Use Lombardi for percentage progression
                const estimatedWeight = (oneRM * (percentage / 100)).toFixed(1);

                const li = document.createElement('li');
                li.className = 'rep-max-item';
                li.innerHTML = `<span>${i} Reps:</span> <span>${estimatedWeight} ${weightUnit}</span>`;
                ul.appendChild(li);
            }
            repMaxTable.appendChild(ul);
        });

        oneRepMaxForm.addEventListener('reset', function() {
            document.getElementById('oneRepMaxResult').textContent = '0';
            document.getElementById('resultUnit').textContent = '';
            document.getElementById('resultsCard').classList.remove('show');
            document.getElementById('repMaxTable').innerHTML = '';
        });
    }
}

// Initialize Body Type Quiz
function initBodyTypeQuiz() {
    const bodyTypeQuizForm = document.getElementById('bodyTypeQuizForm');
    if (bodyTypeQuizForm) {
        setupRadioStyling('q1');
        setupRadioStyling('q2');
        setupRadioStyling('q3');
        setupRadioStyling('q4');
        setupRadioStyling('q5');

        bodyTypeQuizForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const answers = {
                ectomorph: 0,
                mesomorph: 0,
                endomorph: 0
            };

            const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];
            let allAnswered = true;

            questions.forEach(qName => {
                const selected = document.querySelector(`input[name="${qName}"]:checked`);
                if (selected) {
                    answers[selected.value]++;
                } else {
                    allAnswered = false;
                }
            });

            if (!allAnswered) {
                alert('Please answer all questions to get your body type result.');
                return;
            }

            let dominantBodyType = 'Unknown';
            let maxScore = 0;

            for (const type in answers) {
                if (answers[type] > maxScore) {
                    maxScore = answers[type];
                    dominantBodyType = type;
                } else if (answers[type] === maxScore && maxScore > 0) {
                    dominantBodyType = 'Blend'; // Indicate a mix if scores are tied and not zero
                }
            }

            let resultText = '';
            let descriptionText = '';
            let recommendations = '';

            switch (dominantBodyType) {
                case 'ectomorph':
                    resultText = 'Ectomorph';
                    descriptionText = 'Naturally lean and often struggles to gain weight or muscle.';
                    recommendations = `
                        <p><strong>Training:</strong> Focus on strength training with heavy weights and lower reps (6-10). Limit cardio to avoid excess calorie burn. Prioritize compound movements.</p>
                        <p><strong>Nutrition:</strong> Consume a high-calorie diet with plenty of carbohydrates and protein. Don't be afraid to eat frequently. Healthy fats are also important.</p>
                    `;
                    break;
                case 'mesomorph':
                    resultText = 'Mesomorph';
                    descriptionText = 'Naturally athletic, muscular, and gains muscle relatively easily.';
                    recommendations = `
                        <p><strong>Training:</strong> A balanced approach of strength training and moderate cardio works best. Can respond well to varied rep ranges. Enjoy diverse sports and activities.</p>
                        <p><strong>Nutrition:</strong> A balanced diet with an even distribution of macronutrients (protein, carbs, fats) is usually effective. Pay attention to portion control.</p>
                    `;
                    break;
                case 'endomorph':
                    resultText = 'Endomorph';
                    descriptionText = 'Tends to have a larger build and stores fat easily.';
                    recommendations = `
                        <p><strong>Training:</strong> Regular cardiovascular exercise is important for fat loss. Incorporate strength training to build muscle and boost metabolism. High-intensity interval training (HIIT) can be very effective.</p>
                        <p><strong>Nutrition:</strong> Focus on a diet rich in protein and healthy fats, with controlled carbohydrate intake (especially simple carbs). Prioritize whole, unprocessed foods.</p>
                    `;
                    break;
                case 'Blend':
                    resultText = 'Mixed Body Type';
                    descriptionText = 'You exhibit characteristics of multiple body types. Your approach should be a blend.';
                    recommendations = `
                        <p>You likely have a unique blend of characteristics. Experiment with different training and nutrition strategies to see what works best for your body. Pay attention to how your body responds to specific foods and exercises.</p>
                        <p>Consider focusing on aspects of both dominant types you scored highly on. For example, if you scored high on both Ectomorph and Mesomorph, you might benefit from strength training like a Mesomorph but with a slightly higher calorie intake like an Ectomorph.</p>
                    `;
                    break;
                default:
                    resultText = 'Undetermined';
                    descriptionText = 'Please ensure all questions are answered and try again.';
                    recommendations = '<p>Please answer all questions to receive a personalized recommendation.</p>';
            }

            document.getElementById('bodyTypeResult').textContent = resultText;
            document.getElementById('bodyTypeDescription').textContent = descriptionText;
            document.getElementById('bodyTypeRecommendations').innerHTML = recommendations;
            document.getElementById('resultsCard').classList.add('show');
        });

        bodyTypeQuizForm.addEventListener('reset', function() {
            document.getElementById('bodyTypeResult').textContent = '?';
            document.getElementById('bodyTypeDescription').textContent = '';
            document.getElementById('bodyTypeRecommendations').innerHTML = '';
            document.getElementById('resultsCard').classList.remove('show');
            // Remove 'radio-selected' class on reset
            document.querySelectorAll('.radio-group input[type="radio"]').forEach(radio => {
                radio.closest('label').classList.remove('radio-selected');
            });
        });
    }
}

// Macro Calculator helper functions
function getMacroRatios(goal) {
    const ratios = {
        'lose-weight': { protein: 40, carbs: 30, fats: 30 },
        'maintain': { protein: 30, carbs: 40, fats: 30 },
        'gain-muscle': { protein: 30, carbs: 45, fats: 25 },
        'gain-strength': { protein: 35, carbs: 40, fats: 25 },
        'endurance': { protein: 25, carbs: 55, fats: 20 },
        'ketogenic': { protein: 25, carbs: 5, fats: 70 }
    };
    return ratios[goal] || ratios['maintain'];
}

function adjustRatiosForDiet(ratios, diet) {
    const adjusted = { ...ratios }; // Create a copy to avoid modifying original
    const minMacro = 5;

    switch(diet) {
        case 'low-carb':
            adjusted.carbs = Math.max(minMacro, Math.min(adjusted.carbs, 20));
            adjusted.protein = Math.max(adjusted.protein, 35);
            adjusted.fats = Math.max(minMacro, 100 - adjusted.carbs - adjusted.protein);
            break;
        case 'high-carb':
            adjusted.carbs = Math.min(70, Math.max(adjusted.carbs, 50));
            adjusted.fats = Math.min(adjusted.fats, 25);
            adjusted.protein = Math.max(minMacro, 100 - adjusted.carbs - adjusted.fats);
            break;
        case 'low-fat':
            adjusted.fats = Math.max(minMacro, Math.min(adjusted.fats, 20));
            adjusted.protein = Math.max(adjusted.protein, 35);
            adjusted.carbs = Math.max(minMacro, 100 - adjusted.fats - adjusted.protein);
            break;
        case 'high-fat':
            adjusted.fats = Math.min(70, Math.max(adjusted.fats, 40));
            adjusted.carbs = Math.min(adjusted.carbs, 30);
            adjusted.protein = Math.max(minMacro, 100 - adjusted.fats - adjusted.carbs);
            break;
        case 'vegetarian':
        case 'vegan':
            adjusted.protein = Math.min(40, Math.max(adjusted.protein, adjusted.protein + 5));
            adjusted.carbs = Math.max(minMacro, adjusted.carbs - 2);
            adjusted.fats = Math.max(minMacro, 100 - adjusted.carbs - adjusted.protein);
            break;
    }

    let totalAdjusted = adjusted.protein + adjusted.carbs + adjusted.fats;
    if (totalAdjusted !== 100 && totalAdjusted > 0) {
        adjusted.protein = Math.round(adjusted.protein / totalAdjusted * 100);
        adjusted.carbs = Math.round(adjusted.carbs / totalAdjusted * 100);
        adjusted.fats = 100 - adjusted.protein - adjusted.carbs;
    }
    return adjusted;
}

function generateMealPlan(proteinGrams, carbsGrams, fatsGrams) {
    const mealPlanGrid = document.getElementById('meal-plan-grid');
    if (!mealPlanGrid) return; // Exit if element not found

    mealPlanGrid.innerHTML = ''; // Clear previous meal plan
    
    const meals = [
        { name: 'Breakfast', protein: Math.round(proteinGrams * 0.25), carbs: Math.round(carbsGrams * 0.25), fats: Math.round(fatsGrams * 0.25) },
        { name: 'Lunch', protein: Math.round(proteinGrams * 0.35), carbs: Math.round(carbsGrams * 0.35), fats: Math.round(fatsGrams * 0.35) },
        { name: 'Dinner', protein: Math.round(proteinGrams * 0.30), carbs: Math.round(carbsGrams * 0.30), fats: Math.round(fatsGrams * 0.30) },
        { name: 'Snacks', protein: proteinGrams - Math.round(proteinGrams * 0.25) - Math.round(proteinGrams * 0.35) - Math.round(proteinGrams * 0.30), 
          carbs: carbsGrams - Math.round(carbsGrams * 0.25) - Math.round(carbsGrams * 0.35) - Math.round(carbsGrams * 0.30), 
          fats: fatsGrams - Math.round(fatsGrams * 0.25) - Math.round(fatsGrams * 0.35) - Math.round(fatsGrams * 0.30) }
    ];

    let mealPlanHTML = '<div class="meal-plan-list">';
    
    meals.forEach(meal => {
        if (meal.protein >= 0 && meal.carbs >= 0 && meal.fats >= 0) {
            mealPlanHTML += `
                <div class="meal-item">
                    <div class="meal-name">${meal.name}</div>
                    <div class="meal-macros">
                        <span class="meal-protein">P: ${meal.protein}g</span>
                        <span class="meal-carbs">C: ${meal.carbs}g</span>
                        <span class="meal-fats">F: ${meal.fats}g</span>
                    </div>
                </div>
            `;
        }
    });
    
    mealPlanHTML += '</div>';
    mealPlanGrid.innerHTML = mealPlanHTML;
}

function generateFoodSources(goal, diet) {
    const foodSourcesGrid = document.getElementById('food-sources-grid');
    if (!foodSourcesGrid) return; // Exit if element not found

    foodSourcesGrid.innerHTML = ''; // Clear previous food sources
    
    let sourcesHTML = '<div class="food-sources-list">';
    
    // Protein sources
    sourcesHTML += `
        <div class="food-source-category">
            <h4>🥩 Protein Sources</h4>
            <ul>
                <li>Lean meats (chicken, turkey)</li>
                <li>Fish (salmon, tuna, cod)</li>
                <li>Eggs and dairy</li>
                <li>Legumes and beans</li>
                <li>Tofu and tempeh</li>
            </ul>
        </div>
    `;
    
    // Carb sources
    sourcesHTML += `
        <div class="food-source-category">
            <h4>🍞 Carbohydrate Sources</h4>
            <ul>
                <li>Whole grains (oats, quinoa, brown rice)</li>
                <li>Vegetables and fruits</li>
                <li>Sweet potatoes</li>
                <li>Whole grain bread</li>
                <li>Pasta and legumes</li>
            </ul>
        </div>
    `;
    
    // Fat sources
    sourcesHTML += `
        <div class="food-source-category">
            <h4>🥑 Healthy Fat Sources</h4>
            <ul>
                <li>Avocados and nuts</li>
                <li>Olive oil and coconut oil</li>
                <li>Fatty fish (salmon, mackerel)</li>
                <li>Seeds (chia, flax, hemp)</li>
                <li>Nut butters</li>
            </ul>
        </div>
    `;
    
    sourcesHTML += '</div>';
    foodSourcesGrid.innerHTML = sourcesHTML;
}

function generateMacroRecommendations(calories, ratios, goal) {
    let recommendations = `Your daily target is ${Math.round(calories)} calories with macro ratios of ${ratios.protein}% protein, ${ratios.carbs}% carbs, and ${ratios.fats}% fats. `;
    
    switch(goal) {
        case 'lose-weight':
            recommendations += 'For weight loss, focus on high-protein foods to maintain muscle mass and increase satiety. Choose complex carbs for sustained energy and healthy fats for hormone function.';
            break;
        case 'gain-muscle':
        case 'gain-strength':
            recommendations += 'For muscle gain, prioritize protein intake around workouts. Include sufficient complex carbs for energy and muscle glycogen replenishment, and healthy fats for hormone production.';
            break;
        case 'endurance':
            recommendations += 'For endurance performance, emphasize complex carbohydrates for fuel and adequate protein for recovery. Include healthy fats for long-duration energy and overall health.';
            break;
        case 'ketogenic':
            recommendations += 'For ketogenic diet, severely restrict carbohydrates. Focus on healthy fats as your primary energy source and moderate protein to preserve muscle mass. Monitor electrolyte intake.';
            break;
        case 'maintain':
            recommendations += 'Maintain a balanced approach with whole foods, proper timing around workouts, and adequate hydration to support your current weight and health.';
            break;
        case 'custom':
            recommendations += 'You are using custom macro ratios. Ensure these align with your specific dietary needs and goals. Consult a nutritionist if unsure.';
            break;
        default:
            recommendations += 'Maintain a balanced approach with whole foods, proper timing around workouts, and adequate hydration.';
    }
    
    recommendations += ' Track your intake regularly and adjust based on your progress and how you feel. Consistency is key.';
    
    return recommendations;
}

function shareResults() {
    const dailyCaloriesResult = document.getElementById('daily-calories-result');
    const proteinGramsDisplay = document.getElementById('protein-grams');
    const carbsGramsDisplay = document.getElementById('carbs-grams');
    const fatsGramsDisplay = document.getElementById('fats-grams');

    const calories = dailyCaloriesResult ? dailyCaloriesResult.textContent : '--';
    const protein = proteinGramsDisplay ? proteinGramsDisplay.textContent : '--g';
    const carbs = carbsGramsDisplay ? carbsGramsDisplay.textContent : '--g';
    const fats = fatsGramsDisplay ? fatsGramsDisplay.textContent : '--g';
    const text = `My daily macros are ${calories}: P:${protein}, C:${carbs}, F:${fats}. Calculate yours at Sports Tools Hub!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Macro Calculator Results',
            text: text,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(text + ' ' + window.location.href);
        alert('Results copied to clipboard!');
    }
}

// Initialize Macro Calculator
function initMacroCalculator() {
    const macroForm = document.getElementById('macro-form');
    if (macroForm) {
        // DOM Elements for Macro Calculator
        const calculationMethodSelect = document.getElementById('calculation-method');
        const tdeeFields = document.getElementById('tdee-fields');
        const manualFields = document.getElementById('manual-fields');
        const fitnessGoalSelect = document.getElementById('fitness-goal');
        const customRatiosFields = document.getElementById('custom-ratios');
        const dietPreferenceSelect = document.getElementById('diet-preference');
        const macroResultsCard = document.getElementById('macro-results');
        const dailyCaloriesResult = document.getElementById('daily-calories-result');
        const proteinGramsDisplay = document.getElementById('protein-grams');
        const proteinCaloriesDisplay = document.getElementById('protein-calories');
        const proteinPercentageDisplay = document.getElementById('protein-percentage');
        const carbsGramsDisplay = document.getElementById('carbs-grams');
        const carbsCaloriesDisplay = document.getElementById('carbs-calories');
        const carbsPercentageDisplay = document.getElementById('carbs-percentage');
        const fatsGramsDisplay = document.getElementById('fats-grams');
        const fatsCaloriesDisplay = document.getElementById('fats-calories');
        const fatsPercentageDisplay = document.getElementById('fats-percentage'); // Corrected line
        const mealPlanGrid = document.getElementById('meal-plan-grid');
        const foodSourcesGrid = document.getElementById('food-sources-grid');
        const recommendationText = document.getElementById('recommendation-text');

        // TDEE Method Fields
        const weightInput = document.getElementById('weight');
        const weightUnitSelect = document.getElementById('weight-unit');
        const heightCmInput = document.getElementById('heightCm');
        const heightFeetInput = document.getElementById('heightFeet');
        const heightInchesInput = document.getElementById('heightInches');
        const heightUnitSelect = document.getElementById('height-unit');
        const ageInput = document.getElementById('age');
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        const activityLevelSelect = document.getElementById('activity-level');

        // Manual Method Fields
        const dailyCaloriesInput = document.getElementById('daily-calories');

        // Custom Ratios Fields
        const customProteinInput = document.getElementById('custom-protein');
        const customCarbsInput = document.getElementById('custom-carbs');
        const customFatsInput = document.getElementById('custom-fats');

        // Toggle field visibility functions
        function toggleCalculationMethodFields() {
            [tdeeFields, manualFields].forEach(fieldGroup => {
                fieldGroup.style.display = 'none';
                fieldGroup.querySelectorAll('input, select').forEach(input => setRequired(input, false));
            });

            const selectedMethod = calculationMethodSelect.value;
            if (selectedMethod === 'tdee') {
                tdeeFields.style.display = 'block';
                setRequired(weightInput, true);
                setRequired(heightCmInput, true); 
                setRequired(ageInput, true);
                setRequired(activityLevelSelect, true);
                genderRadios.forEach(radio => setRequired(radio, true));
            } else if (selectedMethod === 'manual') {
                manualFields.style.display = 'block';
                setRequired(dailyCaloriesInput, true);
            }
            toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput);
        }

        function toggleCustomRatiosFields() {
            const selectedGoal = fitnessGoalSelect.value;
            if (selectedGoal === 'custom') {
                customRatiosFields.style.display = 'block';
                setRequired(customProteinInput, true);
                setRequired(customCarbsInput, true);
                setRequired(customFatsInput, true);
            } else {
                customRatiosFields.style.display = 'none';
                customRatiosFields.querySelectorAll('input').forEach(input => setRequired(input, false));
            }
        }

        // Event Listeners
        calculationMethodSelect.addEventListener('change', function() {
            toggleCalculationMethodFields();
            macroResultsCard.classList.remove('show');
            macroResultsCard.style.display = 'none';
            resetResultsDisplay();
        });

        fitnessGoalSelect.addEventListener('change', toggleCustomRatiosFields);
        heightUnitSelect.addEventListener('change', () => toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput));

        // Initial setup
        toggleCalculationMethodFields();
        toggleCustomRatiosFields();
        setupRadioStyling('gender');

        macroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateMacros();
        });

        macroForm.addEventListener('reset', function() {
            macroResultsCard.classList.remove('show');
            macroResultsCard.style.display = 'none';
            resetResultsDisplay();

            calculationMethodSelect.value = '';
            fitnessGoalSelect.value = '';
            dietPreferenceSelect.value = 'standard';
            toggleCalculationMethodFields();
            toggleCustomRatiosFields();
            toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput);
            document.querySelectorAll('input[name="gender"]').forEach(radio => {
                radio.closest('label').classList.remove('radio-selected');
            });
        });

        function resetResultsDisplay() {
            dailyCaloriesResult.textContent = '--';
            proteinGramsDisplay.textContent = '--g';
            proteinCaloriesDisplay.textContent = '-- cal';
            proteinPercentageDisplay.textContent = '--%';
            carbsGramsDisplay.textContent = '--g';
            carbsCaloriesDisplay.textContent = '-- cal';
            carbsPercentageDisplay.textContent = '--%';
            fatsGramsDisplay.textContent = '--g';
            fatsCaloriesDisplay.textContent = '-- cal';
            fatsPercentageDisplay.textContent = '--%';
            if (mealPlanGrid) mealPlanGrid.innerHTML = '';
            if (foodSourcesGrid) foodSourcesGrid.innerHTML = '';
            if (recommendationText) recommendationText.textContent = '';
        }

        // Main Calculation Function
        function calculateMacros() {
            console.log('Macro Calculator: Starting calculateMacros function.');

            const calculationMethod = calculationMethodSelect.value;
            let dailyCalories;

            if (!calculationMethod) { alert('Please select a calculation method.'); console.log('Macro Calculator: No calculation method selected.'); return; }

            if (calculationMethod === 'tdee') {
                const weight = getInputValue(weightInput);
                const weightUnit = getSelectedUnit(weightUnitSelect);
                const age = getInputValue(ageInput);
                const gender = document.querySelector('input[name="gender"]:checked')?.value;
                const activityLevel = getSelectedUnit(activityLevelSelect);
                const heightUnit = getSelectedUnit(heightUnitSelect);

                console.log(`Macro Calculator TDEE inputs: Weight=${weight} ${weightUnit}, Age=${age}, Gender=${gender}, Activity=${activityLevel}`);

                if (isNaN(age) || age < 15 || age > 100) { alert('Please enter a valid age (15-100).'); console.log('Macro Calculator: Invalid age.'); return; }
                if (!gender) { alert('Please select your gender.'); console.log('Macro Calculator: No gender selected.'); return; }
                if (isNaN(weight) || weight < 30) { alert('Please enter a valid weight (min 30).'); console.log('Macro Calculator: Invalid weight.'); return; }
                if (!activityLevel) { alert('Please select your activity level.'); console.log('Macro Calculator: No activity level selected.'); return; }

                let heightVal;
                if (heightUnit === 'cm') {
                    heightVal = getInputValue(heightCmInput);
                    if (isNaN(heightVal) || heightVal < 50 || heightVal > 300) { alert('Please enter a valid height in cm (50-300).'); console.log('Macro Calculator: Invalid height (cm).'); return; }
                } else { // ft/in
                    const feet = getInputValue(heightFeetInput);
                    const inches = getInputValue(heightInchesInput);
                    console.log(`Macro Calculator Height (ft/in) inputs: Feet=${feet}, Inches=${inches}`);
                    if (isNaN(feet) || feet < 1 || feet > 9 || isNaN(inches) || inches < 0 || inches > 11) { alert('Please enter a valid height in feet (1-9) and inches (0-11).'); console.log('Macro Calculator: Invalid height (ft/in).'); return; }
                    heightVal = feet + (inches / 12);
                }
                dailyCalories = calculatorUtils.calculateDailyCalories(weight, heightVal, age, gender, activityLevel, weightUnit, heightUnit);
                console.log('Macro Calculator: Calculated TDEE dailyCalories:', dailyCalories);
            } else { // manual method
                dailyCalories = getInputValue(dailyCaloriesInput);
                if (isNaN(dailyCalories) || dailyCalories < 800 || dailyCalories > 5000) { alert('Please enter a valid daily calorie target (800-5000).'); console.log('Macro Calculator: Invalid manual dailyCalories.'); return; }
                console.log('Macro Calculator: Manual dailyCalories:', dailyCalories);
            }

            if (isNaN(dailyCalories) || dailyCalories <= 0) {
                alert('Could not determine daily calorie target. Please check inputs.');
                console.log('Macro Calculator: Daily calories invalid or 0.');
                return;
            }

            const fitnessGoal = getSelectedUnit(fitnessGoalSelect);
            if (!fitnessGoal) { alert('Please select a fitness goal.'); console.log('Macro Calculator: No fitness goal selected.'); return; }

            let macroRatios;
            if (fitnessGoal === 'custom') {
                const protein = getInputValue(customProteinInput);
                const carbs = getInputValue(customCarbsInput);
                const fats = getInputValue(customFatsInput);
                const total = protein + carbs + fats;

                if (isNaN(protein) || protein < 5 || protein > 50 ||
                    isNaN(carbs) || carbs < 5 || carbs > 70 ||
                    isNaN(fats) || fats < 5 || fats > 60) {
                    alert('Please enter valid custom macro percentages.');
                    console.log('Macro Calculator: Invalid custom macro percentages.');
                    return;
                }
                if (total !== 100) {
                    alert(`Custom macro percentages must total 100% (currently ${total}%).`);
                    console.log('Macro Calculator: Custom macro percentages do not sum to 100%.');
                    return;
                }
                macroRatios = { protein, carbs, fats };
            } else {
                macroRatios = getMacroRatios(fitnessGoal);
            }
            console.log('Macro Calculator: Macro Ratios (P/C/F):', macroRatios);

            const dietPreference = getSelectedUnit(dietPreferenceSelect);
            macroRatios = adjustRatiosForDiet(macroRatios, dietPreference);
            console.log('Macro Calculator: Adjusted Macro Ratios (P/C/F):', macroRatios);

            const proteinCalories = dailyCalories * (macroRatios.protein / 100);
            const carbsCalories = dailyCalories * (macroRatios.carbs / 100);
            const fatsCalories = dailyCalories * (macroRatios.fats / 100);

            const proteinGrams = Math.round(proteinCalories / 4);
            const carbsGrams = Math.round(carbsCalories / 4);
            const fatsGrams = Math.round(fatsCalories / 9);
            
            console.log(`Macro Calculator Results: DailyCalories=${dailyCalories}, ProteinGrams=${proteinGrams}, CarbsGrams=${carbsGrams}, FatsGrams=${fatsGrams}`);

            dailyCaloriesResult.textContent = Math.round(dailyCalories) + ' cal';
            proteinGramsDisplay.textContent = proteinGrams + 'g';
            proteinCaloriesDisplay.textContent = Math.round(proteinCalories) + ' cal';
            proteinPercentageDisplay.textContent = macroRatios.protein + '%';
            
            carbsGramsDisplay.textContent = carbsGrams + 'g';
            carbsCaloriesDisplay.textContent = Math.round(carbsCalories) + ' cal';
            carbsPercentageDisplay.textContent = macroRatios.carbs + '%';
            
            fatsGramsDisplay.textContent = fatsGrams + 'g';
            fatsCaloriesDisplay.textContent = Math.round(fatsCalories) + ' cal';
            fatsPercentageDisplay.textContent = macroRatios.fats + '%';

            generateMealPlan(proteinGrams, carbsGrams, fatsGrams);
            generateFoodSources(fitnessGoal, dietPreference);
            const recommendations = generateMacroRecommendations(dailyCalories, macroRatios, fitnessGoal);
            if (recommendationText) recommendationText.textContent = recommendations;

            macroResultsCard.style.display = 'block';
            macroResultsCard.classList.add('show');
            macroResultsCard.scrollIntoView({ behavior: 'smooth' });

            if (window.calculatorUtils) {
                window.calculatorUtils.trackToolUsage('Macro Calculator');
            }
        }; // Corrected closing
    }
}

// Initialize BMR Calculator
function initBMRCalculator() {
    const bmrForm = document.getElementById('bmrForm');
    if (bmrForm) {
        const ageInput = document.getElementById('age');
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        const heightCmInput = document.getElementById('heightCm');
        const heightFeetInput = document.getElementById('heightFeet');
        const heightInchesInput = document.getElementById('heightInches');
        const heightUnitSelect = document.getElementById('heightUnit');
        const weightInput = document.getElementById('weight');
        const weightUnitSelect = document.getElementById('weightUnit');
        const bmrResultDisplay = document.getElementById('bmrResult');
        const resultsCard = document.getElementById('resultsCard');

        // Initial setup for height inputs and radio styling
        toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput);
        heightUnitSelect.addEventListener('change', () => toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput));
        setupRadioStyling('gender');

        bmrForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('BMR Calculator: Submit event fired.');

            const age = getInputValue(ageInput);
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            const weight = getInputValue(weightInput);
            const weightUnit = getSelectedUnit(weightUnitSelect);
            const heightUnit = getSelectedUnit(heightUnitSelect);

            console.log(`BMR Calculator inputs: Age=${age}, Gender=${gender}, Weight=${weight} ${weightUnit}, HeightUnit=${heightUnit}`);

            if (isNaN(age) || age < 15 || age > 80) {
                alert('Please enter a valid age between 15 and 80.');
                console.log('BMR Calculator: Invalid age.');
                return;
            }
            if (!gender) {
                alert('Please select your gender.');
                console.log('BMR Calculator: No gender selected.');
                return;
            }
            if (isNaN(weight) || weight <= 0) {
                alert('Please enter a valid weight.');
                console.log('BMR Calculator: Invalid weight.');
                return;
            }

            let heightCm;
            if (heightUnit === 'cm') {
                heightCm = getInputValue(heightCmInput);
                if (isNaN(heightCm) || heightCm < 50 || heightCm > 250) {
                    alert('Please enter a valid height in cm (50-250).');
                    console.log('BMR Calculator: Invalid height (cm).');
                    return;
                }
            } else { // ft/in
                const feet = getInputValue(heightFeetInput);
                const inches = getInputValue(heightInchesInput);
                console.log(`BMR Calculator Height (ft/in) inputs: Feet=${feet}, Inches=${inches}`);
                if (isNaN(feet) || feet < 1 || feet > 8 || isNaN(inches) || inches < 0 || inches > 11) {
                    alert('Please enter a valid height in feet (1-8) and inches (0-11).');
                    console.log('BMR Calculator: Invalid height (ft/in).');
                    return;
                }
                heightCm = (feet * 30.48) + (inches * 2.54);
            }

            let weightKg = weight;
            if (weightUnit === 'lbs') {
                weightKg = weight * 0.453592;
            }

            let bmr;
            if (gender === 'male') {
                bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
            } else { // female
                bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
            }
            console.log('BMR Calculator: Calculated BMR:', bmr);

            bmrResultDisplay.textContent = Math.round(bmr);
            resultsCard.style.display = 'block'; // Ensure it's visible before adding 'show'
            resultsCard.classList.add('show');
            resultsCard.scrollIntoView({ behavior: 'smooth' });

            if (window.calculatorUtils) {
                window.calculatorUtils.trackToolUsage('BMR Calculator');
            }
        });

        bmrForm.addEventListener('reset', function() {
            bmrResultDisplay.textContent = '0';
            resultsCard.classList.remove('show');
            document.querySelectorAll('input[name="gender"]').forEach(radio => radio.closest('label').classList.remove('radio-selected'));
            document.querySelector('input[name="gender"][value="male"]').closest('label').classList.add('radio-selected'); // Re-select default
            toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput);
        });
    }
}

// Initialize Lean Body Mass Calculator
function initLBMCalculator() {
    const lbmForm = document.getElementById('lbmForm');
    if (lbmForm) {
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        const heightCmInput = document.getElementById('heightCm');
        const heightFeetInput = document.getElementById('heightFeet');
        const heightInchesInput = document.getElementById('heightInches');
        const heightUnitSelect = document.getElementById('heightUnit');
        const weightInput = document.getElementById('weight');
        const weightUnitSelect = document.getElementById('weightUnit');
        const lbmResultDisplay = document.getElementById('lbmResult');
        const bfpResultDisplay = document.getElementById('bfpResult');
        const resultsCard = document.getElementById('resultsCard');

        // Initial setup for height inputs and radio styling
        toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput);
        heightUnitSelect.addEventListener('change', () => toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput));
        setupRadioStyling('gender');

        lbmForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('LBM Calculator: Submit event fired.');

            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            const weight = getInputValue(weightInput);
            const weightUnit = getSelectedUnit(weightUnitSelect);
            const heightUnit = getSelectedUnit(heightUnitSelect);

            console.log(`LBM Calculator inputs: Gender=${gender}, Weight=${weight} ${weightUnit}, HeightUnit=${heightUnit}`);

            if (!gender) {
                alert('Please select your gender.');
                console.log('LBM Calculator: No gender selected.');
                return;
            }
            if (isNaN(weight) || weight <= 0) {
                alert('Please enter a valid weight.');
                console.log('LBM Calculator: Invalid weight.');
                return;
            }

            let heightCm;
            if (heightUnit === 'cm') {
                heightCm = getInputValue(heightCmInput);
                if (isNaN(heightCm) || heightCm < 50 || heightCm > 250) {
                    alert('Please enter a valid height in cm (50-250).');
                    console.log('LBM Calculator: Invalid height (cm).');
                    return;
                }
            } else { // ft/in
                const feet = getInputValue(heightFeetInput);
                const inches = getInputValue(heightInchesInput);
                console.log(`LBM Calculator Height (ft/in) inputs: Feet=${feet}, Inches=${inches}`);
                if (isNaN(feet) || feet < 1 || feet > 8 || isNaN(inches) || inches < 0 || inches > 11) {
                    alert('Please enter a valid height in feet (1-8) and inches (0-11).');
                    console.log('LBM Calculator: Invalid height (ft/in).');
                    return;
                }
                heightCm = (feet * 30.48) + (inches * 2.54);
            }

            let weightKg = weight;
            if (weightUnit === 'lbs') {
                weightKg = weight * 0.453592;
            }

            let lbm; // Lean Body Mass in kg
            if (gender === 'male') {
                lbm = (0.407 * weightKg) + (0.267 * heightCm) - 19.2;
            } else { // female
                lbm = (0.252 * weightKg) + (0.473 * heightCm) - 48.3;
            }

            const bodyFatMass = weightKg - lbm;
            const bodyFatPercentage = (bodyFatMass / weightKg) * 100;
            console.log(`LBM Calculator: Calculated LBM=${lbm}, BodyFatPercentage=${bodyFatPercentage}`);

            lbmResultDisplay.textContent = lbm.toFixed(1);
            bfpResultDisplay.textContent = bodyFatPercentage.toFixed(1);
            resultsCard.style.display = 'block'; // Ensure it's visible before adding 'show'
            resultsCard.classList.add('show');
            resultsCard.scrollIntoView({ behavior: 'smooth' });

            if (window.calculatorUtils) {
                window.calculatorUtils.trackToolUsage('LBM Calculator');
            }
        });

        lbmForm.addEventListener('reset', function() {
            lbmResultDisplay.textContent = '0';
            bfpResultDisplay.textContent = '0';
            resultsCard.classList.remove('show');
            document.querySelectorAll('input[name="gender"]').forEach(radio => radio.closest('label').classList.remove('radio-selected'));
            document.querySelector('input[name="gender"][value="male"]').closest('label').classList.add('radio-selected'); // Re-select default
            toggleHeightInputs(heightUnitSelect, heightCmInput, heightFeetInput, heightInchesInput);
        });
    }
}

// Initialize Micronutrient Intake Checker
function initMicronutrientChecker() {
    const micronutrientForm = document.getElementById('micronutrientForm');
    if (micronutrientForm) {
        setupRadioStyling('gender');
        
        micronutrientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const age = getInputValue(document.getElementById('age'));
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            
            if (isNaN(age) || age < 15 || age > 80) {
                alert('Please enter a valid age between 15 and 80.');
                return;
            }
            
            if (!gender) {
                alert('Please select your gender.');
                return;
            }
            
            // Get micronutrient inputs
            const micronutrients = {
                vitaminA: getInputValue(document.getElementById('vitamin-a')) || 0,
                vitaminC: getInputValue(document.getElementById('vitamin-c')) || 0,
                vitaminD: getInputValue(document.getElementById('vitamin-d')) || 0,
                vitaminE: getInputValue(document.getElementById('vitamin-e')) || 0,
                vitaminK: getInputValue(document.getElementById('vitamin-k')) || 0,
                thiamine: getInputValue(document.getElementById('thiamine')) || 0,
                riboflavin: getInputValue(document.getElementById('riboflavin')) || 0,
                niacin: getInputValue(document.getElementById('niacin')) || 0,
                vitaminB6: getInputValue(document.getElementById('vitamin-b6')) || 0,
                folate: getInputValue(document.getElementById('folate')) || 0,
                vitaminB12: getInputValue(document.getElementById('vitamin-b12')) || 0,
                calcium: getInputValue(document.getElementById('calcium')) || 0,
                iron: getInputValue(document.getElementById('iron')) || 0,
                magnesium: getInputValue(document.getElementById('magnesium')) || 0,
                phosphorus: getInputValue(document.getElementById('phosphorus')) || 0,
                potassium: getInputValue(document.getElementById('potassium')) || 0,
                sodium: getInputValue(document.getElementById('sodium')) || 0,
                zinc: getInputValue(document.getElementById('zinc')) || 0,
                selenium: getInputValue(document.getElementById('selenium')) || 0
            };
            
            // RDA values (adults, may vary by age/gender)
            const rda = gender === 'male' ? {
                vitaminA: 900, vitaminC: 90, vitaminD: 15, vitaminE: 15, vitaminK: 120,
                thiamine: 1.2, riboflavin: 1.3, niacin: 16, vitaminB6: 1.3, folate: 400, vitaminB12: 2.4,
                calcium: 1000, iron: 8, magnesium: 400, phosphorus: 700, potassium: 3500, sodium: 2300,
                zinc: 11, selenium: 55
            } : {
                vitaminA: 700, vitaminC: 75, vitaminD: 15, vitaminE: 15, vitaminK: 90,
                thiamine: 1.1, riboflavin: 1.1, niacin: 14, vitaminB6: 1.3, folate: 400, vitaminB12: 2.4,
                calcium: 1000, iron: 18, magnesium: 310, phosphorus: 700, potassium: 3500, sodium: 2300,
                zinc: 8, selenium: 55
            };
            
            // Calculate sufficiency scores
            let totalScore = 0;
            let totalNutrients = 0;
            const breakdown = document.getElementById('micronutrientBreakdown');
            
            let breakdownHTML = '<div class="nutrient-breakdown-grid">';
            
            for (const [nutrient, intake] of Object.entries(micronutrients)) {
                if (intake > 0) {
                    const percentage = Math.min((intake / rda[nutrient]) * 100, 200);
                    totalScore += percentage;
                    totalNutrients++;
                    
                    const status = percentage >= 100 ? 'adequate' : percentage >= 80 ? 'adequate' : percentage >= 60 ? 'insufficient' : 'deficient';
                    
                    breakdownHTML += `
                        <div class="nutrient-item ${status}">
                            <span class="nutrient-name">${nutrient.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span class="nutrient-percentage">${Math.round(percentage)}%</span>
                        </div>
                    `;
                }
            }
            
            breakdownHTML += '</div>';
            breakdown.innerHTML = breakdownHTML;
            
            // Calculate overall score
            const overallScore = totalNutrients > 0 ? Math.round(totalScore / totalNutrients) : 0;
            
            document.getElementById('overallScore').textContent = overallScore;
            
            // Set score description
            const scoreDescription = document.getElementById('scoreDescription');
            if (overallScore >= 90) {
                scoreDescription.textContent = 'Excellent micronutrient intake!';
            } else if (overallScore >= 80) {
                scoreDescription.textContent = 'Good micronutrient intake';
            } else if (overallScore >= 70) {
                scoreDescription.textContent = 'Adequate, but could be improved';
            } else if (overallScore >= 60) {
                scoreDescription.textContent = 'Some deficiencies detected';
            } else {
                scoreDescription.textContent = 'Multiple deficiencies - consider supplementation';
            }
            
            // Generate recommendations
            const recommendations = document.getElementById('recommendationList');
            let recommendationHTML = '<ul>';
            
            if (overallScore < 80) {
                recommendationHTML += '<li>Consider a multivitamin supplement to fill gaps</li>';
            }
            if (micronutrients.vitaminD < rda.vitaminD) {
                recommendationHTML += '<li>Increase Vitamin D intake through sunlight or supplements</li>';
            }
            if (micronutrients.iron < rda.iron) {
                recommendationHTML += '<li>Increase iron intake with leafy greens or lean meats</li>';
            }
            if (overallScore >= 90) {
                recommendationHTML += '<li>Excellent job maintaining micronutrient balance!</li>';
            }
            
            recommendationHTML += '</ul>';
            recommendations.innerHTML = recommendationHTML;
            
            document.getElementById('resultsCard').classList.add('show');
            document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
            
            if (window.calculatorUtils) {
                window.calculatorUtils.trackToolUsage('Micronutrient Intake Checker');
            }
        });
    }
}

// Initialize Glycemic Load Calculator
function initGlycemicLoadCalculator() {
    const glycemicLoadForm = document.getElementById('glycemicLoadForm');
    const addFoodBtn = document.getElementById('addFood');
    const clearFoodsBtn = document.getElementById('clearFoods');
    const currentFoodsDiv = document.getElementById('currentFoods');
    const foodsList = document.getElementById('foodsList');
    
    if (!glycemicLoadForm) return;
    
    let mealFoods = [];
    
    // Food database with GI values
    const foodDatabase = {
        'white-rice': { name: 'White Rice', gi: 73, carbsPer100g: 28 },
        'brown-rice': { name: 'Brown Rice', gi: 68, carbsPer100g: 23 },
        'oats': { name: 'Rolled Oats', gi: 55, carbsPer100g: 66 },
        'quinoa': { name: 'Quinoa', gi: 53, carbsPer100g: 21 },
        'whole-wheat-bread': { name: 'Whole Wheat Bread', gi: 71, carbsPer100g: 41 },
        'white-bread': { name: 'White Bread', gi: 75, carbsPer100g: 49 },
        'potato': { name: 'White Potato', gi: 82, carbsPer100g: 17 },
        'sweet-potato': { name: 'Sweet Potato', gi: 61, carbsPer100g: 20 },
        'pasta': { name: 'Pasta', gi: 49, carbsPer100g: 25 },
        'corn': { name: 'Corn', gi: 60, carbsPer100g: 19 },
        'apple': { name: 'Apple', gi: 38, carbsPer100g: 14 },
        'banana': { name: 'Banana', gi: 51, carbsPer100g: 23 },
        'orange': { name: 'Orange', gi: 43, carbsPer100g: 12 },
        'grapes': { name: 'Grapes', gi: 53, carbsPer100g: 17 },
        'watermelon': { name: 'Watermelon', gi: 76, carbsPer100g: 8 },
        'strawberries': { name: 'Strawberries', gi: 40, carbsPer100g: 8 },
        'blueberries': { name: 'Blueberries', gi: 53, carbsPer100g: 14 },
        'mango': { name: 'Mango', gi: 56, carbsPer100g: 15 },
        'lentils': { name: 'Lentils', gi: 32, carbsPer100g: 20 },
        'chickpeas': { name: 'Chickpeas', gi: 28, carbsPer100g: 27 },
        'black-beans': { name: 'Black Beans', gi: 30, carbsPer100g: 16 },
        'carrots': { name: 'Carrots', gi: 47, carbsPer100g: 10 },
        'broccoli': { name: 'Broccoli', gi: 15, carbsPer100g: 7 },
        'spinach': { name: 'Spinach', gi: 15, carbsPer100g: 4 },
        'milk': { name: 'Cow\'s Milk', gi: 39, carbsPer100g: 5 },
        'yogurt': { name: 'Plain Yogurt', gi: 36, carbsPer100g: 4 },
        'soy-milk': { name: 'Soy Milk', gi: 34, carbsPer100g: 6 },
        'honey': { name: 'Honey', gi: 61, carbsPer100g: 82 },
        'dark-chocolate': { name: 'Dark Chocolate (70%)', gi: 25, carbsPer100g: 45 },
        'chocolate-bar': { name: 'Chocolate Bar', gi: 70, carbsPer100g: 60 },
        'soda': { name: 'Regular Soda', gi: 63, carbsPer100g: 11 }
    };
    
    addFoodBtn.addEventListener('click', () => {
        const foodSelect = document.getElementById('foodSelect');
        const foodAmount = getInputValue(document.getElementById('foodAmount'));
        
        if (!foodSelect.value || isNaN(foodAmount) || foodAmount <= 0) {
            alert('Please select a food and enter a valid amount.');
            return;
        }
        
        const food = foodDatabase[foodSelect.value];
        const carbs = (food.carbsPer100g * foodAmount) / 100;
        const gl = (food.gi * carbs) / 100;
        
        mealFoods.push({
            ...food,
            amount: foodAmount,
            carbs: carbs,
            gl: gl
        });
        
        updateFoodsList();
        currentFoodsDiv.style.display = 'block';
    });
    
    clearFoodsBtn.addEventListener('click', () => {
        mealFoods = [];
        updateFoodsList();
        currentFoodsDiv.style.display = 'none';
    });
    
    function updateFoodsList() {
        foodsList.innerHTML = mealFoods.map((food, index) => `
            <div class="food-item">
                <span class="food-name">${food.amount}g ${food.name}</span>
                <span class="food-gl">GL: ${food.gl.toFixed(1)}</span>
            </div>
        `).join('');
    }
    
    glycemicLoadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (mealFoods.length === 0) {
            alert('Please add at least one food to your meal.');
            return;
        }
        
        const totalGL = mealFoods.reduce((sum, food) => sum + food.gl, 0);
        const totalCarbs = mealFoods.reduce((sum, food) => sum + food.carbs, 0);
        const avgGI = mealFoods.reduce((sum, food) => sum + (food.gi * food.carbs), 0) / totalCarbs;
        
        document.getElementById('totalGL').textContent = totalGL.toFixed(1);
        
        const glCategory = document.getElementById('glCategory');
        if (totalGL < 10) {
            glCategory.textContent = 'Low Glycemic Load - Excellent for blood sugar control';
        } else if (totalGL < 20) {
            glCategory.textContent = 'Medium Glycemic Load - Moderate blood sugar impact';
        } else {
            glCategory.textContent = 'High Glycemic Load - Significant blood sugar impact';
        }
        
        // Display details
        const details = document.getElementById('glycemicDetails');
        details.innerHTML = `
            <div class="gl-details-grid">
                <div class="gl-detail-item">
                    <span class="detail-label">Total Glycemic Load:</span>
                    <span class="detail-value">${totalGL.toFixed(1)}</span>
                </div>
                <div class="gl-detail-item">
                    <span class="detail-label">Total Carbohydrates:</span>
                    <span class="detail-value">${totalCarbs.toFixed(1)}g</span>
                </div>
                <div class="gl-detail-item">
                    <span class="detail-label">Average GI:</span>
                    <span class="detail-value">${avgGI.toFixed(0)}</span>
                </div>
            </div>
        `;
        
        // Generate recommendations
        const recommendations = document.getElementById('recommendationList');
        let recommendationHTML = '<ul>';
        
        if (totalGL > 20) {
            recommendationHTML += '<li>Consider reducing portion sizes or choosing lower GI foods</li>';
        }
        if (avgGI > 70) {
            recommendationHTML += '<li>Include more low GI foods like vegetables, legumes, and whole grains</li>';
        }
        if (totalGL < 10) {
            recommendationHTML += '<li>Great choice for blood sugar management!</li>';
        }
        
        recommendationHTML += '</ul>';
        recommendations.innerHTML = recommendationHTML;
        
        document.getElementById('resultsCard').classList.add('show');
        document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
        
        if (window.calculatorUtils) {
            window.calculatorUtils.trackToolUsage('Glycemic Load Calculator');
        }
    });
}

// Initialize Pre-Workout Nutrition Planner
function initPreWorkoutNutrition() {
    const preWorkoutForm = document.getElementById('preWorkoutForm');
    if (preWorkoutForm) {
        setupRadioStyling('gender');
        
        preWorkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const bodyWeight = getInputValue(document.getElementById('bodyWeight'));
            const workoutType = document.getElementById('workoutType').value;
            const workoutDuration = getInputValue(document.getElementById('workoutDuration'));
            const workoutIntensity = document.getElementById('workoutIntensity').value;
            const primaryGoal = document.getElementById('primaryGoal').value;
            
            if (isNaN(bodyWeight) || bodyWeight <= 0) {
                alert('Please enter a valid body weight.');
                return;
            }
            
            if (isNaN(workoutDuration) || workoutDuration <= 0) {
                alert('Please enter a valid workout duration.');
                return;
            }
            
            // Calculate macronutrient needs based on workout type and intensity
            let carbsPerKg = 1.5; // Base carbs per kg
            let proteinPerKg = 0.25; // Base protein per kg
            
            // Adjust based on workout type
            if (workoutType === 'endurance') {
                carbsPerKg = 3.0;
                proteinPerKg = 0.2;
            } else if (workoutType === 'hiit') {
                carbsPerKg = 2.0;
                proteinPerKg = 0.3;
            } else if (workoutType === 'strength') {
                carbsPerKg = 1.0;
                proteinPerKg = 0.4;
            }
            
            // Adjust for intensity
            const intensityMultiplier = workoutIntensity === 'low' ? 0.8 : 
                                   workoutIntensity === 'moderate' ? 1.0 : 
                                   workoutIntensity === 'high' ? 1.2 : 1.4;
            
            carbsPerKg *= intensityMultiplier;
            proteinPerKg *= intensityMultiplier;
            
            // Calculate total macros
            const totalCarbs = Math.round(carbsPerKg * bodyWeight);
            const totalProtein = Math.round(proteinPerKg * bodyWeight);
            const totalCalories = (totalCarbs * 4) + (totalProtein * 4);
            
            // Generate timeline
            const workoutTime = document.getElementById('workoutTime').value;
            const timeline = document.getElementById('nutritionTimeline');
            timeline.innerHTML = `
                <div class="timeline-grid">
                    <div class="timeline-item">
                        <span class="timeline-time">3-4 hours before</span>
                        <span class="timeline-meal">Full meal: 50-60% of total carbs</span>
                    </div>
                    <div class="timeline-item">
                        <span class="timeline-time">1-2 hours before</span>
                        <span class="timeline-meal">Light snack: 20-30% of total carbs</span>
                    </div>
                    <div class="timeline-item">
                        <span class="timeline-time">30-60 minutes before</span>
                        <span class="timeline-meal">${workoutType === 'endurance' ? 'Quick fuel: 10-20% of total carbs' : 'Optional light snack'}</span>
                    </div>
                    <div class="timeline-item">
                        <span class="timeline-time">Workout time</span>
                        <span class="timeline-meal">Focus on hydration during exercise</span>
                    </div>
                </div>
            `;
            
            // Display macro breakdown
            const macroDetails = document.getElementById('macroDetails');
            macroDetails.innerHTML = `
                <div class="macro-grid">
                    <div class="macro-card">
                        <span class="macro-label">Carbohydrates</span>
                        <span class="macro-value">${totalCarbs}g</span>
                        <span class="macro-calories">${totalCarbs * 4} cal</span>
                    </div>
                    <div class="macro-card">
                        <span class="macro-label">Protein</span>
                        <span class="macro-value">${totalProtein}g</span>
                        <span class="macro-calories">${totalProtein * 4} cal</span>
                    </div>
                    <div class="macro-card">
                        <span class="macro-label">Total Calories</span>
                        <span class="macro-value">${totalCalories} cal</span>
                        <span class="macro-calories">~${(totalCalories/bodyWeight).toFixed(1)} cal/kg</span>
                    </div>
                </div>
            `;
            
            // Generate meal suggestions
            const mealSuggestions = document.getElementById('mealSuggestions');
            const dietaryRestrictions = document.getElementById('dietaryRestrictions').value;
            
            let suggestionsHTML = '<div class="suggestions-grid">';
            
            if (dietaryRestrictions === 'vegan' || dietaryRestrictions === 'vegetarian') {
                suggestionsHTML += `
                    <div class="suggestion-card">
                        <h4>Plant-Based Options</h4>
                        <ul>
                            <li>Oatmeal with banana and nut butter</li>
                            <li>Quinoa bowl with sweet potato</li>
                            <li>Smoothie with plant protein</li>
                        </ul>
                    </div>
                `;
            } else {
                suggestionsHTML += `
                    <div class="suggestion-card">
                        <h4>Quick Energy Sources</h4>
                        <ul>
                            <li>Banana with almond butter</li>
                            <li>Oatmeal with berries</li>
                            <li>Rice cakes with honey</li>
                        </ul>
                    </div>
                    <div class="suggestion-card">
                        <h4>Protein Sources</h4>
                        <ul>
                            <li>Greek yogurt</li>
                            <li>Protein shake</li>
                            <li>Chicken breast (3+ hours before)</li>
                        </ul>
                    </div>
                `;
            }
            
            suggestionsHTML += '</div>';
            mealSuggestions.innerHTML = suggestionsHTML;
            
            // Hydration strategy
            const hydrationDetails = document.getElementById('hydrationDetails');
            hydrationDetails.innerHTML = `
                <div class="hydration-grid">
                    <div class="hydration-item">
                        <span class="hydration-time">2-3 hours before</span>
                        <span class="hydration-amount">500-600ml water</span>
                    </div>
                    <div class="hydration-item">
                        <span class="hydration-time">20-30 minutes before</span>
                        <span class="hydration-amount">200-300ml water</span>
                    </div>
                    <div class="hydration-item">
                        <span class="hydration-time">During workout</span>
                        <span class="hydration-amount">150-200ml every 15-20 min</span>
                    </div>
                    <div class="hydration-item">
                        <span class="hydration-time">For >90min sessions</span>
                        <span class="hydration-amount">Consider electrolyte drink</span>
                    </div>
                </div>
            `;
            
            document.getElementById('resultsCard').classList.add('show');
            document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
            
            if (window.calculatorUtils) {
                window.calculatorUtils.trackToolUsage('Pre-Workout Nutrition Planner');
            }
        });
    }
}

// Initialize Post-Workout Recovery Meal Builder
function initPostWorkoutRecovery() {
    const postWorkoutForm = document.getElementById('postWorkoutForm');
    if (postWorkoutForm) {
        setupRadioStyling('gender');
        
        // Add range input interaction
        const intensityRange = document.getElementById('workoutIntensity');
        const rangeValue = intensityRange?.nextElementSibling;
        if (intensityRange && rangeValue) {
            intensityRange.addEventListener('input', () => {
                rangeValue.textContent = intensityRange.value;
            });
        }
        
        postWorkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentWeight = getInputValue(document.getElementById('currentWeight'));
            const bodyFat = getInputValue(document.getElementById('bodyFat')) || 20;
            const workoutType = document.getElementById('workoutType').value;
            const workoutDuration = getInputValue(document.getElementById('workoutDuration'));
            const workoutIntensity = getInputValue(document.getElementById('workoutIntensity'));
            const primaryGoal = document.getElementById('primaryGoal').value;
            const timeSinceWorkout = document.getElementById('timeSinceWorkout').value;
            
            if (isNaN(currentWeight) || currentWeight <= 0) {
                alert('Please enter a valid body weight.');
                return;
            }
            
            if (isNaN(workoutDuration) || workoutDuration <= 0) {
                alert('Please enter a valid workout duration.');
                return;
            }
            
            // Calculate protein needs (20-40g for most athletes)
            let proteinPerKg = 0.25; // Base protein per kg
            
            // Adjust based on workout type
            if (workoutType === 'strength') {
                proteinPerKg = 0.3;
            } else if (workoutType === 'endurance') {
                proteinPerKg = 0.2;
            } else if (workoutType === 'hiit') {
                proteinPerKg = 0.35;
            }
            
            // Adjust for intensity
            const intensityMultiplier = workoutIntensity / 5; // Normalize to 1.0 for medium
            proteinPerKg *= intensityMultiplier;
            
            const totalProtein = Math.max(20, Math.min(40, Math.round(proteinPerKg * currentWeight)));
            
            // Calculate carb needs based on workout type and duration
            let carbsPerKg = 1.0; // Base carbs per kg
            
            if (workoutType === 'endurance') {
                carbsPerKg = 1.2;
            } else if (workoutType === 'strength') {
                carbsPerKg = 0.8;
            } else if (workoutType === 'hiit') {
                carbsPerKg = 1.0;
            }
            
            // Adjust for duration
            if (workoutDuration > 90) {
                carbsPerKg *= 1.2;
            } else if (workoutDuration < 30) {
                carbsPerKg *= 0.7;
            }
            
            const totalCarbs = Math.round(carbsPerKg * currentWeight);
            const totalCalories = (totalProtein * 4) + (totalCarbs * 4);
            
            // Display recovery macros
            document.getElementById('proteinTarget').textContent = `${totalProtein}g`;
            document.getElementById('carbTarget').textContent = `${totalCarbs}g`;
            document.getElementById('ratioDisplay').textContent = `${Math.round(totalCarbs/totalProtein)}:1`;
            document.getElementById('calorieTarget').textContent = `${totalCalories} cal`;
            
            // Timing window information
            const timingInfo = document.getElementById('timingInfo');
            const isImmediate = timeSinceWorkout === 'immediately';
            const isWithin30min = timeSinceWorkout === '30min';
            
            timingInfo.innerHTML = `
                <div class="timing-card">
                    <h4>${isImmediate ? 'Immediate Recovery Window' : isWithin30min ? 'Optimal Recovery Window' : 'Delayed Recovery'}</h4>
                    <p>${isImmediate ? 'Perfect timing! This is when muscle protein synthesis is highest.' : 
                         isWithin30min ? 'Great timing! Still within optimal window for recovery.' :
                         'Late, but still beneficial. Focus on quickly digestible nutrients.'}</p>
                    <p><strong>Target consumption:</strong> Within 30-120 minutes post-workout</p>
                </div>
            `;
            
            // Meal suggestions
            const mealSuggestions = document.getElementById('mealSuggestions');
            const dietaryRestrictions = document.getElementById('dietaryRestrictions').value;
            
            let suggestionsHTML = '<div class="meal-grid">';
            
            if (dietaryRestrictions === 'vegan') {
                suggestionsHTML += `
                    <div class="meal-card">
                        <h4>Plant-Based Recovery</h4>
                        <ul>
                            <li>Plant protein shake with banana</li>
                            <li>Quinoa bowl with beans and vegetables</li>
                            <li>Smoothie with plant protein and berries</li>
                        </ul>
                    </div>
                `;
            } else {
                suggestionsHTML += `
                    <div class="meal-card">
                        <h4>Quick Recovery Options</h4>
                        <ul>
                            <li>Protein shake with banana</li>
                            <li>Greek yogurt with honey and berries</li>
                            <li>Chicken breast with sweet potato</li>
                        </ul>
                    </div>
                    <div class="meal-card">
                        <h4>Meal Combinations</h4>
                        <ul>
                            <li>${totalProtein}g protein + ${totalCarbs}g fast carbs</li>
                            <li>Chocolate milk (natural 3:1 ratio)</li>
                            <li>Salmon with rice and vegetables</li>
                        </ul>
                    </div>
                `;
            }
            
            suggestionsHTML += '</div>';
            mealSuggestions.innerHTML = suggestionsHTML;
            
            // Hydration strategy
            const hydrationDetails = document.getElementById('hydrationDetails');
            const estimatedFluidLoss = Math.round(workoutDuration * 15 * intensityMultiplier); // Rough estimate
            
            hydrationDetails.innerHTML = `
                <div class="hydration-strategy">
                    <h4>Rehydration Needs</h4>
                    <p><strong>Estimated fluid loss:</strong> ${estimatedFluidLoss}ml</p>
                    <p><strong>Immediate goal:</strong> ${Math.round(estimatedFluidLoss * 1.5)}ml (150% of loss)</p>
                    <p><strong>Next 2-3 hours:</strong> Continue sipping water</p>
                    <p><strong>Electrolytes:</strong> Include sodium if sweat loss was high</p>
                </div>
            `;
            
            // Supplement options
            const supplementList = document.getElementById('supplementList');
            supplementList.innerHTML = `
                <div class="supplement-grid">
                    <div class="supplement-card">
                        <h4>Optional - Creatine</h4>
                        <p>5g post-workout for strength/power athletes</p>
                    </div>
                    <div class="supplement-card">
                        <h4>Optional - BCAA</h4>
                        <p>5-10g if training fasted or very intense</p>
                    </div>
                    <div class="supplement-card">
                        <h4>Optional - Tart Cherry</h4>
                        <p>Reduces muscle soreness for recovery</p>
                    </div>
                </div>
            `;
            
            document.getElementById('resultsCard').classList.add('show');
            document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
            
            if (window.calculatorUtils) {
                window.calculatorUtils.trackToolUsage('Post-Workout Recovery Meal Builder');
            }
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCategoryFiltering();
    trackPagePerformance();
    initOneRepMaxCalculator();
    initBodyTypeQuiz();
    initMacroCalculator();
    initBMRCalculator();
    initLBMCalculator();
    initMicronutrientChecker();
    initGlycemicLoadCalculator();
    initPreWorkoutNutrition();
    initPostWorkoutRecovery();
    
    // Initialize optional features
    // initThemeToggle();
    // initSearch();
});