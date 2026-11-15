const dropdownItems = [...document.querySelectorAll("[data-dropdown]")];
const mobileMenu = document.querySelector("#navigation-shell");
const openMenuButton = document.querySelector("#mobile-menu-open");
const closeMenuButton = document.querySelector("#mobile-menu-close");
const mobileBackdrop = document.querySelector("#mobile-backdrop");

function setDropdownState(item, isOpen) {
  const trigger = item.querySelector(".dropdown-trigger");
  const menu = item.querySelector(".dropdown-menu");
  const arrow = trigger.querySelector(".dropdown-arrow");

  trigger.setAttribute("aria-expanded", String(isOpen));
  menu.hidden = !isOpen;
  arrow.src = isOpen
    ? "./images/icon-arrow-up.svg"
    : "./images/icon-arrow-down.svg";
}

function closeAllDropdowns(except = null) {
  dropdownItems.forEach((item) => {
    if (item !== except) {
      setDropdownState(item, false);
    }
  });
}

function openMobileMenu() {
  mobileMenu.classList.add("is-open");
  mobileBackdrop.hidden = false;
  openMenuButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
  closeAllDropdowns();
  closeMenuButton.focus();
}

function closeMobileMenu({ returnFocus = true } = {}) {
  mobileMenu.classList.remove("is-open");
  mobileBackdrop.hidden = true;
  openMenuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  closeAllDropdowns();

  if (returnFocus) {
    openMenuButton.focus();
  }
}

dropdownItems.forEach((item) => {
  const trigger = item.querySelector(".dropdown-trigger");

  trigger.addEventListener("click", () => {
    const willOpen = trigger.getAttribute("aria-expanded") !== "true";

    closeAllDropdowns(item);
    setDropdownState(item, willOpen);
  });
});

openMenuButton.addEventListener("click", openMobileMenu);
closeMenuButton.addEventListener("click", () => closeMobileMenu());
mobileBackdrop.addEventListener("click", () => closeMobileMenu());

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      closeMobileMenu({ returnFocus: false });
    }
  });
});

document.addEventListener("click", (event) => {
  const target = event.target;
  const clickedInsideDropdown =
    target instanceof Element && target.closest("[data-dropdown]");

  if (!clickedInsideDropdown) {
    closeAllDropdowns();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  closeAllDropdowns();

  if (mobileMenu.classList.contains("is-open")) {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && mobileMenu.classList.contains("is-open")) {
    closeMobileMenu({ returnFocus: false });
  }
});
