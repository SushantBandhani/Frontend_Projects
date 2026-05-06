const root = document.getElementById("root");

let currentFilter = "all";
let currentSort = "reset";

const tasks_steps = [
  {
    step_number: 5,
    title: "Delivery",
    description: "Track your delivery status",
    status: "pending",
    completed_at: null,
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80&auto=format",
  },
  {
    step_number: 1,
    title: "Cart",
    description: "Review your selected items",
    status: "completed",
    completed_at: "2024-01-15 10:30 AM",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80&auto=format",
  },
  {
    step_number: 4,
    title: "Review",
    description: "Confirm your order details",
    status: "pending",
    completed_at: null,
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&q=80&auto=format",
  },
  {
    step_number: 2,
    title: "Address",
    description: "Enter your delivery address",
    status: "completed",
    completed_at: "2024-01-15 10:45 AM",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&q=80&auto=format",
  },
  {
    step_number: 3,
    title: "Payment",
    description: "Choose your payment method",
    status: "pending",
    completed_at: null,
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=500&q=80&auto=format",
  },
];

/* =========================
   ROOT CONTAINERS
========================= */

const navbar = createNavbar();
const container = createContainer();

root.appendChild(navbar);
root.appendChild(container);

/* =========================
   NAVBAR
========================= */

function createNavbar() {
  const navbar = document.createElement("nav");
  navbar.classList.add("navbar");

  const navbarLogo = createNavbarLogo();
  const navbarControls = createNavbarControls();

  navbar.appendChild(navbarLogo);
  navbar.appendChild(navbarControls);

  return navbar;
}

function createNavbarLogo() {
  const navbarLogo = document.createElement("div");
  navbarLogo.classList.add("navbar-logo");

  const icon = document.createElement("i");
  icon.classList.add("ti", "ti-checks");
  icon.textContent = "✔️✔️";

  const logoText = document.createElement("span");
  logoText.textContent = "StepTracker";

  navbarLogo.appendChild(icon);
  navbarLogo.appendChild(logoText);

  return navbarLogo;
}

function createNavbarControls() {
  const navbarControls = document.createElement("div");
  navbarControls.classList.add("navbar-controls");

  const sortSelect = createSortSelect();
  const filterSelect = createFilterSelect();
  const resetButton = createResetButton();

  navbarControls.appendChild(sortSelect);
  navbarControls.appendChild(filterSelect);
  navbarControls.appendChild(resetButton);

  return navbarControls;
}

function createSortSelect() {
  const sortSelect = document.createElement("select");

  sortSelect.classList.add("navbar-select");
  sortSelect.id = "sort";

  sortSelect.onchange = function () {
    sortTasks(this.value);
  };

  const sortOptions = [
    { value: "", text: "Sort by", hidden: true },
    { value: "asc", text: "Step: Low to High" },
    { value: "desc", text: "Step: High to Low" },
  ];

  sortOptions.forEach((optionData) => {
    const option = createOption(optionData);
    sortSelect.appendChild(option);
  });

  return sortSelect;
}

function createFilterSelect() {
  const filterSelect = document.createElement("select");

  filterSelect.classList.add("navbar-select");
  filterSelect.id = "filter";

  filterSelect.onchange = function () {
    filterTasks(this.value);
  };

  const filterOptions = [
    { value: "", text: "Filter by", hidden: true },
    { value: "all", text: "All" },
    { value: "completed", text: "Completed" },
    { value: "pending", text: "Pending" },
  ];

  filterOptions.forEach((optionData) => {
    const option = createOption(optionData);
    filterSelect.appendChild(option);
  });

  return filterSelect;
}

function createOption(optionData) {
  const option = document.createElement("option");

  option.value = optionData.value;
  option.textContent = optionData.text;

  if (optionData.hidden) {
    option.hidden = true;
  }

  return option;
}

function createResetButton() {
  const resetButton = document.createElement("button");

  resetButton.classList.add("navbar-button");
  resetButton.textContent = "Reset Filter";

  resetButton.onclick = resetFilter;

  return resetButton;
}

/* =========================
   CONTAINER
========================= */

function createContainer() {
  const container = document.createElement("div");
  container.classList.add("container");

  return container;
}

/* =========================
   TASK RENDERING
========================= */

function renderTasks(tasks) {
  container.innerHTML = "";

  tasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    container.appendChild(taskCard);
  });
}

function createTaskCard(task) {
  const taskCard = document.createElement("div");

  taskCard.classList.add("task", task.status);

  const image = createTaskImage(task);
  const taskHeader = createTaskHeader(task);
  const content = createTaskContent(task);

  taskCard.appendChild(image);
  taskCard.appendChild(taskHeader);
  taskCard.appendChild(content);

  return taskCard;
}

function createTaskImage(task) {
  const image = document.createElement("img");

  image.src = task.image;
  image.alt = task.title;

  image.classList.add("task-image");

  return image;
}

function createTaskHeader(task) {
  const taskHeader = document.createElement("div");

  taskHeader.classList.add("task-header");

  const circle = createStatusCircle(task);
  const stepNumber = createStepNumber(task);

  taskHeader.appendChild(circle);
  taskHeader.appendChild(stepNumber);

  return taskHeader;
}

function createStatusCircle(task) {
  const circle = document.createElement("span");

  circle.classList.add("circle");

  circle.style.backgroundColor =
    task.status === "completed"
      ? "#28a745"
      : "#6c757d";

  return circle;
}

function createStepNumber(task) {
  const stepNumber = document.createElement("span");

  stepNumber.classList.add("step-number");

  stepNumber.textContent =
    `Step ${task.step_number}`;

  return stepNumber;
}

function createTaskContent(task) {
  const content = document.createElement("div");

  const title = document.createElement("h2");
  title.textContent = task.title;

  const description = document.createElement("p");
  description.textContent = task.description;

  const status = document.createElement("p");
  status.textContent = `Status: ${task.status}`;

  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(status);

  return content;
}

/* =========================
   FILTER / SORT LOGIC
========================= */

function updateTasks() {
  let updatedTasks = [...tasks_steps];

  // FILTER
  if (currentFilter !== "all") {
    updatedTasks = updatedTasks.filter(
      (task) => task.status === currentFilter
    );
  }

  // SORT
  if (currentSort === "asc") {
    updatedTasks.sort(
      (a, b) => a.step_number - b.step_number
    );
  }

  if (currentSort === "desc") {
    updatedTasks.sort(
      (a, b) => b.step_number - a.step_number
    );
  }

  renderTasks(updatedTasks);
}

function sortTasks(order) {
  currentSort = order;
  updateTasks();
}

function filterTasks(status) {
  currentFilter = status;
  updateTasks();
}

function resetFilter() {
  currentFilter = "all";
  currentSort = "reset";

  updateTasks();
}

/* =========================
   INITIAL RENDER
========================= */

renderTasks(tasks_steps);