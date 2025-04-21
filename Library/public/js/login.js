document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      let isValid = true;
      
      // Проста валидация на полетата
      if (username === '') {
        showError('username', 'Моля, въведете потребителско име');
        isValid = false;
      } else {
        removeError('username');
      }
      
      if (password === '') {
        showError('password', 'Моля, въведете парола');
        isValid = false;
      } else {
        removeError('password');
      }
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  }
  
  // Помощни функции за показване на грешки
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