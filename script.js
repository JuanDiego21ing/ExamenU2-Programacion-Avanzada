const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

const imgFondo = new Image();
const imgLogo = new Image();
const imgMemo = new Image();

const images = [
  "img/1.png",
  "img/2.png",
  "img/3.png",
  "img/4.jpeg",
  "img/5.jpeg",
  "img/6.jpeg",
  "img/7.png",
  "img/8.png",
  "img/9.png",
  "img/10.png",
  "img/11.png",
  "img/12.jpeg",
  "img/13.jpeg",
  "img/14.png",
  "img/15.png",
];

imgFondo.src = "img/fondo.jpg";
imgLogo.src = "img/residentLogo.png";
imgMemo.src = "img/memoramaLogo.png";

const cellSize = 140;
const rows = 5;
const cols = 6;
const cards = [];
const cardNumbers = Array.from({ length: (rows * cols) / 2 }, (_, i) => i + 1);
const cardPairs = [...cardNumbers, ...cardNumbers];

let flippedCards = [];

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
  if (imagesLoaded === 3) {
    ctx.drawImage(imgFondo, 0, 0, 1280, 720);
    ctx.drawImage(imgLogo, 400, 200, 500, 200);
    ctx.drawImage(imgMemo, 550, 300, 180, 75);
  }
}

imgFondo.onload = checkImagesLoaded;
imgLogo.onload = checkImagesLoaded;
imgMemo.onload = checkImagesLoaded;

imgFondo.onerror = function () {
  console.error("Error al cargar la imagen del fondo");
};

imgLogo.onerror = function () {
  console.error("Error al cargar la imagen del logo");
};

imgMemo.onerror = function () {
  console.error("Error al cargar la imagen de memorama");
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

function startTimer() {
  const timerElement = document.getElementById("timer");
  let totalTime = 90 * 1000;
  let endTime = Date.now() + totalTime;
  let thirtySecondsElapsed = false;

  function updateTimer() {
    let remainingTime = endTime - Date.now();

    if (remainingTime <= 0) {
      timerElement.innerHTML = "00:00:00";
      clearInterval(timerInterval);
      return;
    }

    if (remainingTime <= 30 * 1000 && !thirtySecondsElapsed) {
      thirtySecondsElapsed = true;
      stopSecondAudioAndPlayThird();
      timerElement.style.color = "#ff0000";
      timerElement.style.textShadow =
        "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000";
    }

    let minutes = Math.floor(remainingTime / (60 * 1000));
    let seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
    let milliseconds = Math.floor((remainingTime % 1000) / 10);

    timerElement.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 10);
}

function stopSecondAudioAndPlayThird() {
  const secondAudio = document.getElementById("secondAudio");
  const thirdAudio = document.getElementById("thirdAudio");

  secondAudio.pause();
  secondAudio.currentTime = 0;

  thirdAudio.play();

  thirdAudio.onerror = function () {
    console.error("Error");
  };
}
