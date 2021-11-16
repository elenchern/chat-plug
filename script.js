let player = videojs('video-exam', {
  fluid: true,
});
const Component = videojs.getComponent('Component');
let id = 0;

class ChatComponent extends Component{
  constructor(player) {
    super(player)
  };
  createEl() {
    const element = videojs.createEl('div', {
      className: 'vjs-chat',
    });
    element.insertAdjacentHTML('afterbegin', this.getTemplate())
    return element;
  };
  getTemplate() {
    return `
      <div class="vjs-chat_DivMessages"><p class="vjs-chat_pMessage"></p></div>
      <input class="vjs-chat_input" type="text" placeholder="Message...">
      <div class ="vjs-chat_DivButton"><button class="vjs-chat_button">Send</div>`
  };
};

Component.registerComponent('ChatComponent', ChatComponent);

function examplePlugin() {
  this.addChild('ChatComponent');
  let messageArray = [];
  let vjs_chat = document.querySelector('.vjs-chat');
  let chat_message = document.querySelector('.vjs-chat_pMessage');
  let inputMessage = document.querySelector('.vjs-chat_input');
  let btnSend = document.querySelector('.vjs-chat_DivButton');
  
  vjs_chat.style.visibility = 'hidden';
  if ( ( JSON.parse( localStorage.getItem('key') ) ) == null ) {
    id = 0;
  } else {
    id = ( JSON.parse( localStorage.getItem('key') ) ).length;
    for (var i = 0; i < ( JSON.parse( localStorage.getItem('key') ) ).length; i++) {
      chat_message.innerHTML += ( JSON.parse( localStorage.getItem('key') ) )[i].message + '<br/>';
      messageArray = JSON.parse( localStorage.getItem('key') );
    };
  };
  
   this.on('playing', function() {
    vjs_chat.style.visibility = 'visible';
   });

  btnSend.onclick = function() {
    messageArray.push({'id':id, 'message':inputMessage.value});
    localStorage.setItem( 'key', JSON.stringify(messageArray) );
    chat_message.innerHTML += messageArray[id].message + '<br/>';
    inputMessage.value = '';
    id += 1;
  };

  inputMessage.onkeyup = function(ent) {
    if(ent.keyCode==13) {
      messageArray.push({'id':id, 'message':inputMessage.value});
      localStorage.setItem( 'key', JSON.stringify(messageArray) );
      chat_message.innerHTML += messageArray[id].message + '<br/>';
      inputMessage.value = '';
      id += 1;
    };
  };
};

videojs.registerPlugin('examplePlugin', examplePlugin);
player.examplePlugin();

