// User Management System
const users = JSON.parse(localStorage.getItem("fundit_users")) || []
let currentUser = JSON.parse(localStorage.getItem("fundit_current_user")) || null

// Application State
let projects = JSON.parse(localStorage.getItem("projects")) || []
let currentProject = null
let contributionAmount = 0
let currentFilter = ""
let currentSort = "newest"

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Initializing app...")

  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen")
    if (loadingScreen) {
      loadingScreen.classList.add("hidden")
      console.log("Loading screen hidden")
    }
  }, 1500)

  // Clear existing projects and add fresh sample projects
  console.log("Current projects in localStorage:", projects.length)

  // Force reload sample projects for testing
  localStorage.removeItem("projects")
  projects = []
  addSampleProjects()

  console.log("Sample projects added:", projects.length)

  // Load projects into the UI
  loadProjects()
  initializeAnimations()
  initializeCounters()

  // Form event listeners
  const createForm = document.getElementById("create-project-form")
  const paymentForm = document.getElementById("payment-form")
  const contactForm = document.getElementById("contact-form")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")

  if (createForm) createForm.addEventListener("submit", createProject)
  if (paymentForm) paymentForm.addEventListener("submit", processPayment)
  if (contactForm) contactForm.addEventListener("submit", handleContactForm)
  if (loginForm) loginForm.addEventListener("submit", handleLogin)
  if (signupForm) signupForm.addEventListener("submit", handleSignup)

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }

  // Scroll animations
  window.addEventListener("scroll", handleScrollAnimations)

  // Custom amount input handler
  document.addEventListener("input", (e) => {
    if (e.target.id === "custom-amount") {
      document.querySelectorAll(".amount-btn").forEach((btn) => btn.classList.remove("active"))
      contributionAmount = Number.parseInt(e.target.value) || 0
    }
  })

  // Check user session
  checkUserSession()

  console.log("App initialization complete")
})

// Fixed sample projects with local image paths
function addSampleProjects() {
  console.log("Adding sample projects...")

  const sampleProjects = [
    {
      id: 1,
      title: "Smart Garden System",
      description:
        "An automated garden system that monitors soil moisture, temperature, and light levels to keep your plants healthy. Features include mobile app control, weather integration, and AI-powered plant care recommendations that help you grow the perfect garden.",
      goal: 5000,
      raised: 3250,
      category: "technology",
      duration: 30,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      contributors: 42,
      imageUrl: "/images/smart-garden.jpg",
      updates: [
        {
          date: "2024-01-15",
          title: "Prototype Complete!",
          content:
            "We've successfully built our first working prototype. The sensors are working perfectly and the mobile app is coming along great! Next week we'll be testing the AI recommendations feature.",
        },
        {
          date: "2024-01-10",
          title: "Sensor Testing Update",
          content:
            "All sensor modules have been tested and calibrated. The moisture sensors are incredibly accurate, and the temperature readings are spot-on. We're excited about the progress!",
        },
      ],
    },
    {
      id: 2,
      title: "Indie Game: Space Explorer",
      description:
        "A retro-style space exploration game with procedurally generated worlds and engaging storylines. Featuring beautiful pixel art, immersive soundtrack, and endless exploration possibilities. Join Captain Nova on an epic journey across the galaxy.",
      goal: 15000,
      raised: 8750,
      category: "games",
      duration: 45,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      contributors: 156,
      imageUrl: "/images/space-game.jpg",
      updates: [
        {
          date: "2024-01-10",
          title: "Alpha Version Released",
          content:
            "The alpha version is now available for backers! We've included the first 3 levels and basic ship customization. Your feedback has been incredible so far!",
        },
      ],
    },
    {
      id: 3,
      title: "Eco-Friendly Water Bottle",
      description:
        "A revolutionary water bottle made from 100% recycled materials with a built-in filtration system. Reduces plastic waste while providing clean, fresh water anywhere you go. Perfect for outdoor adventures and daily use.",
      goal: 8000,
      raised: 12500,
      category: "design",
      duration: 20,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      contributors: 203,
      imageUrl: "/images/water-bottle.jpg",
      updates: [
        {
          date: "2024-01-12",
          title: "Goal Exceeded!",
          content:
            "Thanks to your amazing support, we've exceeded our funding goal! We're now working on stretch goals including additional color options and a premium filter upgrade.",
        },
      ],
    },
    {
      id: 4,
      title: "AI-Powered Music Composer",
      description:
        "An innovative AI tool that helps musicians compose original music by analyzing their style and suggesting harmonies, melodies, and arrangements. Perfect for both beginners and professional musicians looking to expand their creative horizons.",
      goal: 12000,
      raised: 4800,
      category: "music",
      duration: 35,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      contributors: 67,
      imageUrl: "/images/music-ai.jpg",
      updates: [
        {
          date: "2024-01-14",
          title: "Beta Testing Begins",
          content:
            "We've started beta testing with professional musicians. The feedback has been overwhelmingly positive, with many saying it's revolutionizing their creative process.",
        },
      ],
    },
    {
      id: 5,
      title: "Documentary: Ocean Cleanup",
      description:
        "A feature-length documentary following innovative ocean cleanup technologies and the people working to save our marine ecosystems. Join us as we explore cutting-edge solutions to one of our planet's biggest challenges.",
      goal: 25000,
      raised: 18750,
      category: "film",
      duration: 40,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      contributors: 312,
      imageUrl: "/images/ocean-documentary.jpg",
      updates: [
        {
          date: "2024-01-11",
          title: "Filming in the Pacific",
          content:
            "We're currently filming with the Ocean Cleanup Foundation in the Pacific. The footage we're capturing is absolutely incredible and will really drive home the importance of this work.",
        },
      ],
    },
    {
      id: 6,
      title: "Digital Art Collection: Neon Dreams",
      description:
        "A stunning collection of digital artworks exploring cyberpunk themes with vibrant neon aesthetics and futuristic cityscapes. Each piece tells a story of humanity's relationship with technology in the digital age.",
      goal: 6000,
      raised: 7200,
      category: "art",
      duration: 25,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      contributors: 89,
      imageUrl: "/images/neon-art.jpg",
      updates: [
        {
          date: "2024-01-09",
          title: "New Artwork Revealed",
          content:
            "We've just revealed the latest piece in the collection: 'Midnight Runner'. The response from the community has been amazing, and we're excited to share more!",
        },
      ],
    },
  ]

  projects = sampleProjects
  localStorage.setItem("projects", JSON.stringify(projects))
  console.log("Sample projects saved to localStorage:", projects)
}

// Helper function to add a new sample project (you can call this from console)
function addNewSampleProject(projectData) {
  const newProject = {
    id: Date.now(),
    title: projectData.title || "New Sample Project",
    description: projectData.description || "A sample project description",
    goal: projectData.goal || 10000,
    raised: projectData.raised || 0,
    category: projectData.category || "technology",
    duration: projectData.duration || 30,
    createdAt: new Date().toISOString(),
    contributors: projectData.contributors || 0,
    imageUrl: projectData.imageUrl || null,
    gallery: projectData.gallery || [],
    updates: projectData.updates || [
      {
        date: new Date().toISOString().split("T")[0],
        title: "Project Created",
        content: "This is a sample project for demonstration purposes.",
      },
    ],
  }

  projects.unshift(newProject)
  localStorage.setItem("projects", JSON.stringify(projects))
  loadProjects()
  console.log("New sample project added:", newProject)
  return newProject
}

// Helper function to get random images from different categories
function getRandomImageByCategory(category) {
  const imageCategories = {
    technology: ["/images/smart-garden.jpg", "/images/tech-2.jpg", "/images/tech-3.jpg"],
    art: ["/images/neon-art.jpg", "/images/art-2.jpg", "/images/art-3.jpg"],
    music: ["/images/music-ai.jpg", "/images/music-2.jpg", "/images/music-3.jpg"],
    games: ["/images/space-game.jpg", "/images/games-2.jpg", "/images/games-3.jpg"],
    film: ["/images/ocean-documentary.jpg", "/images/film-2.jpg", "/images/film-3.jpg"],
    design: ["/images/water-bottle.jpg", "/images/design-2.jpg", "/images/design-3.jpg"],
  }

  const categoryImages = imageCategories[category] || imageCategories.technology
  return categoryImages[0] // Use the first image for now, or implement random selection
}

// Load projects and display them
function loadProjects() {
  console.log("Loading projects into UI...")
  loadFeaturedProjects()
  loadAllProjects()
}

function loadFeaturedProjects() {
  console.log("Loading featured projects...")
  const container = document.getElementById("featured-projects")

  if (!container) {
    console.error("Featured projects container not found!")
    return
  }

  if (projects.length === 0) {
    console.error("No projects available to display!")
    container.innerHTML = "<p>No projects available</p>"
    return
  }

  const featuredProjects = projects.sort((a, b) => b.raised - a.raised).slice(0, 3)

  console.log("Featured projects to display:", featuredProjects)

  const projectCards = featuredProjects.map((project) => createProjectCard(project)).join("")
  container.innerHTML = projectCards

  // Add animation classes
  container.querySelectorAll(".project-card").forEach((card, index) => {
    card.classList.add("animate-on-scroll")
    card.style.animationDelay = `${index * 0.1}s`
  })

  console.log("Featured projects loaded successfully")
}

function loadAllProjects() {
  const container = document.getElementById("all-projects")
  if (!container) return

  let filteredProjects = [...projects]

  // Apply category filter
  if (currentFilter) {
    filteredProjects = filteredProjects.filter((project) => project.category === currentFilter)
  }

  // Apply sorting
  switch (currentSort) {
    case "popular":
      filteredProjects.sort((a, b) => b.contributors - a.contributors)
      break
    case "ending":
      filteredProjects.sort((a, b) => {
        const daysLeftA = Math.max(
          0,
          a.duration - Math.floor((new Date() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24)),
        )
        const daysLeftB = Math.max(
          0,
          b.duration - Math.floor((new Date() - new Date(b.createdAt)) / (1000 * 60 * 60 * 24)),
        )
        return daysLeftA - daysLeftB
      })
      break
    case "funded":
      filteredProjects.sort((a, b) => b.raised / b.goal - a.raised / a.goal)
      break
    default: // newest
      filteredProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const projectCards = filteredProjects.map((project) => createProjectCard(project)).join("")
  container.innerHTML = projectCards

  // Add animation classes
  container.querySelectorAll(".project-card").forEach((card, index) => {
    card.classList.add("animate-on-scroll")
    card.style.animationDelay = `${index * 0.05}s`
  })
}

// Enhanced createProjectCard function
function createProjectCard(project) {
  const progressPercentage = Math.min((project.raised / project.goal) * 100, 100)
  const daysLeft = Math.max(
    0,
    project.duration - Math.floor((new Date() - new Date(project.createdAt)) / (1000 * 60 * 60 * 24)),
  )

  console.log(`Creating card for: ${project.title}`)

  return `
    <div class="project-card card-3d hover-lift animate-on-scroll" onclick="showProjectDetail(${project.id})">
      <div class="project-image">
        ${createImageElement(project.imageUrl, project.title)}
        <div class="image-overlay"></div>
      </div>
      <div class="project-content">
        <div class="project-title">${project.title}</div>
        <div class="project-description">${project.description.substring(0, 120)}...</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="project-stats">
          <div class="stat">
            <div class="stat-value">$${project.raised.toLocaleString()}</div>
            <div class="stat-label">raised</div>
          </div>
          <div class="stat">
            <div class="stat-value">${project.contributors}</div>
            <div class="stat-label">backers</div>
          </div>
          <div class="stat">
            <div class="stat-value">${daysLeft}</div>
            <div class="stat-label">days left</div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Enhanced image element creation with better error handling
function createImageElement(imageUrl, altText) {
  if (!imageUrl) {
    console.log("No image URL provided, showing placeholder")
    return `
      <div class="image-placeholder">
        <i class="fas fa-image"></i>
        <p>Project Image</p>
      </div>
    `
  }

  console.log("Creating image element for:", imageUrl)

  return `
    <img 
      src="${imageUrl}" 
      alt="${altText}" 
      loading="lazy"
      onload="console.log('Image loaded:', this.src); this.style.opacity='1'"
      onerror="console.log('Image failed to load:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex'"
      style="
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
        border-radius: 8px;
        opacity: 0;
        transition: opacity 0.3s ease;
      "
    >
    <div class="image-placeholder" style="display: none;">
      <i class="fas fa-image"></i>
      <p>Image unavailable</p>
    </div>
  `
}

// View management
function showView(viewName) {
  console.log("Switching to view:", viewName)

  // Add page transition effect
  document.body.classList.add("page-transitioning")

  setTimeout(() => {
    // Hide all views
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.remove("active")
    })

    // Show selected view
    const targetView = document.getElementById(viewName)
    if (targetView) {
      targetView.classList.add("active")
      console.log("View activated:", viewName)

      // Scroll to top with smooth animation
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Load specific content based on view
      switch (viewName) {
        case "projects":
          loadAllProjects()
          break
        case "home":
          loadFeaturedProjects()
          break
      }

      // Trigger scroll animations for new view
      setTimeout(() => {
        handleScrollAnimations()
      }, 100)
    } else {
      console.error("Target view not found:", viewName)
    }

    // Remove transition class
    document.body.classList.remove("page-transitioning")
  }, 150)
}

// Enhanced showProjectDetail function
function showProjectDetail(projectId) {
  console.log("Showing project detail for ID:", projectId)

  currentProject = projects.find((p) => p.id === projectId)
  if (!currentProject) {
    console.error("Project not found:", projectId)
    return
  }

  const progressPercentage = Math.min((currentProject.raised / currentProject.goal) * 100, 100)
  const daysLeft = Math.max(
    0,
    currentProject.duration - Math.floor((new Date() - new Date(currentProject.createdAt)) / (1000 * 60 * 60 * 24)),
  )

  const content = `
    <div class="project-header">
      <div class="project-main-content">
        <div class="project-main-image">
          ${createMainImageElement(currentProject.imageUrl, currentProject.title)}
        </div>
        <h1>${currentProject.title}</h1>
        <p class="project-full-description">${currentProject.description}</p>
        <div class="project-category-tag">
          <span class="category-badge">${currentProject.category}</span>
        </div>
      </div>
      <div class="funding-panel">
        <div class="funding-amount">$${currentProject.raised.toLocaleString()}</div>
        <div class="funding-goal">of $${currentProject.goal.toLocaleString()} goal</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="project-stats">
          <div class="stat">
            <div class="stat-value">${currentProject.contributors}</div>
            <div class="stat-label">backers</div>
          </div>
          <div class="stat">
            <div class="stat-value">${daysLeft}</div>
            <div class="stat-label">days left</div>
          </div>
          <div class="stat">
            <div class="stat-value">${Math.round(progressPercentage)}%</div>
            <div class="stat-label">funded</div>
          </div>
        </div>
        
        <div class="contribute-form">
          <h4>Support This Project</h4>
          <div class="amount-buttons">
            <button class="amount-btn" onclick="selectAmount(25)">$25</button>
            <button class="amount-btn" onclick="selectAmount(50)">$50</button>
            <button class="amount-btn" onclick="selectAmount(100)">$100</button>
          </div>
          <div class="form-group">
            <input type="number" id="custom-amount" placeholder="Enter custom amount" min="1">
          </div>
          <button class="btn btn-primary btn-full" onclick="contribute()">
            <i class="fas fa-heart"></i>
            Back This Project
          </button>
        </div>
      </div>
    </div>
    
    <div class="updates-section">
      <h3>Project Updates</h3>
      ${currentProject.updates
        .map(
          (update) => `
        <div class="update-item">
          <div class="update-date">${new Date(update.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</div>
          <div class="update-title">${update.title}</div>
          <div class="update-content">${update.content}</div>
        </div>
      `,
        )
        .join("")}
    </div>
  `

  document.getElementById("project-detail-content").innerHTML = content
  showView("project-detail")
}

// Helper function for main project images
function createMainImageElement(imageUrl, altText) {
  if (!imageUrl) {
    return `
      <div class="main-image-placeholder">
        <i class="fas fa-image"></i>
        <p>Project Image</p>
      </div>
    `
  }

  return `
    <img 
      src="${imageUrl}" 
      alt="${altText}"
      loading="lazy"
      onload="this.style.opacity='1'"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
      style="
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
        border-radius: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
      "
    >
    <div class="main-image-placeholder" style="display: none;">
      <i class="fas fa-image"></i>
      <p>Image unavailable</p>
    </div>
  `
}

// Amount selection
function selectAmount(amount) {
  document.querySelectorAll(".amount-btn").forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")
  document.getElementById("custom-amount").value = amount
  contributionAmount = amount
}

// Contribute
function contribute() {
  const customAmount = document.getElementById("custom-amount").value
  if (!customAmount || customAmount < 1) {
    showNotification("Please enter a valid contribution amount", "error")
    return
  }

  contributionAmount = Number.parseInt(customAmount)
  document.getElementById("contribution-amount").value = contributionAmount

  // Update payment summary
  const fee = Math.round(contributionAmount * 0.029 + 0.3)
  const total = contributionAmount + fee

  document.getElementById("contribution-display").textContent = `$${contributionAmount}`
  document.getElementById("fee-display").textContent = `$${fee}`
  document.getElementById("total-display").textContent = `$${total}`

  document.getElementById("payment-modal").classList.add("active")
}

// Close payment modal
function closePaymentModal() {
  document.getElementById("payment-modal").classList.remove("active")
  document.getElementById("payment-form").reset()
}

// Close success modal
function closeSuccessModal() {
  document.getElementById("success-modal").classList.remove("active")
}

// Process payment
function processPayment(e) {
  e.preventDefault()

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
  submitBtn.disabled = true

  // Simulate payment processing
  setTimeout(() => {
    // Update project
    currentProject.raised += contributionAmount
    currentProject.contributors += 1

    // Add update
    currentProject.updates.unshift({
      date: new Date().toISOString().split("T")[0],
      title: "New Backer!",
      content: `Thank you to our latest backer for contributing $${contributionAmount}! We're getting closer to our goal every day.`,
    })

    // Save to localStorage
    const projectIndex = projects.findIndex((p) => p.id === currentProject.id)
    projects[projectIndex] = currentProject
    localStorage.setItem("projects", JSON.stringify(projects))

    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Show success and refresh
    closePaymentModal()
    document.getElementById("success-modal").classList.add("active")

    // Refresh project detail and projects list
    setTimeout(() => {
      showProjectDetail(currentProject.id)
      loadProjects()
    }, 2000)
  }, 2000)
}

// Create project
function createProject(e) {
  e.preventDefault()

  const title = document.getElementById("project-title").value
  const description = document.getElementById("project-description").value
  const goal = Number.parseInt(document.getElementById("funding-goal").value)
  const category = document.getElementById("project-category").value
  const duration = Number.parseInt(document.getElementById("project-duration").value)
  const imageUrl = document.getElementById("project-image-url")?.value || null

  const newProject = {
    id: Date.now(),
    title,
    description,
    goal,
    raised: 0,
    category,
    duration,
    createdAt: new Date().toISOString(),
    contributors: 0,
    imageUrl: imageUrl,
    updates: [
      {
        date: new Date().toISOString().split("T")[0],
        title: "Project Launched!",
        content:
          "Our project is now live! Thank you for your support and stay tuned for regular updates as we work towards our goal.",
      },
    ],
  }

  projects.unshift(newProject)
  localStorage.setItem("projects", JSON.stringify(projects))

  showNotification("Project created successfully!", "success")
  document.getElementById("create-project-form").reset()
  loadProjects()
  showView("home")
}

// Filter and sort functions
function filterByCategory(category) {
  currentFilter = category
  const categoryFilter = document.getElementById("category-filter")
  if (categoryFilter) {
    categoryFilter.value = category
  }
  loadAllProjects()
  showView("projects")
}

function filterProjects() {
  const categoryFilter = document.getElementById("category-filter")
  if (categoryFilter) {
    currentFilter = categoryFilter.value
  }
  loadAllProjects()
}

function sortProjects() {
  const sortFilter = document.getElementById("sort-filter")
  if (sortFilter) {
    currentSort = sortFilter.value
  }
  loadAllProjects()
}

// Handle contact form
function handleContactForm(e) {
  e.preventDefault()

  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitBtn.disabled = true

  // Simulate form submission
  setTimeout(() => {
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    showNotification("Message sent successfully! We'll get back to you soon.", "success")
    document.getElementById("contact-form").reset()
  }, 1500)
}

// Handle user signup
function handleSignup(e) {
  e.preventDefault()

  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML

  // Get form data
  const firstName = document.getElementById("signup-firstname").value.trim()
  const lastName = document.getElementById("signup-lastname").value.trim()
  const email = document.getElementById("signup-email").value.trim().toLowerCase()
  const password = document.getElementById("signup-password").value
  const confirmPassword = document.getElementById("signup-confirm-password").value
  const userType = document.getElementById("signup-user-type").value
  const agreeTerms = document.getElementById("agree-terms").checked
  const newsletter = document.getElementById("newsletter-signup").checked

  // Validation
  if (!validateSignupForm(firstName, lastName, email, password, confirmPassword, userType, agreeTerms)) {
    return
  }

  // Check if user already exists
  if (users.find((user) => user.email === email)) {
    showNotification("An account with this email already exists. Please sign in instead.", "error")
    return
  }

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...'
  submitBtn.disabled = true

  // Simulate account creation
  setTimeout(() => {
    // Create new user
    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password: hashPassword(password), // In real app, this would be properly hashed
      userType,
      newsletter,
      createdAt: new Date().toISOString(),
      isVerified: false, // In real app, would require email verification
      profileImage: null,
      bio: "",
      location: "",
      website: "",
      backedProjects: [],
      createdProjects: [],
      totalBacked: 0,
      totalRaised: 0,
    }

    // Add to users array
    users.push(newUser)
    localStorage.setItem("fundit_users", JSON.stringify(users))

    // Set as current user (auto-login after signup)
    currentUser = { ...newUser }
    delete currentUser.password // Don't store password in current user session
    localStorage.setItem("fundit_current_user", JSON.stringify(currentUser))

    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Show success message
    showNotification(`Welcome to FundIt, ${firstName}! Your account has been created successfully.`, "success")

    // Update UI for logged in state
    updateUIForLoggedInUser()

    // Clear form and redirect
    document.getElementById("signup-form").reset()
    showView("home")

    // Send welcome email (simulated)
    setTimeout(() => {
      showNotification("A welcome email has been sent to your inbox!", "info")
    }, 2000)
  }, 2000)
}

// Validate signup form
function validateSignupForm(firstName, lastName, email, password, confirmPassword, userType, agreeTerms) {
  // Check required fields
  if (!firstName || !lastName || !email || !password || !confirmPassword || !userType) {
    showNotification("Please fill in all required fields.", "error")
    return false
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    showNotification("Please enter a valid email address.", "error")
    return false
  }

  // Validate password strength
  if (password.length < 8) {
    showNotification("Password must be at least 8 characters long.", "error")
    return false
  }

  // Check password complexity
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    showNotification(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      "error",
    )
    return false
  }

  // Check password confirmation
  if (password !== confirmPassword) {
    showNotification("Passwords do not match.", "error")
    return false
  }

  // Check terms agreement
  if (!agreeTerms) {
    showNotification("You must agree to the Terms of Service and Privacy Policy.", "error")
    return false
  }

  return true
}

// Simple password hashing (in real app, use proper hashing)
function hashPassword(password) {
  // This is a simple hash for demo purposes
  // In a real application, use proper password hashing like bcrypt
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString()
}

// Update login function to work with the new user system
function handleLogin(e) {
  e.preventDefault()

  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML

  const email = document.getElementById("login-email").value.trim().toLowerCase()
  const password = document.getElementById("login-password").value
  const rememberMe = document.getElementById("remember-me").checked

  if (!email || !password) {
    showNotification("Please enter both email and password.", "error")
    return
  }

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...'
  submitBtn.disabled = true

  // Simulate login process
  setTimeout(() => {
    // Find user
    const user = users.find((u) => u.email === email && u.password === hashPassword(password))

    if (user) {
      // Set current user
      currentUser = { ...user }
      delete currentUser.password // Don't store password in session
      localStorage.setItem("fundit_current_user", JSON.stringify(currentUser))

      // Reset button
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      showNotification(`Welcome back, ${user.firstName}!`, "success")
      updateUIForLoggedInUser()
      document.getElementById("login-form").reset()
      showView("home")
    } else {
      // Reset button
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      showNotification("Invalid email or password. Please try again.", "error")
    }
  }, 1500)
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
  if (!currentUser) return

  // Update navigation
  const navActions = document.querySelector(".nav-actions")
  if (navActions) {
    navActions.innerHTML = `
      <div class="user-menu">
        <span class="user-greeting">Hi, ${currentUser.firstName}!</span>
        <button class="btn btn-outline" onclick="showUserProfile()">Profile</button>
        <button class="btn btn-primary" onclick="showView('create')">Start Project</button>
        <button class="btn btn-outline" onclick="logout()">Logout</button>
      </div>
    `
  }
}

// Logout function
function logout() {
  currentUser = null
  localStorage.removeItem("fundit_current_user")

  // Reset navigation
  const navActions = document.querySelector(".nav-actions")
  if (navActions) {
    navActions.innerHTML = `
      <button class="btn btn-outline" onclick="showView('login')">Login</button>
      <button class="btn btn-primary" onclick="showView('create')">Start Project</button>
    `
  }

  showNotification("You have been logged out successfully.", "info")
  showView("home")
}

// Social signup functions
function signUpWithGoogle() {
  showNotification("Google signup would be implemented with Google OAuth API", "info")
  // In a real app, this would integrate with Google OAuth
}

function signUpWithFacebook() {
  showNotification("Facebook signup would be implemented with Facebook Login API", "info")
  // In a real app, this would integrate with Facebook Login API
}

// Show terms and privacy (placeholder functions)
function showTerms() {
  showNotification("Terms of Service would open in a modal or new page", "info")
}

function showPrivacy() {
  showNotification("Privacy Policy would open in a modal or new page", "info")
}

// Show user profile (placeholder)
function showUserProfile() {
  showNotification("User profile page would be implemented here", "info")
}

// Check if user is logged in on page load
function checkUserSession() {
  if (currentUser) {
    updateUIForLoggedInUser()
  }
}

// Notification system
function showNotification(message, type = "info") {
  if (window.showNotification) {
    window.showNotification(message, type)
  } else {
    // Fallback for when enhanced animations aren't loaded
    console.log(`Notification: ${message} (${type})`)
    alert(message)
  }
}

// Initialize animations
function initializeAnimations() {
  // Add intersection observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated")
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  // Observe all elements with animate-on-scroll class
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el)
  })
}

// Handle scroll animations
function handleScrollAnimations() {
  const elements = document.querySelectorAll(".animate-on-scroll:not(.animated)")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animated")
    }
  })
}

// Initialize counters
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number[data-count]")

  const animateCounter = (counter) => {
    const target = Number.parseFloat(counter.getAttribute("data-count"))
    const increment = target / 100
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
      }
    }

    updateCounter()
  }

  // Intersection observer for counters
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
          entry.target.classList.add("counted")
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

// Close modals when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("active")
  }
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close any open modals
    document.querySelectorAll(".modal.active").forEach((modal) => {
      modal.classList.remove("active")
    })
  }
})

// Smooth scrolling for anchor links
document.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.getAttribute("href")?.startsWith("#")) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }
})

// Debug function to check if everything is working
function debugCheck() {
  console.log("=== DEBUG CHECK ===")
  console.log("Projects loaded:", projects.length)
  console.log("Featured projects container:", document.getElementById("featured-projects"))
  console.log("All projects container:", document.getElementById("all-projects"))
  console.log("Current projects:", projects)
  console.log("==================")
}

// Call debug check after a short delay
setTimeout(debugCheck, 2000)
