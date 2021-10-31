
var player = videojs('video-exam');
//player.play();
const chat=document.getElementById('chat')
const input = document.querySelector("#inputMessage")
const btnSend = document.querySelector("#btnSend")  
const DMessage = document.querySelector("#message")  
DMessage.innerHTML=localStorage.getItem('h');

chat.style.visibility='hidden'
function examplePlugin() {
  player.on('playing', function() {//видимый чат
    chat.style.visibility='visible'
  });
  btnSend.onclick  = function() {//прослушка на кнопке
    var message = input.value; 
    DMessage.innerHTML+= message + '<br/>'
    localStorage.setItem('h', DMessage.innerHTML);
    //localStorage.removeItem('ss');
  };
  input.onkeyup = function(ent){
    if(ent.keyCode==13){
    var message = input.value; 
    DMessage.innerHTML+= message + '<br/>'
    localStorage.setItem('h', DMessage.innerHTML);}
    else {null} 
  }
}

examplePlugin();  

videojs.registerPlugin('examplePlugin', examplePlugin);


 
