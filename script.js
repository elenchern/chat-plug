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
      <div class="vjs-chat__messages-container"><p class="vjs-chat__message-p"></p></div>
      <input class="vjs-chat__input" type="text" placeholder="Message...">
      <div class ="vjs-chat__button-container"><button class="vjs-chat__button">Send</div>`;
  };
};

Component.registerComponent('ChatComponent', ChatComponent);

function ExamplePlugin() {
  this.addChild('ChatComponent');
  let messageArray = [];
  let vjsChat = document.querySelector('.vjs-chat');
  let chatMessage = document.querySelector('.vjs-chat__message-p');
  let inputMessage = document.querySelector('.vjs-chat__input');
  let btnSend = document.querySelector('.vjs-chat__button-container');
  let saveMessage = JSON.parse( localStorage.getItem('messageList') );

  vjsChat.style.visibility = 'hidden';

  if (saveMessage == null) {
    id = 0;
  } else {
    id = saveMessage.length;
    for (var i = 0; i < saveMessage.length; i++) {
      chatMessage.innerHTML += saveMessage[i].message + '<br/>';
      messageArray = saveMessage;
    };
  };

  this.on('playing', function() {
    vjsChat.style.visibility = 'visible';
  });

  btnSend.onclick = function() {
    messageArray.push({'id':id, 'message':inputMessage.value});
    localStorage.setItem( 'messageList', JSON.stringify(messageArray) );
    chatMessage.innerHTML += messageArray[id].message + '<br/>';
    inputMessage.value = '';
    id += 1;
  };

  inputMessage.onkeyup = function(ent) {
    if(ent.keyCode==13) {
      messageArray.push({'id':id, 'message':inputMessage.value});
      localStorage.setItem( 'messageList', JSON.stringify(messageArray) );
      chatMessage.innerHTML += messageArray[id].message + '<br/>';
      inputMessage.value = '';
      id += 1;
    };
  };
};

videojs.registerPlugin('ExamplePlugin', ExamplePlugin);

videojs('video-exam', {
  fluid: true,
  plugins: {
    ExamplePlugin: true
  }
});

