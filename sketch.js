/*

Use L and R arrow keys, and SPACE to jump.

I have created an alpine environment with hibernating bears. They are asleep, but don’t get too close. Fortunately, they are still sleepy and will go back to sleep if you run away. I implemented classes for the bears, platforms, and collectables. To prevent the collectables from re-appearing after losing a life, the array of collectable objects had to be kept outside of the draw loop. Great to implement objects. Really useful to keep them as objects rather than trying to update arrays. Nice to see the project come along. I got more and more ideas as I was writing the code, but I wanted to keep it a simple visual design. 

*/

var floorPos_y;  // Control variables.
var gameChar_x;
var gameChar_y;
var gameChar_world_x;
var isLeft;
var isRight;
var isFalling;
var isCharWet;
var scrollPos;

var bears;  // Design variables.
var cloud;
var collectable;
var flagpole;
var game_score;
var lives;
var logs;
var mountain;
var river;
var tree;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 0.75;
    game_score = 0;
    lives = 3;
    
    // Must initialise collectables here so they do not reappear.
    collectable_arr = [];
    collectable = {x_pos: [-100, 0, 240, 320, 400, 480, 925, 1125, 1300, 1900], 
                   y_pos: [floorPos_y - 250, floorPos_y - 250, 
                           floorPos_y - 100, floorPos_y - 170, 
                           floorPos_y - 150, floorPos_y - 130, 
                           floorPos_y - 180, floorPos_y - 200,
                           floorPos_y - 180, floorPos_y - 10]};
    // Populate collectable array
    for(var i = 0; i < collectable.x_pos.length; i++){
        collectable_arr.push(new Collectable(collectable.x_pos[i], collectable.y_pos[i]));
        }
    
    startGame();
    
}
function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    bear_arr = [];
    log_arr = [];

	scrollPos = 0;  // Variable to control the background scrolling.
	gameChar_world_x = gameChar_x - scrollPos;  // Real position of scrolling character.

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isCharWet = false;

    // Design feature references
    bears = {x_pos: [-825,-50, 700, 1700],
           y_pos: 440};
    river = {x_pos: [-800, 775], 
              width: 700};
    cloud = {x_pos: [-500, -100, 300, 500, 950, 1200, 1500],
             y_pos: [200, 50, 200, 100, 250, 100, 150],
             size: 100};
    logs = {x_pos: [-225, -175, -125, 200, 775, 1000, 1200, 1400],
            y_pos: [floorPos_y - 20, floorPos_y - 100,
                    floorPos_y - 180, floorPos_y - 30, 
                    floorPos_y - 20, floorPos_y - 50,
                    floorPos_y - 50, floorPos_y - 20],
            size: [80, 80, 200, 80, 80, 60, 60, 80]};
    mountain = {x_pos: [20, 650, 1400, 1600], 
                y_pos: 432, 
                size: 300};
	tree = {x_pos: [-550, -500, -300, -100, 50, 300, 700, 950, 1000, 1100, 
                    1525, 1800],
            y_pos: floorPos_y};
    flagpole = {x_pos: 1950, 
                height: 100,
                isReached: false};
    
    // Populate bears array
    for(var i = 0; i < bears.x_pos.length; i++){
        bear_arr.push(new Bears(bears.x_pos[i], bears.y_pos));
        }
    
    // Populate logs array
    for(var i = 0; i < logs.x_pos.length; i++){
        log_arr.push(new Log(logs.x_pos[i], logs.y_pos[i], logs.size[i]));
        }
}

function draw(){
	background(100, 155, 255); // fill the sky blue.
    
	noStroke();  // Background mountain range.
    fill(80, 80, 80); 
    beginShape();
    vertex(0, 170);
    vertex(100, 220);
    vertex(120, 230);
    vertex(200, 210);
    vertex(240 , 190);
    vertex(255, 215);
    vertex(270, 240);
    vertex(290, 250);
    vertex(360, 270);
    vertex(390, 240);
    vertex(450, 200);
    vertex(525 , 150);
    vertex(590, 160);
    vertex(630, 200);
    vertex(660, 210);
    vertex(680, 204);
    vertex(750 , 180);
    vertex(780, 210);
    vertex(800, 240);
    vertex(860, 280);
    vertex(900, 240);
    vertex(985, 200);
    vertex(1024 , 180);
    vertex(width , height);
    vertex(0 , height);
    endShape();
    
    fill(220, 220, 220); // Snow caps.
    triangle(0, 190, 0, 170, 100, 220);
    triangle(200, 210, 240 , 190, 255, 215);
    triangle(450, 200, 525 , 150, 590, 160);
    triangle(500, 180, 590, 160, 630, 200);
    triangle(680, 204, 750 , 180, 780, 210);
    triangle(985, 200, 1024 , 180, 1024, 205);
    
    fill(0, 191, 255); // Distant stream.
    beginShape();
    vertex(360, 270);
    vertex(420, 300);
    vertex(500, 400);
    vertex(480, 400);
    vertex(410, 300);
    vertex(360, 270);
    endShape();
    
    fill(0, 80, 0); // Background hills.
    beginShape();
    vertex(0, 270);
    vertex(130, 300);
    vertex(260, 340);
    vertex(410, 380);
    vertex(450, 380);
    vertex(710 , 300);
    vertex(800, 280);
    vertex(900, 275);
    vertex(1024 , 300);
    vertex(width , height);
    vertex(0 , height);
    endShape();
    
    fill(0, 191, 255); // Midground stream.
    beginShape();
    vertex(410, 380);
    vertex(440, 380);
    vertex(460, 470);
    vertex(420, 470);
    endShape();
    
	fill(0,155,0);  // draw some green ground.
	rect(0, floorPos_y, width, height/4); 
    
    // Scrolling start.
    push();
    translate(scrollPos,0);
    
    /////////////////////
	//Draw the elements//
    /////////////////////
    
    drawClouds();  // Clouds.
    drawMountains();  // Mountains.
    drawTrees();  // Trees.
    
    for(var i = 0; i < river.x_pos.length; i++){  // Rivers.
        drawRiver(river.x_pos[i]);
        checkRiver(i);
        }
    
    for(var i = 0; i < log_arr.length; i++){  // Logs.
        log_arr[i].draw(log.x_pos, log.y_pos, log.size);
        }
    
    for(var i = 0; i < collectable_arr.length; i++){  // Collectables.
        if(collectable_arr[i].isFound == false){
            collectable_arr[i].draw(collectable.x_pos[i], collectable.y_pos[i]);
            collectable_arr[i].update(gameChar_world_x, gameChar_y);
            }
        }
    
    for(var i = 0; i < bear_arr.length; i++){  // Bears.
        bear_arr[i].draw(bears.x_pos, bears.y_pos);
        bear_arr[i].update(gameChar_world_x, gameChar_y);
        }
    
    if(flagpole.isReached == false){  // Flagpole.
        checkFlagpole();
        }
    renderFlagpole();
    
    // Scrolling end.
    pop();  
    
    // Score.
    fill(255, 69, 0);  
    textSize(40);
    text("SCORE:" + " " + game_score, width * 0.1, height * 0.2);
    
    // Lives text and characters.
    fill(255, 69, 0);  
    textSize(40);
    text("LIVES: ", width * 0.7, height * 0.2);
    var ws = width * 0.85;
    var hs = height * 0.23;
    for(var i = 0; i < lives; i++){
        fill(0, 0, 0);  // Background arm.
        stroke(0);
        line((ws + (i * 40)) + 12, (hs) - 50, (ws + (i * 40)) + 12, (hs) - 25); 
        line((ws + (i * 40)), (hs) - 30, (ws + (i * 40)) + 6, (hs));  // Background leg.
        noStroke();  // head.
        fill(255, 0, 255);
        ellipse((ws + (i * 40)), (hs) - 56, 12, 12);
        fill(255, 222, 173);  // Body.
        triangle((ws + (i * 40)), (hs) -30, 
                 (ws + (i * 40)) - 12, (hs) - 50, 
                 (ws + (i * 40)) + 12, (hs) - 50); 
        fill(0, 0, 0);  // Foreground arm.
        stroke(0);
        line((ws + (i * 40)) - 12, (hs) - 50, 
             (ws + (i * 40)) - 12, (hs) - 25); 
        line((ws + (i * 40)), (hs) - 30, (ws + (i * 40)) - 6, (hs));  // Foreground leg.
        }
    
	// Draw game character.
	drawGameChar();
    checkPlayerDie();
    
    
	// Logic to make the game character move or the background scroll.
	if(isLeft){
		if(gameChar_x > width * 0.2){
			gameChar_x -= 5;
		    }
		else{
			scrollPos += 5;
		    }
	    }

	if(isRight){
		if(gameChar_x < width * 0.8){
			gameChar_x  += 5;
		    }
		else{
			scrollPos -= 5; // Negative for moving against the background.
		    }
	    }
    
    // Gravity, platform contact and in water.
    var isContact = false;
    for(var i = 0; i < log_arr.length; i++){
        if(log_arr[i].checkContact(gameChar_world_x, gameChar_y)){
            isContact = true;
            }
        }
    
    if((gameChar_y < floorPos_y) && !isContact){
        gameChar_y += 2;
        isFalling = true;
        }
    else{
        isFalling = false;
        }
    
    if(isCharWet == true){
        isFalling = true;
        gameChar_y += 5;
        }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    //Game Over text.
    if(lives < 0){
        fill(255);
        textSize(90);
        text("GAME OVER", width*0.2, height*0.5);
        textSize(50);
        text("Press F5 to continue", width*0.25, height*0.6);
        noLoop();
        }
    // Level complete text.
    if(flagpole.isReached == true){
        fill(255, 140, 0);
        noStroke();
        textSize(90);
        text("LEVEL COMPLETE", width*0.1, height*0.5);
        textSize(50);
        text("Press F5 to continue", width*0.25, height*0.6);
        noLoop(); // I found this to stop the draw function.
        }
    }


/////////////////////////
//Key control functions//
/////////////////////////

function keyPressed(){
    if(keyCode == 37){
        isLeft = true;
        }
    if(keyCode == 39){
        isRight = true;  
        }
    if(keyCode == 32 && !isFalling){
        gameChar_y -= 100;
        }
    }

function keyReleased(){
    if(keyCode == 37){
        isLeft = false;
        }
    if(keyCode == 39){
        isRight = false;    
        }
    }

/////////////////////////////////////
//Function to render game character//
/////////////////////////////////////

function drawGameChar(){
    if(isLeft && isFalling){  // Jumping-left code.
        fill(0, 0, 0);  
        stroke(0);
        line(gameChar_x - 6, gameChar_y - 60,  // Background arm.
             gameChar_x + 12, gameChar_y - 50); 
        line(gameChar_x, gameChar_y - 50,  // Background leg. 
             gameChar_x - 21, gameChar_y - 26);  
        noStroke();  // Head.
        fill(255, 0, 255);
        ellipse(gameChar_x - 12, gameChar_y - 66, 12, 12);
        fill(255, 222, 173);  // Body.
        triangle(gameChar_x, gameChar_y - 40, 
                 gameChar_x - 12, gameChar_y - 60, 
                 gameChar_x - 3, gameChar_y - 60); 
        fill(0, 0, 0);  // Foreground arm.
        stroke(0);
        line(gameChar_x - 9, gameChar_y - 60, 
             gameChar_x - 21, gameChar_y - 50); 
        line(gameChar_x, gameChar_y - 40,  // Foreground leg.
             gameChar_x + 18, gameChar_y- 30);  
	    }
	else if(isRight && isFalling){  // Jumping-right code.
        fill(0, 0, 0); 
        stroke(0);
        line(gameChar_x + 6, gameChar_y - 60,  // Background arm.
             gameChar_x - 12, gameChar_y - 50); 
        line(gameChar_x, gameChar_y - 50,  // Background leg.
             gameChar_x + 21, gameChar_y - 26); 
        noStroke();  // Head.
        fill(255, 0, 255);
        ellipse(gameChar_x + 12, gameChar_y - 66, 12, 12);
        fill(255, 222, 173);  // Body.
        triangle(gameChar_x, gameChar_y -40, 
                 gameChar_x + 12, gameChar_y - 60, 
                 gameChar_x + 3, gameChar_y - 60); 
        fill(0, 0, 0);  // Foreground arm.
        stroke(0);
        line(gameChar_x + 9, gameChar_y - 60, 
             gameChar_x + 21, gameChar_y - 50); 
        line(gameChar_x, gameChar_y - 40,  // Foreground leg.
             gameChar_x - 18, gameChar_y- 30);
	    }
	else if(isLeft){  // Walking left code.
        fill(0, 0, 0);  // Background arm.
        stroke(0);
        line(gameChar_x , gameChar_y - 50, 
             gameChar_x + 12, gameChar_y - 30); 
        line(gameChar_x, gameChar_y - 30,  // Background leg.
             gameChar_x - 12, gameChar_y - 6); 
        noStroke();  // Head.        
        fill(255, 0, 255);
        ellipse(gameChar_x - 3, gameChar_y - 56, 12, 12);
        fill(255, 222, 173);  // Body.
        triangle(gameChar_x, gameChar_y -30, 
                 gameChar_x - 6, gameChar_y - 50, 
                 gameChar_x + 3, gameChar_y - 50); 
        fill(0, 0, 0);  // Foreground arm.
        stroke(0);
        line(gameChar_x, gameChar_y - 50, 
             gameChar_x - 12, gameChar_y - 30); 
        line(gameChar_x, gameChar_y - 30,  // Foreground leg.
             gameChar_x + 12, gameChar_y); 
	    }
	else if(isRight){  // Walking right code.
        fill(0, 0, 0);  // Background arm.
        stroke(0);
        line(gameChar_x, gameChar_y - 50, 
             gameChar_x - 12, gameChar_y - 30); 
        line(gameChar_x, gameChar_y - 30,  // Background leg.
             gameChar_x + 12, gameChar_y - 6); 
        noStroke();
        fill(255, 0, 255);  // Head.
        ellipse(gameChar_x + 3, gameChar_y - 56, 12, 12);
        fill(255, 222, 173);  // Body.
        triangle(gameChar_x, gameChar_y -30, 
                 gameChar_x - 3, gameChar_y - 50, 
                 gameChar_x + 6, gameChar_y - 50); 
        fill(0, 0, 0);  // Foreground arm.
        stroke(0);
        line(gameChar_x, gameChar_y - 50, 
             gameChar_x + 12, gameChar_y - 30); 
        line(gameChar_x, gameChar_y - 30,  // Foreground leg.
             gameChar_x - 12, gameChar_y);
	    }
	else if(isFalling || isCharWet){  // Jumping facing forwards code.
        fill(0, 0, 0);  // Background arm.
        stroke(0);
        line(gameChar_x + 12, gameChar_y - 60, 
             gameChar_x + 18, gameChar_y - 35); 
        line(gameChar_x, gameChar_y - 40,  // Background leg.
             gameChar_x + 12, gameChar_y - 10); 
        noStroke();
        fill(255, 0, 255);  // Head.
        ellipse(gameChar_x, gameChar_y - 66, 12, 12);
        fill(255, 222, 173);  // Body.
        triangle(gameChar_x, gameChar_y - 40, 
                 gameChar_x - 12, gameChar_y - 60, 
                 gameChar_x + 12, gameChar_y - 60); 
        fill(0, 0, 0);  // Foreground arm.
        stroke(0);
        line(gameChar_x - 12, gameChar_y - 60, 
             gameChar_x - 18, gameChar_y - 35); 
        line(gameChar_x, gameChar_y - 40,  // Foreground leg.
             gameChar_x - 12, gameChar_y - 10); 
	    } 
	else{  // Standing front facing code.
        fill(0, 0, 0);   // Background arm.
        stroke(0);
        line(gameChar_x + 12, gameChar_y - 50, 
             gameChar_x + 12, gameChar_y - 25); 
        line(gameChar_x, gameChar_y - 30,  // Background leg.
             gameChar_x + 6, gameChar_y); 
        noStroke();
        fill(255, 0, 255);  // Head.
        ellipse(gameChar_x, gameChar_y - 56, 12, 12);
        fill(255, 222, 173);  // Body.
        triangle(gameChar_x, gameChar_y -30, 
                 gameChar_x - 12, gameChar_y - 50, 
                 gameChar_x + 12, gameChar_y - 50); 
        fill(0, 0, 0);  // Foreground arm.
        stroke(0);
        line(gameChar_x - 12, gameChar_y - 50, 
             gameChar_x - 12, gameChar_y - 25); 
        line(gameChar_x, gameChar_y - 30,  // Foreground leg.
             gameChar_x - 6, gameChar_y); 
	    }
    }

///////////////////////////////
//Background render functions//
///////////////////////////////

function drawClouds(){  // Draw cloud objects.
    for(var i = 0; i < cloud.x_pos.length; i++){
        fill(255, 255, 255);
        ellipse(cloud.x_pos[i], cloud.y_pos[i], cloud.size, cloud.size * 0.6);
        ellipse(cloud.x_pos[i] - 50, cloud.y_pos[i], cloud.size * 0.75, cloud.size * 0.4);
        ellipse(cloud.x_pos[i] + 50, cloud.y_pos[i], cloud.size * 0.75, cloud.size * 0.4);    
        }
    }

function drawMountains(){  // Draw mountain objects.
   for(var i = 0; i < mountain.x_pos.length; i++){
        fill(0, 100, 0);
        triangle(mountain.x_pos[i], mountain.y_pos - (mountain.size)/2,
                 mountain.x_pos[i] - (mountain.size)/2, mountain.y_pos,
                 mountain.x_pos[i] + (mountain.size)/2, mountain.y_pos);
        fill(220, 220, 220);
        triangle(mountain.x_pos[i], mountain.y_pos - (mountain.size)/2,
                 mountain.x_pos[i] - (mountain.size)/6, mountain.y_pos- (mountain.size)/3,
                 mountain.x_pos[i] + (mountain.size)/6, mountain.y_pos- (mountain.size)/3);
        fill(0, 100, 0);
        triangle(mountain.x_pos[i], mountain.y_pos - (mountain.size)/2.75,
                 mountain.x_pos[i] - (mountain.size)/6, mountain.y_pos- (mountain.size)/3,
                 mountain.x_pos[i] + (mountain.size)/6, mountain.y_pos- (mountain.size)/3);
            } 
    } 

function drawTrees(){  // Draw tree objects.
    for(var i = 0; i < tree.x_pos.length; i++){
        fill(139, 69, 19);
        rect(tree.x_pos[i] -15, tree.y_pos, 30, -20);
        fill(34, 139, 34);
        triangle(tree.x_pos[i] + 0, tree.y_pos - 100,
                 tree.x_pos[i] - 80, tree.y_pos -20,
                 tree.x_pos[i] + 80, tree.y_pos -20);
        triangle(tree.x_pos[i] + 0, tree.y_pos -140,
                 tree.x_pos[i] - 60, tree.y_pos - 70,
                 tree.x_pos[i] + 60, tree.y_pos - 70);
        triangle(tree.x_pos[i] + 0, tree.y_pos -190,
                 tree.x_pos[i] - 40, tree.y_pos- 120, 
                 tree.x_pos[i] + 40, tree.y_pos- 120);
        }   
    }

function drawRiver(t_river){  // Draw river objects.
    fill(0, 191, 255);
    
    rect(t_river, floorPos_y , river.width, 144);
    fill(70, 130, 220);
    rect(t_river, 532, river.width, 44);
    fill(0,155,0);
    triangle(t_river, floorPos_y, 
             t_river + 20, floorPos_y, 
             t_river, 576);
    triangle(t_river + river.width, floorPos_y, 
             t_river + river.width - 20, floorPos_y, 
             t_river + river.width, 576);
    }

function renderFlagpole(){  // Draw flagpole.
    strokeWeight(5);
    stroke(255);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 100);
    if(flagpole.isReached == false){
        strokeWeight(4);
        stroke(255, 0, 0); 
        line(flagpole.x_pos + 2, floorPos_y - flagpole.height,
             flagpole.x_pos + 2, floorPos_y - flagpole.height * 0.7);
        }
    else{    
        noStroke();
        fill(255, 0, 0);
        triangle(flagpole.x_pos + 2, floorPos_y - flagpole.height,
                 flagpole.x_pos + 2, floorPos_y - flagpole.height * 0.8,
                 flagpole.x_pos + flagpole.height * 0.2, floorPos_y - flagpole.height * 0.9);
        }
    }

/////////////////////////
//Interaction functions//
/////////////////////////

function checkRiver(i){  // Check character is over a river.
    if(gameChar_world_x > (river.x_pos[i] + 20) && 
       gameChar_world_x < (river.x_pos[i] + river.width - 20) && gameChar_y >= floorPos_y){
        isCharWet = true;
        }
    for(var j = 0; j < bear_arr.length; j++){
        if(bear_arr[j].currentX > (river.x_pos[i] + 20) && 
           bear_arr[j].currentX < (river.x_pos[i] + river.width - 20) && bear_arr[j].currentY >= floorPos_y){
            bear_arr[j].isDead = true;
            }
        }
    }

function checkFlagpole(){  // Check reached flagpole.
    if(abs(gameChar_world_x - flagpole.x_pos) < 10){
        flagpole.isReached = true;
        }
    }

function checkPlayerDie(){  // Fall to death.
    if(abs(gameChar_y > (height + 100))){
        lives -= 1;   
        if((lives +1) > 0){
            startGame();
            }
        }
    }

///////////
//Classes//
///////////

class Bears{    
    
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.isChasing = false;
        this.currentX = x;
        this.currentY = y;
        this.inc = 0.5;
        this.isDead = false;
        }
    
    update(gc_x, gc_y){
        this.checkChasing(gc_x, gc_y);
        this.checkContact(gc_x, gc_y);
        if(this.isChasing == true){
            if(gameChar_world_x >= this.currentX){
                this.currentX += this.inc;
            }
            else if(gameChar_world_x < this.currentX){
                this.currentX -= this.inc;
                }
            }
        if(this.isDead == true){
            this.currentY += 5;
            }
        }
        
    draw(){
        this.update();
        if((this.isChasing == true) && (this.currentX >= gameChar_world_x)){  //Walking, turned left.
            strokeWeight(1);  // background arm.
            stroke(0);
            fill( 78, 53, 36);
            rect(this.currentX - 35, this.currentY - 55, 30, 10, 5, 5, 5, 5);
            rect(this.currentX - 15, this.currentY - 10, 10, 15, 5, 5, 5, 5);  // Background leg.
            strokeWeight(1);
            stroke(0);  // Ears.
            fill( 78, 53, 36);
            ellipse(this.currentX + 5, this.currentY -100, 10, 10); 
            ellipse(this.currentX +15, this.currentY -95, 10, 10);
            stroke(0);  // Body.
            fill( 78, 53, 36);
            rect(this.currentX - 15, this.currentY -100, 30, 95, 10);
            strokeWeight(6);
            stroke(210, 180, 140);
            line(this.currentX - 11, this.currentY - 60, this.currentX - 11, this.currentY - 20);
            strokeWeight(1);  // Foreground head.
            stroke(0);
            fill(210, 180, 140);
            ellipse(this.currentX - 10, this.currentY - 80, -15, 15); // Snout.
            line(this.currentX - 7, this.currentY - 78, this.currentX - 13, this.currentY - 78); // Mouth.
            strokeWeight(2);
            point(this.currentX - 10, this.currentY - 90); // Eyes.
            point(this.currentX - 5, this.currentY - 90);
            strokeWeight(5);
            point(this.currentX - 12, this.currentY - 83); // Nose.
            strokeWeight(1);  // Foreground arm.
            stroke(0);
            fill( 78, 53, 36);
            rect(this.currentX -30, this.currentY - 50, 30, 10, 5, 5, 5, 5);
            strokeWeight(1);
            fill(0, 0, 0);
            strokeWeight(1);  // Foreground leg.
            stroke(0);
            fill( 78, 53, 36);
            rect(this.currentX , this.currentY - 10, 10, 15, 5, 5, 5, 5);
            }
        else if((this.isChasing == true) && (this.currentX < gameChar_world_x)){  // Walking, turned right.   
            strokeWeight(1);  // Background arm.
            stroke(0);
            fill( 78, 53, 36);
            rect(this.currentX + 5, this.currentY - 55, 30, 10, 5, 5, 5, 5);
            rect(this.currentX + 5, this.currentY - 10, 10, 15, 5, 5, 5, 5);  // Background leg.
            strokeWeight(1);
            stroke(0);  // Ears.
            fill( 78, 53, 36);
            ellipse(this.currentX -5, this.currentY -100, 10, 10); 
            ellipse(this.currentX -15, this.currentY -95, 10, 10);
            stroke(0);  // Body.
            fill( 78, 53, 36);
            rect(this.currentX -15, this.currentY -100, 30, 95, 10);
            strokeWeight(6);
            stroke(210, 180, 140);
            line(this.currentX + 11, this.currentY - 60, this.currentX + 11, this.currentY - 20);
            strokeWeight(1);  // Foreground head.
            stroke(0);
            fill(210, 180, 140);
            ellipse(this.currentX + 10, this.currentY - 80, 15, 15); // snout
            line(this.currentX + 7, this.currentY - 78, this.currentX + 13, this.currentY - 78); // mouth
            strokeWeight(2);
            point(this.currentX + 10, this.currentY - 90); // eyes
            point(this.currentX + 5, this.currentY - 90);
            strokeWeight(5);
            point(this.currentX + 12, this.currentY - 83); // nose
            strokeWeight(1);  // Foreground arm.
            stroke(0);
            fill( 78, 53, 36);
            rect(this.currentX, this.currentY - 50, 30, 10, 5, 5, 5, 5);
            strokeWeight(1);  // Foreground leg.
            stroke(0);
            fill( 78, 53, 36);
            rect(this.currentX - 10, this.currentY - 10, 10, 15, 5, 5, 5, 5);
            }
        else if(this.isChasing == false){  // Asleep
            strokeWeight(1);  // Background arm.
            stroke(0);
            fill( 78, 53, 36);
            rect(this.currentX - 55, this.currentY-5, 30, 10, 5, 5, 5, 5);
            rect(this.currentX + 45, this.currentY - 10, 10, 15, 5, 5, 5, 5);  // Background leg.
            fill( 78, 53, 36);
            ellipse(this.currentX -40, this.currentY -25, 10, 10); 
            ellipse(this.currentX -25, this.currentY -25, 10, 10);
            stroke(0);  // Body.
            fill( 78, 53, 36);
            rect(this.currentX - 50, this.currentY -25, 100, 30, 10);
            strokeWeight(6);
            stroke(210, 180, 140);
            line(this.currentX - 10, this.currentY, this.currentX +30, this.currentY);
            strokeWeight(1);  // Foreground head.
            stroke(0);
            fill(210, 180, 140);
            ellipse(this.currentX - 30, this.currentY -5, 15, 15);  // Snout.
            ellipse(this.currentX - 31, this.currentY -2, 4, 4);  // Mouth.
            strokeWeight(1);
            line(this.currentX - 40, this.currentY - 15, this.currentX - 35, this.currentY - 15);  // Eyes.
            line(this.currentX - 30, this.currentY - 15, this.currentX - 25, this.currentY - 15);
            strokeWeight(5);
            point(this.currentX - 27, this.currentY - 7);  // Nose.
            strokeWeight(1);  // Foreground arm.
            stroke(0);
            fill( 78, 53, 36);
            rect(this.currentX -30, this.currentY - 5, 30, 10, 5, 5, 5, 5);
            strokeWeight(1);  // Foreground leg.
            stroke(0);
            fill( 78, 53, 36);
            rect(this.currentX +40, this.currentY - 10, 10, 15, 5, 5, 5, 5);
            }
        }
        
    checkContact = function(gc_x, gc_y) {
        var d = dist(gc_x, gc_y, this.currentX, this.y -20);
        if(d < 50){
            lives -= 1;   
            if((lives +1) > 0){
                startGame();
                }
            else{
                //break;
            }
            }
        }

    checkChasing = function(gc_x, gc_y) {
        var d = dist(gc_x, gc_y, this.currentX, this.currentY);
        if(d < 100){
            return this.isChasing = true;
            }
        else if(d > 400){
            return this.isChasing = false;
            }
        }
    }

class Log{
    
    constructor(x, y, size){
        this.x = x;
        this.y = y - 40;
        this.size = size;
        }
        
    draw(){
        strokeWeight(1);  // Log platforms.
        stroke(0);
        fill(139, 69, 19);
        rect(this.x, this.y - 20, this.size, 20, 15, 15, 15, 15);
        fill(0, 0 ,0);
        line(this.x +5 , this.y - 15, this.x + this.size / 1.5, this.y - 15);
        line(this.x + this.size -2 , this.y - 5, this.x + this.size / 1.5, this.y - 5);
        fill(240, 230, 140);
        ellipse(this.x + 8, this.y - 10, 17, 19);
        noStroke();
        strokeWeight(1);
        stroke(139, 69, 19);
        noFill();
        ellipse(this.x + 8, this.y - 10, 11, 13);
        ellipse(this.x + 8, this.y - 10, 5, 6);
        }
    
    checkContact(gc_x, gc_y){
        if(gc_x > this.x && gc_x < this.x + this.size){
            var d = this.y - gc_y - 15;
            if(d < 5 && d >= 0){
               return true;
               }
            }
        return false;
        }
    }

class Collectable{
    
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 30;
        this.isFound = false;
        }
    
    update(){   
        if(dist(gameChar_world_x, gameChar_y - 20, this.x, this.y) < 30){
            this.isFound = true;
            game_score += 1;
            }
        }  
    
    draw(){
        stroke(1);  // Draw collectable objects.
        fill(184, 134, 11);
        ellipse(this.x, this.y, this.size * 0.75, this.size);
        ellipse(this.x + this.size * 0.5, this.y, this.size * 0.75, this.size);
        fill(255, 215, 0);
        ellipse(this.x - this.size * 0.1, this.y, this.size * 0.75, this.size);
        ellipse(this.x - this.size * 0.1 + this.size*0.5, this.y, this.size * 0.75, this.size);
        }
    }