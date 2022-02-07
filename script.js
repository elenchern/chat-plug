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

function ExamplePlugin() {
  this.addChild('ChatComponent');

  videoJs = this.el();

  let saveImg = [];
  let user = [];
  let messageArrayFid = [
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

  let messageArrayFidInt = messageArrayFid.length;

  let messagesAvatar = videoJs.getElementsByClassName('vjs-chat__img-ava');
  let vjsChat = videoJs.querySelector('.vjs-chat');
  let textareaMessage = videoJs.querySelector('.vjs-chat__textarea');
  let chatContainer = videoJs.querySelector('.vjs-chat__messages-container');
  let btnLogin = videoJs.querySelector('.vjs-chat__button-login');
  let inputUsername = videoJs.querySelector('.vjs-chat__input-username');
  let btnLoad = videoJs.querySelector('.vjs-chat__button-load');
  let isPinned = videoJs.querySelector('.vjs-chat__pinned-message');
  let inputDownload = videoJs.querySelector('.vjs-chat__input-download-ava');
  let isAdmin = videoJs.querySelector('.vjs-chat__input-admin');
  let saveAvatar = JSON.parse( localStorage.getItem('messageAva') );
  let saveUser = JSON.parse( localStorage.getItem('Username') );
  let savePinnedMessage = JSON.parse( localStorage.getItem('Pinned') );
  let saveMessageFid = JSON.parse( localStorage.getItem('messageList_fid') );

  let admin = false;
  let readerImg = '';
  let themeMessage = '';
  let answerIndex = null;

  function SaveMessageFid() {
    if (saveMessageFid != null) {
      for (var i = messageArrayFid.length; i < saveMessageFid.length; i++){
      messageArrayFid.push(saveMessageFid[i]);
      localStorage.setItem( 'messageList_fid', JSON.stringify(messageArrayFid) );
      };
    } else {
      localStorage.setItem( 'messageList_fid', JSON.stringify(messageArrayFid) );
    };
    return JSON.parse( localStorage.getItem('messageList_fid') );
  };
  SaveMessageFid();
  saveMessageFid = JSON.parse( localStorage.getItem('messageList_fid') );

  let id = 0;

  if (saveMessageFid != null) {
    id = saveMessageFid.length;
    for (var i = 0; i < saveMessageFid.length; i++) {
      if (saveMessageFid[i].answerTo == null) {
        chatContainer.innerHTML += `<div class="vjs-chat__container-fullmessage">
        <div class="vjs-chat__img-ava"></div>
        <div class="vjs-chat__message vjs-chat__message_${ i }">${saveMessageFid[i].userName}</br>${saveMessageFid[i].message}</div>
        <img src="img/otvet2.png" class="vjs-chat__img-answer" alt="answer" id="${ i }" title="Ответить">`;
      } else if (saveMessageFid[i].answerTo != null) {
        for (var j = 0; j < saveMessageFid.length; j++) {
          if (saveMessageFid[i].answerTo == j) {
            chatContainer.innerHTML += `
            <div class="vjs-chat__container-fullmessage">
            <div class="vjs-chat__img-ava"></div>
            <div class="vjs-chat__message vjs-chat__message_${ i }"><div class="vjs-chat__message_answer">
            ${saveMessageFid[j].userName}</br>${saveMessageFid[j].message}</div>
            ${saveMessageFid[i].userName}</br>${saveMessageFid[i].message}</div>
             <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${ i }" alt="answer" title="Ответить">`;
          };
        };
      };

      if (saveMessageFid[i].avatar != null) {
        messagesAvatar[i].style.backgroundImage = 'url(' + saveMessageFid[i].avatar + ')';
      };

      let chatMessage =  videoJs.querySelectorAll('.vjs-chat__message');
      if (saveMessageFid[i].isAdmin == true) {
        chatMessage[i].classList.add('vjs-chat_theme_admin');
      } else {
        chatMessage[i].classList.add('vjs-chat_theme');
      };

      if (saveMessageFid[i].isPinned == true) {
        isPinned.classList.remove('vjs-chat_hidden');
        isPinned.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="zakrep">
        <div class="vjs-chat_pinned-line">${chatMessage[i].innerHTML}<div>`;
      };
    };
  };

  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (vjsChat.parentElement.clientWidth >= 1280) { //размер чата в зависимостти от ширины плеера
    vjsChat.classList.add('vjs-chat_width-deskstop');
  } else if ((vjsChat.parentElement.clientWidth >= 768) & (vjsChat.parentElement.clientWidth <= 1280)) {
    vjsChat.classList.add('vjs-chat_width-tablet');
  } else if (vjsChat.parentElement.clientWidth < 768) {
    vjsChat.classList.add('vjs-chat_width-mobile');
  };

  vjsChat.classList.add('vjs-chat_hidden');

  if (savePinnedMessage != null) {
    if (savePinnedMessage.isPinnedContetnt != '') {
      isPinned.classList.remove('vjs-chat_hidden');
      isPinned.innerHTML = savePinnedMessage.isPinnedContetnt;
    };
  };

  function AdminChange() {
    isAdmin.onchange = function() {
      if (isAdmin.checked) {
        admin = true;
      };
    };
    return admin;
  };


  if (saveMessageFid.length == messageArrayFidInt) {
    id = saveMessageFid.length;
  } else {
    videoJs.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat_hidden');
    videoJs.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat_hidden');
  };
  if (saveAvatar != null) {
    btnLoad.style.backgroundImage = saveAvatar.avatar;
  };

  this.one('playing', function() {
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
  });

  saveImg = ( {'avatar': btnLoad.style.backgroundImage} );
  localStorage.setItem( 'messageAva', JSON.stringify(saveImg) );

  function SaveAva() {
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
    return JSON.parse( localStorage.getItem('messageAva') );
  };
  SaveAva();

  saveAvatar = JSON.parse( localStorage.getItem('messageAva') );

  textareaMessage.onclick = function() {
    this.textContent = '';
    this.onclick = null;
  };

  btnLogin.addEventListener("click", LoginClick(), false);
  function LoginClick() {
    btnLogin.onclick = function() { //сохранение имя пользователя, показ чата
      AdminChange();
      user = ( {'userName': inputUsername.value, 'isAdmin': admin} );
      localStorage.setItem( 'Username', JSON.stringify(user) );
      videoJs.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat_hidden');
      videoJs.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat_hidden');
    };
    return saveUser;
  };

  let messagesAvatarn = videoJs.getElementsByClassName('vjs-chat__img-ava');//аватарка в сообщениях

  for (var n = messageArrayFidInt; n < saveMessageFid.length; n++) {
    if (saveAvatar != null) {
      messagesAvatarn[n].style.backgroundImage = saveAvatar.avatar;
    } else {
      messagesAvatarn[n].style.backgroundImage = 'url(img/default_ava.png)';
    };
  };

  let messageContent = '';
  function MessegeContent() {
    saveUser = JSON.parse( localStorage.getItem('Username') );
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

    if (toAnswer == '') {
        messageContent = `
        <div class="vjs-chat__container-fullmessage">
          <div class="vjs-chat__img-ava"></div>
          <div class="vjs-chat__message ${themeMessage} vjs-chat__message_${id}"> ${saveUser.userName}</br>
          ${textareaMessage.textContent}</div>
        <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${videoJs.querySelectorAll('.vjs-chat__message').length }" alt="answer" title="Ответить">`;
      } else {
      messageContent = `
      <div class="vjs-chat__container-fullmessage">
        <div class="vjs-chat__img-ava"></div>
        <div class="vjs-chat__message ${themeMessage} vjs-chat__message_${id}"><div class="vjs-chat__message_answer">
        ${toAnswer}</div>
        ${saveUser.userName}</br>${textareaMessage.textContent}</div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${videoJs.querySelectorAll('.vjs-chat__message').length }" alt="answer" title="Ответить">`;
    };
    return messageContent;
  };

  textareaMessage.onkeyup = function(ent) { //отправка по enter
    if(ent.keyCode==13) {
      let answerMessage = videoJs.querySelector('.vjs-chat__container-answer-message');
      answerMessage.classList.add('vjs-chat_hidden');

      SaveAva();
      MessegeContent();
      LoginClick();

      messageArrayFid.push( {'id':id, 
      'message': textareaMessage.textContent, 'avatar': saveAvatar.avatar, "userName": saveUser.userName, 
      "isAdmin": saveUser.isAdmin, "isPinned": false, "answerTo": answerIndex});
      localStorage.setItem( 'messageList_fid', JSON.stringify(messageArrayFid) );

      chatContainer.innerHTML += messageContent;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      textareaMessage.textContent = '';
      for (var i=messageArrayFid.length; i < messagesAvatar.length; i++) {
        if (saveAvatar != null) {
          messagesAvatar[i].style.backgroundImage = saveAvatar.avatar;
        };
      };
      id += 1;
      SaveMessageFid();
      saveMessageFid = JSON.parse( localStorage.getItem('messageList_fid') );
    };
    OnclickPinned();
    OnclickAnswer();

    let answerMessage = videoJs.querySelector('.vjs-chat__container-answer-message');
    if ( answerMessage.classList.length == 2){toAnswer = '';};
  };

  function OnclickPinned() {
    let divMessage = videoJs.getElementsByClassName('vjs-chat__message');
    let isPinnedMessage = '';
    for (var i=0; i < divMessage.length; i++) {
      videoJs.querySelector('.vjs-chat__message_'+i).addEventListener('click', function(i) {
        isPinned.classList.remove('vjs-chat_hidden');
        isPinned.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="zakrep">
        <div class="vjs-chat_pinned-line">${saveMessageFid[i].userName}<br>${saveMessageFid[i].message}`;

        messageArrayFid[i].isPinned = true;
        isPinnedMessage = saveMessageFid[i];
        localStorage.setItem( 'Pinned', JSON.stringify({"isPinnedContetnt":isPinned.innerHTML}) );
        localStorage.setItem( 'messageList_fid', JSON.stringify(messageArrayFid) );
      }.bind(this, i));
    };
    isPinned.onclick = function() {
      this.classList.add('vjs-chat_hidden');
      isPinned.innerHTML = '';
      localStorage.setItem( 'Pinned', JSON.stringify({"isPinnedContetnt":isPinned.innerHTML}) );
      for (var i=0; i < divMessage.length; i++) {
        if (saveMessageFid[i] == isPinnedMessage) {
          messageArrayFid[i].isPinned = false;
          localStorage.setItem( 'Pinned', JSON.stringify({"isPinnedContetnt":isPinned.innerHTML}) );
          localStorage.setItem( 'messageList_fid', JSON.stringify(messageArrayFid) );
        };
      };
    };
    return savePinnedMessage;
  };
  OnclickPinned();

  let toAnswer= '';
  function OnclickAnswer() {
    let answerMessage = videoJs.querySelector('.vjs-chat__container-answer-message');
    for (var i=0; i < saveMessageFid.length; i++) {
      document.getElementById(i).addEventListener('click', function(i) {
        answerMessage.classList.remove('vjs-chat_hidden');
        toAnswer = videoJs.querySelectorAll('.vjs-chat__message')[i].innerHTML;
        answerIndex = i;
      }.bind(this, i));
    };
    answerMessage.onclick = function() {
      toAnswer = '';
      answerMessage.classList.add('vjs-chat_hidden');
      messageArrayFid[answerIndex].toAnswer = null;
      localStorage.setItem( 'messageList_fid', JSON.stringify(messageArrayFid) );
    };
    return answerIndex;
  };
  OnclickAnswer();
};

videojs.registerPlugin('ExamplePlugin', ExamplePlugin);

videojs('video-exam', {
  fluid: true,
  controlBar: true,
  plugins: {
    ExamplePlugin: true
  },
});