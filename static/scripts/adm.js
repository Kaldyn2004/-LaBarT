 

// async function publish() {
//   // const post = {
//   //   title: document.getElementById("title").value,
//   //   subtitle: document.getElementById("subtitle").value,
//   //   author: document.getElementById("author").value,
//   //   authorImage: encodedAvatar,
//   //   date: document.getElementById("date").value,
//   //   articleImage: document.getElementById("article-image").value,
//   //   postImage: document.getElementById("post-image").value,
//   //   content: document.getElementById("content").value
//   // }

//   // console.log(JSON.stringify(post));

//   const titleInput = document.querySelector('#title')
//   const subtitleInput = document.querySelector("#subtitle")
//   const authorInput = document.querySelector('#author')
//   const datePublishInput = document.querySelector("#date")
//   const articleImageInput = document.querySelector("#article-image")
//   const postImageInput = document.querySelector("#post-image")
//   const contentInput = document.querySelector("#content")

//   // const response = await fetch('api/post', {
//   //     method: 'POST',
//   //     body: JSON.stringify({
//   //         title: titleInput.value,
//   //         subtitle: subtitleInput.value,
//   //         author_name: authorInput.value,
//   //         avatar: avatarr,
//   //         avatar_name: avatar_name,
//   //         publish_date: datePublishInput.value,
//   //         image: image,
//   //         image_name: image_name,
//   //         content: contentInput.value
//   //   })
//   // })
//   // console.log(response.ok)
// }

const publishButton = document.getElementById("publish");
publishButton.addEventListener('click', publish);

 var avatarr;
 var postimage;
 var avatar_name;
 var image_name;
 var image;

function uploadAvatar(event) {
  let reader = new FileReader();
  reader.onload = () => {
    let definedAuthorImage = document.querySelector(".author-image-from-input");
    if (!!definedAuthorImage) {
      definedAuthorImage.remove();
    }
    let divAvatar = document.querySelector(".upload__avatar");
    if (divAvatar) {
      divAvatar.remove();
    }

    let authorImage = document.createElement("img");
    authorImage.classList.add("author-image-from-input");
    authorImage.setAttribute("id", "showAuthorImage");

    let formUpload = document.querySelector(".form__upload__author-photo");

    let labelChangeAvatar = document.querySelector(".upload__author-photo");
    labelChangeAvatar.innerHTML = "";

    let divUploadAvatar = document.createElement("div");
    divUploadAvatar.classList.add("upload__avatar");
    formUpload.insertBefore(divUploadAvatar, labelChangeAvatar);

    let divUploadNewAvatar = document.createElement("div");
    divUploadNewAvatar.style.display = "flex";
    let iconCamera = document.createElement("div");
    iconCamera.classList.add("icon-camera");
    let divUpload = document.createElement("div");
    divUpload.classList.add("text_upload-new");
    divUpload.classList.add("label-upload");
    divUpload.innerText = "Upload New";
    divUploadNewAvatar.appendChild(iconCamera);
    divUploadNewAvatar.appendChild(divUpload);

    divRemove = document.querySelector(".remove-avatar");
    if (!divRemove) {
      let divRemoveAvatar = document.createElement("div");
      divRemoveAvatar.classList.add("remove-avatar");
      divRemoveAvatar.style.display = "flex";
      let iconRemove = document.createElement("div");
      iconRemove.classList.add("icon-remove");
      let divRemove = document.createElement("div");
      divRemove.classList.add("text_upload-new");
      divRemove.classList.add("label-upload");
      divRemove.innerText = "Remove";
      divRemove.style.color = "#E86961";
      divRemoveAvatar.appendChild(iconRemove);
      divRemoveAvatar.appendChild(divRemove);
      formUpload.appendChild(divRemoveAvatar);
      formUpload.insertBefore(divRemoveAvatar, document.getElementById("author-image"));
      
      divRemoveAvatar.addEventListener('click', removeAvatar);
    }

    labelChangeAvatar.appendChild(divUploadNewAvatar);


    document.getElementById("previewAuthorImage").classList.add("preview-author-image");

    divUploadAvatar.appendChild(authorImage);
    authorImage.src = reader.result;
    previewAuthorImage.src = reader.result;
    
    avatarr = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
  avatar_name = event.target.files[0].name;
};


const uploadAvatarButton = document.getElementById("author-image");
uploadAvatarButton.addEventListener('change', uploadAvatar);

function removeAvatar(event) {
  let image = document.querySelector(".author-image-from-input");
  if (image) {
    image.remove();
  }
  let divAvatar = document.querySelector(".upload__avatar");
  divAvatar.remove();

  let labelChangeAvatar = document.querySelector(".upload__author-photo");
  labelChangeAvatar.innerHTML = "";
  let divUploadAvatar = document.createElement("div");
  let iconCamera = document.createElement("div");
  iconCamera.classList.add("icon-camera");
  divUploadAvatar.classList.add("upload__avatar");
  divUploadAvatar.appendChild(iconCamera);
  labelChangeAvatar.appendChild(divUploadAvatar);
  let divUpload = document.createElement("div");
  divUpload.classList.add("upload__text");
  divUpload.classList.add("label-upload");
  divUpload.innerText = "Upload";
  labelChangeAvatar.appendChild(divUpload);

  let divRemoveAvatar = document.querySelector(".remove-avatar");
  divRemoveAvatar.remove();

  let previewAuthorImage = document.getElementById("previewAuthorImage");
  previewAuthorImage.removeAttribute("src");
  previewAuthorImage.removeAttribute("class");
}


function uploadArticleImage(event) {
  let reader = new FileReader();
  reader.onload = () => {
    let divUploadArticleImage = document.querySelector(".form__upload__article-image__container");
    let definedArticleImage = document.querySelector(".article-image-from-input");
    if (!!definedArticleImage) {
      definedArticleImage.remove();
    }
    let articleImage = document.createElement("img");
    articleImage.classList.add("article-image-from-input");
    articleImage.setAttribute("id", "showArticleImage");

    let divFormUploadDescription = document.querySelector(".form__upload__article-image__description");
    pFormDesription = document.querySelector(".form__label-description-article");
    if (!!pFormDesription) {
      pFormDesription.remove();
    }

    let labelChangeArticleImage = document.querySelector(".upload__hero-image_article");
    if (!!labelChangeArticleImage) {
      labelChangeArticleImage.innerHTML = "";
    }

    divUploadNewArticleImage = document.querySelector(".upload-article");
    if (!divUploadNewArticleImage) {
      let divUploadNewArticleImage = document.createElement("label");
      divUploadNewArticleImage.classList.add("upload-article")
      divUploadNewArticleImage.setAttribute("for", "article-image")
      divUploadNewArticleImage.style.display = "flex";
      let iconCamera = document.createElement("div");
      iconCamera.classList.add("icon-camera");
      let divUpload = document.createElement("div");
      divUpload.classList.add("text_upload-new");
      divUpload.classList.add("label-upload");
      divUpload.innerText = "Upload New";
      divUploadNewArticleImage.appendChild(iconCamera);
      divUploadNewArticleImage.appendChild(divUpload);
      divFormUploadDescription.appendChild(divUploadNewArticleImage);
    }

    divRemove = document.querySelector(".remove-article");
    if (!divRemove) {
      let divRemoveArticleImage = document.createElement("div");
      divRemoveArticleImage.classList.add("remove-article");
      divRemoveArticleImage.style.display = "flex";
      let iconRemove = document.createElement("div");
      iconRemove.classList.add("icon-remove");
      let divRemove = document.createElement("div");
      divRemove.classList.add("text_upload-new");
      divRemove.classList.add("label-upload");
      divRemove.innerText = "Remove";
      divRemove.style.color = "#E86961";
      divRemoveArticleImage.appendChild(iconRemove);
      divRemoveArticleImage.appendChild(divRemove);
      divFormUploadDescription.appendChild(divRemoveArticleImage);

      divRemoveArticleImage.addEventListener('click', removeArticleImage);
    }

    document.getElementById("previewArticleImage").classList.add("preview-article-image");


    divUploadArticleImage.appendChild(articleImage);
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
  let image = document.querySelector(".article-image-from-input");
  if (!!image) {
    image.remove();
  }
  let previewArticleImage = document.getElementById("previewArticleImage");
  previewArticleImage.removeAttribute("src");
  previewArticleImage.removeAttribute("class");

  let labelImage = document.querySelector(".upload__hero-image_article");
  let divIconCamera = document.createElement("div");
  divIconCamera.classList.add("icon-camera");
  let divUpload = document.createElement("div");
  divUpload.classList.add("label-upload");
  divUpload.innerText = "Upload";
  labelImage.appendChild(divIconCamera);
  labelImage.appendChild(divUpload);

  let divFormUploadDescription = document.querySelector(".form__upload__article-image__description");
  divFormUploadDescription.innerHTML = "";
  let pDescription = document.createElement("p");
  pDescription.innerText = "Size up to 10mb. Format: png, jpeg, gif.";
  pDescription.classList.add("form__label-description-article");
  divFormUploadDescription.appendChild(pDescription);
}

function uploadPostImage(event) {
  let reader = new FileReader();
  reader.onload = () => {
    let divUploadPostImage = document.querySelector(".form__upload__post-image__container");
    let definedPostImage = document.querySelector(".post-image-from-input");
    if (!!definedPostImage) {
      definedPostImage.remove();
    }
    let postImage = document.createElement("img");
    postImage.classList.add("post-image-from-input");
    postImage.setAttribute("id", "showPostImage");

    let divFormUploadDescription = document.querySelector(".form__upload__post-image__description");
    pFormDesription = document.querySelector(".form__label-description-post");
    if (!!pFormDesription) {
      pFormDesription.remove();
    }

    let labelChangePostImage = document.querySelector(".upload__hero-image_post");
    if (!!labelChangePostImage) {
      labelChangePostImage.innerHTML = "";
    }

    divUploadNewPostImage = document.querySelector(".upload-post");
    if (!divUploadNewPostImage) {
      let divUploadNewPostImage = document.createElement("label");
      divUploadNewPostImage.classList.add("upload-post")
      divUploadNewPostImage.setAttribute("for", "post-image")
      divUploadNewPostImage.style.display = "flex";
      let iconCamera = document.createElement("div");
      iconCamera.classList.add("icon-camera");
      let divUpload = document.createElement("div");
      divUpload.classList.add("text_upload-new");
      divUpload.classList.add("label-upload");
      divUpload.innerText = "Upload New";
      divUploadNewPostImage.appendChild(iconCamera);
      divUploadNewPostImage.appendChild(divUpload);
      divFormUploadDescription.appendChild(divUploadNewPostImage);
    }

    divRemove = document.querySelector(".remove-post");
    if (!divRemove) {
      let divRemovePostImage = document.createElement("div");
      divRemovePostImage.classList.add("remove-post");
      divRemovePostImage.style.display = "flex";
      let iconRemove = document.createElement("div");
      iconRemove.classList.add("icon-remove");
      let divRemove = document.createElement("div");
      divRemove.classList.add("text_upload-new");
      divRemove.classList.add("label-upload");
      divRemove.innerText = "Remove";
      divRemove.style.color = "#E86961";
      divRemovePostImage.appendChild(iconRemove);
      divRemovePostImage.appendChild(divRemove);
      divFormUploadDescription.appendChild(divRemovePostImage);

      divRemovePostImage.addEventListener('click', removePostImage);
    }

    document.getElementById("previewPostImage").classList.add("preview-post-image");


    divUploadPostImage.appendChild(postImage);
    postImage.src = reader.result;
    previewPostImage.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
};

const uploadPostImageButton = document.getElementById("post-image");
uploadPostImageButton.addEventListener('change', uploadPostImage);

function removePostImage() {
  let image = document.querySelector(".post-image-from-input");
  if (image) {
    image.remove();
  }
  let previewPostImage = document.getElementById("previewPostImage");
  previewPostImage.removeAttribute("src");
  previewPostImage.removeAttribute("class");

  let labelImage = document.querySelector(".upload__hero-image_post");
  let divIconCamera = document.createElement("div");
  divIconCamera.classList.add("icon-camera");
  let divUpload = document.createElement("div");
  divUpload.classList.add("label-upload");
  divUpload.innerText = "Upload";
  labelImage.appendChild(divIconCamera);
  labelImage.appendChild(divUpload);

  let divFormUploadDescription = document.querySelector(".form__upload__post-image__description");
  divFormUploadDescription.innerHTML = "";
  let pDescription = document.createElement("p");
  pDescription.innerText = "Size up to 10mb. Format: png, jpeg, gif.";
  pDescription.classList.add("form__label-description-post");
  divFormUploadDescription.appendChild(pDescription);
}

function getTitle() {
  let input_taker = document.getElementById('title').value;
  let articleCardTitle = document.getElementById('showTitle');
  let postCardTitle = document.getElementById('cardShowTitle');
  articleCardTitle.innerHTML = input_taker;
  postCardTitle.innerHTML = input_taker;
  if(input_taker == ''){
    articleCardTitle.innerHTML = 'New Post';
    postCardTitle.innerHTML = 'New Post';
  }
}

const printTitle = document.getElementById("title");
printTitle.addEventListener('keyup', getTitle);

function getSubtitle() {
  let input_taker = document.getElementById('subtitle').value;
  let articleCardSubtitle = document.getElementById('showSubitle');
  let postCardSubtitle = document.getElementById('cardShowSubtitle'); 
  articleCardSubtitle.innerHTML = input_taker;
  postCardSubtitle.innerHTML = input_taker;
  if(input_taker == ''){
    articleCardSubtitle.innerHTML = 'Please, enter any description';
    postCardSubtitle.innerHTML = 'Please, enter any description';
  }
}

const printSubtitle = document.getElementById("subtitle");
printSubtitle.addEventListener('keyup', getSubtitle);

function getAuthorName() {
  let input_taker = document.getElementById('author').value;
  let postCardAuthor = document.getElementById('showAuthor');
  postCardAuthor.innerHTML = input_taker;
  if(input_taker == ''){
    postCardAuthor.innerHTML = 'Kirill';
  }
}

const printAuthorName = document.getElementById("author");
printAuthorName.addEventListener('keyup', getAuthorName);

function getPublishDate() {
  let input_taker = document.getElementById('date').value;
  let postCardDate = document.getElementById('showPublishDate');
  postCardDate.innerText = input_taker;
}

const printPublishDate = document.getElementById("date");
printPublishDate.addEventListener('change', getPublishDate);