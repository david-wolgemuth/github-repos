const DEVELOPMENT = false;

const API_ROOT = 'https://api.github.com';
const ACCESS_TOKEN = null;
const HEADERS = new Headers();
const FETCH_OPTIONS = {
  method: 'GET',
  headers: HEADERS,
  mode: 'cors',
  cache: 'default'
};

const fetchGitHub = (endpoint, options={}) => {
  let url = `${API_ROOT}${endpoint}`;
  if (ACCESS_TOKEN) {
    options.access_token = ACCESS_TOKEN;
  } else {
    let token = document.getElementsByName('access_token')[0].value;
    if (token) {
      options.access_token = token;
    }
  }
  const keys = Object.keys(options);
  if (keys.length) {
    url += `?${keys[0]}=${options[keys[0]]}`;
  }
  for (let i = 1; i < keys.length; i += 1) {
    url += `&${keys[i]}=${options[keys[i]]}`;
  }
  return fetch(url, FETCH_OPTIONS);
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
    return fetchGitHub('/repos/' + this.repoName)
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
    return fetchGitHub(`/repos/${this.repoName}/pulls`)
    .then(response => {
      const pagString = response.headers.get('Link');
      const reg = /page=(\d)/g;
      if (reg.exec(pagString)) {
        let numberOfPages = parseInt(reg.exec(pagString)[1]);
        this.numberOfPulls = (numberOfPages-1) * 30;
        return fetchGitHub(`/repos/${this.repoName}/pulls`, { page: numberOfPages })
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
