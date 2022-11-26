import axios from 'axios';

axios.defaults.baseURL = 'https://rickandmortyapi.com/api/character';

export default class ApiService {
  constructor() {
    this.query = null;
    this.status = null;
    this.gender = null;
    this.page = 1;
  }

  getData() {
    return axios.get('/', {
      params: {
        name: this.query,
        status: this.status,
        gender: this.gender,
        page: this.page,
      },
    });
  }

  getQuery() {
    return this.query;
  }

  changeQuery(newQuery) {
    this.query = newQuery;
  }

  resetQuery() {
    this.query = null;
  }

  changeStatus(newStatus) {
    this.status = newStatus;
  }

  resetStatus() {
    this.status = null;
  }

  changeGender(newGender) {
    this.gender = newGender;
  }

  resetGender() {
    this.gender = null;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  getPage() {
    return this.page;
  }
}
