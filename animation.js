// Enhanced Animation Controller
class AnimationController {
  constructor() {
    this.particles = []
    this.isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    this.init()
  }

  init() {
    if (!this.isReducedMotion) {
      this.createParticles()
      this.initScrollAnimations()
      this.initButtonRipples()
      this.initTypingAnimation()
      this.initParallaxEffects()
      this.initHoverEffects()
    }

    this.initIntersectionObserver()
    this.initCounterAnimations()
  }

  // Particle System
  createParticles() {
    const particleContainer = document.getElementById("particles")
    if (!particleContainer) return

    const particleCount = window.innerWidth < 768 ? 20 : 50

    for (let i = 0; i < particleCount; i++) {
      this.createParticle(particleContainer)
    }
  }

  createParticle(container) {
    const particle = document.createElement("div")
    particle.className = "particle"

    // Random position
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"

    // Random animation duration and delay
    const duration = 8 + Math.random() * 12
    const delay = Math.random() * 5

    particle.style.animationDuration = duration + "s"
    particle.style.animationDelay = delay + "s"

    // Random size
    const size = 2 + Math.random() * 4
    particle.style.width = size + "px"
    particle.style.height = size + "px"

    container.appendChild(particle)
    this.particles.push(particle)
  }

  // Enhanced Scroll Animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0
          setTimeout(() => {
            entry.target.classList.add("animated")
          }, Number.parseInt(delay))
        }
      })
    }, observerOptions)

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el)
    })
  }

  // Button Ripple Effects
  initButtonRipples() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".btn-glow")) {
        this.createRipple(e)
      }
    })
  }

  createRipple(e) {
    const button = e.target.closest(".btn-glow")
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const ripple = document.createElement("div")
    ripple.className = "btn-ripple"
    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  // Enhanced Typing Animation
  initTypingAnimation() {
    const typingElements = document.querySelectorAll(".typing-animation")

    typingElements.forEach((element) => {
      const text = element.textContent
      element.textContent = ""
      element.style.borderRight = "3px solid"

      let i = 0
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i)
          i++
          setTimeout(typeWriter, 100)
        } else {
          // Blinking cursor effect
          setInterval(() => {
            element.style.borderRightColor =
              element.style.borderRightColor === "transparent" ? "currentColor" : "transparent"
          }, 500)
        }
      }

      setTimeout(typeWriter, 1000)
    })
  }

  // Parallax Effects
  initParallaxEffects() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const parallaxElements = document.querySelectorAll(".parallax")

      parallaxElements.forEach((element) => {
        const speed = element.dataset.speed || 0.5
        const yPos = -(scrolled * speed)
        element.style.transform = `translateY(${yPos}px)`
      })
    })
  }

  // Enhanced Hover Effects
  initHoverEffects() {
    // 3D Card Effects
    document.querySelectorAll(".card-3d").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
      })

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
      })
    })

    // Magnetic Button Effect
    document.querySelectorAll(".btn-magnetic").forEach((button) => {
      button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
      })

      button.addEventListener("mouseleave", () => {
        button.style.transform = "translate(0px, 0px)"
      })
    })
  }

  // Intersection Observer for General Animations
  initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view")

          // Trigger specific animations based on class
          if (entry.target.classList.contains("counter")) {
            this.animateCounter(entry.target)
          }

          if (entry.target.classList.contains("progress-bar")) {
            this.animateProgressBar(entry.target)
          }
        }
      })
    }, observerOptions)

    // Observe elements
    document.querySelectorAll(".animate-on-scroll, .counter, .progress-bar").forEach((el) => {
      observer.observe(el)
    })
  }

  // Enhanced Counter Animation
  initCounterAnimations() {
    const counters = document.querySelectorAll(".stat-number[data-count]")

    const animateCounter = (counter) => {
      if (counter.classList.contains("counted")) return

      const target = Number.parseFloat(counter.getAttribute("data-count"))
      const duration = 2000
      const increment = target / (duration / 16)
      let current = 0

      const updateCounter = () => {
        if (current < target) {
          current += increment
          if (target >= 1000) {
            counter.textContent = Math.floor(current).toLocaleString()
          } else {
            counter.textContent = current.toFixed(1)
          }
          requestAnimationFrame(updateCounter)
        } else {
          if (target >= 1000) {
            counter.textContent = target.toLocaleString()
          } else {
            counter.textContent = target.toString()
          }
          counter.classList.add("counted")
        }
      }

      updateCounter()
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    counters.forEach((counter) => {
      counterObserver.observe(counter)
    })
  }

  // Progress Bar Animation
  animateProgressBar(progressBar) {
    const fill = progressBar.querySelector(".progress-fill")
    if (fill && !fill.classList.contains("animated")) {
      fill.classList.add("animated")
      const width = fill.style.width
      fill.style.width = "0%"

      setTimeout(() => {
        fill.style.width = width
      }, 100)
    }
  }

  // Smooth Page Transitions
  initPageTransitions() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"], button[onclick*="showView"]')
      if (link) {
        document.body.classList.add("page-transitioning")

        setTimeout(() => {
          document.body.classList.remove("page-transitioning")
        }, 300)
      }
    })
  }

  // Scroll to Top with Animation
  initScrollToTop() {
    const scrollButton = document.createElement("button")
    scrollButton.className = "scroll-to-top"
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>'
    scrollButton.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--primary-gradient);
      border: none;
      color: white;
      cursor: pointer;
      opacity: 0;
      transform: translateY(100px);
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: var(--shadow-medium);
    `

    document.body.appendChild(scrollButton)

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollButton.style.opacity = "1"
        scrollButton.style.transform = "translateY(0)"
      } else {
        scrollButton.style.opacity = "0"
        scrollButton.style.transform = "translateY(100px)"
      }
    })

    scrollButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Loading Screen Animation
  initLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen")
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = "0"
        setTimeout(() => {
          loadingScreen.style.display = "none"
        }, 500)
      }, 1500)
    }
  }

  // Cleanup
  destroy() {
    this.particles.forEach((particle) => particle.remove())
    this.particles = []
  }
}

// Enhanced Notification System
class NotificationSystem {
  constructor() {
    this.notifications = []
    this.container = this.createContainer()
  }

  createContainer() {
    const container = document.createElement("div")
    container.className = "notification-container"
    container.style.cssText = `
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `
    document.body.appendChild(container)
    return container
  }

  show(message, type = "info", duration = 5000) {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`

    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    }

    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `

    notification.style.cssText = `
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-medium);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-width: 300px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      border-left: 4px solid var(--${type === "success" ? "success" : type === "error" ? "error" : "primary"}-color);
    `

    this.container.appendChild(notification)
    this.notifications.push(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 10)

    // Close button
    notification.querySelector(".notification-close").addEventListener("click", () => {
      this.remove(notification)
    })

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification)
      }, duration)
    }

    return notification
  }

  remove(notification) {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
      this.notifications = this.notifications.filter((n) => n !== notification)
    }, 300)
  }
}

// Initialize Enhanced Animations
document.addEventListener("DOMContentLoaded", () => {
  const animationController = new AnimationController()
  const notificationSystem = new NotificationSystem()

  // Make notification system globally available
  window.showNotification = (message, type, duration) => {
    notificationSystem.show(message, type, duration)
  }

  // Initialize scroll to top
  animationController.initScrollToTop()

  // Initialize loading screen
  animationController.initLoadingScreen()

  // Initialize page transitions
  animationController.initPageTransitions()
})

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === "measure") {
      console.log(`${entry.name}: ${entry.duration}ms`)
    }
  }
})

if ("PerformanceObserver" in window) {
  performanceObserver.observe({ entryTypes: ["measure"] })
}

// Utility functions for animations
const AnimationUtils = {
  // Easing functions
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeIn: (t) => t * t * t,

  // Animation frame helper
  animate: (duration, callback, easing = AnimationUtils.easeInOut) => {
    const start = performance.now()

    const frame = (time) => {
      const elapsed = time - start
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)

      callback(easedProgress)

      if (progress < 1) {
        requestAnimationFrame(frame)
      }
    }

    requestAnimationFrame(frame)
  },

  // Stagger animation helper
  stagger: (elements, animation, delay = 100) => {
    elements.forEach((element, index) => {
      setTimeout(() => {
        animation(element)
      }, index * delay)
    })
  },
}

// Export for use in other scripts
window.AnimationUtils = AnimationUtils
