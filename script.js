/* =========================
   مرحله سوم
   حافظه
========================= */

function startStage3() {

  clearAllTimers();

  currentStage = 3;
  matchedPairs = 0;

  firstCard = null;
  secondCard = null;
  lockCards = false;

  levelEl.textContent = "3";

  stageTitle.textContent = "مرحله ۳: حافظه ورزشی 🧠";
  message.textContent = "جفت شکل‌های مشابه را پیدا کن!";

  showScreen(gameScreen);

  const symbols = [
    "⚽", "⚽",
    "🏀", "🏀",
    "🏐", "🏐",
    "🏃", "🏃"
  ];

  // به‌هم ریختن کارت‌ها
  symbols.sort(() => Math.random() - 0.5);

  gameArea.innerHTML = `
    <div class="memory-grid">

      ${symbols.map((symbol, index) => `
        <button
          class="memory-card"
          type="button"
          data-symbol="${symbol}"
          data-index="${index}"
        >
          ❓
        </button>
      `).join("")}

    </div>
  `;

  document.querySelectorAll(".memory-card").forEach(card => {

    card.addEventListener("click", () => {
      flipCard(card);
    });

  });
}


function flipCard(card) {

  // جلوگیری از انتخاب کارت‌های غیرمجاز
  if (
    lockCards ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  // نمایش شکل کارت
  card.classList.add("flipped");
  card.textContent = card.dataset.symbol;

  // انتخاب کارت اول
  if (!firstCard) {

    firstCard = card;

    return;
  }

  // انتخاب کارت دوم
  secondCard = card;

  // تا مشخص شدن نتیجه، کارت‌ها قفل شوند
  lockCards = true;

  const firstSymbol = firstCard.dataset.symbol;
  const secondSymbol = secondCard.dataset.symbol;

  // =========================
  // اگر مشابه باشند
  // =========================

  if (firstSymbol === secondSymbol) {

    successSound();

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;

    updateScore(30);

    message.textContent =
      "آفرین! جفت مشابه را پیدا کردی! 🎯";

    resetCards();

    // پیدا شدن تمام جفت‌ها
    if (matchedPairs === 4) {

      showStars();

      message.textContent =
        "عالی بود! حافظه‌ات فوق‌العاده است! 🎉";

      setTimeout(startStage4, 1000);
    }

  } 
  
  // =========================
  // اگر مشابه نباشند
  // =========================

  else {

    errorSound();

    message.textContent =
      "این دو شکل مشابه نیستند! دوباره تلاش کن 💪";

    setTimeout(() => {

      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      // برگرداندن کارت‌ها به حالت ❓
      firstCard.textContent = "❓";
      secondCard.textContent = "❓";

      resetCards();

    }, 900);
  }
}


function resetCards() {

  firstCard = null;
  secondCard = null;
  lockCards = false;
}
