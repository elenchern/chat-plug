let player = videojs('video-exam', {
     fluid: true,})
const Component = videojs.getComponent('Component');

class ChatComponent extends Component{
  constructor(player){
    super(player)
  };
  createEl(){
    const element = videojs.createEl('div', { 
      className: 'vjs_chat',
    });
    element.insertAdjacentHTML('afterbegin', this.getTemplate())
    return element;
  };
  getTemplate() {
      return `
      <div class="chat" id="chat">
        <div class = "chat_message"><p id = "chat_message"></p></div>
            <input id = "inputMessage" type = "text" placeholder = "Message...">
            <div id="btnSend" class ="chat_btn"><button class="btnSend-btn">Send</div>
          </div>`
  }
};

Component.registerComponent('ChatComponent', ChatComponent);

function examplePlugin(){
  let messageArray = [];

  this.addChild('ChatComponent');
  chat.style.visibility='hidden';
  if ((JSON.parse(localStorage.getItem('key'))).length ==null){
    id=0}
  else{
    id=(JSON.parse(localStorage.getItem('key'))).length;
    for (var i = 0; i < (JSON.parse(localStorage.getItem('key'))).length; i++){
      chat_message.innerHTML += (JSON.parse(localStorage.getItem('key')))[i].message +'<br/>';
      messageArray = JSON.parse(localStorage.getItem('key'));
    };
  };

   this.on('playing', function(){
     chat.style.visibility='visible';
   });

  btnSend.onclick  = function(){
    messageArray.push({'id':id, 'message':inputMessage.value });
    localStorage.setItem('key',  JSON.stringify(messageArray));
    chat_message.innerHTML +=messageArray[id].message +'<br/>';
    inputMessage.value='';
    id+=1;
  };

  inputMessage.onkeyup = function(ent){
    if(ent.keyCode==13){
     messageArray.push({'id':id, 'message':inputMessage.value });
      localStorage.setItem('key',  JSON.stringify(messageArray));
     chat_message.innerHTML +=messageArray[id].message +'<br/>';
     inputMessage.value='';
      id+=1;
    };
  };
  };

 videojs.registerPlugin('examplePlugin', examplePlugin);
 player.examplePlugin();
