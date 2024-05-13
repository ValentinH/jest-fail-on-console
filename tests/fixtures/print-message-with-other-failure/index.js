module.exports = () => {
  console.error('my error message that I do not control');
  throw new Error('some other error');
}
