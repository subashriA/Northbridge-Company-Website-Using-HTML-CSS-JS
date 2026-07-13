/* =========================================================
   NORTHBRIDGE CONSULTING — SCRIPT.JS
   1. Mobile navigation toggle
   2. Active navigation link highlighting
   3. Contact form validation + success message
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. MOBILE NAVIGATION TOGGLE ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the mobile menu whenever a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 2. ACTIVE NAVIGATION LINK HIGHLIGHTING ---------- */
  // Works by comparing the current page filename against each link's href.
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const linkPage = link.getAttribute('href');
    if (
      linkPage === currentPage ||
      (currentPage === '' && linkPage === 'index.html')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ---------- 3. CONTACT FORM VALIDATION ---------- */
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return; // Only run this section on the Contact page

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullName-error'),
      validate: function (value) {
        if (value.trim().length === 0) return 'Full name is required.';
        if (value.trim().length < 2) return 'Please enter your full name.';
        return '';
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: function (value) {
        if (value.trim().length === 0) return 'Email address is required.';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    phone: {
      input: document.getElementById('phone'),
      error: document.getElementById('phone-error'),
      validate: function (value) {
        if (value.trim().length === 0) return 'Phone number is required.';
        // Accepts digits, spaces, dashes, parentheses, and an optional leading +
        const phonePattern = /^\+?[0-9\s\-().]{7,20}$/;
        if (!phonePattern.test(value.trim())) return 'Please enter a valid phone number.';
        return '';
      }
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: function (value) {
        if (value.trim().length === 0) return 'Please tell us a little about your project.';
        if (value.trim().length < 10) return 'Message should be at least 10 characters.';
        return '';
      }
    }
  };

  function showFieldError(field, message) {
    field.input.classList.add('input-error');
    field.error.textContent = message;
    field.error.classList.add('visible');
  }

  function clearFieldError(field) {
    field.input.classList.remove('input-error');
    field.error.textContent = '';
    field.error.classList.remove('visible');
  }

  function validateField(key) {
    const field = fields[key];
    const message = field.validate(field.input.value);
    if (message) {
      showFieldError(field, message);
      return false;
    }
    clearFieldError(field);
    return true;
  }

  // Live validation as the user leaves each field
  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener('blur', function () {
      validateField(key);
    });
    fields[key].input.addEventListener('input', function () {
      // Clear the error as soon as the user starts correcting it
      if (fields[key].input.classList.contains('input-error')) {
        validateField(key);
      }
    });
  });

  const successMessage = document.getElementById('form-success');

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let isFormValid = true;
    Object.keys(fields).forEach(function (key) {
      const valid = validateField(key);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) {
      successMessage.classList.remove('visible');
      // Move focus to the first invalid field for accessibility
      const firstInvalidKey = Object.keys(fields).find(function (key) {
        return fields[key].input.classList.contains('input-error');
      });
      if (firstInvalidKey) fields[firstInvalidKey].input.focus();
      return;
    }

    // Simulate a successful submission (no backend is connected)
    successMessage.textContent = '✓ Thank you! Your message has been sent. Our team will get back to you within one business day.';
    successMessage.classList.add('visible');
    contactForm.reset();

    // Clear any lingering error styles after reset
    Object.keys(fields).forEach(function (key) {
      clearFieldError(fields[key]);
    });

    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

});
