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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCategoryFiltering();
    trackPagePerformance();
    initOneRepMaxCalculator();
    initBodyTypeQuiz();
    initMacroCalculator();
    initBMRCalculator();
    initLBMCalculator();
    
    // Initialize optional features
    // initThemeToggle();
    // initSearch();
});