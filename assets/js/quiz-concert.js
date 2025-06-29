document.addEventListener("DOMContentLoaded", function() {
  // Use data injected by Jekyll into the page
  if (typeof window.quizData === 'undefined') {
    console.error('Quiz data not found!');
    return;
  }
  const questions = window.quizData;
  let current = 0;
  let userAnswers = Array(questions.length).fill(null);

  function renderStep() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    const q = questions[current];
    container.innerHTML = `<div class='quiz-question'><h3>${current+1}. ${q.question}</h3>` +
      q.options.map((opt, j) =>
        `<label><input type='radio' name='q' value='${j}' ${userAnswers[current] === j ? 'checked' : ''}> ${opt}</label><br>`
      ).join('') + '</div>';
    let nav = '';
    if (current > 0) nav += `<button id='prev-q'>Назад</button> `;
    if (current < questions.length-1) nav += `<button id='next-q'>Далі</button>`;
    else nav += `<button class='submit' id='submit-quiz'>Перевірити результати</button>`;
    container.innerHTML += `<div class='quiz-nav'>${nav}</div>`;
    document.getElementById('quiz-result').innerHTML = '';

    document.querySelectorAll("input[name='q']").forEach(input => {
      input.addEventListener('change', function() {
        userAnswers[current] = parseInt(this.value);
      });
    });
    if (document.getElementById('prev-q')) {
      document.getElementById('prev-q').onclick = function() {
        current--;
        renderStep();
      };
    }
    if (document.getElementById('next-q')) {
      document.getElementById('next-q').onclick = function() {
        if (userAnswers[current] === null) {
          alert('Оберіть відповідь!');
          return;
        }
        current++;
        renderStep();
      };
    }
    if (document.getElementById('submit-quiz')) {
      document.getElementById('submit-quiz').onclick = function() {
        if (userAnswers[current] === null) {
          alert('Оберіть відповідь!');
          return;
        }
        showResult();
      };
    }
  }

  function showResult() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) correct++;
    });
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('quiz-result').innerHTML =
      `<h3>Результат: ${correct} з ${questions.length} правильних відповідей!</h3>`;
  }

  renderStep();
});
