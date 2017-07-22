const DEVELOPMENT = true;

const API_ROOT = 'https://api.github.com';
const HEADERS = new Headers();
const FETCH_OPTIONS = {
  method: 'GET',
  headers: HEADERS,
  mode: 'cors',
  cache: 'default'
};

class Repo
{
  constructor (repoName)
  {
    this._repoName = repoName;
    this._repoData = null;
    this._pulls    = [];
    this.numberOfPulls = null;
  }
  fetch()
  {
    if (DEVELOPMENT) {
      this._repoData = window.SAMPLE_REPO;
      this.numberOfPulls = 12;
      return Promise.resolve(null);
    }
    return fetch(`${API_ROOT}/repos/${this._repoName}`, FETCH_OPTIONS)
    .then(response => response.json())
    .then(data => {
      this._repoData = data;
      return this._getNumberOfPulls();
    });
  }
  _getNumberOfPulls ()
  {
    return fetch(`${API_ROOT}/repos/${this._repoName}/pulls`, FETCH_OPTIONS)
    .then(response => {
      const pagString = response.headers.get('Link');
      const reg = /page=(\d)/g;
      if (reg.exec(pagString)) {
        let numberOfPages = parseInt(reg.exec(pagString)[1]);
        this.numberOfPulls = (numberOfPages-1) * 30;
        return fetch(`${API_ROOT}/repos/${this._repoName}/pulls?page=${numberOfPages}`)
        .then(response => response.json()).then(pulls => {
          this.numberOfPulls += pulls.length;
        });
      } else {
        return response.json().then(pulls => {
          this.numberOfPulls = pulls.length;
          return null;
        });
      }
    });
  }
}
