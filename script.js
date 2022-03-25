'use strict';
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

const Component = videojs.getComponent('Component');
class ChatComponent extends Component {
  constructor(player) {
    super(player);
  };
  createEl() {
    const element = videojs.createEl('div', {
      className: 'vjs-chat vjs-chat_hidden',
    });
    element.insertAdjacentHTML( 'afterbegin', this.getTemplate() );

    let messagesAvatar = element.getElementsByClassName('vjs-chat__img-ava'),
      textareaMessage = element.querySelector('.vjs-chat__textarea'),
      chatContainer = element.querySelector('.vjs-chat__messages-container'),
      btnLogin = element.querySelector('.vjs-chat__button-login'),
      inputUsername = element.querySelector('.vjs-chat__input-username'),
      btnLoad = element.querySelector('.vjs-chat__button-load'),
      pinnedMessageContainer = element.querySelector('.vjs-chat__pinned-message'),
      inputDownload = element.querySelector('.vjs-chat__input-download-ava'),
      adminEl = element.querySelector('.vjs-chat__input-admin'),
      storageMessage = JSON.parse( localStorage.getItem('messageList') ),
      admin = false,
      answerIndex = null,
      readerImg = '',
      themeMessage = '',
      messageContent = '',
      toAnswer= '',
      lastPinned = '',
      state = {};
  if (storageMessage !== null) {
    messageArrayFeed = storageMessage;
  };
  let id = messageArrayFeed.length;
  chatContainer.scrollTop = chatContainer.scrollHeight;

  textareaMessage.onclick = function() {
    this.textContent = '';
    this.onclick = null;
  };

  adminEl.onchange = function() {
    adminEl.checked ? admin = true : admin = false;
  };

  window.addEventListener('beforeunload', function() {
    localStorage.setItem( 'messageList', JSON.stringify(messageArrayFeed) );
  });

  function fillingStorageUser() {
    btnLogin.onclick = function() {//сохранение имя пользователя, показ чата
      state.userName = inputUsername.value;
      state.isAdmin = admin;
      element.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat__registr-container_hidden');
      element.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat__send-messages-container_hidden');
      fillingMessageContent()
    };
    if (messageArrayFeed.length !== messageArrayFeedLength) {
      state.userName = messageArrayFeed[id-1].userName;
      state.isAdmin = messageArrayFeed[id-1].isAdmin;
    };
  };

  function fillingStorageAva() {
    state.avatar = btnLoad.style.backgroundImage;
    inputDownload.onchange = function() { //загрузка и сохранение аватарки
      let file = element.querySelector('input[type=file]').files[0];
      readerImg = new FileReader();
      readerImg.onloadend = function() {
        btnLoad.style.backgroundImage = "url('" + readerImg.result + "')";
        state.avatar = btnLoad.style.backgroundImage;
      };
      
      file ? readerImg.readAsDataURL(file) : btnLoad.style.backgroundImage = "url('img/default_ava.png')";
    };
    for (let n = messageArrayFeedLength; n < messageArrayFeed.length; n++) {//аватарка в сообщениях
      messagesAvatar[n].style.backgroundImage = state.avatar || 'url(img/default_ava.png)';
    };
    return state;
  };

  function fillingChatContainer() {
    for (let i = 0; i < messageArrayFeed.length; i++) {
      let indexMessageAnswerTo = messageArrayFeed[i].answerTo;
      let chatContainerContent = (indexMessageAnswerTo === null) ? `${messageArrayFeed[i].userName}</br>${messageArrayFeed[i].message}` :
        `<div class="vjs-chat__message_answer">${messageArrayFeed[indexMessageAnswerTo].userName}</br>${messageArrayFeed[indexMessageAnswerTo].message}
        </div>${messageArrayFeed[i].userName}</br>${messageArrayFeed[i].message}`;
      chatContainer.innerHTML += `
        <div class="vjs-chat__container-fullmessage">
          <div class="vjs-chat__img-ava"></div>
          <div class="vjs-chat__message vjs-chat__message_${ i }">${chatContainerContent}</div>
        <img src="img/otvet2.png" class="vjs-chat__img-answer vjs-chat__img-answer_${ i }" alt="answer" title="Ответить">`;

      if (messageArrayFeed[i].avatar !== null) {
        messagesAvatar[i].style.backgroundImage = 'url(' + messageArrayFeed[i].avatar + ')';
      };

      let chatMessage = element.querySelectorAll('.vjs-chat__message');
      messageArrayFeed[i].isAdmin ? chatMessage[i].classList.add('vjs-chat_theme_admin') : chatMessage[i].classList.add('vjs-chat_theme');
    };

    for (let i = 0; i < messageArrayFeed.length; i++) {
      if (messageArrayFeed[i].isPinned === true) {
        pinnedMessageContainer.classList.remove('vjs-chat__pinned-message_hidden');
        pinnedMessageContainer.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="pinned message">
        <div class="vjs-chat_pinned-line">${messageArrayFeed[i].userName}<br>${messageArrayFeed[i].message}`;;
      };
    };

    if (messageArrayFeed.length === messageArrayFeedLength) {
      id = messageArrayFeed.length;
    } else {
      element.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat__send-messages-container_hidden');
      element.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat__registr-container_hidden');
    };
    fillingStorageAva();
    if (state.avatar === '') {
      btnLoad.style.backgroundImage = messageArrayFeed[id-1].avatar;
    };
  };

  function fillingMessageContent() {
    themeMessage = (admin || state.isAdmin) ? 'vjs-chat_theme_admin' : 'vjs-chat_theme';
    let messageContentAnswer = (toAnswer !== '') ? `<div class="vjs-chat__message_answer">${toAnswer}</div>${state.userName}</br>${textareaMessage.textContent}` :
    `${state.userName}</br>${textareaMessage.textContent}`;
    messageContent = `
      <div class="vjs-chat__container-fullmessage">
        <div class="vjs-chat__img-ava" style="background-image: ${state.avatar} "></div>
        <div class="vjs-chat__message ${themeMessage} vjs-chat__message_${id}"> ${messageContentAnswer}
      </div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer vjs-chat__img-answer_${element.querySelectorAll('.vjs-chat__message').length }" alt="answer" title="Ответить">`;
    return messageContent;
  };

  function sendingMessage() {
    textareaMessage.onkeyup = function(event) {//отправка по enter
      if(event.keyCode === 13) {
        let answerMessage = element.querySelector('.vjs-chat__container-answer-message');
        answerMessage.classList.add('vjs-chat__container-answer-message_hidden');

        fillingStorageAva();
        fillingMessageContent();

        messageArrayFeed.push( {'id':id,
          "message": textareaMessage.textContent, "avatar": state.avatar, "userName": state.userName,
          "isAdmin": state.isAdmin, "isPinned": false, "answerTo": answerIndex} );

        chatContainer.innerHTML += messageContent;
        chatContainer.scrollTop = chatContainer.scrollHeight;
        textareaMessage.textContent = '';
        id += 1;
      };
      fillingStoragePinnedMessage();
      fillingStorageAnswerMessage();

      let answerMessage = element.querySelector('.vjs-chat__container-answer-message');
      if ( answerMessage.classList.contains('vjs-chat__container-answer-message_hidden') ) {
        toAnswer = '';
      };
    };
  };

  function fillingStoragePinnedMessage() {
    let divMessage = element.getElementsByClassName('vjs-chat__message');
    for (let i=0; i < divMessage.length; i++) {
      if (messageArrayFeed[i].isPinned) {
        lastPinned = messageArrayFeed[i];
      };
      element.querySelector('.vjs-chat__message_'+i).addEventListener('click', function() {
        for (let i = 0; i < divMessage.length; i++) {
          if (messageArrayFeed[i] === lastPinned) {
            messageArrayFeed[i].isPinned = false;
          };
        };
        pinnedMessageContainer.classList.remove('vjs-chat__pinned-message_hidden');
        pinnedMessageContainer.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="zakrep">
          <div class="vjs-chat_pinned-line">${messageArrayFeed[i].userName}<br>${messageArrayFeed[i].message}`;
        messageArrayFeed[i].isPinned = true;
      });
    };

    pinnedMessageContainer.onclick = function() {
      this.classList.add('vjs-chat__pinned-message_hidden');
      pinnedMessageContainer.innerHTML = '';
      for (let i=0; i < messageArrayFeed.length; i++) {
        messageArrayFeed[i].isPinned = false;
      };
    };
  };

  function fillingStorageAnswerMessage() {
    let answerMessage = element.querySelector('.vjs-chat__container-answer-message');
    for (let i=0; i < messageArrayFeed.length; i++) {
      element.querySelector('.vjs-chat__img-answer_'+i).addEventListener('click', function() {
        answerMessage.classList.remove('vjs-chat__container-answer-message_hidden');
        toAnswer = element.querySelectorAll('.vjs-chat__message')[i].innerHTML;
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


class ButtonToggle extends videojs.getComponent('Button') {
  constructor(player) {
    super(player);
  };
  createEl() {
    const element = videojs.createEl('button', {
      innerHTML: '<svg class="vjs-svg-use-button" width="70%" height="70%" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><use class="vjs-chat__svg-use-button" xlink:href="icon.svg#icon_1"/></svg>',
      className: 'vjs-chat__button-toggle',
    });
    let videoEl =  this.player().el();
    let vjsChat = videoEl.querySelector('.vjs-chat');
    let svgBttn = element.querySelector('svg');
    vjsChat.classList.remove('vjs-chat_hidden');
    svgBttn.onclick = function() {
      if ( vjsChat.classList.contains('vjs-chat_hidden') ) {
        svgBttn.classList.remove("vjs-svg-use-button_color");
        vjsChat.classList.remove('vjs-chat_hidden');
      } else {
        vjsChat.classList.add('vjs-chat_hidden');
        svgBttn.classList.add("vjs-svg-use-button_color");
      };
    };
    return element;
  };
};


Component.registerComponent('ChatComponent', ChatComponent);
Component.registerComponent('ButtonToggle', ButtonToggle);

function ChatPlugin() {
  this.one('playing', function() {
    this.addChild('ChatComponent');
    this.controlBar.addChild('ButtonToggle');
  });
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