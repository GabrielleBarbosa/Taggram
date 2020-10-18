(function(apiUrl) {
    function getMe() {
      return fetch(apiUrl + "/me")
        .then(function(response) {
          return response.json();
        })
        .then(function(user) {
          const $username = document.getElementById("current-user-username");
          const $avatar = document.getElementById("current-user-avatar");
  
          $username.innerHTML = user.username;
  
          if (user.avatar) {
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
            const $date = document.getElementById("date");
            const $comments_qt = document.getElementById("comments-qt");
    
            $username.innerHTML = post.user.username;
    
            if (post.user.avatar) {
              $avatar.style.backgroundImage = "url('" + post.user.avatar + "')";
            }

            $location.innerHTML = post.location.city + ", " + post.location.country;
            $image.style.backgroundImage = "url('" + post.photo + "')";
            date = new Date(post.created_at);
            months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            $date.innerHTML = date.getDay()  + " de " + months[date.getMonth()];
            $comments_qt.innerHTML = post.comments.length + " comentários";

          });
      }
  
    function initialize() {
      getMe();
      getPost();
    }
  
    initialize();
  })("https://taggram.herokuapp.com");