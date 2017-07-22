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
  table.refresh();
});

