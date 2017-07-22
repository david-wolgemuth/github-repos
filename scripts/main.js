const REPOS = [
  'facebook/react',
  'angular/angular.js',
  'emberjs/ember.js',
  'vuejs/vue'
];

document.addEventListener('DOMContentLoaded', function () {
  const repos = REPOS.map(repoName => new Repo(repoName));
  const tableElement = document.getElementsByTagName('table')[0];
  const table = new RepoTable(tableElement, repos);

  const refreshButton = document.getElementById('refresh');
  refreshButton.addEventListener('click', () => {
    table.refresh();
  });

  const addButton = document.getElementById('add-framework');
  addButton.addEventListener('click', () => {
    let input = document.getElementsByName('framework')[0]
    let name = input.value;
    input.value = '';
    table.addFramework(name);
  });

  const filterButton = document.getElementsByName('search')[0];
  filterButton.addEventListener('keyup', () => {
    table.setRows();
  });

  table.refresh();
});

