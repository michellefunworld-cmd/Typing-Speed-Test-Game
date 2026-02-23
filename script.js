const LEVELS = {
  1: {
    time: 40,
    texts: [
      "Silver moonlight danced across the silent lake as the world fell into a deep slumber.",
    ],
  },
  2: {
    time: 50,
    texts: [
      "The golden sun dipped below the horizon as a gentle breeze whispered through the grass, signaling the arrival of the night.",
    ],
  },
  3: {
    time: 50,
    texts: [
      "Web development combines creativity and logic. Learning to type faster makes writing code, essays, and projects much easier.",
    ],
  },
  4: {
    time: 60,
    texts: [
      "Life can be challenging at times, but those challenges help people grow stronger and wiser. Every mistake is a chance to learn something new and improve for the future. In the end, staying determined and positive makes all the difference.",
    ],
  },
  5: {
    time: 70,
    texts: [
      "Good typing habits include sitting comfortably, keeping your eyes on the screen, and using all your fingers correctly.",
    ],
  },
  6: {
    time: 80,
    texts: [
      "Music has a powerful way of expressing emotions that words sometimes can’t. It brings people together and helps them feel understood. A good song can change your mood in seconds.",
    ],
  },
  7: {
    time: 90,
    texts: [
      "Hard work doesn’t always pay off right away, which can be frustrating at times. However, putting in consistent effort builds discipline and teaches patience. When someone stays focused and doesn’t give up, their goals start to feel more achievable, and success becomes more likely over time.",
    ],
  },
  8: {
    time: 100,
    texts: [
      "Friendship is important because it gives people support and comfort. Having someone to talk to can make tough moments easier. True friends help each other grow.",
    ],
  },
  9: {
    time: 110,
    texts: [
      "Learning new things can feel difficult at first, but it becomes easier with practice. Making mistakes is part of the process. Each lesson helps build confidence.",
    ],
  },
  10: {
    time: 120,
    texts: [
      "Confidence plays a big role in how people face challenges. When someone believes in themselves, they are more willing to try new things. Even small successes can help build that confidence over time. Self-doubt may still appear, but it doesn’t have to stop progress. With patience and effort, confidence can continue to grow.",
    ],
  },
};

// ---------- STATE VARIABLES ----------
let currentLevel = 1;
let timeLeft = 0;
let timerId = null;
let currentText = "";
let unlockedLevels = 1;

// ---------- DOM ELEMENTS ----------
const textDisplay = document.getElementById("textDisplay");
const inputBox = document.getElementById("inputBox");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const startBtn = document.getElementById("startBtn");
const levelLabel = document.querySelector(".current-level");
const completionMsg = document.getElementById("completionMessage");
const darkModeBtn = document.getElementById("darkModeBtn");

// ---------- LEVEL BUTTONS ----------
const levelButtons = document.querySelectorAll(".levels button");
levelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lvl = Number(btn.dataset.level);
    if (lvl <= unlockedLevels) {
      currentLevel = lvl;
      levelLabel.textContent = `Level ${currentLevel}`;
      resetTest();
    }
  });
});

// ---------- DARK MODE ----------
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// ---------- START TEST ----------
startBtn.addEventListener("click", startTest);

function startTest() {
  resetTest();
  inputBox.disabled = false;
  inputBox.focus();
  startBtn.textContent = "Restart";

  const levelData = LEVELS[currentLevel];
  timeLeft = levelData.time;
  timeEl.textContent = timeLeft;

  // Pick random paragraph
  currentText =
    levelData.texts[Math.floor(Math.random() * levelData.texts.length)];
  textDisplay.innerHTML = wrapText(currentText); // wrap letters in spans

  // Live typing highlight
  inputBox.addEventListener("input", highlightText);

  // Timer
  timerId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft === 0) endTest();
  }, 1000);
}

// ---------- HIGHLIGHT FUNCTION ----------
function wrapText(text) {
  return text
    .split("")
    .map((char) => `<span>${char}</span>`)
    .join("");
}

function highlightText() {
  const typed = inputBox.value;
  const spans = textDisplay.querySelectorAll("span");
  let correctChars = 0;

  spans.forEach((span, index) => {
    const typedChar = typed[index];
    if (typedChar == null) {
      span.classList.remove("correct", "incorrect");
    } else if (typedChar === span.textContent) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
      correctChars++;
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }
  });
}

// ---------- END TEST ----------
function endTest() {
  clearInterval(timerId);
  inputBox.disabled = true;

  const typed = inputBox.value.trim();
  const words = typed.split(/\s+/).filter(Boolean).length;
  const wpm = Math.round((words / LEVELS[currentLevel].time) * 60);

  // Accuracy
  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === currentText[i]) correctChars++;
  }
  const accuracy = typed.length
    ? Math.round((correctChars / typed.length) * 100)
    : 0;

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;

  // Completion message
  completionMsg.textContent = `🎉 Level ${currentLevel} completed!`;

  // Unlock next level
  if (currentLevel < 10 && currentLevel >= unlockedLevels) {
    unlockedLevels++;
    levelButtons[unlockedLevels - 1].disabled = false;
  }
}

// ---------- RESET TEST ----------
function resetTest() {
  clearInterval(timerId);
  inputBox.value = "";
  inputBox.disabled = true;
  wpmEl.textContent = "0";
  accuracyEl.textContent = "0";
  startBtn.textContent = "Start Quiz";
  completionMsg.textContent = "";
  // Reset text highlight
  textDisplay.innerHTML = "";
}
