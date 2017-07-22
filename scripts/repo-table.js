
class RepoTable
{
  constructor (el, rows)
  {
    this.rows = rows;
    this.tbody = el.getElementsByTagName('tbody')[0];
    this.thElements = el.getElementsByTagName('th');
    this._addListenersToThElements();
    this.refresh();
  }
  sortByCol (colNum)
  {
    this.rows.sort((repoA, repoB) => {
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
    this.tbody.innerHTML = '';
    this.rows.forEach(row => {
      this.tbody.appendChild(row.toTableRowElement());
    });
    this.setAllThInactive();
    this.thElements[colNum].classList.add('active');
  }
  setAllThInactive ()
  {
    for (let i = 0; i < this.thElements.length; i += 1) {
      this.thElements[i].classList.remove('active');
    }
  }
  refresh ()
  {
    Promise.all(
      this.rows.map(row => row.fetch())
    ).then(() => {
      this.sortByCol(0);
    });
  }
  _addListenersToThElements ()
  {
    const clickHeader = (index) => (
      () => this.sortByCol(index)
    );
    for (let i = 0; i < this.thElements.length; i += 1) {
      this.thElements[i].addEventListener('click', clickHeader(i));
    }
  }
}