function createCard(name, path, imgPath, colors) {
    var link = document.createElement("a");
    link.href = path;

    var card = document.createElement("div");
    card.classList.add("cartao");
    card.style = colors[0] ? `background-color: ${colors[0]};` : "";
    link.appendChild(card);

    var cardText = document.createElement("div");
    cardText.classList.add("card-text");

    var heading = document.createElement("h3");
    heading.innerHTML = name;
    heading.style = colors[1] && colors[2] ? `background-color: ${colors[1]}; color: ${colors[2]};` : "";
    cardText.appendChild(heading);

    var paragraph = document.createElement("p");
    cardText.appendChild(paragraph);

    var lineBreak = document.createElement("br");
    cardText.appendChild(lineBreak);

    var cardAccess = document.createElement("div");
    cardAccess.classList.add("card-acessar");

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "42");
    svg.setAttribute("height", "42");
    svg.setAttribute("viewBox", "0 0 42 42");
    svg.setAttribute("fill", "none");

    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "21");
    circle.setAttribute("cy", "21");
    circle.setAttribute("r", "20.5");
    circle.setAttribute("fill", colors[3] ? colors[3] : "#000");

    var pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", "M11.75 25.201C11.0326 25.6152 10.7867 26.5326 11.201 27.25C11.6152 27.9674 12.5326 28.2133 13.25 27.799L11.75 25.201ZM31.2694 16.8882C31.4838 16.088 31.0089 15.2655 30.2087 15.0511L17.1687 11.5571C16.3685 11.3426 15.546 11.8175 15.3316 12.6177C15.1172 13.4179 15.5921 14.2404 16.3923 14.4548L27.9834 17.5607L24.8776 29.1518C24.6631 29.952 25.138 30.7745 25.9382 30.9889C26.7384 31.2033 27.5609 30.7284 27.7753 29.9282L31.2694 16.8882ZM13.25 27.799L30.5705 17.799L29.0705 15.201L11.75 25.201L13.25 27.799Z");
    pathElement.setAttribute("fill", colors[5] ? colors[5] : "#0071BB");

    svg.appendChild(circle);
    svg.appendChild(pathElement);
    cardAccess.appendChild(svg);

    var accessText = document.createElement("div");
    accessText.classList.add("acessar");
    accessText.innerHTML = "Acessar";
    accessText.style = colors[4] ? `color: ${colors[4]};` : "";
    cardAccess.appendChild(accessText);

    card.appendChild(cardText);
    cardText.appendChild(cardAccess);

    var cardImg = document.createElement("div");
    cardImg.classList.add("card-img");

    var img = document.createElement("img");
    img.src = imgPath;
    cardImg.appendChild(img);

    card.appendChild(cardImg);

    document.querySelector(".card-container").appendChild(link);
}

const AplicationsList = [
    { name: "Rastreio", path: "/rastreio", imgPath: "../static/img/rastreio-index.png", colors: [] },
    { name: "Bip!", path: "/bipagem", imgPath: "../static/img/bipagem-index.png", colors: ["#0071BB", "#FFF", "#000", "#FFF", "#FFF"] },
    { name: "Dashboard", path: "/dashboard", imgPath: "../static/img/relatorios-index.png", colors: ["#191A23", "#FFF", "#000", "#0071BB", "#FFF", "#FFF"] },
    { name: "Relatórios", path: "/relatorios", imgPath: "../static/img/controle-index.png", colors: [] },
];

for (let application of AplicationsList) {
    createCard(application.name, application.path, application.imgPath, application.colors);
}

let currentSlideIndex = 0;
let slideInterval;

function showSlide(index) {
  const slides = document.querySelector('.slides');
  const totalSlides = document.querySelectorAll('.slide').length;
  const indicators = document.querySelectorAll('.indicator');

  if (index >= totalSlides) {
    currentSlideIndex = 0;
  } else if (index < 0) {
    currentSlideIndex = totalSlides - 1;
  } else {
    currentSlideIndex = index;
  }

  slides.style.transform = 'translateX(' + (-currentSlideIndex * 100) + '%)';

  indicators.forEach((indicator, i) => {
    if (i === currentSlideIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

function moveSlide(step) {
  showSlide(currentSlideIndex + step);
}

function currentSlide(index) {
  showSlide(index);
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    moveSlide(1);
  }, 4000);
}

function stopAutoSlide() {
  clearInterval(slideInterval);
}

document.querySelector('.slider').addEventListener('mouseenter', stopAutoSlide);
document.querySelector('.slider').addEventListener('mouseleave', startAutoSlide);

showSlide(currentSlideIndex);
startAutoSlide();

const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});