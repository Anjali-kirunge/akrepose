// Shared theme management for all pages
function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}
function initializeTheme() {
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('theme') || 'dark';
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem('theme', newTheme);
  } catch (e) {}
  updateThemeIcon(newTheme);
}
function initializeThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}
window.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeThemeToggle();
});
window.addEventListener('storage', () => {
  let theme = 'dark';
  try {
    theme = localStorage.getItem('theme') || 'dark';
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
});
