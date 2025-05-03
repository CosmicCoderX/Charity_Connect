// Check if the user is logged in
if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "form.html"; // Redirect to login page if not logged in
}

function logout() {
    sessionStorage.removeItem("loggedIn"); // Clear session storage
    window.location.href = "form.html"; // Redirect to login page
}

// Enhanced Scroll Effect
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Function to animate the counter
function animateCounter(element, target, duration) {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / target));
    const isDonated = element.parentElement.querySelector('span').textContent.includes('Donated');
    const isNGOs = element.parentElement.querySelector('span').textContent.includes('NGOs');
    const isLives = element.parentElement.querySelector('span').textContent.includes('Lives');

    const timer = setInterval(() => {
        start += 1; // Increment by 1 for smoother animation
        if (start >= target) {
            start = target;
            clearInterval(timer);
            if (isDonated) {
                element.textContent = '₹' + start + 'M+';
            } else if (isNGOs) {
                element.textContent = start + '+';
            } else if (isLives) {
                element.textContent = start + 'K+';
            }
        } else {
            if (isDonated) {
                element.textContent = '₹' + start;
            } else {
                element.textContent = start;
            }
        }
    }, stepTime);
}

// Intersection Observer to trigger animation when section is in view
const statsSection = document.querySelector('.stats');
const statItems = document.querySelectorAll('.stat-item strong');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statItems.forEach(item => {
                const target = parseInt(item.getAttribute('data-target'));
                animateCounter(item, target, 2000);
            });
            observer.disconnect(); // Stop observing after animation
        }
    });
}, { threshold: 0.5 });

observer.observe(statsSection);

// Mobile Menu Toggle with Animation
const openButton = document.getElementById('open-sidebar-button');
const closeButton = document.getElementById('close-sidebar-button');
const navbarMenu = document.getElementById('navbar');
const overlay = document.getElementById('overlay');

// Toggle Sidebar
function toggleSidebar(open = true) {
    if (open) {
        navbarMenu.classList.add('show');
        openButton.setAttribute('aria-expanded', 'true');
        overlay.style.display = "block";
        // Small delay to trigger the fade in
        setTimeout(() => overlay.style.opacity = "1", 10);
    } else {
        navbarMenu.classList.remove('show');
        openButton.setAttribute('aria-expanded', 'false');
        overlay.style.opacity = "0";
        // Wait for fade out before hiding
        setTimeout(() => overlay.style.display = "none", 300);
    }
}

// Event Listeners
openButton.addEventListener('click', () => toggleSidebar(true));
closeButton.addEventListener('click', () => toggleSidebar(false));
overlay.addEventListener('click', () => toggleSidebar(false));

// Close Sidebar with Escape Key
document.addEventListener('keydown', (event) => {
    if (event.key === "Escape" && navbarMenu.classList.contains('show')) {
        toggleSidebar(false);
    }
});