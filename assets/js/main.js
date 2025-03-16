
(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });
  // Sample Job Listings
const jobs = [
    { title: "Digital Marketing Manager", description: "Manage digital campaigns and SEO strategies." },
    { title: "Graphic Designer", description: "Create engaging visuals and branding materials." },
    { title: "Video Editor", description: "Edit and enhance videos for media production." }
];

// Function to Load Jobs
function loadJobs() {
    const jobList = document.getElementById("job-list");
    jobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");
        jobCard.innerHTML = `
            <h4>${job.title}</h4>
            <p>${job.description}</p>
            <a href="apply.html" class="apply-btn">Apply Now</a>
        `;
        jobList.appendChild(jobCard);
    });
}

// Load jobs when page loads
document.addEventListener("DOMContentLoaded", loadJobs);

// Handle General Application Form Submission
document.querySelector("#generalApplicationForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Application submitted successfully!");
    document.querySelector("#generalApplicationForm").reset();
});


// Fetch job listings from backend
async function loadJobs() {
  const jobList = document.getElementById("job-list");
  jobList.innerHTML = "";

  const response = await fetch("http://localhost:4000/jobs");
  const jobs = await response.json();

  jobs.forEach(job => {
      const jobCard = document.createElement("div");
      jobCard.classList.add("job-card");
      jobCard.innerHTML = `
          <h4>${job.title}</h4>
          <p>${job.description}</p>
          <a href="#" class="apply-btn" onclick="applyJob('${job._id}')">Apply Now</a>
      `;
      jobList.appendChild(jobCard);
  });
}
// Function to Load Jobs from Backend
async function loadJobs() {
  const jobList = document.getElementById("job-list");
  jobList.innerHTML = "";

  const response = await fetch("http://localhost:4000/jobs");
  const jobs = await response.json();

  jobs.forEach(job => {
      const jobCard = document.createElement("div");
      jobCard.classList.add("job-card");
      jobCard.innerHTML = `
          <h4>${job.title}</h4>
          <p>${job.description}</p>
          <a href="#" class="apply-btn" onclick="applyJob('${job._id}')">Apply Now</a>
      `;
      jobList.appendChild(jobCard);
  });
}

// Function to Post a New Job (Admin Only)
document.querySelector("#jobPostForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const jobData = {
      title: document.querySelector("#jobTitle").value,
      description: document.querySelector("#jobDescription").value
  };

  const response = await fetch("http://localhost:4000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData)
  });

  const result = await response.json();
  alert(result.message);
  document.querySelector("#jobPostForm").reset();
  loadJobs(); // Refresh job listings
});

// Function to Show Admin Panel if Logged in as Admin
function checkAdmin() {
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("Checking Admin Role:", user);  // Debugging line

  if (user && user.role === "admin") {
      document.getElementById("admin-panel").style.display = "block";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
      contactForm.addEventListener("submit", async function (e) {
          e.preventDefault(); // Prevents page reload

          const formData = {
              name: document.getElementById("name").value.trim(),
              email: document.getElementById("email").value.trim(),
              phone: document.getElementById("phone").value.trim(),
              message: document.getElementById("message").value.trim()
          };

          try {
              const response = await fetch("http://localhost:4000/contact", {
                  method: "POST",
                  headers: { 
                      "Content-Type": "application/json"  // ✅ Ensures JSON format
                  },
                  body: JSON.stringify(formData) // ✅ Converts form data to JSON
              });

              const result = await response.json();
              if (response.ok) {
                  alert(result.message); // Show success message
                  contactForm.reset(); // Clear form
              } else {
                  alert("Error: " + result.message); // Show backend error
              }
          } catch (error) {
              alert("Something went wrong! Please try again.");
          }
      });
  } else {
      console.error("❌ Contact form not found in index.html");
  }
});


// Load Jobs and Check Admin on Page Load
document.addEventListener("DOMContentLoaded", () => {
  loadJobs();
  checkAdmin();
});

// Apply for a specific job
async function applyJob(jobId) {
  const name = prompt("Enter your name:");
  const email = prompt("Enter your email:");
  const resumeFile = document.createElement("input");
  resumeFile.type = "file";

  resumeFile.addEventListener("change", async function () {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("resume", resumeFile.files[0]);

      const response = await fetch(`http://localhost:4000/apply/${jobId}`, {
          method: "POST",
          body: formData
      });

      const result = await response.json();
      alert(result.message);
  });

  resumeFile.click();
}

// Handle General Application Form
document.querySelector("#generalApplicationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", document.querySelector("#name").value);
  formData.append("email", document.querySelector("#email").value);
  formData.append("resume", document.querySelector("#resume").files[0]);

  const response = await fetch("http://localhost:4000/apply", {
      method: "POST",
      body: formData
  });

  const result = await response.json();
  alert(result.message);
  document.querySelector("#generalApplicationForm").reset();
});

// Load jobs when the page loads
document.addEventListener("DOMContentLoaded", loadJobs);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

})();