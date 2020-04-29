'use strict';
import '../styles/styles.css';
import InfiniteScroll from 'infinite-scroll';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';
import galleryTemplate from '../templates/gallery-templates.hbs';
import 'material-design-icons/iconfont/material-icons.css';
import _ from 'lodash';

const API_KEY = '16237149-31f8128048fb3bf9af47cfac8';
const baseUrl =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal&';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
};
const elem = refs.gallery;
let searchQuery;

refs.searchForm.addEventListener(
  'input',
  _.debounce(searchFormInputHandler, 1000),
);
refs.gallery.addEventListener('click', ImageclickHandler);

function searchFormInputHandler(e) {
  e.preventDefault();
  clearMarkup();
  searchQuery = e.target.value;
  e.target.value = '';
  infiniteScrollInstance.loadNextPage();
}

const infiniteScrollInstance = new InfiniteScroll(elem, {
  responseType: 'text',
  history: false,
  path() {
    return `https://cors-anywhere.herokuapp.com/${baseUrl}q=${searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;
  },
});

infiniteScrollInstance.on('load', response => {
  const data = JSON.parse(response);
  const posts = data.hits;
  const markup = posts.map(post => galleryTemplate(post)).join('');
  const proxyEl = document.createElement('div');
  proxyEl.innerHTML = markup;
  const parsedItems = proxyEl.querySelectorAll('.photo-card');
  infiniteScrollInstance.appendItems(parsedItems);
});

function ImageclickHandler(e) {
  basicLightbox
    .create(
      `
      <img src="${e.target.dataset.source}">
  `,
    )
    .show();
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}
