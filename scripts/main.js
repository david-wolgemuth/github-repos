
const react = new Repo('facebook/react');
react.fetch().then(() => {
  console.log(react);
});
