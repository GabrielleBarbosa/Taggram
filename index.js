
//variáveis para usar no post do comentário do usuário
username = "";
userAvatar = "";
postUuid = "";

//função de inicialização, recebe informações do post e do usuário atual
(function(apiUrl) {

  //função que recebe o usuário atual
    function getMe() {
      return fetch(apiUrl + "/me")
        .then(function(response) {
          return response.json();
        })
        .then(function(user) {
          const $username = document.getElementById("current-user-username"); //div que receberá o username para mostrar na página
          const $avatar = document.getElementById("current-user-avatar");     //div que receberá o avatar para mostrar na página
  
          username = user.username;
          $username.innerHTML = user.username;
  
          if (user.avatar) {
            avatar = user.avatar;
            $avatar.style.backgroundImage = "url('" + user.avatar + "')";
          }
        });
    }

    //função que recebe as informações do post
    function getPost() {
        return fetch(apiUrl + "/post")
          .then(function(response) {
            return response.json();
          })
          .then(function(post) {

            //divs da página que receberão as informações
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

            //tratando a data para mostrar "dia de mês" ("9 de outubro", por exemplo)
            date = new Date(post.created_at);
            months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            $date.innerHTML = date.getDate()  + " de " + months[date.getMonth()];

            $comments_qt.innerHTML = post.comments.length + " comentários";

            post.comments.forEach(comment => {
              buildComment(comment.user.avatar, comment.user.username, comment.message, new Date(comment.created_at));
            }); 

            //guarda o uuid do post para quando for salvar o comentário escrito pelo user
            postUuid = post.uuid;

          });
      }
  
    function initialize() {
      getMe();
      getPost();
    }
  
    initialize();
  })("https://taggram.herokuapp.com");

  //função que manda o comentário para o banco de dados
  function  sendComment(apiUrl) {

    //pega o valor do comentário digitado
    var message = document.getElementById("textfield").value;

    //informações para mandar 
    let body = { username: username , message: message };

    var init = { method: 'POST', headers: {'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify(body) };
    var url = apiUrl + "/posts/" + postUuid + "/comments"

    try {
      const response = await fetch(url, init);

      //verifica se não deu erro
      if (!response.ok) {
        return new Error('falhou a requisição');
      }

      const comments = await response.json();
      const $comments = document.getElementById("comments");
      $comments.innerHTML = "";

      //recarrega os comentários
      comments.forEach(comment => {
        buildComment(comment.user.avatar, comment.user.username, comment.message, new Date(comment.created_at));
      });

    } catch (err) {
      window.alert("Houve um erro ao enviar seu comentário. Por favor tente novamente!");
    }
  }

  //função construtora do comentário
  function buildComment(avatar, name, message, created_at){
    
    //referência da área de comentários
    const $comments = document.getElementById("comments");

    //criação de divs para estruturação
    var comment_container = document.createElement("DIV");
    var comment = document.createElement("DIV");
    var avatar1 = document.createElement("DIV");
    var comment_info = document.createElement("DIV");
    var date = document.createElement("DIV");

    //atribuição das classes (css)
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

    //cálculo do tempo decorrido da postagem até a data presente
    const now = Date.now();
    var timeDiff = Math.abs(now - created_at.getTime());
    var diff = Math.ceil(timeDiff / (1000 * 60)); //minutos
    var unit = "min";

    if(diff >= 60){
      diff = Math.ceil(diff/60); //horas
      unit = "h";

      if(diff >= 24){
        diff = Math.ceil(diff/24); //dias
        unit = "d";

        if(diff >= 7){
          diff = Math.ceil(diff/7); //semanas
          unit = "w";
        }
      }
    }

    date.innerHTML = diff+unit;

    comment.appendChild(avatar1);
    comment.appendChild(comment_info);
    comment_container.appendChild(comment);
    comment_container.appendChild(date);
    $comments.appendChild(comment_container);
  }