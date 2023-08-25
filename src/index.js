import { getData } from './pixabay-api'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// дом. ВАЖНО! не работал html, поэтому пришлось создать базовую разментку через js
const form = document.querySelector('#search-form')
const input = document.querySelector('[name="searchQuery"]')
const searchButton = form.lastElementChild
form.insertAdjacentHTML("afterend", `<div class ="image-gallery"></div>`); // тут контейнер 
const imageGallery = document.querySelector('.image-gallery');
imageGallery.insertAdjacentHTML("afterend", `<div class="button-div"> <button type="button" class="load-more">Load more</button></div>`); // тут кнопка 
const moreButton = document.querySelector('.load-more');

// переменные и изначальные события
const perPage = 40;
let querry  = ''
let PAGE_NUMBER = 1
let totalPageQty = null;
searchButton.disabled = true;
searchButton.classList.add("load-more")
moreButton.classList.add('is-hidden');

// Events 
form.addEventListener('input', onInputStartEvent)
form.addEventListener('submit', onSubmitEvent);
moreButton.addEventListener('click', handlerLoad)


    const lightbox = new SimpleLightbox('.image-gallery a', {
        captions: true,
        captionAttribute: 'alt',
      captionDelay: 250
    });





async function onSubmitEvent(event) {
    event.preventDefault();
  imageGallery.innerHTML = "";
  PAGE_NUMBER = 1;

    const { searchQuery } = event.currentTarget.elements;
    querry = searchQuery.value.trim();
  

  try {
          // получаем доступ к объектам с данными
            const getPhotos = await getData(querry);
            const { hits, totalHits } = getPhotos;
    
    
            if (!hits.length) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
            }

          Notify.info(`Hooray! We found ${totalHits} images.`);

          // выводим карточки
          imageGallery.insertAdjacentHTML('beforeend', createMarcupGallery(hits));
              lightbox.refresh();

          totalPageQty = Math.ceil(totalHits / perPage);
          
          if (hits.length < perPage) {
            moreButton.classList.add('is-hidden')
            moreButton.disabled = true
            Notify.info("We're sorry, but you've reached the end of search results.");
          }else {
            moreButton.classList.remove('is-hidden')
            moreButton.disabled = false
          }
        }
        catch (err) {
            Notify.failure(err.message);
  };
};

// Рендер карточек
function createMarcupGallery(hits) {
    return hits.map((
        { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => {
        return `<a href="${largeImageURL}" class="link-lightbox"><div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" width = "300" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
      </div>
      </a>`
    }).join(" ");

};
// Пагинация 
async function handlerLoad() {
  moreButton.classList.add('is-hidden');
    PAGE_NUMBER += 1;
   
    try {
        const { hits } = await getData(querry, PAGE_NUMBER);

        imageGallery.insertAdjacentHTML('beforeend', createMarcupGallery(hits));

           lightbox.refresh();
        smoothScroll();
      moreButton.classList.remove('is-hidden');

        if (PAGE_NUMBER === totalPageQty) {
          Notify.info("We're sorry, but you've reached the end of search results.");
          moreButton.disabled = true;
moreButton.classList.add('is-hidden');
        }
    }
    catch (err) {
        Notify.failure(err.message);
    }
};


function onInputStartEvent(event) {
  searchButton.disabled = false;
  const inputValue = event.target.value.trim()
  
  if (inputValue === ''){
       searchButton.disabled = true;
      return Notify.failure('Please enter a search query.')
  } {
    searchButton.disabled = false;
  };
};



function smoothScroll() {

  const { height: cardHeight } = document
  .querySelector(".image-gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}


Notify.init({
  width: '500px'
});


