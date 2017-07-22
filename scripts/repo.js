const DEVELOPMENT = false;

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
    this.repoName = repoName;
    this.numberOfPulls = 0;
    this.openIssues = 0;
    this.forks = 0;
  }
  fetch()
  {
    if (DEVELOPMENT) {
      this.repoData = window.SAMPLE_REPO;
      this.openIssues = Math.random();
      this.forks = Math.random();
      this.numberOfPulls = Math.floor(Math.random() * 120);
      return Promise.resolve(null);
    }
    return fetch(`${API_ROOT}/repos/${this.repoName}`, FETCH_OPTIONS)
    .then(response => response.json())
    .then(data => {
      this.openIssues = data.open_issues_count;      
      this.forks = data.forks_count;      
      return this._getNumberOfPulls();
    });
  }
  toTableRowElement () {
    const row = document.createElement('tr');
    [this.repoName, this.numberOfPulls, this.forks, this.openIssues].forEach(stat => {
      const col = document.createElement('td');
      col.innerHTML = stat;
      row.appendChild(col);
    });
    return row;
  }
  _getNumberOfPulls ()
  {
    return fetch(`${API_ROOT}/repos/${this.repoName}/pulls`, FETCH_OPTIONS)
    .then(response => {
      const pagString = response.headers.get('Link');
      const reg = /page=(\d)/g;
      if (reg.exec(pagString)) {
        let numberOfPages = parseInt(reg.exec(pagString)[1]);
        this.numberOfPulls = (numberOfPages-1) * 30;
        return fetch(`${API_ROOT}/repos/${this.repoName}/pulls?page=${numberOfPages}`)
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
