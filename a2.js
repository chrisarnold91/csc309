
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	var intervalId;

	// paddle's initial start position and dimmensions
	var ph = 10;
	var pw = 100;
	var px = c.width/2 - pw/2;
	
	// ball's initial start position
	var ballr = 10;
	var x = c.width/2;
	var y = c.height - ph - ballr;
	
	// adjust ball speed with these coordinates
	var dx = 1.25;
	var dy = 3;

	var points = 0;
	var lives = 3;
	var hits = 0;

	var left = false;
	var right = false;

	// calls drawBall function every 10ms
	function create() {
		intervalId = setInterval(function() {draw()}, 10);
	}

	// if an arrow key is pressed, decide which direction the paddle should move
	function arrowKeyDown(event) {
		if(event.keyCode == 37) {
			left = true;
		} else if(event.keyCode == 39) {
			right = true;
		}
	}

	// if an arrow key is lifted, stop paddle
	function arrowKeyUp(event) {
		if(event.keyCode == 37) {
			left = false;
		} else if(event.keyCode == 39) {
			right = false;
		}
	}

	// detect keyboard
	document.onkeydown = arrowKeyDown;;
	document.onkeyup = arrowKeyUp;
	
	function draw() {
		//clear the canvas
		ctx.clearRect(0, 0, c.width, c.height);
		
		/************* BRICK ACTIVITY **************/
		
		ctx.strokeStyle="black";

		for (i=0; i < rows; i++) {	
			switch (i) {
				case 0:
					ctx.fillStyle = "red";
					break;
				case 1:
					ctx.fillStyle = "red";
					break;
				case 2:
					ctx.fillStyle = "orange";
					break;
				case 3:
					ctx.fillStyle = "orange";
					break;
				case 4:
					ctx.fillStyle = "green";
					break;
				case 5:
					ctx.fillStyle = "green";
					break;
				case 6:
					ctx.fillStyle = "yellow";
					break;
				case 7:
					ctx.fillStyle = "yellow";
					break;
			}
			
			for (j=0; j < cols; j++) {
				if (bricks[i][j] == 1) {
					ctx.fillRect((j * bwidth), (i * bheight), bwidth, bheight);
					ctx.strokeRect((j * bwidth), (i * bheight), bwidth, bheight);
				}
			}
			ctx.fill();
		}

		// brick has been hit by ball
		row = Math.floor(y/bheight);
		col = Math.floor(x/bwidth);
		if (y < rows * bheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
			dy = -dy;

			// increase ball's speed when it makes 4 hits, and then again at 12 hits
			hits++;
			switch (hits) {
				case 4:
					dy += 0.5;
					break;
				case 12:
					dy += 0.5;
					break;	
			} 

			// add points based on which level the brick was in
			switch (row) {
				case 7:
					points += 1;
					break;
				case 6:
					points += 1;
					break;
				case 5:
					points += 3;
					break;
				case 4:
					points += 3;
					break;
				// increase ball's speed when it reaches these rows
				case 3:
					points += 5;
					if (dy == 3) {
						dy++;
					}
					break;
				case 2:
					points += 5;
					break;
				case 1:
					points += 7;
					if (dy == 4) {
						dy++;
					}
					break;
				case 0:
					points += 7;
					break;
			}

			score.innerHTML = points;
			bricks[row][col] = 0;

			// if finished level one, reset information
			if (points == 448) {
				initBricks();
				levelId.innerHTML = 2;
				dy = 3;
				hits = 0;
				px = c.width/2 - pw/2;
				x = c.width/2;
				y = c.height - ph - ballr;
			}

			if (points == 896) {
				victory();
				clearInterval(intervalId);
			}
		}
		
		/************ BALL ACTIVITY *************/
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, 2*Math.PI, true);
		ctx.closePath()
		ctx.fillStyle = "#006699";  
		ctx.fill(); 			

		// if ball reaches left or right edge of canvas, change direction
		if (x + dx < 0 || x + dx > c.width) {
    		dx = -dx;
    	}

    	// if ball reaches top of canvas or hits paddle, change direction
  		if (y + dy < 0) {
    		dy = -dy;
    		if (Math.abs(dy) == 4) {
    			pw = 50;
    		}
    	} else if (y + dy > c.height - ph - ballr) {
			if (x > px && x < px + pw) {
				dy = -dy;
				// if paddle is moving when the ball hits it, change the ball's horizontal velocity
				if (Math.abs(dx) > 1 && Math.abs(dx) < 2.5) {
					if (left) {
						dx -= 0.5;
					}
					if (right) {
						dx += 0.5;
					}
				}
			// if ball reaches bottom of canvas, lose a life
			} else if (y + dy > c.height - ballr + 2){
				if (lives == 1) {
					lives--;
					livesId.innerHTML = lives;
					gameOver();
					clearInterval(intervalId);
				} else {
					x = c.width/2;
					y = c.height - ph - ballr;
					px = c.width/2 - pw/2;
					lives--;
					livesId.innerHTML = lives;
					if (lives == 2) {
						alert("Oops! Only two lives left. Press OK to continue.")
					}
					if (lives ==1) {
						alert("Watch out! Only one life left! Press OK to continue.")
					}
					left = false;
					right = false;
				}
			}
		}

    	// move ball
		x += dx;
  		y += dy;
  		
  		/************** PADDLE ACTIVITY ************/
  		
  		if (left) {
			// prevents paddle from going off screen left
			if (px < 1) {
				px = 0;
			}
			else {
				px -= 4;
			}
		}

		if (right) {
			// prevents paddle from going off screen right
			if (px + pw > c.width - 1) {
				px = c.width - pw;
			}
			else {
				px += 4;
			}
		}

		ctx.fillStyle = "#006699";
		ctx.beginPath();
		ctx.rect(px, c.height - ph, pw, ph);
		ctx.closePath();
		ctx.fill();
	}

	function initBricks() {
		rows = 8;
		cols = 14;
		bwidth = (c.width/cols);
  		bheight = 15;
  		
  		// array of array of bricks,
  		bricks = new Array(rows);
  		for (i=0; i < rows; i++) {
    		bricks[i] = new Array(cols);
    		for (j=0; j < cols; j++) {
      			bricks[i][j] = 1;
    		}
  		}
  	}

  	function gameOver() {
  		ctx.textAlign="center";
  		ctx.font="50px Helvetica";
  		ctx.fillText("Game Over", 300, 200);
  	}

  	function victory() {
  		ctx.textAlign="center";
  		ctx.font="50px Helvetica";
  		ctx.fillText("Victory!", 300, 200);
  	}

	initBricks();
	create();