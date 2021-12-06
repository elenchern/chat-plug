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
      <div class ="vjs-chat__button-login">login</div>
      <div class ="vjs-chat__button-load">
        <input type="file" class="vjs-chat__input-downloadPic" accept="image/*">
        <div class = "choose_pic">Choose</div>
      </div>
      
      <textarea class="vjs-chat__input" type="text" placeholder="Message..."></textarea>
      <div id="text_area_div"></div>
      <div class ="vjs-chat__button-container"><button class="vjs-chat__button">Send</div>`;
  };
};

Component.registerComponent('ChatComponent', ChatComponent);

function ExamplePlugin() {
  // var myButton = this.controlBar.addChild("button");
  // var myButtonDom = myButton.el();
  // myButtonDom.innerHTML = '<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.75 6C19.7495 5.60231 19.5914 5.22105 19.3102 4.93984C19.029 4.65864 18.6477 4.50045 18.25 4.5H15.25V1.5C15.2495 1.10231 15.0914 0.721048 14.8102 0.439842C14.529 0.158636 14.1477 0.000454817 13.75 0H1.75C1.35231 0.000454817 0.971048 0.158636 0.689842 0.439842C0.408636 0.721048 0.250455 1.10231 0.25 1.5V13.5C0.249996 13.6416 0.290079 13.7803 0.365614 13.9001C0.441148 14.0199 0.549046 14.1158 0.676829 14.1768C0.804611 14.2378 0.947055 14.2614 1.08768 14.2449C1.22831 14.2283 1.36138 14.1723 1.4715 14.0832L4.75 11.4328L4.75009 14.25C4.75055 14.6477 4.90873 15.029 5.18994 15.3102C5.47114 15.5914 5.85241 15.7495 6.25009 15.75H15.024L18.5286 18.5832C18.6387 18.6723 18.7718 18.7283 18.9124 18.7449C19.053 18.7614 19.1955 18.7378 19.3233 18.6768C19.451 18.6158 19.5589 18.5199 19.6345 18.4001C19.71 18.2803 19.7501 18.1416 19.7501 18L19.75 6ZM15.7607 14.4168C15.6272 14.3089 15.4608 14.25 15.2892 14.25H6.25009L6.25 11.25H13.75C14.1477 11.2495 14.529 11.0914 14.8102 10.8102C15.0914 10.529 15.2495 10.1477 15.25 9.75V6H18.25L18.2501 16.4292L15.7607 14.4168Z" fill="white"/></svg>';
  // myButtonDom.onclick = function(){
  // }  

  this.addChild('ChatComponent');
  
  let messageArray = [];
  let saveImg =[];
  let user = [];
  let vjsChat = document.querySelector('.vjs-chat');
  let inputMessage = document.querySelector('.vjs-chat__input');
  let btnSend = document.querySelector('.vjs-chat__button-container');
  let chatContainer = document.querySelector('.vjs-chat__messages-container');
  let btnLogin = document.querySelector('.vjs-chat__button-login');
  let inputUsername = document.querySelector('.vjs-chat__input-username');
  let preview = document.querySelector('.vjs-chat__button-load');
  let fullscreen = document.querySelector('.vjs-fullscreen-control')

  let saveMessage = JSON.parse( localStorage.getItem('messageLim') );
  let saveAvatar = JSON.parse( localStorage.getItem('messageAva') );
  let saveUser = JSON.parse( localStorage.getItem('Username') );
  let inputDownload = document.querySelector('.vjs-chat__input-downloadPic');
  let reader = '';
  //vjsChat.style.visibility = 'hidden';
   console.log(fullscreen)
  // fullscreen.onclick = function() {
  //   vjsChat.style.visibility = 'hidden';
  // }
 
  if (saveMessage == null) {
    id = 0;
    inputMessage.classList.add('vjs-chat__input--hidden');
    btnSend.classList.add('vjs-chat__button-container--hidden');
  } else {
    id = saveMessage.length;
    for (var i = 0; i < saveMessage.length; i++) {
      chatContainer.innerHTML += saveMessage[i].message
      messageArray = saveMessage;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      if (saveUser == null) {                                 //если ника нет, то отправка сообщений недоступна
        inputMessage.classList.add('vjs-chat__input--hidden');
        btnSend.classList.add('vjs-chat__button-container--hidden');
      };
    };
  };
  if (saveAvatar != null) {
    preview.style.backgroundImage = saveAvatar.avatar;

  } else {
    preview.style.backgroundImage = "url(img/defoult_ava.png)";
  }
  let myButtonDom =  new Object(); 
  this.on('playing', function() {
    //console.log(this.controlBar)
    vjsChat.style.visibility = 'visible';

    let myButton = this.controlBar.addChild("button");
    myButtonDom = myButton.el();
    myButtonDom.innerHTML = '<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.75 6C19.7495 5.60231 19.5914 5.22105 19.3102 4.93984C19.029 4.65864 18.6477 4.50045 18.25 4.5H15.25V1.5C15.2495 1.10231 15.0914 0.721048 14.8102 0.439842C14.529 0.158636 14.1477 0.000454817 13.75 0H1.75C1.35231 0.000454817 0.971048 0.158636 0.689842 0.439842C0.408636 0.721048 0.250455 1.10231 0.25 1.5V13.5C0.249996 13.6416 0.290079 13.7803 0.365614 13.9001C0.441148 14.0199 0.549046 14.1158 0.676829 14.1768C0.804611 14.2378 0.947055 14.2614 1.08768 14.2449C1.22831 14.2283 1.36138 14.1723 1.4715 14.0832L4.75 11.4328L4.75009 14.25C4.75055 14.6477 4.90873 15.029 5.18994 15.3102C5.47114 15.5914 5.85241 15.7495 6.25009 15.75H15.024L18.5286 18.5832C18.6387 18.6723 18.7718 18.7283 18.9124 18.7449C19.053 18.7614 19.1955 18.7378 19.3233 18.6768C19.451 18.6158 19.5589 18.5199 19.6345 18.4001C19.71 18.2803 19.7501 18.1416 19.7501 18L19.75 6ZM15.7607 14.4168C15.6272 14.3089 15.4608 14.25 15.2892 14.25H6.25009L6.25 11.25H13.75C14.1477 11.2495 14.529 11.0914 14.8102 10.8102C15.0914 10.529 15.2495 10.1477 15.25 9.75V6H18.25L18.2501 16.4292L15.7607 14.4168Z" fill="white"/></svg>';
    myButtonDom.onclick = function(){
      if (vjsChat.style.visibility == 'visible'){
        vjsChat.style.visibility = 'hidden';
      } else {
        vjsChat.style.visibility = "visible";
      }
    }
    this.on = null;
  });
// data-time=${new Date().getHours() + ':' + new Date().getMinutes()}
 
  inputMessage.addEventListener("keyup", function () {       //расширение textarea
    let line_height = 15;
    let min_line_count = 2;
    var min_line_height = min_line_count * line_height;
    var obj = event.target;
    var div = document.getElementById('text_area_div');
    div.innerHTML = obj.value;
    var obj_height = div.offsetHeight;
    if (obj_height < min_line_height)
      obj_height = min_line_height;
    obj.style.height = obj_height + 'px';
  });

  inputDownload.onchange = function() {
    let file = document.querySelector('input[type=file]').files[0];
    reader = new FileReader();
    reader.onloadend = function() {
      preview.style.backgroundImage = "url('" + reader.result + "')";
      saveImg = ( {'avatar': preview.style.backgroundImage} )
      localStorage.setItem( 'messageAva', JSON.stringify(saveImg) );
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.style.backgroundImage ='url(img/default_ava.png)';
  }
}

  btnLogin.onclick = function() {
    user = ({'userName': inputUsername.value});
    localStorage.setItem( 'Username', JSON.stringify(user) );
    inputMessage.classList.remove('vjs-chat__input--hidden');
    btnSend.classList.remove('vjs-chat__button-container--hidden');
};
  let messAva = document.querySelector('.vjs-chat__imgAva')
    // console.log(messAva, saveAvatar.avatar)
    if (saveAvatar != 0){
      messAva.style.backgroundImage =saveAvatar.avatar;
    } else {
      messAva.style.backgroundImage = 'url(img/default_ava.png)'
    }
  btnSend.onclick = function() {
    console.log(saveUser)
    messageArray.push({'id':id,
    'message': `<div class = "container-fullmessage">
    <div class="vjs-chat__imgAva"></div>
      <div class="vjs-chat__message-p theme"> ${ JSON.parse( localStorage.getItem('Username') ).userName}</br>
      ${inputMessage.value}</div>`} );

    localStorage.setItem( 'messageLim', JSON.stringify(messageArray) );
    chatContainer.innerHTML += messageArray[id].message
    chatContainer.scrollTop = chatContainer.scrollHeight;
    inputMessage.value = '';
    id += 1;
  };

  //закреплёные сооббщения
  let divMessage = document.getElementsByClassName('container-fullmessage');
  for (var i=0; i < divMessage.length; i++) {
    divMessage[i].onclick = function() {
      
      this.classList.add('isPinned')
      this.classList.remove('container-fullmessage')
      // divMessage.style.top = "top:" + (top+200) + "";
      console.log(this.classList);
  };
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

