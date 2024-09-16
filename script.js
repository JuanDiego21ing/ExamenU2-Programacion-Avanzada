const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

const imgFondo = new Image();
const imgLogo = new Image();
const imgMemo = new Image();
const imgExtra1 = new Image();
const imgExtra2 = new Image();

const audioExtra1 = new Audio("sounds/CursorSelect.mp3");
const audioExtra2 = new Audio("sounds/CursorSelect.mp3");

const audioCardClick = new Audio("sounds/cardFlip.mp3");

const images = [
  "img/1.png",
  "img/2.png",
  "img/3.png",
  "img/4.png",
  "img/5.png",
  "img/6.png",
  "img/7.png",
  "img/8.png",
  "img/9.png",
  "img/10.png",
  "img/11.png",
  "img/12.png",
  "img/13.png",
  "img/14.png",
  "img/15.png",
];

imgFondo.src = "img/fondo.jpg";
imgLogo.src = "img/residentLogo.png";
imgMemo.src = "img/memoramaLogo.png";
imgExtra1.src = "img/verde.jpg";
imgExtra2.src = "img/roja.jpeg";

const cellSize = 140;
const rows = 5;
const cols = 6;
const cards = [];
const cardNumbers = Array.from({ length: (rows * cols) / 2 }, (_, i) => i + 1);
const cardPairs = [...cardNumbers, ...cardNumbers];

let flippedCards = [];
let totalTime = 125 * 1000;
let endTime = Date.now() + totalTime;

let clickedExtraImages = {
  imgExtra1: false,
  imgExtra2: false,
};

function drawCells() {
  const totalWidth = cols * cellSize;
  const totalHeight = rows * cellSize;

  const offsetX = (myCanvas.width - totalWidth) / 2 + 315;
  const offsetY = (myCanvas.height - totalHeight) / 2;

  const positions = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * cellSize + offsetX;
      const y = i * cellSize + offsetY;
      positions.push({ x, y });
    }
  }

  shuffle(cardPairs).forEach((number, index) => {
    const { x, y } = positions[index];
    createCard(x, y, number);
  });

  ctx.drawImage(imgExtra1, 50, 50, 150, 75);
  ctx.drawImage(imgExtra2, 50, 150, 150, 75);

  myCanvas.addEventListener("click", handleCanvasClick);
}

function createCard(x, y, number) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.style.left = `${x}px`;
  card.style.top = `${y}px`;

  const front = document.createElement("div");
  front.classList.add("front");

  const back = document.createElement("div");
  back.classList.add("back");

  back.style.backgroundImage = `url(${images[number - 1]})`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", () => flipCard(card, number));

  document.getElementById("cardContainer").appendChild(card);
}

function flipCard(card, number) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    flippedCards.push({ card, number });

    audioCardClick.play();

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.number === second.number) {
    first.card.removeEventListener("click", () =>
      flipCard(first.card, first.number)
    );
    second.card.removeEventListener("click", () =>
      flipCard(second.card, second.number)
    );
  } else {
    first.card.classList.remove("flipped");
    second.card.classList.remove("flipped");
  }

  flippedCards = [];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let imagesLoaded = 0;

function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 5) {
    ctx.drawImage(imgFondo, 0, 0, 1280, 720);
    ctx.drawImage(imgLogo, 400, 200, 500, 200);
    ctx.drawImage(imgMemo, 550, 300, 180, 75);
  }
}

imgFondo.onload = checkImagesLoaded;
imgLogo.onload = checkImagesLoaded;
imgMemo.onload = checkImagesLoaded;
imgExtra1.onload = checkImagesLoaded;
imgExtra2.onload = checkImagesLoaded;

imgFondo.onerror = function () {
  console.error("Error al cargar la imagen del fondo");
};

imgLogo.onerror = function () {
  console.error("Error al cargar la imagen del logo");
};

imgMemo.onerror = function () {
  console.error("Error al cargar la imagen de memorama");
};

imgExtra1.onerror = function () {
  console.error("Error al cargar la primera imagen extra");
};

imgExtra2.onerror = function () {
  console.error("Error al cargar la segunda imagen extra");
};

document.getElementById("playButton").addEventListener("click", function () {
  startFadeOut();
});

function startFadeOut() {
  const startAudio = document.getElementById("startAudio");
  const secondAudio = document.getElementById("secondAudio");

  startAudio.play();

  startAudio.onended = function () {
    secondAudio.play();
    startTimer();
    drawCells();
  };

  const fadeDuration = 2000;
  const fadeSteps = 100;

  let imgLogoOpacity = 1;
  let imgMemoOpacity = 1;
  let buttonOpacity = 1;

  function fadeOutStep(step) {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.drawImage(imgFondo, 0, 0, 1280, 720);

    ctx.globalAlpha = imgLogoOpacity;
    ctx.drawImage(imgLogo, 400, 200, 500, 200);

    ctx.globalAlpha = imgMemoOpacity;
    ctx.drawImage(imgMemo, 550, 300, 180, 75);

    ctx.globalAlpha = 1;

    imgLogoOpacity -= 1 / fadeSteps;
    imgMemoOpacity -= 1 / fadeSteps;
    buttonOpacity -= 1 / fadeSteps;

    document.getElementById("btnContainer").style.opacity = buttonOpacity;

    if (step < fadeSteps) {
      requestAnimationFrame(() => fadeOutStep(step + 1));
    } else {
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      ctx.drawImage(imgFondo, 0, 0, 1280, 720);
    }
  }

  fadeOutStep(0);
}

function gameOver() {
  const secondAudio = document.getElementById("secondAudio");
  const thirdAudio = document.getElementById("thirdAudio");

  if (!secondAudio.paused) {
    secondAudio.pause();
  }

  if (!thirdAudio.paused) {
    thirdAudio.pause();
  }

  const restart = confirm("¡Haz perdido! ¿Quieres jugar otra vez?");
  if (restart) {
    restartGame();
  } else {
    goToMainScreen();
  }
}

function restartGame() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  document.getElementById("cardContainer").innerHTML = "";

  endTime = Date.now() + totalTime;
  const timerElement = document.getElementById("timer");
  timerElement.style.color = "#00ff00";
  timerElement.style.textShadow = "";

  const secondAudio = document.getElementById("secondAudio");
  secondAudio.currentTime = 0;
  secondAudio.play();

  ctx.drawImage(imgFondo, 0, 0, 1280, 720);
  drawCells();

  startTimer();

  clickedExtraImages = [];
  setupExtraImages();
}

function goToMainScreen() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  ctx.drawImage(imgFondo, 0, 0, 1280, 720);
  ctx.drawImage(imgLogo, 400, 200, 500, 200);
  ctx.drawImage(imgMemo, 550, 300, 180, 75);

  const secondAudio = document.getElementById("secondAudio");
  secondAudio.pause();

  const thirdAudio = document.getElementById("thirdAudio");
  thirdAudio.pause();

  document.getElementById("playButton").style.display = "block";
}

function startTimer() {
  const timerElement = document.getElementById("timer");
  let thirtySecondsElapsed = false;

  function updateTimer() {
    let remainingTime = endTime - Date.now();

    if (remainingTime <= 0) {
      timerElement.innerHTML = "00:00:00";
      clearInterval(timerInterval);
      gameOver();
      return;
    }

    if (remainingTime <= 30 * 1000 && !thirtySecondsElapsed) {
      thirtySecondsElapsed = true;
      stopSecondAudioAndPlayThird();
      timerElement.style.color = "#ff0000";
      timerElement.style.textShadow =
        "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000";
    }

    const minutes = Math.floor(remainingTime / (60 * 1000));
    const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
    const milliseconds = Math.floor((remainingTime % 1000) / 10);

    timerElement.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 10);

  function stopSecondAudioAndPlayThird() {
    const secondAudio = document.getElementById("secondAudio");
    const thirdAudio = document.getElementById("thirdAudio");

    secondAudio.pause();
    thirdAudio.play();
  }
}

function handleExtraImageClick() {
  endTime += 15 * 1000;

  clickedExtraImages.push(this);
}

function setupExtraImages() {
  const extraImages = document.querySelectorAll(".extra-image");
  extraImages.forEach((image) => {
    image.addEventListener("click", handleExtraImageClick);
  });
}

function initializeGame() {
  setupExtraImages();
  goToMainScreen();
}

document.addEventListener("DOMContentLoaded", initializeGame);
function addTimeToTimer(seconds) {
  endTime += seconds * 1000;
}

function handleCanvasClick(event) {
  const rect = myCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (
    x >= 50 &&
    x <= 200 &&
    y >= 50 &&
    y <= 125 &&
    !clickedExtraImages.imgExtra1
  ) {
    clickedExtraImages.imgExtra1 = true;
    audioExtra1.play();

    ctx.drawImage(imgFondo, 50, 50, 150, 75, 50, 50, 150, 75);
    addTimeToTimer(15);
  }

  if (
    x >= 50 &&
    x <= 200 &&
    y >= 150 &&
    y <= 225 &&
    !clickedExtraImages.imgExtra2
  ) {
    clickedExtraImages.imgExtra2 = true;
    audioExtra2.play();

    ctx.drawImage(imgFondo, 50, 150, 150, 75, 50, 150, 150, 75);
    addTimeToTimer(15);
  }

  if (clickedExtraImages.imgExtra1 && clickedExtraImages.imgExtra2) {
    myCanvas.removeEventListener("click", handleCanvasClick);
  }
}
