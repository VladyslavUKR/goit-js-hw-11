import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formImages: document.querySelector('.search-form'),
  listGallery: document.querySelector('div.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  inputForm: document.querySelector('.input-value'),
};

let currentPage = 1;
let limit = 5;

refs.formImages.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onSubmitForm);

async function onSubmitForm(e) {
  e.preventDefault();

  const input = refs.inputForm.value.trim();
  console.log(input);

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=31992358-fee5b7a6e58dad6481a8d399d&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${limit}`
    );

    const valueQuery = response.data.hits;
    const quantityImages = response.data.totalHits;
    let totalPages = Math.ceil(quantityImages / limit);

    console.log(valueQuery);

    if (valueQuery.length === 0 || input === '') {
      console.log(valueQuery);

      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (e.type === 'submit') {
      delateListGallery();

      refs.loadMoreBtn.classList.remove('load-more');

      currentPage += 1;

      Notiflix.Notify.success(`Hooray! We found ${quantityImages} images.`);

      createContent(valueQuery);
    } else if (currentPage > totalPages) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );

      refs.loadMoreBtn.classList.add('load-more');
    } else {
      createContent(valueQuery);
      currentPage += 1;
    }
  } catch (error) {
    console.log(error);
  }
}

// _______РЕНДЕР ЗОБРАЖЕНЬ_____________
function createContent(valueQuery) {
  const generateContent = valueQuery.map(value => createListItem(value));
  refs.listGallery.insertAdjacentHTML('beforeend', generateContent);
}

function createListItem(item) {
  return `<div class="photo-card">
   <a href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${item.likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${item.views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${item.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${item.downloads}</b>
      </p>
      </div>
      </div>`;
}

// _______ / РЕНДЕР ЗОБРАЖЕНЬ_____________

//____libary SimpleLightbox____

let gallery = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  showCounter: false,
  maxZoom: 10,
  disableScroll: true,
  nav: true,
});

gallery.refresh();
gallery.on('show.simplelightbox');

//____ | libary SimpleLightbox____

function delateListGallery() {
  refs.listGallery.innerHTML = '';
}
