// Алгоритм автоматического определения важности
function classifyEmail(subject, body) {
  const text = (subject + " " + body).toLowerCase();
  
  const urgentKeywords = ['срочно', 'ошибка', 'угроза', 'падение', 'пароль', 'сбой', 'важно', 'диплом', 'дедлайн', 'urgent', 'error', 'critical', 'asap'];
  const lowKeywords = ['рассылка', 'скидка', 'акция', 'новость', 'спам', 'promo', 'news', 'off', 'бесплатно'];

  let hasUrgent = urgentKeywords.some(word => text.includes(word));
  let hasLow = lowKeywords.some(word => text.includes(word));

  if (hasUrgent) {
    return { priority: 'Срочно 🔴', level: 'high' };
  } else if (hasLow) {
    return { priority: 'Низкая важность 🟢', level: 'low' };
  } else {
    return { priority: 'Средняя важность 🟡', level: 'medium' };
  }
}

document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const statusDiv = document.getElementById('status');

  const to = document.getElementById('to').value;
  const userSubject = document.getElementById('subject').value;
  const userBody = document.getElementById('body').value;

  // 1. Автоматический анализ текста через ИИ-алгоритм
  const aiResult = classifyEmail(userSubject, userBody);

  const payload = {
    to: to,
    subject: `[${aiResult.priority}] ${userSubject}`,
    body: `Автоматический приоритет: ${aiResult.priority}\n\nТекст сообщения:\n${userBody}`
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
      statusDiv.textContent = `Письмо проанализировано как [${aiResult.priority}] и отправлено!`;
      statusDiv.classList.add('status-success');
      
      // Добавляем письмо в интерактивный список
      addEmailToList(to, userSubject, userBody, aiResult);
      document.getElementById('contactForm').reset();
    } else {
      throw new Error(result.message || 'Ошибка отправки');
    }

  } catch (error) {
    statusDiv.textContent = 'Ошибка: ' + error.message;
    statusDiv.classList.add('status-error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Анализировать и отправить';
  }
});

function addEmailToList(to, subject, body, aiResult) {
  const emailList = document.getElementById('emailList');
  
  // Удаляем плашку "Пусто"
  const emptyText = emailList.querySelector('.empty-text');
  if (emptyText) emptyText.remove();

  const emailCard = document.createElement('div');
  emailCard.className = `email-item ${aiResult.level}`;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  emailCard.innerHTML = `
    <div class="email-header">
      <span class="badge ${aiResult.level}">${aiResult.priority}</span>
      <span class="email-time">${time}</span>
    </div>
    <div class="email-to">Кому: ${to}</div>
    <div class="email-subject"><strong>${subject}</strong></div>
    <div class="email-body">${body}</div>
  `;

  emailList.prepend(emailCard);
}
