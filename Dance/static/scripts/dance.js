window.addEventListener("DOMContentLoaded", (event) => {
  const musics = document.getElementById('list-genry'); 
  const song__list = document.getElementById('list-song');
  const return_Button =  document.getElementById('return-button');
  const playButton = document.getElementById('Play');

 
  musics.addEventListener('click', openSong);
  return_Button.addEventListener('click', closeSong);
  playButton.addEventListener('click', startGame);

  function openSong() {
    song__list.classList.toggle('none');
    musics.classList.toggle('none');
  }

  function closeSong() {
    song__list.classList.add('none');
    musics.classList.remove('none');
  }

  function startGame() {
    window.location.href = 'homepage-url';
    //проверка выбрана ли песня
    //отправка в выбранную игру
  }
});