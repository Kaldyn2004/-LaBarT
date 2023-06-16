window.addEventListener("DOMContentLoaded", (event) => {

  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");
  const authore = document.getElementById("author");
  const date = document.getElementById("date");
  const autorImage = document.getElementById("author-image");
  const articleImage = document.getElementById("article-image");
  const postImage = document.getElementById("post-image");
  const content = document.getElementById("content");
  const form = document.getElementById('forms');
  const buttonLogOut = document.getElementById('log-out');
  async function publish(event) {
    event.preventDefault();
    const post = {
      title: title.value,
      subtitle: subtitle.value,
      author: authore.value,
      authorImage: autorImage.value,
      date: date.value,
      articleImage: articleImage.value,
      postImage: postImage.value,
      content: content.value,
    }

    console.log(JSON.stringify(post));
    const avatarB64 = await avatarToBase64();
    // const articleImages = await articleImageToBase64();
    const postImages = await postImageToBase64();
    const response = await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({
        title: title.value,
        subtitle: subtitle.value,
        author_name: authore.value,
        avatar: avatarB64,
        avatar_name: getAvatarName(),
        publish_date: date.value,
        image: postImages,
        image_name: getArticleImageName(),
        content: content.value,
      })
    })
    if ((title.value == '') || (subtitle.value == '') || (authore.value == '') || (autorImage.value == '') || (date.value == '') || (articleImage.value == '') || (postImage.value == '') || (content.value == '')) {
      let error = document.getElementById('incorrect-error');
      error.classList.add('play');
      error.classList.remove('unplay');
      er = true;
    } else {
      let succes = document.getElementById('correct-error');
      succes.classList.add('play');
      form.reset();
      removeAvatars();
      removeArticleImage();
      removePostImage();
      succes.classList.remove('unplay');
      sc = true;
    }
  }
  function getAvatarName() {
    const imageName = uploadedImageName(autorImage);
    return imageName
  }
  const uploadedImageName = (inputFile) => {
    return inputFile.files[0].name;
  }
  function getArticleImageName() {
    const imageName = uploadedImageName(articleImage);
    return imageName
  }
  async function articleImageToBase64() {
    const articleImageB64 = await readUploadedFileAsBase64(articleImage);
    return articleImageB64
    // вызвать функцию в нее передать картинку Б64 и она сгенерит шаблон для предпроссмотра
  }

  async function avatarToBase64() {
    const avatarB64 = await readUploadedFileAsBase64(autorImage);
    autorImage
    return avatarB64
    // вызвать функцию в нее передать картинку Б64 и она сгенерит шаблон для предпроссмотра
  }
  async function postImageToBase64() {
    const postImageB64 = await readUploadedFileAsBase64(postImage);
    return postImageB64
    // вызвать функцию в нее передать картинку Б64 и она сгенерит шаблон для предпроссмотра
  }


  const readUploadedFileAsBase64 = (inputFile) => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile.files[0]);
    });

  };

  const publishButton = document.getElementById("publish");
  form.addEventListener('submit', publish);

  let avatarr;
  let postimage;
  let avatar_name;
  let image_name;
  let image;
  let er;
  let sc;

  //function nameImage(inputFile) { return inputFile.files[0].name; }

  function uploadAvatar(event) {
    let reader = new FileReader();
    reader.onload = () => {
      let authorImage = document.getElementById("showAuthorImage");
      let previewAuthorImage = document.getElementById("previewAuthorImage");
      let removeAvatar = document.getElementById('removeAvatar');
      let autorText = document.getElementById('autorText');

      authorImage.classList.remove('none');
      removeAvatar.classList.remove('none');
      document.getElementById('iconCamera').classList.remove('none');
      autorText.innerText = 'Upload New';
      previewAuthorImage.classList.remove('none');

      removeAvatar.addEventListener('click', removeAvatars);

      authorImage.src = reader.result;
      previewAuthorImage.src = reader.result;
      avatarr = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    avatar_name = event.target.files[0].name;
  };


  const uploadAvatarButton = document.getElementById("author-image");
  uploadAvatarButton.addEventListener('change', uploadAvatar);

  function removeAvatars() {
    let removeAvatar = document.getElementById('removeAvatar');
    let previewAuthorImage = document.getElementById("previewAuthorImage");
    let authorImage = document.getElementById("showAuthorImage");
    let autorText = document.getElementById('autorText');
    removeAvatar.classList.add('none');
    document.getElementById('iconCamera').classList.add('none');
    autorText.innerText = 'Upload';
    authorImage.removeAttribute("src");
    previewAuthorImage.removeAttribute("src");
    previewAuthorImage.classList.add('none');
    authorImage.classList.add('none');
    autorImage.value = '';
  }


  function uploadArticleImage(event) {
    let reader = new FileReader();
    reader.onload = () => {
      let previewArticleImage = document.getElementById("previewArticleImage");
      let label = document.querySelector(".form__label-description-article");
      let comand = document.getElementById("big-img-bottom");
      let RemoveArticleImage = document.querySelector(".remove-article");
      let articleImage = document.getElementById("showArticleImage");

      label.classList.add('none');
      comand.classList.remove('none');
      comand.classList.add('flex');
      articleImage.classList.remove('none');
      RemoveArticleImage.addEventListener('click', removeArticleImage);
      document.getElementById("previewArticleImage").classList.add("preview-article-image");
      previewArticleImage.classList.remove('none');

      articleImage.src = reader.result;
      previewArticleImage.src = reader.result;

      image = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    image_name = event.target.files[0].name;
  };

  const uploadArticleImageButton = document.getElementById("article-image");
  uploadArticleImageButton.addEventListener('change', uploadArticleImage);

  function removeArticleImage() {
    let label = document.querySelector(".form__label-description-article");
    let comand = document.getElementById("big-img-bottom");
    let articleImage = document.getElementById("showArticleImage");
    label.classList.remove('none');
    comand.classList.add('none');
    comand.classList.remove('flex');
    articleImage.classList.add('none');
    articleImage.removeAttribute("src");
    previewArticleImage.removeAttribute("src");
    previewArticleImage.classList.add('none');
    articleImage.value = '';
  }

  function uploadPostImage(event) {
    closeNotice();
    let reader = new FileReader();
    reader.onload = () => {
      let label = document.getElementById("form__label-description-article");
      let divRemovePostImage = document.getElementById("remove-article");
      let comand = document.getElementById("big-img-bottom2");
      let postImage = document.getElementById("showPostImage");

      label.classList.add('none');
      comand.classList.remove('none');
      comand.classList.add('flex');
      postImage.classList.remove('none');
      divRemovePostImage.addEventListener('click', removePostImage);
      document.getElementById("previewPostImage").classList.add("preview-post-image");
      previewPostImage.classList.remove('none');
      postImage.src = reader.result;
      previewPostImage.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const uploadPostImageButton = document.getElementById("post-image");
  uploadPostImageButton.addEventListener('change', uploadPostImage);

  function removePostImage() {
    let label = document.getElementById("form__label-description-article");
    let comand = document.getElementById("big-img-bottom2");
    let postImage = document.getElementById("showPostImage");

    label.classList.remove('none');
    comand.classList.add('none');
    comand.classList.remove('flex');
    postImage.classList.add('none');
    previewPostImage.classList.add('none');

    postImage.removeAttribute("src");
    previewPostImage.removeAttribute("src");
    postImage.value = '';
  }

  function getTitle() {
    closeNotice();
    let input_taker = document.getElementById('title').value;
    let articleCardTitle = document.getElementById('showTitle');
    let postCardTitle = document.getElementById('cardShowTitle');
    let stile = document.getElementById('title').classList;

    articleCardTitle.innerHTML = input_taker;
    postCardTitle.innerHTML = input_taker;
    stile.add('add-style');
    if (input_taker == '') {
      articleCardTitle.innerHTML = 'New Post';
      postCardTitle.innerHTML = 'New Post';
      stile.remove('add-style');
    }
  }

  const printTitle = document.getElementById("title");
  printTitle.addEventListener('keyup', getTitle);

  function getSubtitle() {
    closeNotice();
    let input_taker = document.getElementById('subtitle').value;
    let articleCardSubtitle = document.getElementById('showSubitle');
    let postCardSubtitle = document.getElementById('cardShowSubtitle');
    let stile = document.getElementById('subtitle').classList;
    articleCardSubtitle.innerHTML = input_taker;
    postCardSubtitle.innerHTML = input_taker;
    stile.add('add-style');
    if (input_taker == '') {
      articleCardSubtitle.innerHTML = 'Please, enter any description';
      postCardSubtitle.innerHTML = 'Please, enter any description';
      stile.remove('add-style');
    }
  }

  const printSubtitle = document.getElementById("subtitle");
  printSubtitle.addEventListener('keyup', getSubtitle);

  function getAuthorName() {
    closeNotice();
    let input_taker = document.getElementById('author').value;
    let postCardAuthor = document.getElementById('showAuthor');
    let stile = document.getElementById('author').classList;
    postCardAuthor.innerHTML = input_taker;
    stile.add('add-style');
    if (input_taker == '') {
      postCardAuthor.innerHTML = 'Kirill';
      stile.remove('add-style');
    }
  }

  const printAuthorName = document.getElementById("author");
  printAuthorName.addEventListener('keyup', getAuthorName);

  function getPublishDate() {
    closeNotice();
    let input_taker = document.getElementById('date').value;
    let year = input_taker.split('-')[0];
    let month = input_taker.split('-')[1];
    let day = input_taker.split('-')[2];
    let newstr = day + '/' + month + '/' + year;
    let postCardDate = document.getElementById('showPublishDate');
    postCardDate.innerText = newstr;
    document.getElementById('date').classList.add('add-style');
  }

  const printPublishDate = document.getElementById("date");
  printPublishDate.addEventListener('change', getPublishDate);

  function closeNotice() {
    if (er) {
      let error = document.getElementById('incorrect-error');
      error.classList.remove('play');
      error.classList.add('unplay');
      er = false;
    }
    if (sc) {
      let succes = document.getElementById('correct-error');
      succes.classList.remove('play');
      succes.classList.add('unplay');
      sc = false;
    }
  }
  async function logout() {
    const response = await fetch('/logout')

    if (response.ok) {
      location.assign("http://localhost:3000/home");
    }
  }

  buttonLogOut.addEventListener("click", logout)
});