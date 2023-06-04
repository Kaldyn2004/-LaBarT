const titles = document.getElementById("title");
const subtitles = document.getElementById("subtitle");
const authors = document.getElementById("author");
const dates = document.getElementById("date");
const autorImg = document.getElementById("author-image");
const articleImages =  document.getElementById("article-image");
const postImages =  document.getElementById("post-image");
const contents = document.getElementById("content");
async function publish() {
   const post = {
     title:  titles.value,
     subtitle: subtitles.value,
     author: authors.value,
     authorImage: encodedAvatar,
     date: dates.value,
     articleImage: articleImages.value,
     postImage: postImages.value,
     content: contents.value,
   }
     console.log(JSON.stringify(post));
  }


const publishButton = document.getElementById("publish");
publishButton.addEventListener('click', publish);

var avatarr;
var postimage;
var avatar_name;
var image_name;
var image;

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

function removeAvatars(event) {
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
    autorImg.value = '';
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
    articleImages.value = '';
}

function uploadPostImage(event) {
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
  postImages.value = '';
}

function getTitle() {
  let input_taker = document.getElementById('title').value;
  let articleCardTitle = document.getElementById('showTitle');
  let postCardTitle = document.getElementById('cardShowTitle');
  let stile = document.getElementById('title').classList;

  articleCardTitle.innerHTML = input_taker;
  postCardTitle.innerHTML = input_taker;
  stile.add('add-style');
  if(input_taker == ''){
    articleCardTitle.innerHTML = 'New Post';
    postCardTitle.innerHTML = 'New Post';
    stile.remove('add-style');
  }
}

const printTitle = document.getElementById("title");
printTitle.addEventListener('keyup', getTitle);

function getSubtitle() {
  let input_taker = document.getElementById('subtitle').value;
  let articleCardSubtitle = document.getElementById('showSubitle');
  let postCardSubtitle = document.getElementById('cardShowSubtitle'); 
  let stile = document.getElementById('subtitle').classList;
  articleCardSubtitle.innerHTML = input_taker;
  postCardSubtitle.innerHTML = input_taker;
  stile.add('add-style');
  if(input_taker == ''){
    articleCardSubtitle.innerHTML = 'Please, enter any description';
    postCardSubtitle.innerHTML = 'Please, enter any description';
    stile.remove('add-style');
  }
}

const printSubtitle = document.getElementById("subtitle");
printSubtitle.addEventListener('keyup', getSubtitle);

function getAuthorName() {
  let input_taker = document.getElementById('author').value;
  let postCardAuthor = document.getElementById('showAuthor');
  let stile = document.getElementById('author').classList;
  postCardAuthor.innerHTML = input_taker;
  stile.add('add-style');
  if(input_taker == ''){
    postCardAuthor.innerHTML = 'Kirill';
    stile.remove('add-style');
  }
}

const printAuthorName = document.getElementById("author");
printAuthorName.addEventListener('keyup', getAuthorName);

function getPublishDate() {
  let input_taker = document.getElementById('date').value;
  let postCardDate = document.getElementById('showPublishDate');
  postCardDate.innerText = input_taker;
  document.getElementById('date').classList.add('add-style');
}

const printPublishDate = document.getElementById("date");
printPublishDate.addEventListener('change', getPublishDate);