/* AI / ML Learning Path — Day 01 interactions
   No frameworks or external JavaScript libraries are used. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Theme preference is kept for this browser session.
  const themeToggle = $("#themeToggle");
  const savedTheme = sessionStorage.getItem("aiml-theme");
  if (savedTheme === "light") document.body.classList.add("light-theme");
  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    sessionStorage.setItem("aiml-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
  });

  // Scroll position controls the active lesson link and reading progress.
  const sections = $$(".content-section");
  const navLinks = $$(".nav-link");
  const progressBar = $("#progressBar");
  const progressText = $("#progressText");
  const progressDetail = $("#progressDetail");
  const updateReadingProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0;
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${percent}%`;
    if (progressDetail) progressDetail.textContent = "Scroll through the lesson to track your reading";
    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 150) current = section;
    });
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current?.id}`));
    $("#backToTop")?.classList.toggle("visible", window.scrollY > 500);
  };
  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  updateReadingProgress();

  // Sidebar topic search filters navigation entries.
  $("#lessonSearch")?.addEventListener("input", event => {
    const term = event.target.value.trim().toLowerCase();
    navLinks.forEach(link => link.classList.toggle("search-hidden", !link.textContent.toLowerCase().includes(term)));
  });

  $("#backToTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Learning approach tabs.
  $$(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;
      $$(".tab-button").forEach(tab => {
        const active = tab === button;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      $$(".tab-panel").forEach(panel => {
        const active = panel.id === `tab-${target}`;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
    });
  });

  // House price playground: deliberately transparent illustrative formula.
  const sliders = {
    area: $("#areaInput"), beds: $("#bedInput"), age: $("#ageInput"), location: $("#locationInput")
  };
  const updateEstimate = () => {
    const area = Number(sliders.area.value);
    const beds = Number(sliders.beds.value);
    const age = Number(sliders.age.value);
    const location = Number(sliders.location.value);
    $("#areaValue").textContent = `${area.toLocaleString("en-IN")} sq ft`;
    $("#bedValue").textContent = `${beds} bedroom${beds > 1 ? "s" : ""}`;
    $("#ageValue").textContent = `${age} years`;
    $("#locationValue").textContent = `${location} / 10`;
    // Synthetic classroom formula only; not fitted to market data.
    const estimate = Math.max(18, (area * 0.035) + (beds * 3.2) + (location * 2.8) - (age * 0.45));
    $("#priceEstimate").textContent = `₹${estimate.toFixed(1)} lakh`;
    $("#priceExplanation").textContent = `Illustrative estimate · ${area.toLocaleString("en-IN")} sq ft · location score ${location}/10`;
  };
  Object.values(sliders).forEach(input => input?.addEventListener("input", updateEstimate));
  updateEstimate();

  // Classification vs regression mini-quiz.
  $$(".question-card").forEach(card => {
    const correct = card.dataset.answer;
    $$(".answer-options button", card).forEach(button => {
      button.addEventListener("click", () => {
        $$(".answer-options button", card).forEach(option => option.classList.remove("selected", "correct", "incorrect"));
        button.classList.add("selected");
        const feedback = $(".feedback", card);
        if (button.dataset.choice === correct) {
          button.classList.add("correct");
          feedback.textContent = "Correct — " + (correct === "classification" ? "the output is a category." : "the output is a numerical quantity.");
        } else {
          button.classList.add("incorrect");
          feedback.textContent = `Not quite. The correct answer is ${correct}.`;
        }
      });
    });
  });

  // End-of-lesson assessment.
  const answers = { q1: "b", q2: "c", q3: "a", q4: "c", q5: "b" };
  $("#submitQuiz")?.addEventListener("click", () => {
    let score = 0;
    let unanswered = 0;
    Object.entries(answers).forEach(([name, correct]) => {
      const selected = $(`input[name="${name}"]:checked`);
      const fieldset = $(`input[name="${name}"]`)?.closest("fieldset");
      const explanation = $(".quiz-explanation", fieldset);
      if (!selected) unanswered++;
      else if (selected.value === correct) score++;
      if (explanation) explanation.hidden = false;
      fieldset?.classList.toggle("quiz-correct", selected?.value === correct);
      fieldset?.classList.toggle("quiz-incorrect", Boolean(selected && selected.value !== correct));
    });
    const result = $("#quizResult");
    result.hidden = false;
    result.innerHTML = `<strong>${score} / 5</strong> ${score === 5 ? "Excellent work — you have a strong grasp of Day 1." : score >= 3 ? "Good effort. Review the explanations for the questions you missed." : "Keep learning. Revisit the modules and try again."}${unanswered ? ` <span>(${unanswered} unanswered)</span>` : ""}`;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  $("#resetQuiz")?.addEventListener("click", () => {
    $("#quiz")?.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    $$(".quiz-explanation").forEach(item => item.hidden = true);
    $$(".quiz-question").forEach(item => item.classList.remove("quiz-correct", "quiz-incorrect"));
    $("#quizResult").hidden = true;
  });
})();
