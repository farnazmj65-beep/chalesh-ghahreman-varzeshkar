let score = 0;
let currentStage = 0;

let soundOn = true;
let audioContext = null;

let reactionTimer = null;
let reactionTime = 30;

let questionIndex = 0;

let firstCard = null;
let secondCard = null;
let lockCards = false;
let matchedPairs = 0;

let balanceTimer = null;
let balancePosition = 0;
let balanceTime = 20;


/* =========================
   اتصال به HTML
========================= */

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");
const soundBtn = document.getElementById("soundBtn");

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");

const stageTitle = document.getElementById("stageTitle");
const message = document.getElementById("message");
const gameArea = document.getElementById("gameArea");

const finalTitle = document.getElementById("finalTitle");
const finalMessage = document.getElementById("finalMessage");
const finalScore = document.getElementById("finalScore");


/* =========================
   صدا
========================= */

function initAudio() {

  if (!audioContext) {

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }

  if (
    audioContext &&
    audioContext.state === "suspended"
  ) {
    audioContext.resume();
  }
}


function playTone(
  frequency,
  duration,
  type = "sine",
  volume = 0.12
) {

  if (!soundOn) return;

  initAudio();

  if (!audioContext) return;

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(
    volume,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + duration
  );
}


function successSound() {

  playTone(523, 0.12);

  setTimeout(() => {
    playTone(659, 0.12);
  }, 100);

  setTimeout(() => {
    playTone(784, 0.18);
  }, 200);
}


function errorSound() {

  playTone(
    330,
    0.18,
    "sawtooth",
    0.14
  );

  setTimeout(() => {

    playTone(
      220,
      0.25,
      "sawtooth",
      0.12
    );

  }, 160);
}


function celebrationSound() {

  playTone(523, 0.12);

  setTimeout(() => {
    playTone(659, 0.12);
  }, 100);

  setTimeout(() => {
    playTone(784, 0.12);
  }, 200);

  setTimeout(() => {
    playTone(1046, 0.3);
  }, 300);
}


/* =========================
   ابزارهای بازی
========================= */

function showScreen(screen) {

  startScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  endScreen.classList.remove("active");

  screen.classList.add("active");
}


function updateScore(points) {

  score += points;

  scoreEl.textContent = score;
}


function showStars() {

  const particles =
    document.getElementById("particles");

  if (!particles) return;

  for (let i = 0; i < 10; i++) {

    const star =
      document.createElement("div");

    star.textContent = "⭐";

    star.style.position = "fixed";
    star.style.left =
      Math.random() * 100 + "%";

    star.style.top = "70%";
    star.style.fontSize = "25px";
    star.style.pointerEvents = "none";

    star.style.animation =
      "starFly 1s ease-out forwards";

    particles.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 1000);
  }
}


function clearAllTimers() {

  if (reactionTimer) {

    clearInterval(reactionTimer);

    reactionTimer = null;
  }

  if (balanceTimer) {

    clearInterval(balanceTimer);

    balanceTimer = null;
  }

  document.onkeydown = null;
}


/* =========================
   شروع بازی
========================= */

startBtn.addEventListener("click", () => {

  initAudio();

  score = 0;
  currentStage = 1;

  scoreEl.textContent = "0";
  levelEl.textContent = "1";

  startStage1();
});


restartBtn.addEventListener("click", () => {

  initAudio();

  score = 0;
  currentStage = 1;

  scoreEl.textContent = "0";
  levelEl.textContent = "1";

  startStage1();
});


homeBtn.addEventListener("click", () => {

  clearAllTimers();

  score = 0;
  currentStage = 0;

  scoreEl.textContent = "0";
  levelEl.textContent = "1";

  showScreen(startScreen);
});


soundBtn.addEventListener("click", () => {

  soundOn = !soundOn;

  soundBtn.textContent =
    soundOn ? "🔊" : "🔇";

  if (soundOn) {

    initAudio();

    playTone(659, 0.12);
  }
});


/* =========================
   مرحله اول
   واکنش سریع
========================= */

function startStage1() {

  clearAllTimers();

  currentStage = 1;

  levelEl.textContent = "1";

  stageTitle.textContent =
    "مرحله ۱: واکنش سریع ⚡";

  message.textContent =
    "ستاره را هرچه سریع‌تر پیدا و لمس کن!";

  showScreen(gameScreen);

  gameArea.innerHTML = `

    <div
      class="reaction-area"
      id="reactionArea"
    >

      <button
        class="target"
        id="target"
        type="button"
        aria-label="ستاره"
      >
        ⭐
      </button>

    </div>

    <div
      class="question-box"
      style="margin-top:15px;"
    >

      زمان باقی‌مانده:

      <strong id="reactionTime">
        30
      </strong>

      ثانیه

    </div>

  `;

  reactionTime = 30;

  const timeEl =
    document.getElementById("reactionTime");

  createTarget();

  const target =
    document.getElementById("target");

  target.addEventListener(
    "click",
    () => {

      updateScore(10);

      successSound();

      showStars();

      message.textContent =
        "آفرین! ⭐ سریع بودی!";

      createTarget();
    }
  );

  reactionTimer = setInterval(() => {

    reactionTime--;

    timeEl.textContent =
      reactionTime;

    if (reactionTime <= 0) {

      clearInterval(reactionTimer);

      reactionTimer = null;

      message.textContent =
        "عالی بود! بریم مرحله بعد 🚀";

      setTimeout(
        startStage2,
        1000
      );
    }

  }, 1000);
}


function createTarget() {

  const area =
    document.getElementById("reactionArea");

  const target =
    document.getElementById("target");

  if (!area || !target) return;

  const maxX =
    Math.max(
      0,
      area.clientWidth -
      target.offsetWidth
    );

  const maxY =
    Math.max(
      0,
      area.clientHeight -
      target.offsetHeight
    );

  target.style.left =
    Math.random() * maxX + "px";

  target.style.top =
    Math.random() * maxY + "px";
}


/* =========================
   مرحله دوم
   سوالات ورزشی
========================= */

const questions = [

  {
    question:
      "کدام ورزش با توپ انجام می‌شود؟",

    answers: [
      "فوتبال",
      "شنا",
      "ژیمناستیک"
    ],

    correct: 0
  },

  {
    question:
      "برای طناب‌زنی به چه وسیله‌ای نیاز داریم؟",

    answers: [
      "طناب",
      "راکت",
      "تور"
    ],

    correct: 0
  },

  {
    question:
      "کدام مورد به آمادگی جسمانی کمک می‌کند؟",

    answers: [
      "ورزش منظم",
      "بی‌تحرکی",
      "خواب خیلی کم"
    ],

    correct: 0
  },

  {
    question:
      "در فوتبال معمولاً چند تیم مقابل هم بازی می‌کنند؟",

    answers: [
      "۲ تیم",
      "۳ تیم",
      "۴ تیم"
    ],

    correct: 0
  },

  {
    question:
      "کدام ورزش در آب انجام می‌شود؟",

    answers: [
      "شنا",
      "دوومیدانی",
      "بسکتبال"
    ],

    correct: 0
  },

  {
    question:
      "قبل از ورزش بهتر است چه کاری انجام دهیم؟",

    answers: [
      "گرم کردن",
      "خوابیدن",
      "خوردن غذای سنگین"
    ],

    correct: 0
  }

];


function startStage2() {

  clearAllTimers();

  currentStage = 2;

  questionIndex = 0;

  levelEl.textContent = "2";

  stageTitle.textContent =
    "مرحله ۲: هوش ورزشی 🧠";

  message.textContent =
    "به سؤال‌ها با دقت جواب بده!";

  showScreen(gameScreen);

  showQuestion();
}


function showQuestion() {

  if (
    questionIndex >=
    questions.length
  ) {

    message.textContent =
      "آفرین! مرحله بعدی آماده است 🎉";

    setTimeout(
      startStage3,
      1000
    );

    return;
  }

  const q =
    questions[questionIndex];

  gameArea.innerHTML = `

    <div class="question-box">

      <div class="question">
        ${q.question}
      </div>

      <div class="answers">

        ${q.answers
          .map(
            (answer, index) => `

              <button
                class="answer-btn"
                type="button"
                data-index="${index}"
              >
                ${String.fromCharCode(
                  1575 + index
                )}
                ـ ${answer}
              </button>

            `
          )
          .join("")}

      </div>

    </div>

  `;

  const buttons =
    document.querySelectorAll(
      ".answer-btn"
    );

  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const selected =
          Number(
            button.dataset.index
          );

        if (
          selected === q.correct
        ) {

          updateScore(20);

          successSound();

          message.textContent =
            "درست جواب دادی! 👏";

          questionIndex++;

          setTimeout(
            showQuestion,
            600
          );

        } else {

          errorSound();

          message.textContent =
            "اشتباه بود! دوباره تلاش کن 💪";

          button.style.transform =
            "scale(0.95)";
        }

      }
    );

  });
}


/* =========================
   مرحله سوم
   حافظه ورزشی
========================= */

function startStage3() {

  clearAllTimers();

  currentStage = 3;

  matchedPairs = 0;

  firstCard = null;
  secondCard = null;

  lockCards = false;

  levelEl.textContent = "3";

  stageTitle.textContent =
    "مرحله ۳: حافظه ورزشی 🧠";

  message.textContent =
    "جفت شکل‌های مشابه را پیدا کن!";

  showScreen(gameScreen);

  const symbols = [

    "⚽",
    "⚽",

    "🏀",
    "🏀",

    "🏐",
    "🏐",

    "🏃",
    "🏃"

  ];

  /* مخلوط کردن کارت‌ها */

  symbols.sort(
    () => Math.random() - 0.5
  );


  /* ساخت کارت‌ها */

  gameArea.innerHTML = `

    <div class="memory-grid">

      ${symbols
        .map(
          (symbol, index) => `

            <button
              class="memory-card"
              type="button"
              data-symbol="${symbol}"
              data-index="${index}"
            >
              ❓
            </button>

          `
        )
        .join("")}

    </div>

  `;


  /* فعال کردن کلیک کارت‌ها */

  const cards =
    document.querySelectorAll(
      ".memory-card"
    );

  cards.forEach(card => {

    card.addEventListener(
      "click",
      () => {

        flipCard(card);

      }
    );

  });

}


/* =========================
   باز کردن کارت
========================= */

function flipCard(card) {

  /* اگر کارت قابل انتخاب نیست */

  if (
    lockCards ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {

    return;
  }


  /* نمایش کارت */

  card.classList.add("flipped");

  card.textContent =
    card.dataset.symbol;


  /* کارت اول */

  if (!firstCard) {

    firstCard = card;

    return;
  }


  /* کارت دوم */

  secondCard = card;

  lockCards = true;


  const firstSymbol =
    firstCard.dataset.symbol;

  const secondSymbol =
    secondCard.dataset.symbol;


  /* =========================
     جفت مشابه
  ========================= */

  if (
    firstSymbol === secondSymbol
  ) {

    successSound();

    firstCard.classList.add(
      "matched"
    );

    secondCard.classList.add(
      "matched"
    );

    matchedPairs++;

    updateScore(30);

    message.textContent =
      "آفرین! جفت مشابه را پیدا کردی! 🎯";


    /* آماده انتخاب جفت بعدی */

    firstCard = null;
    secondCard = null;
    lockCards = false;


    /* تمام جفت‌ها پیدا شده */

    if (matchedPairs === 4) {

      showStars();

      message.textContent =
        "عالی بود! حافظه‌ات فوق‌العاده است! 🎉";

      setTimeout(
        startStage4,
        1200
      );
    }

    return;
  }


  /* =========================
     جفت اشتباه
  ========================= */

  errorSound();

  message.textContent =
    "این دو شکل مشابه نیستند! دوباره تلاش کن 💪";


  setTimeout(() => {

    if (firstCard) {

      firstCard.classList.remove(
        "flipped"
      );

      firstCard.textContent =
        "❓";
    }

    if (secondCard) {

      secondCard.classList.remove(
        "flipped"
      );

      secondCard.textContent =
        "❓";
    }


    firstCard = null;
    secondCard = null;

    lockCards = false;

  }, 900);

}


/* =========================
   مرحله چهارم
   چالش حرکت و تعادل
========================= */

function startStage4() {

  clearAllTimers();

  currentStage = 4;

  balancePosition = 0;
  balanceTime = 20;

  levelEl.textContent = "4";

  stageTitle.textContent =
    "مرحله ۴: چالش تعادل ⚖️";

  message.textContent =
    "با دکمه‌ها حرکت کن و امتیاز بگیر!";

  showScreen(gameScreen);


  gameArea.innerHTML = `

    <div class="balance-area">

      <h3>
        بازیکن را به چپ و راست حرکت بده! 🏃
      </h3>

      <div
        class="balance-player"
        id="balancePlayer"
      >
        🏃‍♀️
      </div>

      <div>

        زمان:

        <strong id="balanceTime">
          20
        </strong>

        ثانیه

      </div>


      <div class="balance-controls">

        <button
          class="balance-btn"
          id="leftBtn"
          type="button"
        >
          ◀️
        </button>

        <button
          class="balance-btn"
          id="rightBtn"
          type="button"
        >
          ▶️
        </button>

      </div>

    </div>

  `;


  const player =
    document.getElementById(
      "balancePlayer"
    );

  const timeEl =
    document.getElementById(
      "balanceTime"
    );


  function movePlayer(direction) {

    balancePosition +=
      direction * 10;

    balancePosition =
      Math.max(
        -120,
        Math.min(
          120,
          balancePosition
        )
      );

    player.style.transform =
      `translateX(${balancePosition}px)`;

    updateScore(5);

    successSound();
  }


  document
    .getElementById("leftBtn")
    .addEventListener(
      "click",
      () => {

        movePlayer(-1);

      }
    );


  document
    .getElementById("rightBtn")
    .addEventListener(
      "click",
      () => {

        movePlayer(1);

      }
    );


  balanceTimer =
    setInterval(() => {

      balanceTime--;

      timeEl.textContent =
        balanceTime;

      if (balanceTime <= 0) {

        clearInterval(
          balanceTimer
        );

        balanceTimer = null;

        celebrationSound();

        showStars();

        setTimeout(
          finishGame,
          800
        );
      }

    }, 1000);

}


/* =========================
   پایان بازی
========================= */

function finishGame() {

  clearAllTimers();

  finalScore.textContent =
    score;


  if (score >= 350) {

    finalTitle.textContent =
      "🏆 قهرمان ورزشکار شدی!";

    finalMessage.textContent =
      "فوق‌العاده بود! تو واقعاً یک قهرمان ورزشی هستی! 💪🎉";

    celebrationSound();

  }

  else if (score >= 220) {

    finalTitle.textContent =
      "🌟 خیلی عالی بود!";

    finalMessage.textContent =
      "عملکرد خیلی خوبی داشتی. به تلاش ادامه بده! 👏";

    successSound();

  }

  else {

    finalTitle.textContent =
      "💪 دوباره تلاش کن!";

    finalMessage.textContent =
      "این بار نشد، اما قهرمان‌ها هیچ‌وقت تسلیم نمی‌شوند!";

    successSound();
  }


  showScreen(endScreen);
}


/* =========================
   شروع اولیه
========================= */

showScreen(startScreen);

scoreEl.textContent = "0";

levelEl.textContent = "1";
