document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const statusDiv = document.getElementById('status');

  const payload = {
    to: document.getElementById('to').value,
    subject: document.getElementById('subject').value,
    body: document.getElementById('body').value
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';
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
      statusDiv.textContent = 'Письмо успешно отправлено!';
      statusDiv.classList.add('status-success');
      document.getElementById('contactForm').reset();
    } else {
      throw new Error(result.message || 'Ошибка при отправке');
    }

  } catch (error) {
    statusDiv.textContent = 'Ошибка: ' + error.message;
    statusDiv.classList.add('status-error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
  }
});