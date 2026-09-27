gsap.registerPlugin(SplitText);

const storyTextEl = document.getElementById("storyText");
const steeringWrapper = document.getElementById("steeringWrapper");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const soundBtn = document.getElementById("soundBtn");
const restartBtn = document.getElementById("restartBtn");
const bgMusic = document.getElementById("bgMusic");

let currentPage = "start";    // start of the story

if (bgMusic) {
  bgMusic.volume = 0.5;     // music volume to 50%
}

function animateWords(text) {
  storyTextEl.textContent = text;   // Put the plain text in the element
  // Split the text into words 
  const split = SplitText.create(storyTextEl, { type: "words" });

  // Animate the words
  gsap.from(split.words, {
    duration: 0.6,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: "power2.out"
  });
}
// the storytree
// Each page has:
//   - text: what the user reads
//   - leftButton / rightButton: what the buttons say
//   - leftGoesTo / rightGoesTo: which page to go to next
//
// "end" means the story is over for that path.

const storyPages = {
  start: {
    text: "The highway splits. Which way will you turn?",
    leftButton: "⬅ Left",
    leftGoesTo: "store",
    rightButton: "Right ➡",
    rightGoesTo: "aquarium"
  },

  store: {
    text: "You went into the store to buy a snack for the road trip. After you get what you need, you head back on the road and take a different way. You see two roads — left and right. Which one will you pick?",
    leftButton: "⬅ Left",
    leftGoesTo: "store_left",
    rightButton: "Right ➡",
    rightGoesTo: "store_right"
  },

  store_left: {
    text: "You see another two roads. Which way will you pick?",
    leftButton: "⬅ Left",
    leftGoesTo: "farm",
    rightButton: "Right ➡",
    rightGoesTo: "city"
  },

  store_right: {
    text: "You see a water park! You buy a ticket and play on the water slides. Some slides have long lines, but it's worth the wait.",
    leftButton: " End",
    leftGoesTo: "end",
    rightButton: " End",
    rightGoesTo: "end"
  },

  farm: {
    text: "You made it to a farm. You pay the farmer to pick apples and strawberries. You spend your whole day picking fresh fruit to bring home.",
    leftButton: " End",
    leftGoesTo: "end",
    rightButton: " End",
    rightGoesTo: "end"
  },

  city: {
    text: "You made it to the city. You see lots of shops — clothes, food, anything you can think of. You spend your whole day eating and shopping.",
    leftButton: " End",
    leftGoesTo: "end",
    rightButton: " End",
    rightGoesTo: "end"
  },

  aquarium: {
    text: "You made it to the aquarium. After paying for your ticket, you see jellyfish, sharks, and learn about the history of sea animals. You spend your whole day here.",
    leftButton: " End",
    leftGoesTo: "end",
    rightButton: " End",
    rightGoesTo: "end"
  }
};


// This function takes a page name, finds it in storyPages,
// and change the text + buttons on screen.

function showPage(pageName) {
  const page = storyPages[pageName];

  // Change the story text (with pop-in animation)
  animateWords(page.text);

  // Change what the buttons say
  leftBtn.textContent = page.leftButton;
  rightBtn.textContent = page.rightButton;

  // If this page is an ending, disable both buttons
  if (page.leftGoesTo === "end") {
    leftBtn.disabled = true;
    rightBtn.disabled = true;
  } else {
    leftBtn.disabled = false;
    rightBtn.disabled = false;
  }

  // Remember where we are
  currentPage = pageName;
}

// steerling wheel animation
// Adds a CSS class that rotates/slides the wheel.
function turnSteering(direction) {
   // Remove old state
  steeringWrapper.classList.remove("Wobble","turn-left", "turn-right");

  if (direction === "left") {
    steeringWrapper.classList.add("turn-left");
  } else {
    steeringWrapper.classList.add("turn-right");
  }
}

// Runs when the user clicks Left or Right.
function handleChoice(direction) {
  const page = storyPages[currentPage];

  // Find out where the button goes
  let nextPage;

   if (direction === "left") {
      nextPage = page.leftGoesTo;
    } else {
      nextPage = page.rightGoesTo;
    }

  // Turn the wheel
  turnSteering(direction);

  // If the next page is "end", do nothing
  if (nextPage === "end") return;

  // Otherwise, show the next page
  showPage(nextPage);
}

// go back to the beginning.

function restartStory() {
  steeringWrapper.classList.remove("turn-left", "turn-right");
  steeringWrapper.classList.add("Wobble");
  showPage("start");
}

// sound button off and on
function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    bgMusic.play();                    
    soundBtn.textContent = " Sound On";
    soundBtn.classList.add("on");
  } else {
    bgMusic.pause();
    soundBtn.textContent = " Sound Off";
    soundBtn.classList.remove("on");
  }
}

// When the user clicks a button, run the matching function.
leftBtn.addEventListener("click", function() {
  handleChoice("left");
});
rightBtn.addEventListener("click", function() {
  handleChoice("right");
});

restartBtn.addEventListener("click", restartStory);
soundBtn.addEventListener("click", toggleMusic);

// When the page finishes loading, show the first page.
window.addEventListener("load", function() {
  showPage("start");
});