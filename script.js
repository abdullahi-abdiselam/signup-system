const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const message = document.getElementById('message');
const dashboard = document.getElementById('dashboard');
const welcomeText = document.getElementById('welcomeText');

function showMessage(text, type = 'error') {
  message.textContent = text;
  message.className = `message ${type}`;
}
function switchView(view) {
  const isLogin = view === 'login';
  loginForm.classList.toggle('hidden', !isLogin);
  signupForm.classList.toggle('hidden', isLogin);
  loginTab.classList.toggle('active', isLogin);
  signupTab.classList.toggle('active', !isLogin);
  dashboard.classList.add('hidden');
  showMessage('');
}
function getUsers() {
  try { return JSON.parse(localStorage.getItem('demoUsers') || '[]'); }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem('demoUsers', JSON.stringify(users));
}

loginTab.addEventListener('click', () => switchView('login'));
signupTab.addEventListener('click', () => switchView('signup'));

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!name || !email || !password || !confirmPassword) return showMessage('Please complete every field.');
  if (password.length < 8) return showMessage('Password must be at least 8 characters.');
  if (password !== confirmPassword) return showMessage('Passwords do not match.');

  const users = getUsers();
  if (users.some(user => user.email === email)) return showMessage('An account with this email already exists.');
  users.push({ name, email, password });
  saveUsers(users);
  signupForm.reset();
  showMessage('Account created! You can now log in.', 'success');
  switchView('login');
  document.getElementById('loginEmail').value = email;
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const user = getUsers().find(item => item.email === email && item.password === password);
  if (!user) return showMessage('Invalid email or password.');
  loginForm.classList.add('hidden');
  signupForm.classList.add('hidden');
  document.querySelector('.tabs').classList.add('hidden');
  welcomeText.textContent = `Welcome, ${user.name}!`;
  dashboard.classList.remove('hidden');
  showMessage('Login successful.', 'success');
  loginForm.reset();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  dashboard.classList.add('hidden');
  document.querySelector('.tabs').classList.remove('hidden');
  switchView('login');
  showMessage('You have logged out.', 'success');
});
