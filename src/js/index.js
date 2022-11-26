import { Notify } from 'notiflix';
import ApiService from './apiService';
import characterTemplate from './templates/characterTemplate.hbs';

const refs = {
  formRef: document.querySelector('.form'),
  listRef: document.querySelector('.content-list'),
  observerRef: document.querySelector('.js-observer'),
  statusRef: document.querySelector('.status-fieldset'),
  genderRef: document.querySelector('.gender-fieldset'),
};

const observer = new IntersectionObserver(onScrollToDown, {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
});

const apiService = new ApiService();

apiService
  .getData()
  .then(response => {
    refs.listRef.innerHTML = characterTemplate(response.data.results);
    observer.observe(refs.observerRef);
  })
  .catch(console.log);

async function onFormSubmit(e) {
  e.preventDefault();
  const query = e.target.elements.query.value;

  if (query === apiService.getQuery() || query === '') {
    return;
  }

  apiService.resetPage();
  apiService.resetStatus();
  apiService.resetGender();
  refs.statusRef.querySelectorAll('input')[0].checked = true;
  refs.genderRef.querySelectorAll('input')[0].checked = true;

  apiService.changeQuery(query);

  try {
    const {
      data: { info, results },
    } = await apiService.getData();

    if (info.pages > 1) {
      observer.observe(refs.observerRef);
    }

    refs.listRef.innerHTML = characterTemplate(results);
    Notify.info(`We found ${info.count} matches for you`);
  } catch (err) {
    if (err.response.status === 404) {
      Notify.failure('No matches found');
      refs.listRef.innerHTML = '';
    } else {
      console.log(err);
    }
  } finally {
    e.target.reset();
  }
}

async function onGenderChange(e) {
  if (e.target.tagName !== 'INPUT') {
    return;
  }
  observer.unobserve(refs.observerRef);
  apiService.resetPage();
  const gender = e.target.value;

  if (gender === 'all') {
    apiService.resetGender();
  } else {
    apiService.changeGender(gender);
  }

  try {
    const {
      data: { info, results },
    } = await apiService.getData();

    if (info.pages > 1) {
      observer.observe(refs.observerRef);
    }

    refs.listRef.innerHTML = characterTemplate(results);
    Notify.info(`We found ${info.count} matches for you`);
  } catch (err) {
    if (err.response.status === 404) {
      Notify.failure('No matches found');
      refs.listRef.innerHTML = '';
    } else {
      console.log(err);
    }
  }
}

async function onStatusChange(e) {
  if (e.target.tagName !== 'INPUT') {
    return;
  }
  observer.unobserve(refs.observerRef);
  apiService.resetPage();
  const status = e.target.value;

  if (status === 'all') {
    apiService.resetStatus();
  } else {
    apiService.changeStatus(status);
  }

  try {
    const {
      data: { info, results },
    } = await apiService.getData();

    if (info.pages > 1) {
      observer.observe(refs.observerRef);
    }
    console.log(info);

    refs.listRef.innerHTML = characterTemplate(results);
    Notify.info(`We found ${info.count} matches for you`);
  } catch (err) {
    if (err.response.status === 404) {
      Notify.failure('No matches found');
      refs.listRef.innerHTML = '';
    } else {
      console.log(err);
    }
  }
}

async function onScrollToDown(entries, observer) {
  if (entries[0].isIntersecting) {
    apiService.incrementPage();
    try {
      const {
        data: { info, results },
      } = await apiService.getData();

      refs.listRef.insertAdjacentHTML('beforeend', characterTemplate(results));
      if (info.pages === apiService.getPage()) {
        observer.unobserve(refs.observerRef);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

refs.formRef.addEventListener('submit', onFormSubmit);
refs.statusRef.addEventListener('click', onStatusChange);
refs.genderRef.addEventListener('click', onGenderChange);
