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
  }
  fetch()
  {
    if (DEVELOPMENT) {
      this._repoData = window.SAMPLE_REPO;
      return Promise.resolve(null);
    }
    return fetch(`${API_ROOT}/repos/${this._repoName}`, FETCH_OPTIONS)
    .then(response => response.json())
    .then(json => {
      console.log(JSON.stringify(json));
      return null;
    });
  }

}