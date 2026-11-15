// ===== Contact form validation =====
const form = document.getElementById("contactForm");
const success = document.getElementById("success");

const rules = {
  name: (v) => (v === "" ? "Name cannot be empty." : ""),
  email: (v) => {
    if (v === "") return "Email cannot be empty.";
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return pattern.test(v) ? "" : "Enter a valid email, e.g. name@example.com.";
  },
  phone: (v) => {
    if (v === "") return "Phone number cannot be empty.";
    return /^\d+$/.test(v) ? "" : "Phone number must contain digits only (no spaces, + or dashes).";
  },
  message: (v) => (v === "" ? "Message cannot be empty." : ""),
};

function check(field) {
  const input = form.elements[field];
  const msg = rules[field](input.value.trim());
  const box = input.closest(".field");
  box.querySelector(".error").textContent = msg;
  box.classList.toggle("invalid", msg !== "");
  box.classList.toggle("valid", msg === "");
  return msg === "";
}

Object.keys(rules).forEach((f) => {
  form.elements[f].addEventListener("blur", () => check(f));
  form.elements[f].addEventListener("input", () => {
    if (form.elements[f].closest(".field").classList.contains("invalid")) check(f);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  success.classList.remove("show");
  const results = Object.keys(rules).map(check);   // run every check so all errors show
  if (results.every(Boolean)) {
    success.textContent = "Thanks, " + form.elements.name.value.trim() + "! Your message passed validation. (Demo form: nothing is sent to a server.)";
    success.classList.add("show");
    form.reset();
    form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid"));
  }
});
