const h1 = document.getElementById('main_header');
const originalText = h1.textContent;
const finalTexts = [
  "HELLO_VISITOR",
  "WELCOME_BACK",
  "GOOD_TO_SEE_YOU",
  "HAVE_A_NICE_DAY",
  "HEY_THERE",
  "STAY_POSITIVE",
  "KEEP_GOING",
  "YOU_CAN_DO_IT",
  "NEVER_GIVE_UP",
  "BELIEVE_IN_YOURSELF",
  "MAKE_IT_HAPPEN",
  "SEIZE_THE_DAY",
  "CHASE_YOUR_DREAMS",
  "EMBRACE_THE_JOURNEY",
  "ENJOY_THE_MOMENT",
  "STAY_FOCUSED",
  "WORK_HARD_PLAY_HARD",
  "BE_BOLD_BE_BRIGHT",
  "RISE_AND_SHINE",
  "DARE_TO_BE_DIFFERENT",
  "FOLLOW_YOUR_HEART",
  "STAY_HUNGRY",
  "CREATE_YOUR_PATH",
  "THINK_POSITIVE",
  "MAKE_TODAY_COUNT"
];

let shuffleInterval;

function shuffleText(text) {
  const arr = text.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

function animateShuffle(startText, endText, animationClass, callback) {
  let iterations = 0;
  clearInterval(shuffleInterval);

  h1.classList.remove('text-swap', 'text-swap-reverse');
  void h1.offsetWidth; // trigger reflow

  shuffleInterval = setInterval(() => {
    h1.textContent = shuffleText(startText);
    iterations++;
    if (iterations > 10) {
      clearInterval(shuffleInterval);
      h1.textContent = endText;
      h1.classList.add(animationClass);
      if (callback) callback();
    }
  }, 25);
}

function getRandomFinalText() {
  const index = Math.floor(Math.random() * finalTexts.length);
  return finalTexts[index];
}

h1.addEventListener('mouseenter', () => {
  const selectedText = getRandomFinalText();
  animateShuffle(originalText, selectedText, 'text-swap');
});

h1.addEventListener('mouseleave', () => {
  animateShuffle(h1.textContent, originalText, 'text-swap-reverse');
});




const links = document.querySelectorAll('.header_links a');

links.forEach(link => {
  const originalText = link.textContent;

  function shuffleText(text) {
    const arr = text.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  link.addEventListener('mouseenter', () => {
    let iterations = 0;
    const interval = setInterval(() => {
      link.textContent = shuffleText(originalText);
      iterations++;
      if (iterations > 10) {
        clearInterval(interval);
        link.textContent = originalText;
      }
    }, 25);
  });
});

//Scroll to the specified destination
document.querySelectorAll('.header_links a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const scrollBtn = document.getElementById('scrollToTopBtn');
const sections = document.querySelectorAll('.main_div section');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY || window.pageYOffset;
  const threshold = sections[0].offsetHeight * 1;

  if (scrollY > threshold) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function scrollToTop(duration) {
  const start = window.scrollY;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start * (1 - easeOutQuad(progress)));

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  function easeOutQuad(t) {
    return t * (2 - t); // Easing function for smooth deceleration
  }

  requestAnimationFrame(animateScroll);
}

// Example: Scroll to top in 1000ms (1 second)
document.getElementById('scrollToTopBtn').addEventListener('click', () => {
  scrollToTop(500);
});

function toggleMenu() {
  document.querySelector('.header_links').classList.toggle('active');
  document.querySelector('.hamburger').classList.toggle('active');
}

// Watch scroll position and auto-close dropdown
window.addEventListener('scroll', () => {
  const section1 = document.getElementById('sect_1');
  const rect = section1.getBoundingClientRect();

  // Check if user has scrolled out of section 1
  const outOfView = rect.bottom <= 0 || rect.top < -rect.height / 2;

  if (outOfView) {
    const menu = document.querySelector('.header_links');
    const hamburger = document.querySelector('.hamburger');

    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      hamburger.classList.remove('active');
    }
  }
});


