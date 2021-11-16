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
      <div class="vjs-chat_messages-container"><p class="vjs-chat_pMessage"></p></div>
      <input class="vjs-chat_input" type="text" placeholder="Message...">
      <div class ="vjs-chat_button-container"><button class="vjs-chat_button">Send</div>`
  };
};

Component.registerComponent('ChatComponent', ChatComponent);

function examplePlugin() {
  this.addChild('ChatComponent');
  let messageArray = [];
  let vjs_chat = document.querySelector('.vjs-chat');
  let chat_message = document.querySelector('.vjs-chat_pMessage');
  let inputMessage = document.querySelector('.vjs-chat_input');
  let btnSend = document.querySelector('.vjs-chat_button-container');
  let saveMessage = JSON.parse( localStorage.getItem('messageList') );

  vjs_chat.style.visibility = 'hidden';
  if (saveMessage == null) {
    id = 0;
  } else {
    id = saveMessage.length;
    for (var i = 0; i < saveMessage.length; i++) {
      chat_message.innerHTML += saveMessage[i].message + '<br/>';
      messageArray = saveMessage;
    };
  };

   this.on('playing', function() {
    vjs_chat.style.visibility = 'visible';
   });

  btnSend.onclick = function() {
    messageArray.push({'id':id, 'message':inputMessage.value});
    localStorage.setItem( 'messageList', JSON.stringify(messageArray) );
    chat_message.innerHTML += messageArray[id].message + '<br/>';
    inputMessage.value = '';
    id += 1;
  };

  inputMessage.onkeyup = function(ent) {
    if(ent.keyCode==13) {
      messageArray.push({'id':id, 'message':inputMessage.value});
      localStorage.setItem( 'messageList', JSON.stringify(messageArray) );
      chat_message.innerHTML += messageArray[id].message + '<br/>';
      inputMessage.value = '';
      id += 1;
    };
  };
};

videojs.registerPlugin('examplePlugin', examplePlugin);

videojs('video-exam', {
  fluid: true,
  plugins: {
      examplePlugin: true
  }
});

