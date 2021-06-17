//constants
const gameWidth =  800;
const gameHeight =  600;
const mazeColor = "black";
const INTRO=0, START=1, PLAY=2, END=3, WIN=4;
const SQUIRRELMOVE=5;
const MAXLIVES = 3;
const MAXNUTS=35;

//variables
var squirrel, squirrelImg, squirrelFlip;
var snake, snakeImg, snakeFlip, snake2, snake3;
var story, gameStory;
var blackScreen, randNum, edges;
var nutImg, gnutImg;
var bgImg;
var n1,n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16, n17, n18, n19, n20, n21, n22, n23, n24, n25,
n26, n27, n28, n29, n30, n31, n32, n33, n34, n35, n36;
var gn1, gn2, gn3, gn4, gn5;
var m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20, m21, m22, m23, m24, m25,
m26, m27, m28, m29, m30, m31, m32, m33, m34;
var nutGroup, gnutGroup, mazeGroup;
var gameState=INTRO;
var score=0, lives=MAXLIVES;
var collectGnut, collectNuts, snakeBites, loseGame, gameWin;
var soundPlayedOnce = false


function preload(){

  //load squirrel image
  squirrelImg=loadImage("assets/images/Squirrel_left.png");
  squirrelFlip=loadImage("assets/images/Squirrel_right.png");

  //load snake image
  snakeImg=loadImage("assets/images/snake2.png");
  snakeFlip=loadImage("assets/images/snakeFlip.png")

  //load nuts images
  nutImg=loadImage("assets/images/nut.png");
  gnutImg=loadImage("assets/images/gnut.png");

  //load bg image
  bgImg=loadImage("assets/images/bg1.png");

  //load story img
  gameStory=loadImage("assets/images/gameStory7.png");

  //load all sounds
  collectGnut=loadSound("assets/sounds/collectGoldenNut.mp3");
  collectNuts=loadSound("assets/sounds/collectNut.mp3");
  snakeBites=loadSound("assets/sounds/snakeBite.mp3");
  loseGame=loadSound("assets/sounds/loseGame.mp3");
  gameWin=loadSound("assets/sounds/gameWin.mp3");

}


function setup() {
  createCanvas(gameWidth,gameHeight);

  //create group for golden, normal nuts and maze
  nutGroup=new Group();
  gnutGroup=new Group();
  mazeGroup=new Group();

  //call create maze
  createMaze();

  //call create nuts
  createNuts();
  //call create golden nuts
  createGoldenNuts();
      
  //create squirrel sprite and add image
  squirrel=createSprite(753,65,10,10);
  squirrel.addImage("leftImg", squirrelImg);

  //create snakes and add image
  snake=createSprite(55,575,1,1);
  snake.addImage(snakeImg);
  snake.scale=.2;  
  snake2=createSprite(50,55,1,1);
  snake2.addImage(snakeImg);
  snake2.scale=.2; 
  snake3=createSprite(750,575,1,1);
  snake3.addImage(snakeFlip);
  snake3.scale=.2;

  //create story sprite for background
  story=createSprite(395,300,gameWidth,gameHeight);
  story.addImage(gameStory);
  story.scale=.8;

  //create black screen
  blackScreen=createSprite(gameWidth/2,gameHeight/2,gameWidth,gameHeight);
  blackScreen.shapeColor="black";
  blackScreen.visible=false;

}

function draw() {
  background(bgImg);
  
  //show all sprites
  drawSprites();

  if(gameState!=INTRO){

    //display points and lives
    push();
    textSize (15);
    fill(220,30,5);
    stroke(4);
    text ("POINTS : " + score + "            LIVES : " + lives, 300,15);
    pop();

  }


  if (gameState==INTRO){
    

    if(keyDown("N")){

      //hide text and story sprite shown in INTRO state
      story.destroy();
  
      //change to start state
      gameState=START;
  
    }
    
  }


  if (gameState==START){

    //show text to press S key to start playing
    fill(220,30,5);
    textSize(15);
    text ("Press the S key to start", 330,50);

    //when s key is pressed,
    if(keyDown("S")){

      //remove barriers 
      m3.remove();
      m4.remove();
      m5.remove();
      m6.remove();
      m8.remove();
      m32.remove();
      m33.remove();
      m34.remove();

      // play game
      gameState=PLAY;

      console.log ("START KEY PRESSED");

    }

  }


  if(gameState==PLAY){

    console.log ("INSIDE PLAY STATE");
    edges=createEdgeSprites();

      //if squirrel touches any nut,
      nutGroup.overlap(squirrel, collectNut);
      gnutGroup.overlap(squirrel, collectGoldenNut);

      //if squirrel touches snake,
      snake.overlap(squirrel, snakeBite);
      snake2.overlap(squirrel, snakeBite);
      snake3.overlap(squirrel, snakeBite);
    
    
      //call snake movement functions to make snakes move
      
      snakeMovement();
      snakeTwoMovement();
      snakeThreeMovement();
    
    
      //let squirrel move using arrow key controls
      if(keyDown("UP_ARROW")){
          squirrel.y = squirrel.y-SQUIRRELMOVE;
      }
      if(keyDown("DOWN_ARROW")){
          squirrel.y=squirrel.y+SQUIRRELMOVE;
      }
      if(keyDown("LEFT_ARROW")){
          squirrel.x=squirrel.x-SQUIRRELMOVE;
          squirrel.addImage("LeftImage", squirrelImg);
          squirrel.changeImage("LeftImage"); 
      }
      if(keyDown("RIGHT_ARROW")){
          squirrel.x=squirrel.x+SQUIRRELMOVE;
          squirrel.addImage("RightImage", squirrelFlip); 
          squirrel.changeImage("RightImage");
      }
      
      //make squirrel collide against all walls of the maze and edges 
      squirrelCollide();
    
      //make snakes collide against all walls of the maze and edges 
      snakesCollide();
      

      if (score>=MAXNUTS){

        //change gameState to win
        gameState=WIN;

      }

      if (lives<=0){

        //change gameState to end
        gameState=END; 

      }
      
  }
  

  if (gameState==END){

    //destroy nuts and maze
    nutGroup.destroyEach();
    gnutGroup.destroyEach();
    mazeGroup.destroyEach();

    //make black screen visible
    blackScreen.visible=true;

    //display you lose press r to try again text
    textSize(30);
    fill(220,30,5);
    text("You Lose! Press R to try again.", 200,300);  

    //play end sound only once
    if (soundPlayedOnce == false) {
      loseGame.play();
      soundPlayedOnce = true; 
    }

  }

  //if r key is pressed in end or win state, restart game
  if (keyDown ("R") && (gameState == END || gameState == WIN)){
    restart ();
  }

  if(gameState==WIN){

    //destroy nuts
    nutGroup.destroyEach();
    gnutGroup.destroyEach();
    mazeGroup.destroyEach();

    //make black screen visible
    blackScreen.visible=true;

    //display you win text
    textSize(40);
    fill(220,30,5);
    text("You Win!!!", 320,300);

    //display mini text at bottom that says press r to play again
    textSize(15);
    fill(220,30,5);
    text("Press R to play again", 335, 590);

    //play win sound
    if (soundPlayedOnce == false) {
      gameWin.play();
      soundPlayedOnce = true;
    }

  }

  

}


function createNuts(){

  //create all 35 nuts
  n1=createSprite(590,60,10,10);
  n1.addImage(nutImg);
  n1.scale=0.06;
  n2=createSprite(670,115,10,10);
  n2.addImage(nutImg);
  n2.scale=0.06;
  n3=createSprite(600,175,10,10);
  n3.addImage(nutImg);
  n3.scale=0.06;
  n4=createSprite(750,175,10,10);
  n4.addImage(nutImg);
  n4.scale=0.06;
  n5=createSprite(750,175,10,10);
  n5.addImage(nutImg);
  n5.scale=0.06;
  n6=createSprite(600,250,10,10);
  n6.addImage(nutImg);
  n6.scale=0.06;
  n7=createSprite(600,350,10,10);
  n7.addImage(nutImg);
  n7.scale=0.06;
  n8=createSprite(700,400,10,10);
  n8.addImage(nutImg);
  n8.scale=0.06;
  n9=createSprite(750,330,10,10);
  n9.addImage(nutImg);
  n9.scale=0.06;
  n10=createSprite(670,520,10,10);
  n10.addImage(nutImg);
  n10.scale=0.06;
  n11=createSprite(550,570,10,10);
  n11.addImage(nutImg);
  n11.scale=0.06;
  n12=createSprite(450,520,10,10);
  n12.addImage(nutImg);
  n12.scale=0.06;
  n13=createSprite(380,450,10,10);
  n13.addImage(nutImg);
  n13.scale=0.06;
  n14=createSprite(280,500,10,10);
  n14.addImage(nutImg);
  n14.scale=0.06;
  n15=createSprite(350,570,10,10);
  n15.addImage(nutImg);
  n15.scale=0.06;
  n16=createSprite(180,510,10,10);
  n16.addImage(nutImg);
  n16.scale=0.06;
  n17=createSprite(50,490,10,10);
  n17.addImage(nutImg);
  n17.scale=0.06;
  n18=createSprite(30,390,10,10);
  n18.addImage(nutImg);
  n18.scale=0.06;
  n19=createSprite(180,390,10,10);
  n19.addImage(nutImg);
  n19.scale=0.06;
  n20=createSprite(300,350,10,10);
  n20.addImage(nutImg);
  n20.scale=0.06;
  n21=createSprite(150,305,10,10);
  n21.addImage(nutImg);
  n21.scale=0.06;
  n22=createSprite(670,520,10,10);
  n22.addImage(nutImg);
  n22.scale=0.06;
  n23=createSprite(80,120,10,10);
  n23.addImage(nutImg);
  n23.scale=0.06;
  n24=createSprite(320,240,10,10);
  n24.addImage(nutImg);
  n24.scale=0.06;
  n25=createSprite(400,290,10,10);
  n25.addImage(nutImg);
  n25.scale=0.06;
  n26=createSprite(440,180,10,10);
  n26.addImage(nutImg);
  n26.scale=0.06;
  n27=createSprite(500,320,10,10);
  n27.addImage(nutImg);
  n27.scale=0.06;
  n28=createSprite(520,120,10,10);
  n28.addImage(nutImg);
  n28.scale=0.06;
  n29=createSprite(400,90,10,10);
  n29.addImage(nutImg);
  n29.scale=0.06;
  n30=createSprite(300,50,10,10);
  n30.addImage(nutImg);
  n30.scale=0.06;
  n31=createSprite(230,150,10,10);
  n31.addImage(nutImg);
  n31.scale=0.06;
  n32=createSprite(170,60,10,10);
  n32.addImage(nutImg);
  n32.scale=0.06;
  n33=createSprite(40,250,10,10);
  n33.addImage(nutImg);
  n33.scale=0.06;
  n34=createSprite(90,180,10,10);
  n34.addImage(nutImg);
  n34.scale=0.06;
  n35=createSprite(220,260,10,10);
  n35.addImage(nutImg);
  n35.scale=0.06;
  n36=createSprite(500,430,10,10);
  n36.addImage(nutImg);
  n36.scale=0.06;

  //add all nuts to the nut group
  nutGroup.add(n1);
  nutGroup.add(n2);
  nutGroup.add(n3);
  nutGroup.add(n4);
  nutGroup.add(n5);
  nutGroup.add(n6);
  nutGroup.add(n7);
  nutGroup.add(n8);
  nutGroup.add(n9);
  nutGroup.add(n10);
  nutGroup.add(n11);
  nutGroup.add(n12);
  nutGroup.add(n13);
  nutGroup.add(n14);
  nutGroup.add(n15);
  nutGroup.add(n16);
  nutGroup.add(n17);
  nutGroup.add(n18);
  nutGroup.add(n19);
  nutGroup.add(n20);
  nutGroup.add(n21);
  nutGroup.add(n22);
  nutGroup.add(n23);
  nutGroup.add(n24);
  nutGroup.add(n25);
  nutGroup.add(n26);
  nutGroup.add(n27);
  nutGroup.add(n28);
  nutGroup.add(n29);
  nutGroup.add(n30);
  nutGroup.add(n31);
  nutGroup.add(n32);
  nutGroup.add(n33);
  nutGroup.add(n34);
  nutGroup.add(n35);
  nutGroup.add(n36);
  
}

function createGoldenNuts(){

  //create all 5 golden nuts
  gn1=createSprite(730,230,10,10);
  gn1.addImage(gnutImg);
  gn1.scale=0.023;
  gn2=createSprite(430,375,10,10);
  gn2.addImage(gnutImg);
  gn2.scale=0.023;
  gn3=createSprite(50,320,10,10);
  gn3.addImage(gnutImg);
  gn3.scale=0.023;
  gn4=createSprite(510,60,10,10);
  gn4.addImage(gnutImg);
  gn4.scale=0.023;
  gn5=createSprite(220,570,10,10);
  gn5.addImage(gnutImg);
  gn5.scale=0.023;

  gnutGroup.add(gn1);
  gnutGroup.add(gn2);
  gnutGroup.add(gn3);
  gnutGroup.add(gn4);
  gnutGroup.add(gn5);


}

function createMaze(){

  //create all 27 maze pieces
  m3=createSprite(30,550,170,7);
  m3.shapeColor="gray";
  m4=createSprite(115,575,7,57);
  m4.shapeColor="gray";
  m5=createSprite(765,105,110,7);
  m5.shapeColor="gray";
  m6=createSprite(710,68.5,7,80);
  m6.shapeColor="gray";
  m8=createSprite(110,53.5,7,60);
  m8.shapeColor="gray";
  m32=createSprite(25,80,170,7);
  m32.shapeColor="gray";
  m33=createSprite(700,575,7,70);
  m33.shapeColor="gray";
  m34=createSprite(750,550,95,7);
  m34.shapeColor="gray";

  m1=createSprite(350,230,7,180);
  m1.shapeColor=mazeColor;
  m2=createSprite(350,140,90,7);
  m2.shapeColor=mazeColor;
  m7=createSprite(290,210,120,7);
  m7.shapeColor=mazeColor;
  m9=createSprite(20,345,350,7);
  m9.shapeColor=mazeColor;
  m10=createSprite(70,345,7,105);
  m10.shapeColor=mazeColor;
  m11=createSprite(250,470,145,7);
  m11.shapeColor=mazeColor;
  m12=createSprite(250,480,7,85);
  m12.shapeColor=mazeColor;
  m13=createSprite(120,175,7,85);
  m13.shapeColor=mazeColor;
  m14=createSprite(90,155,120,7);
  m14.shapeColor=mazeColor;
  m15=createSprite(570,175,7,305);
  m15.shapeColor=mazeColor;
  m16=createSprite(550,100,150,7);
  m16.shapeColor=mazeColor;
  m17=createSprite(460,270,7,160);
  m17.shapeColor=mazeColor;
  m18=createSprite(480,400,230,7);
  m18.shapeColor=mazeColor;
  m19=createSprite(780,200,270,7);
  m19.shapeColor=mazeColor;
  m20=createSprite(700,200,7,105);
  m20.shapeColor=mazeColor;
  m21=createSprite(690,330,50,7);
  m21.shapeColor=mazeColor;
  m22=createSprite(650,550,105,7);
  m22.shapeColor=mazeColor;
  m23=createSprite(700,500,7,105);
  m23.shapeColor=mazeColor;
  m24=createSprite(580,480,60,7);
  m24.shapeColor=mazeColor;
  m25=createSprite(400,565,7,75);
  m25.shapeColor=mazeColor;
  m26=createSprite(240,70,7,50);
  m26.shapeColor=mazeColor;
  m27=createSprite(240,70,50,7);
  m27.shapeColor=mazeColor;
  m28=createSprite(400,24,800,10);
  m28.shapeColor=mazeColor;
  m29=createSprite(400,597,800,10);
  m29.shapeColor=mazeColor;
  m30=createSprite(797,320,10,600);
  m30.shapeColor=mazeColor;
  m31=createSprite(3,320,10,600);
  m31.shapeColor=mazeColor;

  //add all mazes to maze group
  mazeGroup.add(m3);
  mazeGroup.add(m4);
  mazeGroup.add(m5);
  mazeGroup.add(m6);
  mazeGroup.add(m8);
  mazeGroup.add(m32);
  mazeGroup.add(m33);
  mazeGroup.add(m34);

  mazeGroup.add(m1);
  mazeGroup.add(m2);
  mazeGroup.add(m7);
  mazeGroup.add(m9);
  mazeGroup.add(m10);
  mazeGroup.add(m11);
  mazeGroup.add(m12);
  mazeGroup.add(m13);
  mazeGroup.add(m14);
  mazeGroup.add(m15);
  mazeGroup.add(m16);
  mazeGroup.add(m17);
  mazeGroup.add(m18);
  mazeGroup.add(m19);
  mazeGroup.add(m20);
  mazeGroup.add(m21);
  mazeGroup.add(m22);
  mazeGroup.add(m23);
  mazeGroup.add(m24);
  mazeGroup.add(m25);
  mazeGroup.add(m26);
  mazeGroup.add(m27);
  mazeGroup.add(m28);
  mazeGroup.add(m29);
  mazeGroup.add(m30);
  mazeGroup.add(m31);




}


function snakeMovement(){

  if (frameCount%200==0){

    //assign random number movements
    randNum=round(random(1,4));

    //switch case
    switch (randNum){

      //let snake move left
      case 1 : snake.velocityX=-5; snake.velocityY=2; snake.addImage(snakeFlip);
      break;

      //let snake move right
      case 2 : snake.velocityX=5; snake.velocityY=2; snake.addImage(snakeImg);
      break;

      //let snake move down
      case 3 : snake.velocityY=5; snake.velocityX=2;
      break;

      //let snake move up
      case 4 : snake.velocityY=-5; snake.velocityX=2;
      break;

      default : break ;

    }
  }
}

function snakeTwoMovement(){

  if (frameCount%200==0){

    //assign random number movements
    randNum=round(random(1,4));

    //switch case
    switch (randNum){

      //let snake move left
      case 1 : snake2.velocityX=-4; snake2.velocityY=2; snake.addImage(snakeFlip);
      break;

      //let snake move right
      case 2 : snake2.velocityX=4; snake2.velocityY=2; snake.addImage(snakeImg);
      break;

      //let snake move down
      case 3 : snake2.velocityY=4; snake2.velocityX=2;
      break;

      //let snake move up
      case 4 : snake2.velocityY=-4; snake2.velocityX=2;
      break;

      default : break ;

    }
  }
}

function snakeThreeMovement(){

  if (frameCount%200==0){

    //assign random number movements
    randNum=round(random(1,4));

    //switch case
    switch (randNum){

      //let snake move left
      case 1 : snake3.velocityX=-5; snake3.velocityY=3; snake.addImage(snakeFlip);
      break;

      //let snake move right
      case 2 : snake3.velocityX=5; snake3.velocityY=3; snake.addImage(snakeImg);
      break;

      //let snake move down
      case 3 : snake3.velocityY=5; snake3.velocityX=3;
      break;

      //let snake move up
      case 4 : snake3.velocityY=-5; snake3.velocityX=3;
      break;

      default : break ;

    }
  }
}


//when squirrel touches any normal nut,
function collectNut (nutSprite, squirrel) {

  //destroy nut
  nutGroup.remove (nutSprite);
  nutSprite.destroy ();

  //increment score
  score++;

  //play collect nut sound
  collectNuts.play();

}


//when squirrel touches any golden nut,
function collectGoldenNut (gnutSprite, squirrel) {
  
  //destroy golden nut
  gnutGroup.remove (gnutSprite);
  gnutSprite.destroy ();

  //increment score and lives 
  score++;
  lives++;

  //play collect golden nut sound
  collectGnut.play();

}

//when snake touches/bites squirrel
function snakeBite(sn, sq){

  //if there is a life left,
  if (lives >= 1) {

    //dedcut life 
    lives--; 
    
    //squirrel.setCollider ("circle", 0,0,10);
  }  
  else {
    //else, change gameState to END 
    gameState = END;
  }

  //move squirrel back to beginning position
  squirrel.x=753;
  squirrel.y=65;

  //play snake bite sound
  snakeBites.play();
 
}


function restart(){

  //reset gameState to start
  gameState=START;

  //reset sound played once to false again
  soundPlayedOnce = false;

  //move squirrel back to beginning position
  squirrel.x=753;
  squirrel.y=65;

  //reset lives and score
  lives=MAXLIVES;
  score=0;

  //reset snake's position
  snake.x=55;
  snake.y=575;
  snake2.x=50;
  snake2.y=55;
  snake3.x=750;
  snake3.y=575;

  //reset snake velocity to zero
  snake.velocityX=0;
  snake.velocityY=0;
  snake2.velocityX=0;
  snake2.velocityY=0;
  snake3.velocityX=0;
  snake3.velocityY=0;

  //make blackScreen invisible again
  blackScreen.visible=false;

  //destroy all nuts and reset them
  nutGroup.destroyEach();
  gnutGroup.destroyEach();
  createNuts();
  createGoldenNuts();

  //destroy whole maze and reset it
  mazeGroup.destroyEach();
  createMaze();


}


function squirrelCollide(){

  //make squirrel collide against maze and edges 
  squirrel.collide(mazeGroup);
  squirrel.collide(edges);

}


function snakesCollide(){

  //make snakes bounceoff off maze and edges and collide against other snakes
  snake.bounceOff(mazeGroup);
  snake.collide(snake2);
  snake.collide(snake3);
  snake.bounceOff(edges);

  snake2.bounceOff(mazeGroup);
  snake2.collide(snake);
  snake2.collide(snake3);
  snake2.bounceOff(edges);

  snake3.bounceOff(mazeGroup);
  snake3.collide(snake);
  snake3.collide(snake2);
  snake3.bounceOff(edges);


}

