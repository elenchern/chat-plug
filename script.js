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
  let messageArray = [];
  let messageArray_fid = [
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

  let messAva = videoJs.getElementsByClassName('vjs-chat__img-ava');
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
  let saveMessage_fid = JSON.parse( localStorage.getItem('messageList_fid') );

  let admin = false;
  let readerImg = '';
  let themeMessage = '';

  localStorage.setItem( 'messageList_fid', JSON.stringify(messageArray_fid) );
  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (saveMessage_fid != null) {
    for (var i = 0; i < saveMessage_fid.length; i++) {
      if (saveMessage_fid[i].answerTo == null) {
      chatContainer.innerHTML += `<div class="vjs-chat__container-fullmessage">
      <div class="vjs-chat__img-ava"></div>
      <div class="vjs-chat__message">${saveMessage_fid[i].userName}</br>${saveMessage_fid[i].message}</div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer" alt="answer" id="${ i }" title="Ответить">`;
      } else if (saveMessage_fid[i].answerTo != null) {
        for (var j = 0; j < saveMessage_fid.length; j++) {
          if (saveMessage_fid[i].answerTo == j) {
            chatContainer.innerHTML += `
            <div class="vjs-chat__container-fullmessage">
              <div class="vjs-chat__img-ava"></div>
              <div class="vjs-chat__message"><div class="vjs-chat__message_answer">
              ${saveMessage_fid[j].userName}</br>${saveMessage_fid[j].message}</div>
              ${saveMessage_fid[i].userName}</br>${saveMessage_fid[i].message}</div>
            <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${ i }" alt="answer" title="Ответить">`;
          };
        };
      };

      if (saveMessage_fid[i].avatar != null) {
        messAva[i].style.backgroundImage = 'url(' + saveMessage_fid[i].avatar + ')';
      } else if (saveMessage_fid[i].avatar == null) {
        messAva[i].style.backgroundImage = 'url("img/default_ava.png")';
      };

      let chatMessage =  videoJs.querySelectorAll('.vjs-chat__message');
      if (saveMessage_fid[i].isAdmin == true) {
        chatMessage[i].classList.add('vjs-chat_theme_admin');
      } else {
        chatMessage[i].classList.add('vjs-chat_theme');
      };

      if (saveMessage_fid[i].isPinned == true) {
        isPinned.classList.remove('vjs-chat_hidden');
        isPinned.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="zakrep">
        <div class="vjs-chat_pinned-line">${chatMessage[i].innerHTML}<div>`;
      };
    };
  };

  if (vjsChat.parentElement.clientWidth >= 1280) { //размер чата в зависимостти от ширины плеера
    vjsChat.classList.add('vjs-chat_width-deskstop');
  } else if ((vjsChat.parentElement.clientWidth >= 768) & (vjsChat.parentElement.clientWidth <= 1280)) {
    vjsChat.classList.add('vjs-chat_width-tablet');
  } else if (vjsChat.parentElement.clientWidth < 768) {
    vjsChat.classList.add('vjs-chat_width-mobile');
  };

  vjsChat.classList.add('vjs-chat_hidden');

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
    OnclickAnswer();
    id = saveMessage_fid.length;
  } else {
    videoJs.querySelector('.vjs-chat__send-messages-container').classList.remove('vjs-chat_hidden');
    videoJs.querySelector('.vjs-chat__registr-container').classList.add('vjs-chat_hidden');

    id = saveMessage.length + saveMessage_fid.length;
    for (var i = 0; i < saveMessage.length; i++) {
      chatContainer.innerHTML += saveMessage[i].message;
      messageArray= saveMessage;
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

    // console.log(saveMessage_fid.length + saveMessage.length)
    // for (var i=0; i < saveMessage_fid.length + saveMessage.length; i++) {
    //   console.log(document.getElementById(i))}
    OnclickAnswer();
   });

  saveImg = ( {'avatar': btnLoad.style.backgroundImage} );
  localStorage.setItem( 'messageAva', JSON.stringify(saveImg) );

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

  let messAvan = videoJs.getElementsByClassName('vjs-chat__img-ava');//аватарка в сообщениях
  if (saveMessage != null){
    for (var n = saveMessage_fid.length; n < (saveMessage_fid.length + messageArray.length); n++) {
      if (saveAvatar != null) {
        messAvan[n].style.backgroundImage = saveAvatar.avatar;
      } else {
        messAvan[n].style.backgroundImage = 'url(img/default_ava.png)';
      };
    };
  };

  let messageContent = '';
  function MessegeContent(){
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
        <div class="vjs-chat__message ${themeMessage}"> ${saveUser.userName}</br>
        ${textareaMessage.textContent}</div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${videoJs.querySelectorAll('.vjs-chat__message').length }" alt="answer" title="Ответить">`;
    } else {
      messageContent = `
      <div class="vjs-chat__container-fullmessage">
        <div class="vjs-chat__img-ava"></div>
        <div class="vjs-chat__message ${themeMessage}"><div class="vjs-chat__message_answer">
        ${toAnswer}</div>
        ${saveUser.userName}</br>${textareaMessage.textContent}</div>
      <img src="img/otvet2.png" class="vjs-chat__img-answer" id="${videoJs.querySelectorAll('.vjs-chat__message').length }" alt="answer" title="Ответить">`;
    };
    return messageContent;
  };

  textareaMessage.onkeyup = function(ent) { //отправка по enter
    let ava = '';
    if(ent.keyCode==13) {
      let answerMessage = videoJs.querySelector('.vjs-chat__container-answer-message');
      answerMessage.classList.add('vjs-chat_hidden');
      if(btnLoad.style.backgroundImage != '') {
        ava = btnLoad.style.backgroundImage;
      } else {
        ava = null;
      };
      MessegeContent();

      messageArray.push( {'id':id, 
      'message': messageContent, 'avatar': ava });
      localStorage.setItem( 'messageList', JSON.stringify(messageArray) );

      let ind = messageArray.length-1;
      chatContainer.innerHTML += messageArray[ind].message;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      textareaMessage.textContent = '';
      for (var i=messageArray_fid.length; i < messAva.length; i++) {
        if (saveAvatar != null) {
          messAva[i].style.backgroundImage = saveAvatar.avatar;
        };
      };
    };

    OnclickAnswer();
    OnclickPinned();
    let answerMessage = videoJs.querySelector('.vjs-chat__container-answer-message');
    if ( answerMessage.classList.length == 2){toAnswer = '';};
  };

  let divMessage = videoJs.getElementsByClassName('vjs-chat__message');
  function OnclickPinned() {
    for (var i=0; i < divMessage.length; i++) { //закреплёные сооббщения
      divMessage[i].onclick = function() {
        isPinned.classList.remove('vjs-chat_hidden');
        isPinned.innerHTML = `<img src="img/zakrep.png" class="vjs-chat__img-pinned" alt="zakrep">
        <div class="vjs-chat_pinned-line">${this.innerHTML}`;
        localStorage.setItem( 'Pinned', JSON.stringify(isPinned.innerHTML) );
      };
    };
  };
  OnclickPinned();

  isPinned.onclick = function() {
    window.localStorage.removeItem("Pinned");
    this.classList.add('vjs-chat_hidden');
  };

  let toAnswer= '';
  function OnclickAnswer() {
    let saveMessageLength = 0;
    if (saveMessage == null) {
      saveMessageLength = 0;
    } else {saveMessageLength = saveMessage.length};

    let answerMessage = videoJs.querySelector('.vjs-chat__container-answer-message');
    for (var i=0; i < saveMessageLength + saveMessage_fid.length; i++) {
      document.getElementById(i).addEventListener('click', function(i) {
        answerMessage.classList.remove('vjs-chat_hidden');
        toAnswer = videoJs.querySelectorAll('.vjs-chat__message')[i].innerHTML;
      }.bind(this, i));
    };
    answerMessage.onclick = function() {
      toAnswer = '';
      answerMessage.classList.add('vjs-chat_hidden');
    };
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



 
