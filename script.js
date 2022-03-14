'use strict';
const Component = videojs.getComponent('Component');
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
      <div class="vjs-chat__pinned-message vjs-chat__pinned-message_hidden"></div>
      <div class="vjs-chat__messages-container"></div>
      <div class="vjs-chat__registr-container">
        <input class="vjs-chat__input-username" type="text" placeholder="User">
        <div class="vjs-chat__button-login">login</div>
        <label class="vjs-chat__label-container">
          <input class="vjs-chat__input-admin" id="admin" type="checkbox">Admin
        </label>
      </div>
      <div class="vjs-chat__send-messages-container vjs-chat__send-messages-container_hidden">
        <div class="vjs-chat__contaiher-textarea">
          <div class="vjs-chat__button-load">
            <input class="vjs-chat__input-download-ava" type="file" accept="image/*">
          </div>
          <div class="vjs-chat__textarea" contenteditable>Добавить комментарий</div>
        </div>
        <img class="vjs-chat__img-button-like" src="img/like.png" alt="like">
      </div>
      <div class="vjs-chat__container-answer-message vjs-chat__container-answer-message_hidden">Сообщение прикреплено</div>`;
  };
};

Component.registerComponent('ChatComponent', ChatComponent);

function ChatPlugin() {
  this.addChild('ChatComponent');

  let videoEl = this.el(),
    saveImg = {},
    user = {},
    messageArrayFeed = [
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
    ],
    messageArrayFeedLength = messageArrayFeed.length,
    messagesAvatar = videoEl.getElementsByClassName('vjs-chat__img-ava'),
    vjsChat = videoEl.querySelector('.vjs-chat'),
    textareaMessage = videoEl.querySelector('.vjs-chat__textarea'),
    chatContainer = videoEl.querySelector('.vjs-chat__messages-container'),
    btnLogin = videoEl.querySelector('.vjs-chat__button-login'),
    inputUsername = videoEl.querySelector('.vjs-chat__input-username'),
    btnLoad = videoEl.querySelector('.vjs-chat__button-load'),
    pinnedMessageContainer = videoEl.querySelector('.vjs-chat__pinned-message'),
    inputDownload = videoEl.querySelector('.vjs-chat__input-download-ava'),
    adminEl = videoEl.querySelector('.vjs-chat__input-admin'),
    saveAvatar = JSON.parse( localStorage.getItem('messageAva') ),
    saveUser = JSON.parse( localStorage.getItem('Username') ),
    savePinnedMessage = JSON.parse( localStorage.getItem('Pinned') ),
    storageMessage = JSON.parse( localStorage.getItem('messageList') ),
    admin = false,
    readerImg = '',
    themeMessage = '',
    messageContent = '',
    toAnswer= '',
    answerIndex = null,
    state = saveUser;
  chatContainer.scrollTop = chatContainer.scrollHeight;
  // vjsChat.classList.add('vjs-chat_hidden');
  if (storageMessage !== null) {
    messageArrayFeed = storageMessage;
  };
  let id = messageArrayFeed.length;

  this.one('playing', function() {
    vjsChat.classList.remove('vjs-chat_hidden');

    let chatDisplayBtn = this.controlBar.addChild("button"), //добавление кнопки открытия/закрытия чата
    chatDisplayBtnEl = chatDisplayBtn.el();
    chatDisplayBtnEl.innerHTML = '<svg class="vjs-svg-use-button" width="70%" height="70%" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><use class="vjs-chat__svg-use-button" xlink:href="icon.svg#icon_1"/></svg>';
    let svgBttn = chatDisplayBtnEl.querySelector('svg');
    svgBttn.onclick = function() {
      if ( vjsChat.classList.contains('vjs-chat_hidden') ) {
        svgBttn.classList.remove("vjs-svg-use-button_color");//изменение цвета иконкиы
        vjsChat.classList.remove('vjs-chat_hidden');
      } else {
        vjsChat.classList.add('vjs-chat_hidden');
        svgBttn.classList.add("vjs-svg-use-button_color");
      };
    };
  });

  function fillingStorageUser() {
    btnLogin.onclick = function() {//сохранение имя пользователя, показ чата
      user = ( {'userName': inputUsername.value, 'isAdmin': admin} );
      localStorage.setItem( 'Username', JSON.stringify(user) );
      state = user;
      videoEl.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat__registr-container_hidden');
      videoEl.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat__send-messages-container_hidden');
      fillingMessageContent()
    };
  };

  function fillingChatContainer() {
    for (let i = 0; i < messageArrayFeed.length; i++) {
      let indexMessageAnswerTo = messageArrayFeed[i].answerTo,
      chatContainerContent = (messageArrayFeed[i].answerTo === null) ? `${messageArrayFeed[i].userName}</br>${messageArrayFeed[i].message}` :
        `<div class="vjs-chat__message_answer">${messageArrayFeed[indexMessageAnswerTo].userName}</br>${messageArrayFeed[indexMessageAnswerTo].message}
        </div>${messageArrayFeed[i].userName}</br>${messageArrayFeed[i].message}`;

      chatContainer.innerHTML += `
        <div class="vjs-chat__container-fullmessage">
          <div class="vjs-chat__img-ava"></div>
          <div class="vjs-chat__message vjs-chat__message_${ i }">${chatContainerContent}</div>
        <img src="img/otvet2.png" class="vjs-chat__img-answer" alt="answer" id="${ i }" title="Ответить">`;

      if (messageArrayFeed[i].avatar !== null) {
        messagesAvatar[i].style.backgroundImage = 'url(' + messageArrayFeed[i].avatar + ')';
      };

      let chatMessage = videoEl.querySelectorAll('.vjs-chat__message');
      messageArrayFeed[i].isAdmin ? chatMessage[i].classList.add('vjs-chat_theme_admin') : chatMessage[i].classList.add('vjs-chat_theme');

      if (messageArrayFeed[i].isPinned) continue;
      pinnedMessageContainer.classList.remove('vjs-chat__pinned-message_hidden');
      pinnedMessageContainer.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="zakrep">
        <div class="vjs-chat_pinned-line">${chatMessage[i].innerHTML}<div>`;
    };

    if (savePinnedMessage?.isPinnedContent) {
      pinnedMessageContainer.classList.remove('vjs-chat__pinned-message_hidden');
      pinnedMessageContainer.innerHTML = savePinnedMessage.isPinnedContent;
    } else if (messageArrayFeed.length !== messageArrayFeedLength) {
      pinnedMessageContainer.classList.add('vjs-chat__pinned-message_hidden');
    };
    adminEl.onchange = function() {
      if (adminEl.checked) {
        admin = true;
      };
    };

    if (messageArrayFeed.length === messageArrayFeedLength) {
      id = messageArrayFeed.length;
    } else {
      videoEl.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat__send-messages-container_hidden');
      videoEl.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat__registr-container_hidden');
    };
    if (saveAvatar !== null) {
      btnLoad.style.backgroundImage = saveAvatar.avatar;
    };

    textareaMessage.onclick = function() {
      this.textContent = '';
      this.onclick = null;
    };
  };

  function fillingStorageAva() {
    saveImg = ( {'avatar': btnLoad.style.backgroundImage} );
    inputDownload.onchange = function() { //загрузка и сохранение аватарки
      let file = videoEl.querySelector('input[type=file]').files[0];
      readerImg = new FileReader();
      readerImg.onloadend = function() {
        btnLoad.style.backgroundImage = "url('" + readerImg.result + "')";
        saveImg = ( {'avatar': btnLoad.style.backgroundImage} );
      };
      
      file ? readerImg.readAsDataURL(file) : btnLoad.style.backgroundImage = "url('img/default_ava.png')";
    };
    for (let n = messageArrayFeedLength; n < messageArrayFeed.length; n++) {//аватарка в сообщениях
      messagesAvatar[n].style.backgroundImage = saveImg.avatar || 'url(img/default_ava.png)';
    };
    return saveImg;
  };

  function fillingMessageContent() {
    themeMessage = (admin || state.isAdmin) ? 'vjs-chat_theme_admin' : 'vjs-chat_theme';
    let messageContentAnswer = (toAnswer !== '') ? `<div class="vjs-chat__message_answer">${toAnswer}</div>${state.userName}</br>${textareaMessage.textContent}` :
    `${state.userName}</br>${textareaMessage.textContent}`;
    messageContent = `
      <div class="vjs-chat__container-fullmessage">
        <div class="vjs-chat__img-ava" style="background-image: ${saveImg.avatar} "></div>
        <div class="vjs-chat__message ${themeMessage} vjs-chat__message_${id}"> ${messageContentAnswer}
      </div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${videoEl.querySelectorAll('.vjs-chat__message').length }" alt="answer" title="Ответить">`;
    return messageContent;
  };

  function sendingMessage() {
    textareaMessage.onkeyup = function(event) {//отправка по enter
      if(event.keyCode === 13) {
        let answerMessage = videoEl.querySelector('.vjs-chat__container-answer-message');
        answerMessage.classList.add('vjs-chat__container-answer-message_hidden');

        fillingStorageAva();
        fillingMessageContent();

        messageArrayFeed.push( {'id':id,
          "message": textareaMessage.textContent, "avatar": saveImg.avatar, "userName": state.userName,
          "isAdmin": state.isAdmin, "isPinned": false, "answerTo": answerIndex} );

        chatContainer.innerHTML += messageContent;
        chatContainer.scrollTop = chatContainer.scrollHeight;
        textareaMessage.textContent = '';
        id += 1;
      };
      fillingStoragePinnedMessage();
      fillingStorageAnswerMessage();

      let answerMessage = videoEl.querySelector('.vjs-chat__container-answer-message');
      if ( answerMessage.classList.contains('vjs-chat__container-answer-message_hidden') ) {
        toAnswer = '';
      };
    };
  };

  function fillingStoragePinnedMessage() {
    let divMessage = videoEl.getElementsByClassName('vjs-chat__message'),
    pinnedMessage = '';
    for (let i=0; i < divMessage.length; i++) {
      videoEl.querySelector('.vjs-chat__message_'+i).addEventListener('click', function() {
        pinnedMessageContainer.classList.remove('vjs-chat__pinned-message_hidden');
        pinnedMessageContainer.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="zakrep">
          <div class="vjs-chat_pinned-line">${messageArrayFeed[i].userName}<br>${messageArrayFeed[i].message}`;
        messageArrayFeed[i].isPinned = true;
        pinnedMessage = messageArrayFeed[i];
      });
    };
    pinnedMessageContainer.onclick = function() {
      this.classList.add('vjs-chat__pinned-message_hidden');
      pinnedMessageContainer.innerHTML = '';
      for (let i=0; i < divMessage.length; i++) {
        if (messageArrayFeed[i] === pinnedMessage) continue;
        messageArrayFeed[i].isPinned = false;
      };
    };
    return savePinnedMessage;
  };

  function fillingStorageAnswerMessage() {
    let answerMessage = videoEl.querySelector('.vjs-chat__container-answer-message');
    for (let i=0; i < messageArrayFeed.length; i++) {
      document.getElementById(i).addEventListener('click', function() {
        answerMessage.classList.remove('vjs-chat__container-answer-message_hidden');
        toAnswer = videoEl.querySelectorAll('.vjs-chat__message')[i].innerHTML;
        answerIndex = i;
      });
    };
    answerMessage.onclick = function() {
      toAnswer = '';
      answerMessage.classList.add('vjs-chat__container-answer-message_hidden');
      messageArrayFeed[answerIndex].toAnswer = null;
    };
    return answerIndex;
  };

  fillingStorageUser();
  fillingChatContainer();
  fillingStorageAva();
  fillingStorageAnswerMessage();
  fillingStoragePinnedMessage();
  sendingMessage();

  window.onbeforeunload = function() {
    localStorage.setItem( 'messageAva', JSON.stringify(saveImg) );
    localStorage.setItem( 'messageList', JSON.stringify(messageArrayFeed) );
    localStorage.setItem( 'Pinned', JSON.stringify({"isPinnedContent":pinnedMessageContainer.innerHTML}) );
  };
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