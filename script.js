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

const Component = videojs.getComponent('Component');
class ChatComponent extends Component {
  constructor(player) {
    super(player);
    let element = this.el();
    this.messageArrayFeedLength = messageArrayFeed.length;
    this.storageMessage = JSON.parse( localStorage.getItem('messageList') );
    this.admin = false;
    this.answerIndex = null;
    this.readerImg = '';
    this.themeMessage = '';
    this.messageContent = '';
    this.toAnswer= '';
    this.lastPinned = '';
    this.state = {};

    this.setFillingStorageUser(element);
    this.fillingStorageAvatar(element);
    this.fillingChatContainer(element);
    this.fillingMessageContent(element);
    this.sendingMessage(element);
    this.fillingStoragePinnedMessage(element);
    this.fillingStorageAnswerMessage(element);
    this.fillingStorageBeforeunload();
  };
  createEl() {
    const element = videojs.createEl('div', {
      className: 'vjs-chat',
    });
    element.insertAdjacentHTML( 'afterbegin', this.getTemplate() );
    return element;
  };

  getStorageMessage() {
    if (this.storageMessage !== null) {
      messageArrayFeed = this.storageMessage;
    };
    return messageArrayFeed;
  };

  setFillingStorageUser(element) {
    let btnLogin = element.querySelector('.vjs-chat__button-login');
    let inputUsername = element.querySelector('.vjs-chat__input-username');
    let id = messageArrayFeed.length;
    let adminEl = element.querySelector('.vjs-chat__input-admin');
    adminEl.onchange = () => {
      this.admin = adminEl.checked;
    };
    btnLogin.onclick = () => {//сохранение имя пользователя, показ чата
      this.state.userName = inputUsername.value;
      this.state.isAdmin = this.admin;
      element.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat__registr-container_hidden');
      element.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat__send-messages-container_hidden');
    };
    if (messageArrayFeed.length !== this.messageArrayFeedLength) {
      this.state.userName = messageArrayFeed[id-1].userName;
      this.state.isAdmin = messageArrayFeed[id-1].isAdmin;
    };
    return this.state;
  };

  fillingStorageAvatar(element) {
    let inputDownload = element.querySelector('.vjs-chat__input-download-avatar');
    let btnLoad = element.querySelector('.vjs-chat__button-load');
    this.state.avatar = btnLoad.style.backgroundImage;
    inputDownload.onchange = () => { //загрузка и сохранение аватарки
      let file = element.querySelector('input[type=file]').files[0];
      this.readerImg = new FileReader();
      this.readerImg.onloadend = () => {
        btnLoad.style.backgroundImage = "url('" + this.readerImg.result + "')";
        this.state.avatar = btnLoad.style.backgroundImage;
      };
      file ? this.readerImg.readAsDataURL(file) : btnLoad.style.backgroundImage = "url('img/default_ava.png')";
    };
    return this.state;
  };

  fillingChatContainer(element) {
    this.getStorageMessage();
    let messagesAvatar = element.getElementsByClassName('vjs-chat__img-avatar');
    let chatContainer = element.querySelector('.vjs-chat__messages-container');
    let pinnedMessageContainer = element.querySelector('.vjs-chat__pinned-message');
    let btnLoad = element.querySelector('.vjs-chat__button-load');
    let id = messageArrayFeed.length;
    for (let i = 0; i < messageArrayFeed.length; i++) {
      let indexMessageAnswerTo = messageArrayFeed[i].answerTo;
      let chatContainerContent = (indexMessageAnswerTo === null) ? `${messageArrayFeed[i].userName}</br>${messageArrayFeed[i].message}` :
        `<div class="vjs-chat__message_answer">${messageArrayFeed[indexMessageAnswerTo].userName}</br>${messageArrayFeed[indexMessageAnswerTo].message}
        </div>${messageArrayFeed[i].userName}</br>${messageArrayFeed[i].message}`;
      chatContainer.innerHTML += `
        <div class="vjs-chat__container-fullmessage">
          <div class="vjs-chat__img-avatar"></div>
          <div class="vjs-chat__message vjs-chat__message_${ i } ${messageArrayFeed[i].isAdmin ? 'vjs-chat_theme_admin' : 'vjs-chat_theme'}">
            ${chatContainerContent}</div>
        <img src="img/otvet2.png" class="vjs-chat__img-answer vjs-chat__img-answer_${ i }" alt="answer" title="Ответить">`;

      if (messageArrayFeed[i].avatar !== null) {
        messagesAvatar[i].style.backgroundImage = 'url(' + messageArrayFeed[i].avatar + ')';
      };

      if (messageArrayFeed[i].isPinned) {
        pinnedMessageContainer.classList.remove('vjs-chat__pinned-message_hidden');
        pinnedMessageContainer.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="pinned message">
        <div class="vjs-chat_pinned-line">${messageArrayFeed[i].userName}<br>${messageArrayFeed[i].message}`;
      };
    };
    for (let i = this.messageArrayFeedLength; i < messageArrayFeed.length; i++) {
      messagesAvatar[i].style.backgroundImage = (messageArrayFeed[messageArrayFeed.length-1].avatar !== '') ? messageArrayFeed[messageArrayFeed.length-1].avatar : 'url(img/default_ava.png)';
    };

    if (messageArrayFeed.length === this.messageArrayFeedLength) {
      id = messageArrayFeed.length;
    } else {
      element.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat__send-messages-container_hidden');
      element.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat__registr-container_hidden');
    };
    this.fillingStorageAvatar(element);
    if (this.state.avatar === '') {
      btnLoad.style.backgroundImage = messageArrayFeed[id-1].avatar;
    };
  };

  fillingMessageContent(element) {
    this.getStorageMessage();
    this.setFillingStorageUser(element);
    this.fillingStorageAnswerMessage(element);
    let id = messageArrayFeed.length;
    let textareaMessage = element.querySelector('.vjs-chat__textarea');
    this.themeMessage = (this.admin || this.state.isAdmin) ? 'vjs-chat_theme_admin' : 'vjs-chat_theme';
    let messageContentAnswer = (this.toAnswer !== '') ? `<div class="vjs-chat__message_answer">${this.toAnswer}</div>${this.state.userName}</br>${textareaMessage.textContent}` :
    `${this.state.userName}</br>${textareaMessage.textContent}`;
    this.messageContent = `
      <div class="vjs-chat__container-fullmessage">
        <div class="vjs-chat__img-avatar" style="background-image: ${this.state.avatar} "></div>
        <div class="vjs-chat__message ${this.themeMessage} vjs-chat__message_${id}"> ${messageContentAnswer}
      </div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer vjs-chat__img-answer_${element.querySelectorAll('.vjs-chat__message').length }" alt="answer" title="Ответить">`;
    return this.messageContent;
  };

  sendingMessage(element) {
    let id = messageArrayFeed.length;
    let chatContainer = element.querySelector('.vjs-chat__messages-container');
    let textareaMessage = element.querySelector('.vjs-chat__textarea');
    textareaMessage.onclick = function() {
      this.textContent = '';
      this.onclick = null;
    };
    textareaMessage.onkeyup = (event) => {//отправка по enter
      if(event.keyCode === 13) {
        let answerMessage = element.querySelector('.vjs-chat__container-answer-message');
        answerMessage.classList.add('vjs-chat__container-answer-message_hidden');

        this.fillingStorageAvatar(element);
        this.fillingMessageContent(element);

        messageArrayFeed.push( {'id':id,
          "message": textareaMessage.textContent, "avatar": this.state.avatar, "userName": this.state.userName,
          "isAdmin": this.state.isAdmin, "isPinned": false, "answerTo": this.answerIndex} );

        chatContainer.innerHTML += this.messageContent;
        textareaMessage.textContent = '';
        id += 1;
        let messagesAvatar = element.getElementsByClassName('vjs-chat__img-avatar');
        for (let i = this.messageArrayFeedLength; i < id; i++) {
          messagesAvatar[i].style.backgroundImage = (messageArrayFeed[id-1].avatar !== '') ? messageArrayFeed[id-1].avatar : 'url(img/default_ava.png)';
        };
      };
      chatContainer.scrollTop = chatContainer.scrollHeight;
      this.fillingStoragePinnedMessage(element);
      this.fillingStorageAnswerMessage(element);

      let answerMessage = element.querySelector('.vjs-chat__container-answer-message');
      if ( answerMessage.classList.contains('vjs-chat__container-answer-message_hidden') ) {
        this.toAnswer = '';
      };
    };
  };

  fillingStoragePinnedMessage(element) {
    let pinnedMessageContainer = element.querySelector('.vjs-chat__pinned-message');
    let divMessage = element.getElementsByClassName('vjs-chat__message');
    for (let i=0; i < divMessage.length; i++) {
      if (messageArrayFeed[i].isPinned) {
        this.lastPinned = messageArrayFeed[i];
      };
      element.querySelector('.vjs-chat__message_'+i).addEventListener('click', () => {
        for (let i = 0; i < divMessage.length; i++) {
          if (messageArrayFeed[i] === this.lastPinned) {
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

  fillingStorageAnswerMessage(element) {
    let answerMessage = element.querySelector('.vjs-chat__container-answer-message');
    for (let i=0; i < messageArrayFeed.length; i++) {
      element.querySelector('.vjs-chat__img-answer_'+i).addEventListener('click', () => {
        answerMessage.classList.remove('vjs-chat__container-answer-message_hidden');
        this.toAnswer = element.querySelectorAll('.vjs-chat__message')[i].innerHTML;
        this.answerIndex = i;
      });
    };
    answerMessage.onclick = () => {
      this.toAnswer = '';
      answerMessage.classList.add('vjs-chat__container-answer-message_hidden');
      messageArrayFeed[this.answerIndex].toAnswer = null;
    };
  };

  fillingStorageBeforeunload() {
    this.getStorageMessage();
    window.addEventListener('beforeunload', function() {
      localStorage.setItem( 'messageList', JSON.stringify(messageArrayFeed) );
    });
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
            <input class="vjs-chat__input-download-avatar" type="file" accept="image/*">
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
    return element;
  };
  handleClick() {
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