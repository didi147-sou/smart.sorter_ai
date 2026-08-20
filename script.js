document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const statusDiv = document.getElementById('status');

  const priority = document.getElementById('priority').value;
  const userSubject = document.getElementById('subject').value;
  const userBody = document.getElementById('body').value;

  // Формируем письмо сметкой важности
  const payload = {
    to: document.getElementById('to').value,
    subject: `[${priority}] ${userSubject}`,
    body: `Категория важности: ${priority}\n\nТекст сообщения:\n${userBody}`
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Анализ и отправка...';
  statusDiv.textContent = '';
  statusDiv.className = 'status-message';

  try {
    const response = await fetch(CONFIG.GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === 'success') {
      statusDiv.textContent = 'Успешно классифицировано и отправлено!';
      statusDiv.classList.add('status-success');
      document.getElementById('contactForm').reset();
    } else {
      throw new Error(result.message || 'Ошибка обработки');
    }

  } catch (error) {
    statusDiv.textContent = 'Ошибка: ' + error.message;
    statusDiv.classList.add('status-error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить и Сортировать';
  }
});
