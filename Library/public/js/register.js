document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('register-form');
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      let isValid = true;
      
      // Валидация на потребителското име
      if (username === '') {
        showError('username', 'Моля, въведете потребителско име');
        isValid = false;
      } else if (username.length < 3) {
        showError('username', 'Потребителското име трябва да е поне 3 символа');
        isValid = false;
      } else {
        removeError('username');
      }
      
      // Валидация на имейла
      if (email === '') {
        showError('email', 'Моля, въведете имейл адрес');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError('email', 'Моля, въведете валиден имейл адрес');
        isValid = false;
      } else {
        removeError('email');
      }
      
      // Валидация на паролата
      if (password === '') {
        showError('password', 'Моля, въведете парола');
        isValid = false;
      } else if (password.length < 6) {
        showError('password', 'Паролата трябва да е поне 6 символа');
        isValid = false;
      } else {
        removeError('password');
      }
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  }
  
  // Помощни функции
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    
    // Премахване на съществуващи съобщения за грешки
    removeError(inputId);
    
    input.classList.add('error-input');
    input.parentNode.appendChild(errorDiv);
  }
  
  function removeError(inputId) {
    const input = document.getElementById(inputId);
    const errorDiv = input.parentNode.querySelector('.input-error');
    
    if (errorDiv) {
      input.parentNode.removeChild(errorDiv);
      input.classList.remove('error-input');
    }
  }
}); 