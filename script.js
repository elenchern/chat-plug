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
      <div class="vjs-chat__pinned-message vjs-chat_hidden"></div>
      <div class="vjs-chat__messages-container"></div>

      <div class="vjs-chat__registr-container">
        <input class="vjs-chat__input-username" type="text" placeholder="User">
        <div class="vjs-chat__button-login">login</div>
        <label class="vjs-chat__label-container">
          <input class="vjs-chat__input-admin" id="admin" type="checkbox">Admin
        </label>
      </div>

      <div class="vjs-chat__send-messages-container vjs-chat_hidden">
        <div class="vjs-chat__contaiher-textarea">
          <div class="vjs-chat__button-load">
            <input class="vjs-chat__input-download-ava" type="file" accept="image/*">
          </div>
          <div class="vjs-chat__textarea" contenteditable>Добавить комментарий</div>
        </div>
        <img class="vjs-chat__img-button-like" src="img/like2.png" alt="like">
      </div>`;
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
  let chatContainer = videoJs.querySelector('.vjs-chat__messages-container');
  let btnLogin = videoJs.querySelector('.vjs-chat__button-login');
  let inputUsername = videoJs.querySelector('.vjs-chat__input-username');
  let btnLoad = videoJs.querySelector('.vjs-chat__button-load');
  let isPinned = videoJs.querySelector('.vjs-chat__pinned-message');
  let inputDownload = videoJs.querySelector('.vjs-chat__input-download-ava');
  let isAdmin = videoJs.querySelector('.vjs-chat__input-admin');
  let saveMessage = JSON.parse( localStorage.getItem('messageList') );
  let saveAvatar = JSON.parse( localStorage.getItem('messageAva') );
  let saveUser = JSON.parse( localStorage.getItem('Username') );
  let savePinnedMessage = JSON.parse( localStorage.getItem('Pinned') );

  let admin = false;
  let readerImg = '';
  let themeMessage = '';

  if (vjsChat.parentElement.clientWidth >= 1280) { //размер чата в зависимостти от ширины плеера
    vjsChat.classList.add('vjs-chat_width-deskstop');
  } else if (vjsChat.parentElement.clientWidth >= 768) {
    vjsChat.classList.add('vjs-chat_width-tablet');
  } else if (vjsChat.parentElement.clientWidth < 768) {
    vjsChat.classList.add('vjs-chat_width-mobile');
  };

  // vjsChat.classList.add('vjs-chat_hidden');

  if (savePinnedMessage != null) {
    isPinned.classList.remove('vjs-chat_hidden');
    isPinned.innerHTML = savePinnedMessage;
  };

  isAdmin.onchange = function() {
    if (isAdmin.checked) {
      admin = true;
    };
  };

  if (saveMessage == null) {
    id = 0;
  } else {
    videoJs.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat_hidden');
    videoJs.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat_hidden');

    id = saveMessage.length;
    for (var i = 0; i < saveMessage.length; i++) {
      chatContainer.innerHTML += saveMessage[i].message;
      messageArray = saveMessage;
      chatContainer.scrollTop = chatContainer.scrollHeight;
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
        myButtonDom.querySelector('svg').setAttribute("fill", "rgb(85, 85, 209");
      };
    };
    this.on = null;
  });

  inputDownload.onchange = function() { //загрузка и сохранение аватарки
    let file = videoJs.querySelector('input[type=file]').files[0];
    readerImg = new FileReader();
    readerImg.onloadend = function() {
      btnLoad.style.backgroundImage = "url('" + readerImg.result + "')";
      saveImg = ( {'avatar': btnLoad.style.backgroundImage} );
      localStorage.setItem( 'messageAva', JSON.stringify(saveImg) );
    };
    if (file) {
      readerImg.readAsDataURL(file);
    } else {
      btnLoad.style.backgroundImage = "url('img/default_ava.png')";
    };
  };

  textareaMessage.onclick = function() {
    this.textContent = '';
  };

  btnLogin.onclick = function() { //сохранение имя пользователя, показ чата
    user = ( {'userName': inputUsername.value, 'isAdmin': admin} );
    localStorage.setItem( 'Username', JSON.stringify(user) );
    videoJs.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat_hidden');
    videoJs.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat_hidden');
  };

  let messAva = videoJs.getElementsByClassName('vjs-chat__img-ava');//аватарка в сообщениях
  for (var i=0; i < messAva.length; i++) {
    if (saveAvatar != null) {
      messAva[i].style.backgroundImage = saveAvatar.avatar;
    } else {
      messAva[i].style.backgroundImage = 'url(img/default_ava.png)';
    };
  };

  textareaMessage.onkeyup = function(ent) { //отправка по enter
    if(ent.keyCode==13) {
      if (saveUser == null) {
        if (admin == true) {
          themeMessage = 'vjs-chat_theme_admin';
        } else if (admin == false) {
          themeMessage = 'vjs-chat_theme';
        };
      } else {
        if (saveUser.isAdmin == true) {
          themeMessage = 'vjs-chat_theme_admin';
        } else if (saveUser.isAdmin == false) {
          themeMessage = 'vjs-chat_theme';
        };
      };
      messageArray.push( {'id':id,
      'message': `<div class="vjs-chat__container-fullmessage">
      <div class="vjs-chat__img-ava"></div>
      <div class="vjs-chat__message ${themeMessage}"> ${JSON.parse( localStorage.getItem('Username') ).userName}</br>
      ${textareaMessage.textContent}</div>`} );

      localStorage.setItem( 'messageList', JSON.stringify(messageArray) );
      chatContainer.innerHTML += messageArray[id].message;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      textareaMessage.textContent = '';
      id += 1;
      for (var i=0; i < messAva.length; i++) {
        if (saveAvatar != null) {
          messAva[i].style.backgroundImage = saveAvatar.avatar;
        };
      };
    };
  };

  let divMessage = videoJs.getElementsByClassName('vjs-chat__message');
  for (var i=0; i < divMessage.length; i++) { //закреплёные сооббщения
    divMessage[i].onclick = function() {
      isPinned.classList.remove('vjs-chat_hidden');
      isPinned.innerHTML = this.innerHTML;
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



 
