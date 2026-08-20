// Ключевые слова из Технического Задания
const HIGH_KEYWORDS = ['education', 'scholarship', 'project', 'internship', 'turan university'];
const MEDIUM_KEYWORDS = ['extra', 'job alert', 'additional'];

// Начальные данные для наглядности
const initialEmails = [
  {
    sender: "Turan University Office",
    subject: "Information about Scholarship and Education",
    body: "Dear student, please check the updates regarding your Turan University Scholarship program.",
    time: "10:30"
  },
  {
    sender: "HR Career Center",
    subject: "New Extra Job Alert for students",
    body: "We have additional internship opportunities available this week.",
    time: "09:15"
  },
  {
    sender: "Online Store",
    subject: "Weekly Newsletter & Discounts",
    body: "Check out our best deals for this month with special promo codes.",
    time: "08:00"
  }
];

// Функция определения категории важности по ТЗ
function classifyImportance(subject, body) {
  const text = (subject + " " + body).toLowerCase();

  const isHigh = HIGH_KEYWORDS.some(kw => text.includes(kw));
  if (isHigh) {
    return {
      category: 'high',
      label: '1-я Важность (High) 🔴',
      badgeClass: 'badge-high'
    };
  }

  const isMedium = MEDIUM_KEYWORDS.some(kw => text.includes(kw));
  if (isMedium) {
    return {
      category: 'medium',
      label: '2-я Важность (Medium) 🟡',
      badgeClass: 'badge-medium'
    };
  }

  return {
    category: 'low',
    label: 'Наименее важное 🟢',
    badgeClass: 'badge-low'
  };
}

// Добавление письма в список
function renderEmail(emailData) {
  const container = document.getElementById('emailContainer');
  const classification = classifyImportance(emailData.subject, emailData.body);

  const card = document.createElement('div');
  card.className = `email-card ${classification.category}`;
  card.setAttribute('data-category', classification.category);

  card.innerHTML = `
    <div class="card-header">
      <span class="badge ${classification.badgeClass}">${classification.label}</span>
      <span class="email-time">${emailData.time}</span>
    </div>
    <div class="email-sender"><strong>${emailData.sender}</strong></div>
    <div class="email-subject">${emailData.subject}</div>
    <div class="email-body">${emailData.body}</div>
  `;

  container.prepend(card);
}

// Обработка симуляции входящего письма
function processIncomingEmail() {
  const sender = document.getElementById('sender').value || "Входящее сообщение";
  const subject = document.getElementById('subject').value || "Без темы";
  const body = document.getElementById('body').value || "Текст отсутствует";

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  renderEmail({ sender, subject, body, time });

  // Очистка полей
  document.getElementById('sender').value = '';
  document.getElementById('subject').value = '';
  document.getElementById('body').value = '';
}

// Фильтрация писем по вкладкам
function filterEmails(category) {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const cards = document.querySelectorAll('.email-card');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Инициализация загрузки первичных писем
window.onload = function() {
  initialEmails.forEach(email => renderEmail(email));
};
