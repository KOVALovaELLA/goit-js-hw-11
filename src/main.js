import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const apiKey = "41764159-4dbb46db2acf8e3f55eb7fe99"; //


const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");
const loaderEl = document.getElementById("loader"); 

let inputData = "";
let page = 1;
let lightbox;

function showLoader() {
  loaderEl.style.display = "block";
}

function hideLoader() {
  loaderEl.style.display = "none";
}

function clearGallery() {
  searchResultsEl.innerHTML = "";
}

function createImageCard(imageData) {
  const imageWrapper = document.createElement("a");
  imageWrapper.href = imageData.largeImageURL;
  imageWrapper.classList.add("search-result");

  const image = document.createElement("img");
  image.src = imageData.webformatURL;
  image.alt = imageData.tags;

  const likes = document.createElement("p");
  likes.textContent = `Likes: ${imageData.likes}`;

  const views = document.createElement("p");
  views.textContent = `Views: ${imageData.views}`;

  const comments = document.createElement("p");
  comments.textContent = `Comments: ${imageData.comments}`;

  const downloads = document.createElement("p");
  downloads.textContent = `Downloads: ${imageData.downloads}`;

  imageWrapper.appendChild(image);
  imageWrapper.appendChild(likes);
  imageWrapper.appendChild(views);
  imageWrapper.appendChild(comments);
  imageWrapper.appendChild(downloads);

  return imageWrapper;
}

async function searchImages() {
  showLoader(); // Показати індикатор завантаження

  inputData = searchInputEl.value;
  clearGallery();

  const url = `https://pixabay.com/api/?key=${apiKey}&q=${inputData}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.hits.length === 0) {
      iziToast.error({
        title: "",
        message: "Sorry, there are no images matching your search query. Please try again!",
      });
      return;
    }

    const results = data.hits;

    results.forEach((result) => {
      const imageCard = createImageCard(result);
      searchResultsEl.appendChild(imageCard);
    });

    if (!lightbox) {
      lightbox = new SimpleLightbox(".search-results a", {});
    } else {
      lightbox.refresh();
    }

    page++;

    if (page > 1) {
      showMoreButtonEl.style.display = "block";
    }
  } catch (error) {
    console.error("Помилка під час обробки запиту:", error.message);
  } finally {
    hideLoader(); // Приховати індикатор завантаження незалежно від результату
  }
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

showMoreButtonEl.addEventListener("click", () => {
  searchImages();
});