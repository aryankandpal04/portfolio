// DOM Elements
const hamburger = document.querySelector(".hamburger")
const navLinks = document.querySelector(".nav-links")
const navLinksItems = document.querySelectorAll(".nav-links a")
const header = document.querySelector("header")
const filterBtns = document.querySelectorAll(".filter-btn")
const projectItems = document.querySelectorAll(".project-item")
const contactForm = document.getElementById("contactForm")
const skillItems = document.querySelectorAll(".skill-item")
const progressBars = document.querySelectorAll(".progress-bar")
const toggleSwitch = document.querySelector('#checkbox')
const toggleSwitchMobile = document.querySelector('#checkbox-mobile')

// Dark Mode Toggle
function setupDarkMode() {
  // Check for saved theme preference or prefer-color-scheme
  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Check if user has interacted with theme switch before
  const themeVisited = localStorage.getItem('theme-visited') === 'true';
  
  // Set theme visited attribute
  if (themeVisited) {
    document.body.setAttribute('data-theme-visited', 'true');
  }
  
  // Set initial theme
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleSwitch.checked = true;
    if (toggleSwitchMobile) toggleSwitchMobile.checked = true;
    updateHeaderStyles(true);
  }
  
  // Toggle theme function
  function switchTheme(e) {
    const isDark = e.target.checked;

    // Synchronize both switches
    if (e.target.id === 'checkbox') {
      if (toggleSwitchMobile) toggleSwitchMobile.checked = isDark;
    } else {
      toggleSwitch.checked = isDark;
    }

    // Mark the theme as visited when user toggles
    if (!document.body.hasAttribute('data-theme-visited')) {
      document.body.setAttribute('data-theme-visited', 'true');
      localStorage.setItem('theme-visited', 'true');
    }

    // Create a flash effect for transition
    const flash = document.createElement('div');
    flash.className = 'theme-flash';
    document.body.appendChild(flash);
    
    // Create floating particles for transition effect
    if (!document.querySelector('#theme-transition-particles')) {
      createThemeTransitionParticles(isDark);
    }
    
    // Set the theme with a slight delay for better animation
    setTimeout(() => {
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
      
      updateHeaderStyles(isDark);
      animateDarkModeTransition(isDark);
      
      // Add a subtle pulse animation to the theme switch
      const themeSwitch = document.querySelector('.theme-switch');
      themeSwitch.classList.add('theme-switched');
      setTimeout(() => {
        themeSwitch.classList.remove('theme-switched');
      }, 700);
      
      // Close mobile menu after theme change if on mobile
      if (window.innerWidth <= 768 && e.target.id === 'checkbox-mobile') {
        setTimeout(() => {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
          
          const spans = hamburger.querySelectorAll('span');
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }, 500);
      }
      
      // Remove flash effect
      setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(flash);
        }, 500);
      }, 10);
    }, 50);
    
    // Add flash CSS if it doesn't exist
    if (!document.querySelector('#theme-flash-style')) {
      const style = document.createElement('style');
      style.id = 'theme-flash-style';
      style.textContent = `
        .theme-flash {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: ${isDark ? '#ffffff' : '#121212'};
          z-index: 9999;
          opacity: 0.15;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        
        .theme-transition-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9990;
          opacity: 0.6;
          animation: float-up 1.5s ease-out forwards;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
        
        .theme-switched {
          animation: switchPulse 0.7s ease-out;
        }
        
        @keyframes switchPulse {
          0% {
            transform: scale(1) translateY(-2px);
          }
          50% {
            transform: scale(1.1) translateY(-2px);
          }
          100% {
            transform: scale(1) translateY(-2px);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Create floating particles for theme transition
  function createThemeTransitionParticles(isDark) {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'theme-transition-particles';
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '9990';
    particlesContainer.style.overflow = 'hidden';
    document.body.appendChild(particlesContainer);
    
    // Create particles
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'theme-transition-particle';
      
      // Random properties
      const size = Math.random() * 30 + 10;
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = Math.random() * 1 + 1;
      
      // Use theme-appropriate colors
      let color;
      if (isDark) {
        // Dark mode colors - cyan/teal spectrum
        const blueValue = 229 + Math.random() * 26;
        color = `rgba(0, ${Math.floor(blueValue)}, 255,`;
      } else {
        // Light mode colors - lighter cyan/blue spectrum
        const blueValue = 188 + Math.random() * 24;
        color = `rgba(0, ${Math.floor(blueValue)}, 212,`;
      }
      
      // Apply styles
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.bottom = '-50px';
      particle.style.backgroundColor = `${color} ${Math.random() * 0.5 + 0.2})`;
      particle.style.boxShadow = `0 0 ${size/2}px ${color} 0.3)`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      particlesContainer.appendChild(particle);
    }
    
    // Remove after animation
    setTimeout(() => {
      document.body.removeChild(particlesContainer);
    }, 2000);
  }
  
  // Update header styles based on theme
  function updateHeaderStyles(isDark) {
    const header = document.querySelector('header');
    if (!header) return;
    
    if (isDark) {
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.boxShadow = '0 5px 20px rgba(0, 188, 212, 0.1)';
    }
  }
  
  // Add animation when switching themes
  function animateDarkModeTransition(isDark) {
    const elements = document.querySelectorAll('body, .hero, .about, .skills, .projects, .contact, footer, .section-header h2');
    
    elements.forEach(element => {
      element.style.transition = 'background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease';
    });
    
    // Handle social link icons specifically
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
      // Trigger a subtle animation on theme change
      link.style.transform = isDark ? 'translateY(-3px)' : 'translateY(0)';
      setTimeout(() => {
        link.style.transform = isDark ? 'translateY(0)' : 'translateY(0)';
      }, 300);
    });
    
    // Special animation for dark mode text elements
    if (isDark) {
      const headings = document.querySelectorAll('h1, h2, h3, .section-header h2');
      headings.forEach((heading, index) => {
        setTimeout(() => {
          heading.style.textShadow = '0 0 15px rgba(100, 255, 218, 0.5)';
          setTimeout(() => {
            heading.style.textShadow = '0 0 10px rgba(0, 229, 255, 0.3)';
          }, 300);
        }, index * 100);
      });
    }
    
    // Update particles color and add special effects
    updateParticlesForTheme(isDark);
  }
  
  // Update particles for current theme
  function updateParticlesForTheme(isDark) {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
      // Add staggered transition
      setTimeout(() => {
        if (isDark) {
          particle.style.backgroundColor = `rgba(${100 + Math.random() * 100}, 255, ${218 + Math.random() * 37}, ${0.2 + Math.random() * 0.3})`;
          particle.style.boxShadow = `0 0 ${5 + Math.random() * 10}px rgba(100, 255, 218, 0.3)`;
        } else {
          // Light mode particles
          particle.style.backgroundColor = `rgba(0, ${188 + Math.random() * 40}, 212, ${0.2 + Math.random() * 0.2})`;
          particle.style.boxShadow = 'none';
        }
        
        // Add a slight animation
        particle.style.animation = 'none';
        setTimeout(() => {
          // Add animation parameters based on theme
          if (isDark) {
            particle.style.animation = `float-particle ${10 + Math.random() * 10}s infinite ease-in-out`;
            particle.style.animationDirection = Math.random() > 0.5 ? 'alternate' : 'alternate-reverse';
          } else {
            particle.style.animation = 'float-particle 15s infinite linear';
          }
        }, 10);
      }, index * 10);
    });
    
    // If dark mode and there are fewer than 20 particles, add more for dark theme
    if (isDark && particles.length < 20) {
      const container = document.querySelector('.particles-container');
      if (container) {
        for (let i = 0; i < 15; i++) {
          const newParticle = document.createElement('div');
          newParticle.classList.add('particle');
          
          // More interesting particles for dark mode
          const size = Math.random() * 15 + 5;
          newParticle.style.width = `${size}px`;
          newParticle.style.height = `${size}px`;
          newParticle.style.left = `${Math.random() * 100}%`;
          newParticle.style.top = `${Math.random() * 100}%`;
          newParticle.style.backgroundColor = `rgba(${100 + Math.random() * 100}, 255, ${218 + Math.random() * 37}, ${0.2 + Math.random() * 0.3})`;
          newParticle.style.boxShadow = `0 0 ${5 + Math.random() * 10}px rgba(100, 255, 218, 0.3)`;
          newParticle.style.animationDelay = `${Math.random() * 5}s`;
          newParticle.style.animation = `float-particle ${10 + Math.random() * 10}s infinite ease-in-out`;
          newParticle.style.animationDirection = Math.random() > 0.5 ? 'alternate' : 'alternate-reverse';
          
          container.appendChild(newParticle);
        }
      }
    }
  }
  
  // Event listeners
  toggleSwitch.addEventListener('change', switchTheme);
  if (toggleSwitchMobile) {
    toggleSwitchMobile.addEventListener('change', switchTheme);
  }
  
  // Listen for system color scheme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      toggleSwitch.checked = e.matches;
      if (toggleSwitchMobile) toggleSwitchMobile.checked = e.matches;
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateHeaderStyles(e.matches);
      animateDarkModeTransition(e.matches);
    }
  });
}

// Feature detection for touch devices
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

// Initialize on document load
document.addEventListener("DOMContentLoaded", () => {
  // Add touch device class to body for CSS targeting
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }
  
  // Add page loader
  const loader = document.createElement("div")
  loader.classList.add("page-loader")
  loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-circle"></div>
            <div class="loader-text">Loading...</div>
        </div>
    `
  document.body.appendChild(loader)

  // Hide loader after page loads
  setTimeout(() => {
    loader.style.opacity = "0"
    setTimeout(() => {
      loader.style.display = "none"
    }, 500)
  }, 1000)

  // Add CSS for loader
  const style = document.createElement("style")
  style.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        .loader-content {
            text-align: center;
        }
        .loader-circle {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #00BCD4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        .loader-text {
            color: #00BCD4;
            font-weight: 600;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `
  document.head.appendChild(style)

  // Initialize animations
  initAnimations()
  
  // Initialize dark mode
  setupDarkMode()
  
  // Initialize mobile optimizations
  initMobileOptimizations()
})

// Initialize animations
function initAnimations() {
  // Add animation classes to elements
  document.querySelector(".hero-content").classList.add("slide-right")
  document.querySelector(".hero-image").classList.add("slide-left")

  // Animate skill bars on load
  setTimeout(() => {
    progressBars.forEach((bar) => {
      const width = bar.style.width
      bar.style.width = "0"
      setTimeout(() => {
        bar.style.width = width
      }, 100)
    })
  }, 1000)

  // Add particle background to hero section
  createParticleBackground()
}

// Create particle background
function createParticleBackground() {
  const heroSection = document.querySelector(".hero")
  const particleContainer = document.createElement("div")
  particleContainer.classList.add("particles-container")

  // Create particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.classList.add("particle")

    // Random position, size and animation delay
    const size = Math.random() * 10 + 5
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.animationDelay = `${Math.random() * 5}s`

    particleContainer.appendChild(particle)
  }

  heroSection.appendChild(particleContainer)

  // Add CSS for particles
  const style = document.createElement("style")
  style.textContent = `
        .particles-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }
        .particle {
            position: absolute;
            background-color: rgba(0, 188, 212, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float-particle 15s infinite linear;
        }
        @keyframes float-particle {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(100px) rotate(360deg);
                opacity: 0;
            }
        }
    `
  document.head.appendChild(style)
}

// Toggle mobile menu
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active")
  hamburger.classList.toggle("active")

  // Animate hamburger
  const spans = hamburger.querySelectorAll("span")
  if (hamburger.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
    spans[1].style.opacity = "0"
    spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
  } else {
    spans[0].style.transform = "none"
    spans[1].style.opacity = "1"
    spans[2].style.transform = "none"
  }
})

// Close mobile menu when clicking on a nav link
navLinksItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("active")
    hamburger.classList.remove("active")

    const spans = hamburger.querySelectorAll("span")
    spans[0].style.transform = "none"
    spans[1].style.opacity = "1"
    spans[2].style.transform = "none"
  })
})

// Enhanced sticky header
window.addEventListener("scroll", () => {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  const headerBg = isDarkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const boxShadow = isDarkMode ? 
    '0 5px 20px rgba(0, 0, 0, 0.3)' : 
    '0 5px 20px rgba(0, 188, 212, 0.1)';
  
  if (window.scrollY > 50) {
    header.style.padding = "10px 0";
    header.style.background = headerBg;
    header.style.backdropFilter = "blur(10px)";
    header.style.boxShadow = boxShadow;
  } else {
    header.style.padding = "15px 0";
    header.style.background = headerBg;
    header.style.backdropFilter = "blur(10px)";
    header.style.boxShadow = boxShadow;
  }
})

// Active nav link on scroll with smooth highlighting
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section")
  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight

    if (scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id")
    }
  })

  navLinksItems.forEach((item) => {
    item.classList.remove("active")
    if (item.getAttribute("href") === `#${current}`) {
      item.classList.add("active")
    }
  })
})

// Enhanced project filtering with animations
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Active button
    filterBtns.forEach((btn) => btn.classList.remove("active"))
    btn.classList.add("active")

    // Filter projects
    const filter = btn.getAttribute("data-filter")

    projectItems.forEach((item) => {
      // Reset animation
      item.style.opacity = "0"
      item.style.transform = "scale(0.8)"

      setTimeout(() => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block"

          // Staggered animation
          setTimeout(
            () => {
              item.style.opacity = "1"
              item.style.transform = "scale(1)"
            },
            100 + Math.random() * 300,
          )
        } else {
          item.style.display = "none"
        }
      }, 300)
    })
  })
})

// Form submission with enhanced validation and animation
contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form values
  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const subject = document.getElementById("subject").value
  const message = document.getElementById("message").value

  // Basic form validation
  if (name.trim() === "" || email.trim() === "" || subject.trim() === "" || message.trim() === "") {
    showFormError("Please fill in all fields")
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    showFormError("Please enter a valid email address")
    return
  }

  // Show success message with animation
  showFormSuccess()
})

// Show form error message
function showFormError(message) {
  // Create error message element if it doesn't exist
  let errorElement = document.querySelector(".form-error")

  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.classList.add("form-error")
    contactForm.prepend(errorElement)

    // Add CSS for error message
    const style = document.createElement("style")
    style.textContent = `
            .form-error {
                background-color: #ffebee;
                color: #f44336;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
                transform: translateY(-10px);
                opacity: 0;
                transition: all 0.3s ease;
            }
            .form-error.show {
                transform: translateY(0);
                opacity: 1;
            }
        `
    document.head.appendChild(style)
  }

  errorElement.textContent = message
  errorElement.classList.add("show")

  // Hide error message after 3 seconds
  setTimeout(() => {
    errorElement.classList.remove("show")
  }, 3000)
}

// Show form success message and animation
function showFormSuccess() {
  // Create success overlay
  const successOverlay = document.createElement("div")
  successOverlay.classList.add("form-success-overlay")

  successOverlay.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Message Sent!</h3>
            <p>Thank you for your message. I'll get back to you soon!</p>
        </div>
    `

  document.body.appendChild(successOverlay)

  // Add CSS for success overlay
  const style = document.createElement("style")
  style.textContent = `
        .form-success-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .success-content {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            transform: scale(0.8);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .success-icon {
            font-size: 60px;
            color: #00BCD4;
            margin-bottom: 20px;
        }
        .success-content h3 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #263238;
        }
        .success-content p {
            color: #607D8B;
        }
    `
  document.head.appendChild(style)

  // Animate overlay
  setTimeout(() => {
    successOverlay.style.opacity = "1"
    successOverlay.querySelector(".success-content").style.transform = "scale(1)"
  }, 100)

  // Reset form
  contactForm.reset()

  // Remove overlay after 3 seconds
  setTimeout(() => {
    successOverlay.style.opacity = "0"
    setTimeout(() => {
      document.body.removeChild(successOverlay)
    }, 300)
  }, 3000)
}

// Enhanced smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      // Smooth scroll with easing
      const startPosition = window.pageYOffset
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80
      const distance = targetPosition - startPosition
      const duration = 1000
      let start = null

      window.requestAnimationFrame(step)

      function step(timestamp) {
        if (!start) start = timestamp
        const progress = timestamp - start

        // Easing function: easeInOutCubic
        let t = progress / duration
        t = t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

        window.scrollTo(0, startPosition + distance * t)
        if (progress < duration) {
          window.requestAnimationFrame(step)
        }
      }
    }
  })
})

// Enhanced scroll animations
const animateOnScroll = () => {
  const elements = document.querySelectorAll(
    ".skill-item, .project-item, .about-image, .about-text, .contact-info, .contact-form, .section-header",
  )

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top
    const screenPosition = window.innerHeight / 1.2

    if (elementPosition < screenPosition) {
      element.classList.add("animate")

      // Animate progress bars when skill items come into view
      if (element.classList.contains("skill-item")) {
        const progressBar = element.querySelector(".progress-bar")
        if (progressBar) {
          progressBar.style.width = progressBar.getAttribute("data-width") || progressBar.style.width
        }
      }
    }
  })
}

// Set initial styles for animation
document.addEventListener("DOMContentLoaded", () => {
  // Add CSS for scroll animations
  const style = document.createElement("style")
  style.textContent = `
        .skill-item, .project-item, .about-image, .about-text, .contact-info, .contact-form, .section-header {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .animate {
            opacity: 1;
            transform: translateY(0);
        }
        .section-header.animate h2 {
            animation: slideDown 0.8s ease forwards;
        }
        .section-header.animate .underline {
            animation: expandWidth 0.8s 0.3s ease forwards;
        }
        @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes expandWidth {
            from { width: 0; }
            to { width: 80px; }
        }
    `
  document.head.appendChild(style)

  // Store original width of progress bars
  progressBars.forEach((bar) => {
    const width = bar.style.width
    bar.setAttribute("data-width", width)
    bar.style.width = "0"
  })

  // Add 3D tilt effect to project cards
  const projectCards = document.querySelectorAll(".project-item")
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const cardRect = card.getBoundingClientRect()
      const cardCenterX = cardRect.left + cardRect.width / 2
      const cardCenterY = cardRect.top + cardRect.height / 2
      const mouseX = e.clientX - cardCenterX
      const mouseY = e.clientY - cardCenterY

      const rotateX = mouseY * -0.05
      const rotateY = mouseX * 0.05

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
    })
  })

  // Trigger animation on initial load
  setTimeout(animateOnScroll, 500)
})

// Trigger animation on scroll
window.addEventListener("scroll", animateOnScroll)

// Add typing animation to hero section
document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector(".hero-content h1")
  const originalText = heroTitle.innerHTML

  // Clear and set up for typing animation
  heroTitle.innerHTML = ""

  let i = 0
  const typeWriter = () => {
    if (i < originalText.length) {
      heroTitle.innerHTML += originalText.charAt(i)
      i++
      setTimeout(typeWriter, 100)
    }
  }

  // Start typing animation after a delay
  setTimeout(typeWriter, 1000)
})

// Preloader
window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader")
  setTimeout(() => {
    preloader.classList.add("fade-out")
  }, 1000)
})
/*
// Custom cursor
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".custom-cursor")
  const cursorFollower = document.querySelector(".custom-cursor-follower")

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px"
    cursor.style.top = e.clientY + "px"

    cursorFollower.style.left = e.clientX + "px"
    cursorFollower.style.top = e.clientY + "px"
  })

  // Cursor hover effect on interactive elements
  const interactiveElements = document.querySelectorAll("a, button, .project-item, .skill-item, input, textarea")

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "30px"
      cursor.style.height = "30px"
      cursor.style.backgroundColor = "rgba(0, 188, 212, 0.2)"
      cursorFollower.style.width = "50px"
      cursorFollower.style.height = "50px"
    })

    el.addEventListener("mouseleave", () => {
      cursor.style.width = "20px"
      cursor.style.height = "20px"
      cursor.style.backgroundColor = "rgba(0, 188, 212, 0.3)"
      cursorFollower.style.width = "40px"
      cursorFollower.style.height = "40px"
    })
  })

  // Hide cursor when leaving window
  document.addEventListener("mouseout", (e) => {
    if (e.relatedTarget === null) {
      cursor.style.opacity = "0"
      cursorFollower.style.opacity = "0"
    }
  })

  document.addEventListener("mouseover", () => {
    cursor.style.opacity = "1"
    cursorFollower.style.opacity = "1"
  })
})
*/
// Add parallax effect to hero section
document.addEventListener("mousemove", parallax)

function parallax(e) {
  const heroSection = document.querySelector(".hero")
  if (!heroSection) return

  const mouseX = e.clientX
  const mouseY = e.clientY

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const moveX = (mouseX - windowWidth / 2) / 50
  const moveY = (mouseY - windowHeight / 2) / 50

  const heroImage = document.querySelector(".hero-image")
  if (heroImage) {
    heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`
  }

  // Parallax for particles
  const particles = document.querySelectorAll(".particle")
  particles.forEach((particle) => {
    const speed = particle.getAttribute("data-speed") || 0.05
    particle.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`
  })
}

// Add scroll reveal animations
const scrollReveal = () => {
  const revealElements = document.querySelectorAll(".reveal")

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("active")
    }
  })
}

// Add reveal class to elements
document.addEventListener("DOMContentLoaded", () => {
  const elementsToReveal = document.querySelectorAll(
    ".section-header, .about-image, .about-text, .skill-item, .project-item, .contact-info, .contact-form",
  )

  elementsToReveal.forEach((element) => {
    element.classList.add("reveal")
  })

  // Add CSS for reveal animations
  const style = document.createElement("style")
  style.textContent = `
        .reveal {
            position: relative;
            opacity: 0;
            transition: all 1s ease;
        }
        
        .reveal.active {
            opacity: 1;
        }
        
        .reveal.from-left {
            transform: translateX(-100px);
        }
        
        .reveal.from-right {
            transform: translateX(100px);
        }
        
        .reveal.from-bottom {
            transform: translateY(100px);
        }
        
        .reveal.active.from-left,
        .reveal.active.from-right,
        .reveal.active.from-bottom {
            transform: translateX(0) translateY(0);
        }
        
        .reveal.delay-1 {
            transition-delay: 0.1s;
        }
        
        .reveal.delay-2 {
            transition-delay: 0.2s;
        }
        
        .reveal.delay-3 {
            transition-delay: 0.3s;
        }
    `
  document.head.appendChild(style)

  // Add direction and delay classes
  document.querySelector(".about-image").classList.add("from-left")
  document.querySelector(".about-text").classList.add("from-right")

  const skillItems = document.querySelectorAll(".skill-item")
  skillItems.forEach((item, index) => {
    item.classList.add("from-bottom")
    item.classList.add(`delay-${(index % 3) + 1}`)
  })

  const projectItems = document.querySelectorAll(".project-item")
  projectItems.forEach((item, index) => {
    item.classList.add("from-bottom")
    item.classList.add(`delay-${(index % 3) + 1}`)
  })

  document.querySelector(".contact-info").classList.add("from-left")
  document.querySelector(".contact-form").classList.add("from-right")

  // Initial check
  scrollReveal()
})

// Run scroll reveal on scroll
window.addEventListener("scroll", scrollReveal)

// Mobile-specific optimizations
function initMobileOptimizations() {
  if (isTouchDevice()) {
    // Fix 300ms tap delay
    const fastClick = document.createElement('script');
    fastClick.src = 'https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js';
    document.head.appendChild(fastClick);
    fastClick.onload = function() {
      FastClick.attach(document.body);
    };
    
    // Better handling of fixed elements when keyboard is shown
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        document.body.classList.add('input-focused');
      });
      input.addEventListener('blur', () => {
        document.body.classList.remove('input-focused');
      });
    });
    
    // Improve scrolling performance
    let scrollingTimeout;
    window.addEventListener('scroll', () => {
      if (!document.body.classList.contains('is-scrolling')) {
        document.body.classList.add('is-scrolling');
      }
      
      clearTimeout(scrollingTimeout);
      scrollingTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 100);
    }, { passive: true });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (navLinks.classList.contains('active') && 
        !nav.contains(e.target) && 
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

