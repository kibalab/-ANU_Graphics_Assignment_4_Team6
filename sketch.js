//Delcare Global Variables
var s;
var scl = 20;
var food;
var items = [];
playfield = 580;
var dirMul = 1; // -1이면 입력 반전
var gameState = "Menu";
var startDelay = 3;
var Speed = 10;

var ItemEffects = {
  AddSpeed: function() {
    Speed += 10
    frameRate (Speed);
    setTimeout(() => { // 10초 뒤에 실행될 코드
      Speed -= 10
      frameRate (Speed);
    }, 10000); // 단위 ms
  },
  SlowSpeed: function() {
    Speed -= 5
    Speed = constrain(Speed, 5, 999);
    frameRate (Speed);
    setTimeout(() => { // 10초 뒤에 실행될 코드
      Speed += 5
      frameRate (Speed);
    }, 10000); // 단위 ms
  },
  RandomMove: function() {
    
    var cols = floor(playfield/scl);
    var rows = floor(playfield/scl);
    var randomPos = createVector(floor(random(cols)), floor(random(rows)));
    randomPos.mult(scl);
    s.x = randomPos.x;
    s.y = randomPos.y;
  },
  ReverseInput: function() {
    dirMul = -1;
    setTimeout(() => { // 1초 뒤에 실행될 코드
      dirMul = 1;
    }, 3000); // 단위 ms
  },
  MoreLife: function() {
    s.life++;
  },
  TailCutter: function() {
    s.total--;
    s.score--;
    text(s.score, 70, 625);
    text(s.highscore, 540, 625);
  },
};
var ItemEffectNames = Object.keys(ItemEffects).map(key => ItemEffects[key]);

// p5js Setup function - required

function setup() {
  createCanvas(playfield, 640);
  background(51);
  s = new Snake();
  frameRate (10);
  SpawnFood();
  
  for(var i = 0; i< 3; i++)
  {
    items.push(SpawnItem(floor(random() * ItemEffectNames.length)));
  }
}

// p5js Draw function - required

function draw() {
  background(51);
  switch(gameState)
  {
    case "Menu":
      DrawMenuMenu()
      break;
    case "Game":
      DrawGameScreen()
      break;
    case "Pause":
      DrawPauseScreen();
      break;
    case "Over":
      DrawGameOver();
      break;
  }
  
  
}

function DrawGameScreen()
{
  scoreboard();
  if (s.eat(food)) {
    SpawnFood();
  }
  s.death(); // 뱀이 죽었는지 체크하는 함수
  s.update(); // 뱀의 움직이는 방향으로 좌표를 업데이트 하는 함수
  s.show(); // 뱀을 그리는 함수
  
  

  fill (255,0,100);
  rect(food.x,food.y, scl, scl); // 음식을 화면에 그리는 코드
  
  
  for(var i = 0; i < items.length; i++)
  {
    items[i].update();
    if(items[i].isEat) {  
      items = items.filter(item => !item.isEat); // 먹은 아이템은 배열에서 제거하는 코드
      items.push(SpawnItem(floor(random() * ItemEffectNames.length)));  // 아이템을 새로 생성하는 코드
    }
    fill (items[i].Color.r,items[i].Color.g,items[i].Color.b);
    rect(items[i].x,items[i].y, scl, scl); // 먹지않은 아이템을 화면에 그리는 코드
  }
}

function DrawGameOver()
{
  fill(255);
  textFont("Georgia");
  textSize(64);
  text("GAMEOVER", 100, 300);
  scoreboard()
}

function mouseClicked() {
  if(gameState == "Pause" || gameState == "Menu"){
    // 마우스 클릭 위치가 Rect 안에 있으면 실행
    if (mouseX >= 200 && mouseX <= 200 + 200 && mouseY >= 400 && mouseY <= 400 + 50) {
      gameState = "Game"
    }
  }
}

function DrawMenuMenu()
{
  fill(255);
  textFont("Georgia");
  textSize(64);
  text("SNAKE GAME", 85, 128);
  
  textSize(16);
  text("ANU Graphics Project", 85, 151);
  
  textSize(16);
  text("Team 6", 450, 151);
  
  rect(200, 400, 200, 50)
  fill(0);
  textSize(51);
  text("Start", 240, 440);
  scoreboard()
}

function DrawPauseScreen()
{
  fill(255);
  textFont("Georgia");
  textSize(64);
  text("PAUSE", 200, 200);
  
  rect(200, 400, 200, 50)
  fill(0);
  textSize(51);
  text("Return", 220, 440); 
}


// Pick a location for food to appear

function SpawnFood() {
  var cols = floor(playfield/scl);
  var rows = floor(playfield/scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);

  // Check the food isn't appearing inside the tail

  for (var i = 0; i < s.tail.length; i++) {
    var pos = s.tail[i];
    var d = dist(food.x, food.y, pos.x, pos.y);
    if (d < 1) {
      SpawnFood();
    }
  }
}

function SpawnItem(effectIndex) {
  var cols = floor(playfield/scl);
  var rows = floor(playfield/scl);
  var pos = createVector(floor(random(cols)), floor(random(rows)));
  pos.mult(scl);

  // Check the food isn't appearing inside the tail

  var item;
  for (var i = 0; i < s.tail.length; i++) {
    var pos = s.tail[i];
    var d = dist(s.x, s.y, pos.x, pos.y);
    if (d < 1) {
      item = SpawnFood();
    }
  }
  item = new Item();
  item.x = pos.x;
  item.y = pos.y;
  item.index = items.length;
  item.OnEat = ItemEffectNames[effectIndex];
  item.Color = {r:floor(random(255)), g:floor(random(255)), b:floor(random(255))}
  return item;
}

// scoreboard

function scoreboard() {
  fill(0);
  rect(0, 580, 600, 60);
  fill(255);
  textFont("Georgia");
  textSize(18);
  text("Score: ", 10, 625);
  text("Highscore: ", 450, 625)
  text("Life: ", 150, 625)
  text("Speed: ", 250, 625)
  text(s.score, 70, 625);
  text(s.highscore, 540, 625)
  text(s.life, 190, 625);
  text(Speed, 310, 625);
  
  if(dirMul <= 0)
  {
    fill(255);
    text("ReverseInput", 10, 600)
  }else{
    fill(100);
    text("ReverseInput", 10, 600)
  }
  
}

// CONTROLS function

function keyPressed() {
  if (keyCode === UP_ARROW){
      s.dir(0, -1 * dirMul); s.x = parseInt(s.x);
  }else if (keyCode === DOWN_ARROW) {
      s.dir(0, 1 * dirMul); s.x = parseInt(s.x);
  }else if (keyCode === RIGHT_ARROW) {
      s.dir (1 * dirMul, 0); s.y = parseInt(s.y);
  }else if (keyCode === LEFT_ARROW) {
      s.dir (-1 * dirMul, 0); s.y = parseInt(s.y);
  }else if (keyCode === ESCAPE && gameState == "Game") {
    gameState = "Pause";
  }
}

function Item()
{
  this.isEat = false;
  this.x = 0;
  this.y = 0;
  this.OnEat;
  this.Color = {r:255, g:100, b:255}
  
  this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if(d > 1) return;
    
    this.OnEat();
    this.isEat = true;
  }
  
  this.update = function() {
    this.eat(s);
  }
}

// SNAKE OBJECT

function Snake() {
  this.x =0;
  this.y =0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];
  this.score = 1;
  this.highscore = 1;
  this.life = 1;

  this.dir = function(x,y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      this.score++;
      text(this.score, 70, 625);
      if (this.score > this.highscore) {
        this.highscore = this.score;
      }
      text(this.highscore, 540, 625);
      return true;
    } else {
      return false;
    }
  }

  this.death = function() {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        s.life--;
        if(s.life <= 0){
          s.life = 1;
          this.total = 0;
          this.score = 0;
          this.tail = [];
          
          gameState = "Over";
          setTimeout(() => { // 3초 뒤에 실행될 코드
            gameState = "Menu";
          }, 3000); // 단위 ms
        }
      }
    }
  }

  this.update = function(){
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length-1; i++) {
        this.tail[i] = this.tail[i+1];
    }

    }
    this.tail[this.total-1] = createVector(this.x, this.y);

    this.x = this.x + this.xspeed*scl;
    this.y = this.y + this.yspeed*scl;

    this.x = constrain(this.x, 0, playfield-scl);
    this.y = constrain(this.y, 0, playfield-scl);


  }
  this.show = function(){
    fill(255);
    for (var i = 0; i < this.tail.length; i++) {
        rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }

    rect(this.x, this.y, scl, scl);
  }
}