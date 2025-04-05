export const downloadImage = (uri: string) => {
  const linkElement = document.createElement('a');
  linkElement.href = uri;
  linkElement.download = 'image.png';
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
};
