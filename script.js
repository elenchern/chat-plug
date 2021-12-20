const Component = videojs.getComponent('Component');
let id = 0;
class ChatComponent extends Component {
  constructor(player) {
    super(player);
  };
  createEl() {
    const element = videojs.createEl('div', {
      className: 'vjs-chat',
    });
    element.insertAdjacentHTML( 'afterbegin', this.getTemplate() );
    return element;
  };
  getTemplate() {
    return `
      <div class="vjs-chat__messages-container"></div>
      <input class="vjs-chat__input-username" type="text" placeholder="User">
      <div class="vjs-chat__button-login">login</div>
      <label class="vjs-chat__label-container">
        <input class="vjs-chat__input-admin" id="admin" type="checkbox">Admin
      </label>
      <div class="vjs-chat__button-load">
        <input type="file" class="vjs-chat__input-download-pic" accept="image/*">
        <div class="vjs-chat__button-choose-ava">Choose</div>
      </div>
      <textarea class="vjs-chat__textarea" type="text" placeholder="Message..."></textarea>
      <div id="vjs-chat__textarea-container"></div>
      <div class="vjs-chat__button-container">Send</div>
      <img class="vjs-chat__button-like" src="img/like2.png" alt="like">`;
  };
};

Component.registerComponent('ChatComponent', ChatComponent);

function ExamplePlugin() {
  this.addChild('ChatComponent');

  videoJs = this.el();
  let messageArray = [];
  let saveImg = [];
  let user = [];
  let vjsChat = videoJs.querySelector('.vjs-chat');
  let textareaMessage = videoJs.querySelector('.vjs-chat__textarea');
  let btnSend = videoJs.querySelector('.vjs-chat__button-container');
  let chatContainer = videoJs.querySelector('.vjs-chat__messages-container');
  let btnLogin = videoJs.querySelector('.vjs-chat__button-login');
  let inputUsername = videoJs.querySelector('.vjs-chat__input-username');
  let btnLoad = videoJs.querySelector('.vjs-chat__button-load');
  let isPinned = document.querySelector('.vjs-chat__pinned-message');
  let inputDownload = videoJs.querySelector('.vjs-chat__input-download-pic');
  let isAdmin = videoJs.querySelector('.vjs-chat__input-admin');
  let saveMessage = JSON.parse( localStorage.getItem('messageList') );
  let saveAvatar = JSON.parse( localStorage.getItem('messageAva') );
  let saveUser = JSON.parse( localStorage.getItem('Username') );
  let savePinnedMessage = JSON.parse( localStorage.getItem('Pinned') );

  let admin = 0;
  let reader = '';
  let themeMessage = '';

  vjsChat.classList.add('vjs-chat_hidden');
  isPinned.classList.add('vjs-chat_hidden');

  if (savePinnedMessage != null) {
    isPinned.classList.remove('vjs-chat_hidden');
    isPinned.innerHTML = savePinnedMessage;
  };

  isAdmin.onchange = function() {
    if (isAdmin.checked) {
      admin = 1;
    } else {
      admin = 0;
    };
  };

  if (saveMessage == null) {
    id = 0;
    videoJs.querySelector('.vjs-chat__button-like').classList.add('vjs-chat_hidden');
    textareaMessage.classList.add('vjs-chat__textarea_hidden');
    btnSend.classList.add('vjs-chat__button-container_hidden');
  } else {
    videoJs.querySelector('.vjs-chat__label-container').classList.add('vjs-chat_hidden');
    id = saveMessage.length;
    for (var i = 0; i < saveMessage.length; i++) {
      chatContainer.innerHTML += saveMessage[i].message;
      messageArray = saveMessage;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      if (saveUser == null) {//если ника нет, то отправка сообщений недоступна
        console.log('gh')
        textareaMessage.classList.add('vjs-chat__textarea_hidden');
        btnSend.classList.add('vjs-chat__button-container_hidden');
      };
    };
  };
  if (saveAvatar != null) {
    btnLoad.style.backgroundImage = saveAvatar.avatar;
  };

  this.on('playing', function() {
    vjsChat.classList.remove('vjs-chat_hidden');

    let myButton = this.controlBar.addChild("button"); //добавление кнопки открытия/закрытия чата
    myButtonDom = myButton.el();
    myButtonDom.innerHTML = '<svg class="vjs-svg-use-button" fill="white" width="70%" height="70%" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><use class="vjs-chat__svg-use-button" xlink:href="icon.svg#icon_1"/></svg>';
    svgBttn = myButtonDom.querySelector('.vjs-chat__svg-use-button');
    svgIcon = myButtonDom.querySelector('.vjs-chat__svg-button');
    svgBttn.onclick = function() {
      if (vjsChat.classList.contains('vjs-chat_hidden')) {
        myButtonDom.querySelector('svg').setAttribute("fill", "white");//изменение цвета иконкиы
        vjsChat.classList.remove('vjs-chat_hidden');
      } else {
        vjsChat.classList.add('vjs-chat_hidden');
        myButtonDom.querySelector('svg').setAttribute("fill", "rgb(241, 70, 2)");
      };
    };
    let fullscreen = videoJs.querySelector('.vjs-fullscreen-control');
    fullscreen.onclick = function() {
      vjsChat.classList.add('vjs-chat_hidden');
    };
    this.on = null;
  });

  textareaMessage.addEventListener("keyup", function() { //расширение textarea
    let lineHeight = 15;
    let minLineCount = 2;
    var minLineHeight = minLineCount * lineHeight;
    var obj = event.target;
    var div = document.getElementById('vjs-chat__textarea-container');
    div.innerHTML = obj.value;
    var objHeight = div.offsetHeight;
    if (objHeight < minLineHeight)
      objHeight = minLineHeight;
      obj.style.height = objHeight + 'px';
  });

  inputDownload.onchange = function() { //загрузка и сохранение аватарки
    let file = videoJs.querySelector('input[type=file]').files[0];
    reader = new FileReader();
    reader.onloadend = function() {
      btnLoad.style.backgroundImage = "url('" + reader.result + "')";
      saveImg = ( {'avatar': btnLoad.style.backgroundImage} );
      localStorage.setItem( 'messageAva', JSON.stringify(saveImg) );
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      btnLoad.style.backgroundImage ='url(img/default_ava.png)';
    };
  };

  btnLogin.onclick = function() { //сохранение имя пользователя, показ чата
    user = ( {'userName': inputUsername.value, 'isAdmin': admin} );
    localStorage.setItem( 'Username', JSON.stringify(user) );
    textareaMessage.classList.remove('vjs-chat__textarea_hidden');
    btnSend.classList.remove('vjs-chat__button-container_hidden');
    videoJs.querySelector('.vjs-chat__label-container').classList.add('vjs-chat_hidden');
    videoJs.querySelector('.vjs-chat__button-like').classList.remove('vjs-chat_hidden');
  };

  let messAva = videoJs.getElementsByClassName('vjs-chat__img-ava');//аватарка в сообщениях
  for (var i=0; i < messAva.length; i++) {
    if (saveAvatar != null) {
      messAva[i].style.backgroundImage = saveAvatar.avatar;
    } else {
      messAva[i].style.backgroundImage = 'url(img/defoult_ava.png)';
    };
  };

  btnSend.onclick = function() {
    if (saveUser == null) {
      if (admin == 1) {
        themeMessage = 'vjs-chat_theme_admin';
      } else if (admin == 0) {
        themeMessage = 'vjs-chat_theme';
      };
    } else {
      if (saveUser.isAdmin == 1) {
        themeMessage = 'vjs-chat_theme_admin';
      } else if (saveUser.isAdmin == 0) {
        themeMessage = 'vjs-chat_theme';
      };
    };
    messageArray.push( {'id':id,
    'message': `<div class="vjs-chat__container-fullmessage">
    <div class="vjs-chat__img-ava"></div>
    <div class="vjs-chat__message ${themeMessage}"> ${ JSON.parse( localStorage.getItem('Username') ).userName}</br>
    ${textareaMessage.value}</div>`} );

    localStorage.setItem( 'messageList', JSON.stringify(messageArray) );
    chatContainer.innerHTML += messageArray[id].message;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    textareaMessage.value = '';
    id += 1;
    for (var i=0; i < messAva.length; i++) {
      if (saveAvatar != null) {
        messAva[i].style.backgroundImage = saveAvatar.avatar;
      } else {
        messAva[i].style.backgroundImage = 'url(img/defoult_ava.png)';
      };
    };
  };

  textareaMessage.onkeyup = function(ent) { //отправка по enter
    if(ent.keyCode==13){
      if (saveUser == null) {
        if (admin == 1) {
          themeMessage = 'vjs-chat_theme_admin';
        } else if (admin == 0) {
          themeMessage = 'vjs-chat_theme';
        };
      } else {
        if (saveUser.isAdmin == 1) {
          themeMessage = 'vjs-chat_theme_admin';
        } else if (saveUser.isAdmin == 0) {
          themeMessage = 'vjs-chat_theme';
        };
      };
      messageArray.push( {'id':id,
      'message': `<div class="vjs-chat__container-fullmessage">
      <div class="vjs-chat__img-ava"></div>
      <div class="vjs-chat__message ${themeMessage}"> ${JSON.parse( localStorage.getItem('Username') ).userName}</br>
      ${textareaMessage.value}</div>`} );

      localStorage.setItem( 'messageList', JSON.stringify(messageArray) );
      chatContainer.innerHTML += messageArray[id].message;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      textareaMessage.value = '';
      id += 1;
      for (var i=0; i < messAva.length; i++) {
        if (saveAvatar != null) {
          messAva[i].style.backgroundImage = saveAvatar.avatar;
        };
      };
    };
  };

  let divMessage = videoJs.getElementsByClassName('vjs-chat__container-fullmessage');
  for (var i=0; i < divMessage.length; i++) { //закреплёные сооббщения
    divMessage[i].onclick = function() {
      isPinned.classList.remove('vjs-chat_hidden');
      isPinned.innerHTML = this.innerHTML;
      theme = isPinned.querySelector('.vjs-chat__message');
      theme.className = "vjs-chat_theme_blur";
      localStorage.setItem( 'Pinned', JSON.stringify(isPinned.innerHTML) );
    };
  };
  isPinned.onclick = function() {
    window.localStorage.removeItem("Pinned");
    this.classList.add('vjs-chat_hidden');
  };
};

videojs.registerPlugin('ExamplePlugin', ExamplePlugin);

videojs('video-exam', {
  fluid: true,
  controlBar: true,
  plugins: {
    ExamplePlugin: true
  },
});

