const introText = document.getElementById("introText");
const aboutText = document.getElementById("aboutText");
const toolsList = document.getElementById("toolsList");
const projectsGrid = document.getElementById("projectsGrid");
const expValue = document.getElementById("expValue");
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const cursorGlow = document.querySelector(".cursor-glow");

const animateReveal = () => {
  const elements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
};

const fetchJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return response.json();
};

const renderProfile = (profile) => {
  introText.textContent = profile.intro;
  aboutText.textContent = `${profile.tagline} ${profile.education}.`;
  expValue.textContent = `${profile.experienceYears}+`;

  toolsList.innerHTML = "";
  profile.tools.forEach((tool) => {
    const li = document.createElement("li");
    li.textContent = tool;
    toolsList.appendChild(li);
  });
};

const renderProjects = (projects) => {
  projectsGrid.innerHTML = "";

  projects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card lift-card";
    card.style.transitionDelay = `${index * 70}ms`;

    const stackTags = project.stack
      .map((item) => `<span>${item}</span>`)
      .join("");

    card.innerHTML = `
      <p class="category">${project.category}</p>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="stack">${stackTags}</div>
    `;

    projectsGrid.appendChild(card);
  });
};

const bindForm = () => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "";
    formStatus.textContent = "Sending...";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      form.reset();
      formStatus.classList.add("success");
      formStatus.textContent = data.message;
    } catch (error) {
      formStatus.classList.add("error");
      formStatus.textContent = error.message || "Something went wrong.";
    }
  });
};

const initCursorGlow = () => {
  window.addEventListener("mousemove", (event) => {
    if (!cursorGlow) {
      return;
    }

    cursorGlow.animate(
      {
        transform: `translate(${event.clientX - 110}px, ${event.clientY - 110}px)`,
      },
      {
        duration: 260,
        fill: "forwards",
      }
    );
  });
};

const init = async () => {
  animateReveal();
  bindForm();
  initCursorGlow();

  try {
    const [profile, projects] = await Promise.all([
      fetchJSON("/api/profile"),
      fetchJSON("/api/projects"),
    ]);

    renderProfile(profile);
    renderProjects(projects);
  } catch (error) {
    introText.textContent =
      "Unable to load profile details right now. Please refresh after a moment.";
  }
};

init();