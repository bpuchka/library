document.addEventListener('DOMContentLoaded', function() {
  const bookForm = document.getElementById('create-book-form');
  
  if (bookForm) {
    bookForm.addEventListener('submit', function(e) {
      const title = document.getElementById('title').value.trim();
      const author = document.getElementById('author').value.trim();
      const genre = document.getElementById('genre').value.trim();
      let isValid = true;
      
      // Валидация на заглавието
      if (title === '') {
        showError('title', 'Моля, въведете заглавие');
        isValid = false;
      } else {
        removeError('title');
      }
      
      // Валидация на автора
      if (author === '') {
        showError('author', 'Моля, въведете автор');
        isValid = false;
      } else {
        removeError('author');
      }
      
      // Валидация на жанра
      if (genre === '') {
        showError('genre', 'Моля, въведете жанр');
        isValid = false;
      } else {
        removeError('genre');
      }
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  }
  
  // Помощни функции
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