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
        <img class="vjs-chat__img-button-like" src="img/like.png" alt="like">
      </div>
      <div class="vjs-chat__container-answer-message vjs-chat_hidden">Сообщение прикреплено</div>`;
  };
};

Component.registerComponent('ChatComponent', ChatComponent);

function ChatPlugin() {
  'use strict';
  this.addChild('ChatComponent');

  var videoEl = this.el();


  var videoContainer = videojs.createEl('div', {
    className: 'chat-plugin',
  });
  videoEl.parentNode.insertBefore(videoContainer, videoEl);
  videoContainer.appendChild(videoEl);
  // this.addClass('chat-plugin');

  let saveImg = [];
  let user = [];
  let messageArrayFeed = [
    {
			"id": "0",
			"userName": "Admin",
			"isPinned": true,
			"isAdmin": true,
			"message":" Дополнительная скидка 15% по промокоду ВЕСНА15",
			"avatar": "https://cdn-icons-png.flaticon.com/512/194/194938.png",
			"answerTo": null
		}, {
			"id": "1",
			"userName": "Костя Морозов",
			"isPinned": false,
			"isAdmin": false,
			"message": "Надюша начинай",
			"avatar": "https://www.pngarts.com/files/5/User-Avatar-PNG-Free-Download.png",
			"answerTo": null
		 }, {
			"id": "2",
			"userName": "Рузанна Комиссарова",
			"isPinned": false,
			"isAdmin": false,
			"message": "Здравствуйте, как купить туфли",
			"avatar": null,
			"answerTo": null
		}, {
			"id": "3",
			"userName": "Admin",
			"isPinned": false,
			"isAdmin": true,
			"message": "Надюша начинай",
			"avatar": null,
			"answerTo": "2"
		}
  ];

  let messageArrayFeedLength = messageArrayFeed.length;

  let messagesAvatar = videoEl.getElementsByClassName('vjs-chat__img-ava');
  let vjsChat = videoEl.querySelector('.vjs-chat');
  let textareaMessage = videoEl.querySelector('.vjs-chat__textarea');
  let chatContainer = videoEl.querySelector('.vjs-chat__messages-container');
  let btnLogin = videoEl.querySelector('.vjs-chat__button-login');
  let inputUsername = videoEl.querySelector('.vjs-chat__input-username');
  let btnLoad = videoEl.querySelector('.vjs-chat__button-load');
  let isPinned = videoEl.querySelector('.vjs-chat__pinned-message');
  let inputDownload = videoEl.querySelector('.vjs-chat__input-download-ava');
  let adminEl = videoEl.querySelector('.vjs-chat__input-admin');
  let saveAvatar = JSON.parse( localStorage.getItem('messageAva') );
  let saveUser = JSON.parse( localStorage.getItem('Username') );
  let savePinnedMessage = JSON.parse( localStorage.getItem('Pinned') );
  let storageMessage = JSON.parse( localStorage.getItem('messageList') );

  let admin = false;
  let readerImg = '';
  let themeMessage = '';
  let answerIndex = null;

  function FillingStorageMessage() {
    if (storageMessage != null) {
      for (var i = messageArrayFeed.length; i < storageMessage.length; i++){
      messageArrayFeed.push(storageMessage[i]);
      localStorage.setItem( 'messageList', JSON.stringify(messageArrayFeed) );
      };
    } else {
      localStorage.setItem( 'messageList', JSON.stringify(messageArrayFeed) );
    };
    return JSON.parse( localStorage.getItem('messageList') );
  };
  FillingStorageMessage();
  storageMessage = JSON.parse( localStorage.getItem('messageList') );

  let id = storageMessage.length;

  for (var i = 0; i < storageMessage.length; i++) {
    if (storageMessage[i].answerTo == null) {
      chatContainer.innerHTML += `<div class="vjs-chat__container-fullmessage">
      <div class="vjs-chat__img-ava"></div>
      <div class="vjs-chat__message vjs-chat__message_${ i }">${storageMessage[i].userName}</br>${storageMessage[i].message}</div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer" alt="answer" id="${ i }" title="Ответить">`;
    } else {
      let j = storageMessage[i].answerTo;
      chatContainer.innerHTML += `
      <div class="vjs-chat__container-fullmessage">
      <div class="vjs-chat__img-ava"></div>
      <div class="vjs-chat__message vjs-chat__message_${ i }"><div class="vjs-chat__message_answer">
      ${storageMessage[j].userName}</br>${storageMessage[j].message}</div>
      ${storageMessage[i].userName}</br>${storageMessage[i].message}</div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${ i }" alt="answer" title="Ответить">`;
    };

    if (storageMessage[i].avatar != null) {
      messagesAvatar[i].style.backgroundImage = 'url(' + storageMessage[i].avatar + ')';
    };

    let chatMessage =  videoEl.querySelectorAll('.vjs-chat__message');
    if (storageMessage[i].isAdmin) {
      chatMessage[i].classList.add('vjs-chat_theme_admin');
    } else {
      chatMessage[i].classList.add('vjs-chat_theme');
    };

    if (storageMessage[i].isPinned) {
      isPinned.classList.remove('vjs-chat_hidden');
      isPinned.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="zakrep">
      <div class="vjs-chat_pinned-line">${chatMessage[i].innerHTML}<div>`;
    };
  };

  chatContainer.scrollTop = chatContainer.scrollHeight;

  vjsChat.classList.add('vjs-chat_hidden');

  if (savePinnedMessage?.isPinnedContent) {
    isPinned.classList.remove('vjs-chat_hidden');
    isPinned.innerHTML = savePinnedMessage.isPinnedContent;
  } else {
    isPinned.classList.add('vjs-chat_hidden');
  };

  function AdminChange() {
    adminEl.onchange = function() {
      if (adminEl.checked) {
        admin = true;
      };
    };
    return admin;
  };
  AdminChange();

  if (storageMessage.length === messageArrayFeedLength) {
    id = storageMessage.length;
  } else {
    videoEl.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat_hidden');
    videoEl.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat_hidden');
  };
  if (saveAvatar != null) {
    btnLoad.style.backgroundImage = saveAvatar.avatar;
  };

  this.one('playing', function() {
    vjsChat.classList.remove('vjs-chat_hidden');

    let chatDisplayBtn = this.controlBar.addChild("button"), //добавление кнопки открытия/закрытия чата
    chatDisplayBtnEl = chatDisplayBtn.el();
    chatDisplayBtnEl.innerHTML = '<svg class="vjs-svg-use-button" width="70%" height="70%" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><use class="vjs-chat__svg-use-button" xlink:href="icon.svg#icon_1"/></svg>';
    let svgBttn = chatDisplayBtnEl.querySelector('svg');
    svgBttn.onclick = function() {
      if (vjsChat.classList.contains('vjs-chat_hidden')) {
        svgBttn.classList.remove("vjs-svg-use-button_color");//изменение цвета иконкиы
        vjsChat.classList.remove('vjs-chat_hidden');
      } else {
        vjsChat.classList.add('vjs-chat_hidden');
        svgBttn.classList.add("vjs-svg-use-button_color");
      };
    };
  });

  saveImg = ( {'avatar': btnLoad.style.backgroundImage} );
  localStorage.setItem( 'messageAva', JSON.stringify(saveImg) );

  function FillingStorageAva() {
    inputDownload.onchange = function() { //загрузка и сохранение аватарки
      let file = videoEl.querySelector('input[type=file]').files[0];
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
    return JSON.parse( localStorage.getItem('messageAva') );
  };
  FillingStorageAva();

  saveAvatar = JSON.parse( localStorage.getItem('messageAva') );

  textareaMessage.onclick = function() {
    this.textContent = '';
    this.onclick = null;
  };

    btnLogin.onclick = function() {//сохранение имя пользователя, показ чата
      user = ( {'userName': inputUsername.value, 'isAdmin': admin} );
      localStorage.setItem( 'Username', JSON.stringify(user) );
      videoEl.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat_hidden');
      videoEl.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat_hidden');
  };

  for (var n = messageArrayFeedLength; n < storageMessage.length; n++) {//аватарка в сообщениях
    if (saveAvatar != null) {
      messagesAvatar[n].style.backgroundImage = saveAvatar.avatar;
    } else {
      messagesAvatar[n].style.backgroundImage = 'url(img/default_ava.png)';
    };
  };

  let messageContent = '';
  function MessegeContent() {
    saveUser = JSON.parse( localStorage.getItem('Username') );
    if (saveUser == null) {
      if (admin) {
        themeMessage = 'vjs-chat_theme_admin';
      } else {
        themeMessage = 'vjs-chat_theme';
      };
    } else {
      if (saveUser.isAdmin) {
        themeMessage = 'vjs-chat_theme_admin';
      } else {
        themeMessage = 'vjs-chat_theme';
      };
    };

    if (toAnswer == '') {
        messageContent = `
        <div class="vjs-chat__container-fullmessage">
          <div class="vjs-chat__img-ava"></div>
          <div class="vjs-chat__message ${themeMessage} vjs-chat__message_${id}"> ${saveUser.userName}</br>
          ${textareaMessage.textContent}</div>
        <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${videoEl.querySelectorAll('.vjs-chat__message').length }" alt="answer" title="Ответить">`;
      } else {
      messageContent = `
      <div class="vjs-chat__container-fullmessage">
        <div class="vjs-chat__img-ava"></div>
        <div class="vjs-chat__message ${themeMessage} vjs-chat__message_${id}"><div class="vjs-chat__message_answer">
        ${toAnswer}</div>
        ${saveUser.userName}</br>${textareaMessage.textContent}</div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${videoEl.querySelectorAll('.vjs-chat__message').length }" alt="answer" title="Ответить">`;
    };
    return messageContent;
  };

  textareaMessage.onkeyup = function(ent) {//отправка по enter
    if(ent.keyCode == 13) {
      let answerMessage = videoEl.querySelector('.vjs-chat__container-answer-message');
      answerMessage.classList.add('vjs-chat_hidden');

      FillingStorageAva();
      MessegeContent();

      messageArrayFeed.push( {'id':id, 
      'message': textareaMessage.textContent, 'avatar': saveAvatar.avatar, "userName": saveUser.userName, 
      "isAdmin": saveUser.isAdmin, "isPinned": false, "answerTo": answerIndex});
      localStorage.setItem( 'messageList', JSON.stringify(messageArrayFeed) );

      chatContainer.innerHTML += messageContent;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      textareaMessage.textContent = '';

      id += 1;
      FillingStorageMessage();
      storageMessage = JSON.parse( localStorage.getItem('messageList') );
    };
    FillingStoragePinnedMessage();
    FillingStorageAnswerMessage();

    let answerMessage = videoEl.querySelector('.vjs-chat__container-answer-message');
    if ( answerMessage.classList.length == 2){toAnswer = '';};
  };

  function FillingStoragePinnedMessage() {
    let divMessage = videoEl.getElementsByClassName('vjs-chat__message');
    let isPinnedMessage = '';
    for (var i=0; i < divMessage.length; i++) {
      videoEl.querySelector('.vjs-chat__message_'+i).addEventListener('click', function(i) {
        isPinned.classList.remove('vjs-chat_hidden');
        isPinned.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="zakrep">
        <div class="vjs-chat_pinned-line">${storageMessage[i].userName}<br>${storageMessage[i].message}`;

        messageArrayFeed[i].isPinned = true;
        isPinnedMessage = storageMessage[i];
        localStorage.setItem( 'Pinned', JSON.stringify({"isPinnedContent":isPinned.innerHTML}) );
        localStorage.setItem( 'messageList', JSON.stringify(messageArrayFeed) );
      }.bind(this, i));
    };
    isPinned.onclick = function() {
      this.classList.add('vjs-chat_hidden');
      isPinned.innerHTML = '';
      localStorage.setItem( 'Pinned', JSON.stringify({"isPinnedContent":isPinned.innerHTML}) );
      for (var i=0; i < divMessage.length; i++) {
        if (storageMessage[i] === isPinnedMessage) {
          messageArrayFeed[i].isPinned = false;
          localStorage.setItem( 'Pinned', JSON.stringify({"isPinnedContent":isPinned.innerHTML}) );
          localStorage.setItem( 'messageList', JSON.stringify(messageArrayFeed) );
        };
      };
    };
    return savePinnedMessage;
  };
  FillingStoragePinnedMessage();

  let toAnswer= '';
  function FillingStorageAnswerMessage() {
    let answerMessage = videoEl.querySelector('.vjs-chat__container-answer-message');
    for (var i=0; i < storageMessage.length; i++) {
      document.getElementById(i).addEventListener('click', function(i) {
        answerMessage.classList.remove('vjs-chat_hidden');
        toAnswer = videoEl.querySelectorAll('.vjs-chat__message')[i].innerHTML;
        answerIndex = i;
      }.bind(this, i));
    };
    answerMessage.onclick = function() {
      toAnswer = '';
      answerMessage.classList.add('vjs-chat_hidden');
      messageArrayFeed[answerIndex].toAnswer = null;
      localStorage.setItem( 'messageList', JSON.stringify(messageArrayFeed) );
    };
    return answerIndex;
  };
  FillingStorageAnswerMessage();
};

videojs.registerPlugin('ChatPlugin', ChatPlugin);

videojs('video-exam', {
  fluid: true,
  controlBar: true,
  customClass: 'chat-plugin',
  plugins: {
    ChatPlugin: true
  },
});