var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

var background_sound = new Audio('background_sound.mp3');

var jump_sound = new Audio('jump.mp3');
var jumpDown_sound = new Audio('jumpDown.mp3');

var end_sound = new Audio('end.mp3');

var setBomb_sound = new Audio('setBomb.mp3');
var bombExplode_sound = new Audio('bombExplode.mp3');

const groundY = window.innerHeight - 30;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var img_background = new Image();
img_background.src = 'background.jpg';
var back = {
    x:0,
    y:0,
    width:canvas.width/1,
    height:canvas.height/1,

    draw(){
        ctx.drawImage(img_background, this.x, this.y, this.width, this.height);
    }
}

var img_user=[]
var img_user1 = new Image();
img_user1.src = 'blitzcrank1.png';
var img_user2 = new Image();
img_user2.src = 'blitzcrank2.png';
//var img_user3 = new Image();
//img_user3.src = 'pika3.png';
//var img_user4 = new Image();
//img_user4.src = 'pika4.png';

img_user=[img_user1, img_user2];

var user = {
    x:10,
    y:groundY-100,
    width:100,
    height:100,
    img_index:0,

    draw(a){
        if(a%20==0){
            this.img_index = (this.img_index+1)%2
        }
        if(jumping == true){
            ctx.drawImage(img_user[0], this.x, this.y, this.width, this.height);
        }
        else{
            ctx.drawImage(img_user[this.img_index], this.x, this.y, this.width, this.height);
        }
        
    }
}

user.draw(0)

var img_bomb = new Image();
img_bomb.src = 'bomb.png';

var level;

//var bombSpeed = 5;

class Bomb{
    constructor(){
        this.x = window.innerWidth - 120;
        this.y = groundY-50;
        this.width = 50;
        this.height = 50;
        setBomb_sound.play();
        this.bombSpeed = (1+Math.random()/2)*(5+level);
        
    }

    draw(){
        //ctx.fillStyle="red";
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(img_bomb, this.x, this.y, this.width, this.height);
    }
}

//var bomb = new Bomb();
//bomb.draw();

var img_teemo = new Image();
img_teemo.src = 'teemo.png';

var teemo = {
    x:window.innerWidth - 120,
    y:groundY-100,
    width:100,
    height:100,

    draw(){
        ctx.drawImage(img_teemo, this.x, this.y, this.width, this.height);
    }
}

var timer = 0;
var bombs = [];
var speedY = 0;
var animation;


function frameSecond(){
    var bombCycle = 0.5;//초당 버섯 수

    animation = requestAnimationFrame(frameSecond);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    timer++;

    level = timer/600;

    //배경
    back.draw();

    ctx.fillStyle = 'black';
    ctx.font = '30px 맑은 고딕';

    ctx.fillText('Avoid Mushrooms', 10, 30);

    background_sound.play();
    //점수
    gameScore();

    ctx.font = '20px 맑은 고딕';
    ctx.fillStyle = 'black';
    ctx.fillText('level : '+ (Math.round(level*100)/100).toFixed(2), 10, 70);


    //버섯
    if(bombCycle*timer%(60-3*Math.round(level))==0){
        var bomb = new Bomb();
        bombs.push(bomb);
    }

    bombs.forEach((b,i,o)=>{
        if(b.x<0){
            o.splice(i,1);
        }
        b.x-=b.bombSpeed;
        collision(user,b);
        b.draw()
    })

    //점프
    if(jumping==true){
        
        user.y-=25;//점프정도
    }
    
    collisionGround(user,groundY);

    user.y+=speedY;

    user.draw(timer);
    teemo.draw();
}

frameSecond();

function collision(user, bomb){
    var x_diff = bomb.x - (user.x+user.width);
    var y_diff = bomb.y - (user.y+user.height);
    if(x_diff<0 && y_diff<0){
        //ctx.clearRect(0,0, canvas.width, canvas.height);
        cancelAnimationFrame(animation);

        ctx.fillStyle = 'red';
        ctx.font = '60px 맑은 고딕';

        ctx.fillText('GAME OVER', canvas.width/3, canvas.height/3);

        background_sound.pause();
        end_sound.play();
        bombExplode_sound.play();
    }
}

function collisionGround(user,groundY){
    var feet = user.y + user.height;
    if (feet >= groundY){
        speedY = 0;
        user.y = groundY-user.height;
        if(jumping==true){
            jumpDown_sound.play();
        }
        jumping = false;
    }
    else{
        speedY += 50*(1/60);//중력 : 중력가속도*프레임당
    }

}

var jumping = false;
document.addEventListener('keydown', function(e){
    if(e.code =="Space"){
        if(jumping == false){
            jump_sound.play();
        }
        jumping = true;
    }
})

function gameScore(){
    ctx.font = '20px 맑은 고딕';
    ctx.fillStyle = 'black';
    ctx.fillText('TIME : '+ (Math.round(timer*100/60)/100).toFixed(2), 10, 50);
}