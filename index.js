
username = "";
userAvatar = "";
postUuid = "";

(function(apiUrl) {
    function getMe() {
      return fetch(apiUrl + "/me")
        .then(function(response) {
          return response.json();
        })
        .then(function(user) {
          const $username = document.getElementById("current-user-username");
          const $avatar = document.getElementById("current-user-avatar");
  
          username = user.username;
          $username.innerHTML = user.username;
  
          if (user.avatar) {
            
            avatar = user.avatar;
            $avatar.style.backgroundImage = "url('" + user.avatar + "')";
          }
        });
    }

    function getPost() {
        return fetch(apiUrl + "/post")
          .then(function(response) {
            return response.json();
          })
          .then(function(post) {
            const $username = document.getElementById("publisher-info-name");
            const $avatar = document.getElementById("publisher-avatar");
            const $location = document.getElementById("publisher-info-location");
            const $image = document.getElementById("image");
            const $date = document.getElementById("date-post");
            const $comments_qt = document.getElementById("comments-qt");
    
            $username.innerHTML = post.user.username;
    
            if (post.user.avatar) {
              $avatar.style.backgroundImage = "url('" + post.user.avatar + "')";
            }

            $location.innerHTML = post.location.city + ", " + post.location.country;
            $image.style.backgroundImage = "url('" + post.photo + "')";
            date = new Date(post.created_at);
            months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            $date.innerHTML = date.getDate()  + " de " + months[date.getMonth()];
            $comments_qt.innerHTML = post.comments.length + " comentários";

            post.comments.forEach(comment => {
              buildComment(comment.user.avatar, comment.user.username, comment.message, new Date(comment.created_at));
            }); 

            postUuid = post.uuid;

          });
      }
  
    function initialize() {
      getMe();
      getPost();
    }
  
    initialize();
  })("https://taggram.herokuapp.com");

  async function  sendComment(apiUrl) {

    var message = document.getElementById("textfield").value;
    let body = { username: username , message: message };
    var myInit = { method: 'POST', headers: {'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify(body) };
    var url = apiUrl + "/posts/" + postUuid + "/comments"

    try {
      const response = await fetch(url, myInit);
      if (!response.ok) {
        return new Error('falhou a requisição');
      }
      const comments = await response.json();
      const $comments = document.getElementById("comments");
      $comments.innerHTML = "";

      console.log(comments);

      comments.forEach(comment => {
        buildComment(comment.user.avatar, comment.user.username, comment.message, new Date(comment.created_at));
      });
    } catch (err) {
      window.alert("Houve um erro ao enviar seu comentário. Por favor tente novamente!");
      console.log(err.message);
    }
  }

  function buildComment(avatar, name, message, created_at){
    
    const $comments = document.getElementById("comments");
    var comment_container = document.createElement("DIV");
    var comment = document.createElement("DIV");
    var avatar1 = document.createElement("DIV");
    var comment_info = document.createElement("DIV");
    var date = document.createElement("DIV");

    comment_info.setAttribute("class", "message");
    comment_container.setAttribute("class", "comment-container");
    comment.setAttribute("class", "comment");
    avatar1.setAttribute("class", "publisher__avatar");
    date.setAttribute("class", "comment-date");
    
    comment_info.innerHTML = "<b>" + name + "</b> " + message;
    
    if(avatar){
      avatar1.style.backgroundImage = "url(" + avatar + ")";
    }

    created_at = new Date(created_at);
    date.innerHTML = created_at.getDate();

    const now = Date.now();
    var timeDiff = Math.abs(now - created_at);
    var diff = Math.ceil(timeDiff / (1000 * 60)); 
    var unit = "m";

    if(diff >= 60){
      diff = Math.ceil(diff/60);
      unit = "h";
    }
    if(diff >= 24){
      diff = Math.ceil(diff/24);
      unit = "d";
    }
    if(diff >= 7){
      diff = Math.ceil(diff/7);
      unit = "w";
    }

    date.innerHTML = diff+unit;

    comment.appendChild(avatar1);
    comment.appendChild(comment_info);
    comment_container.appendChild(comment);
    comment_container.appendChild(date);

    $comments.appendChild(comment_container);
  }