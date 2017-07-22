
document.addEventListener('DOMContentLoaded', function () {

  const react  = new Repo('facebook/react');
  const angular = new Repo('angular/angular.js');
  const ember = new Repo('emberjs/ember.js');
  const vue = new Repo('vuejs/vue');

  const rows = [react, angular, ember, vue];
  const tbody  = document.getElementsByTagName('tbody')[0];

  const sortByCol = (colNum) => {
    rows.sort((repoA, repoB) => {
      switch (colNum) {
        case 0:
          return repoA.repoName > repoB.repoName;
        case 1:
          return repoB.numberOfPulls - repoA.numberOfPulls;
        case 2:
          return repoB.forks - repoA.forks;
        case 3:
          return repoB.openIssues - repoA.openIssues;
      }
    });
    tbody.innerHTML = '';
    rows.forEach(row => {
      tbody.appendChild(row.toTableRowElement());
    });
    setAllThInactive();
    thElements[colNum].classList.add('active');
  };

  const thElements = document.getElementsByTagName('th');
  const setAllThInactive = () => {
    for (let i = 0; i < thElements.length; i += 1) {
      thElements[i].classList.remove('active');
    }
  };
  const clickHeader = (index) => (
    () => sortByCol(index)
  );
  const addListenersToThElements = () => {
    for (let i = 0; i < thElements.length; i += 1) {
      thElements[i].addEventListener('click', clickHeader(i));
    }
  };

  const refresh = () => {
    Promise.all([
      react.fetch(),
      angular.fetch(),
      ember.fetch(),
      vue.fetch()
    ])
    .then(() => {
      sortByCol(0);
    });
  };
  const refreshButton = document.getElementById('refresh');
  refreshButton.addEventListener('click', refresh);

  addListenersToThElements();
  refresh();
});

