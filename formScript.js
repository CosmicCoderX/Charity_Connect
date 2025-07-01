const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Password validation helper functions
const passwordValidation = {
    hasUpperCase: (str) => /[A-Z]/.test(str),
    hasLowerCase: (str) => /[a-z]/.test(str),
    hasNumber: (str) => /[0-9]/.test(str),
    hasSpecialChar: (str) => /[!@#$%^&*(),.?":{}|<>]/.test(str),
    isLongEnough: (str) => str.length >= 6
};

// Function to get detailed password error message
const getPasswordErrorMessage = (value) => {
    const errors = [];
    if (!passwordValidation.hasUpperCase(value)) errors.push("one uppercase letter");
    if (!passwordValidation.hasLowerCase(value)) errors.push("one lowercase letter");
    if (!passwordValidation.hasNumber(value)) errors.push("one number");
    if (!passwordValidation.hasSpecialChar(value)) errors.push("one special character");
    if (!passwordValidation.isLongEnough(value)) errors.push("minimum 6 characters");
    
    return errors.length > 0 
        ? `Password must contain ${errors.join(", ")}`
        : "";
};

// Validation rules for both forms
const validationRules = {
    // Sign Up form validation rules
    signUp: {
        name: {
            element: document.getElementById('name'),
            errorElement: document.getElementById('nameError'),
            validate: (value) => value.length >= 3,
            errorMessage: 'Name must be at least 3 characters long'
        },
        phone: {
            element: document.getElementById('phone'),
            errorElement: document.getElementById('phoneError'),
            validate: (value) => /^[0-9]{10}$/.test(value),
            errorMessage: 'Enter a valid 10-digit phone number'
        },
        email: {
            element: document.getElementById('email'),
            errorElement: document.getElementById('emailError'),
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            errorMessage: 'Enter a valid email address'
        },
        password: {
            element: document.getElementById('password'),
            errorElement: document.getElementById('passwordError'),
            validate: (value) => {
                return Object.values(passwordValidation).every(validationFn => validationFn(value));
            },
            getErrorMessage: getPasswordErrorMessage
        }
    },
    // Sign In form validation rules
    signIn: {
        email: {
            element: document.querySelector('.sign-in-container input[type="email"]'),
            errorElement: document.createElement('span'),
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            errorMessage: 'Enter a valid email address'
        },
        password: {
            element: document.querySelector('.sign-in-container input[type="password"]'),
            errorElement: document.createElement('span'),
            validate: (value) => value.length > 0,
            errorMessage: 'Password is required'
        }
    }
};

// Add error elements to sign-in form
Object.values(validationRules.signIn).forEach(rule => {
    rule.errorElement.className = 'error';
    rule.element.insertAdjacentElement('afterend', rule.errorElement);
});

// Function to set up validation listeners
const setupValidationListeners = (formRules) => {
    Object.values(formRules).forEach(rule => {
        if (rule.element && rule.errorElement) {
            // Add input event listener
            rule.element.addEventListener('input', () => {
                const isValid = rule.validate(rule.element.value);
                const errorMessage = rule.getErrorMessage 
                    ? rule.getErrorMessage(rule.element.value) 
                    : rule.errorMessage;
                rule.errorElement.textContent = isValid ? '' : errorMessage;
                rule.errorElement.style.display = isValid ? 'none' : 'block';
            });

            // Add blur event listener
            rule.element.addEventListener('blur', () => {
                const isValid = rule.validate(rule.element.value);
                const errorMessage = rule.getErrorMessage 
                    ? rule.getErrorMessage(rule.element.value) 
                    : rule.errorMessage;
                rule.errorElement.textContent = isValid ? '' : errorMessage;
                rule.errorElement.style.display = isValid ? 'none' : 'block';
            });
        }
    });
};

// Set up validation for both forms 
setupValidationListeners(validationRules.signUp);
setupValidationListeners(validationRules.signIn);

// Function to show welcome message and redirect
const showWelcomeAndRedirect = () => {
    // Hide the container
    document.getElementById('container').style.display = 'none';
    
    // Show and animate welcome message
    const welcomeMessage = document.getElementById('welcome');
    welcomeMessage.style.display = 'block';
    welcomeMessage.style.opacity = '0';
    
    // Fade in animation
    setTimeout(() => {
        welcomeMessage.style.opacity = '1';
    }, 100);
    
    // Wait for 2 seconds before redirecting
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
};

// Handle sign up form submission
document.getElementById("signUpForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let isFormValid = true;

    Object.values(validationRules.signUp).forEach(rule => {
        if (rule.element && rule.errorElement) {
            const isValid = rule.validate(rule.element.value);
            const errorMessage = rule.getErrorMessage 
                ? rule.getErrorMessage(rule.element.value) 
                : rule.errorMessage;
            rule.errorElement.textContent = isValid ? '' : errorMessage;
            rule.errorElement.style.display = isValid ? 'none' : 'block';
            if (!isValid) isFormValid = false;
        }
    });

    if (isFormValid) {
        showWelcomeAndRedirect();
    }
});

// Handle sign in form submission with authentication
document.getElementById("signInForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let isFormValid = true;

    // Validate form fields
    Object.values(validationRules.signIn).forEach(rule => {
        if (rule.element && rule.errorElement) {
            const isValid = rule.validate(rule.element.value);
            const errorMessage = rule.getErrorMessage 
                ? rule.getErrorMessage(rule.element.value) 
                : rule.errorMessage;
            rule.errorElement.textContent = isValid ? '' : errorMessage;
            rule.errorElement.style.display = isValid ? 'none' : 'block';
            if (!isValid) isFormValid = false;
        }
    });

    if (isFormValid) {
        const email = validationRules.signIn.email.element.value;
        const password = validationRules.signIn.password.element.value;

        // Check credentials
        if (email === "abc@dsa.com" && password === "1234") {
            sessionStorage.setItem("loggedIn", "true"); // Store login status
            showWelcomeAndRedirect(); // Show welcome message before redirect
        } else {
            // Create or update error message for invalid credentials
            const credentialsError = document.createElement('span');
            credentialsError.className = 'error';
            credentialsError.textContent = "Invalid email or password!";
            credentialsError.style.display = 'block';
            credentialsError.style.marginBottom = '10px';
            
            // Remove any existing credentials error message
            const existingError = document.querySelector('.sign-in-container .credentials-error');
            if (existingError) {
                existingError.remove();
            }
            
            // Add the new error message before the button
            const signInButton = document.querySelector('.sign-in-container button');
            signInButton.parentNode.insertBefore(credentialsError, signInButton);
        }
    }
});