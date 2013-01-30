$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var canvas_width= $("#canvas").width();
	var canvas_height = $("#canvas").height();
	
	var cell_width = 10;
	var keyboard_queue = []
	var change_direction = true;
	var snake_direction;
	var food;
	var score;
	
	var snake_array; //Holds cells of snake
	
	function init()
	{
		snake_direction = "right"; //default direction
		init_snake(5); //Creates a Snake of length (default 5)
		create_food(); 

		score = 0;
		
		if(typeof game != "undefined") clearInterval(game);
		game = setInterval(game_loop, 1000/16); //Set to run every 60 ms or 16.6_ FPS
	}
	init();
	
	function init_snake(len)
	{
		if (len < 5) len=5; //Length of the snake
		snake_array = []; 
		for(var i = len-1; i>=0; i--)
		{
			snake_array.push({x: i, y:0}); //Snake will start at [(0,0), (1,0), ..., (length-1, 0)]
		}
	}
	
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(canvas_width-cell_width)/cell_width), 
			y: Math.round(Math.random()*(canvas_height-cell_width)/cell_width), 
		};
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}
	
	//Lets draw the snake now
	function game_loop()
	{
		change_direction = true;
		draw_background(); //Create the Border Box

		update_snake(snake_array[0].x, snake_array[0].y); //Update Head of the Snake

		draw_snake(); // Render the Snake
		
		draw_cell(food.x, food.y); //Draws the Food

		ctx.fillText("Score: " + score, 5, canvas_height-5); //Draws the Score
	}

	function update_snake (head_x, head_y) {
		var next_direction = keyboard_queue.shift()

		if (next_direction) snake_direction =next_direction;

		//Update new possision of the snake by its current direction
		if(snake_direction == "right") head_x++;
		else if(snake_direction == "left") head_x--;
		else if(snake_direction == "up") head_y--;
		else if(snake_direction == "down") head_y++;
		
		// Test if hits bounderies or colides with its self
		if(head_x == -1 || head_x == canvas_width/cell_width || head_y == -1 || head_y == canvas_width/cell_width || check_collision(head_x, head_y, snake_array))
		{
			//Game Over Restart Game
			init();
			return;
		}
		
		//Test if Head of snake is on the same point as the food
		//If so increace the score
		if(head_x == food.x && head_y == food.y)
		{
			var tail = {x: head_x, y: head_y}; //Adds a new cell to add to the snake
			score++;
			create_food(); //Moves Food to new random place
		}
		else //If not than remove the last element of the snake and make it the new head
		{
			var tail = snake_array.pop(); //Remove the last cellpops out the last cell
			tail.x = head_x; tail.y = head_y;
		}
		
		snake_array.unshift(tail); //puts back the tail as the first cell
	}

	function draw_background () { //Draw Boarders
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas_width, canvas_width);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, canvas_width, canvas_width);
	}

	function draw_snake() { //Draw every element of the snake
		for(var i = 0; i < snake_array.length; i++)
		{
			draw_cell(snake_array[i].x, snake_array[i].y);
		}
	}
	
	//Lets first create a generic function to draw cells
	function draw_cell(x, y)
	{
		ctx.fillStyle = "blue"; 
		ctx.fillRect(x*cell_width, y*cell_width, cell_width, cell_width); //Draw Blue Box
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cell_width, y*cell_width, cell_width, cell_width); //Draw White border
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		//Prevent changeing direction in to its self
		//Prevent chnging twice before updating
		//If two keys are pressed before can update they are put in the queue to be dealt with
		if (change_direction)
		{
			if(key == "37" && snake_direction != "right") 
			{
				keyboard_queue.push("left"); 
				change_direction = false;
			}
			else if(key == "38" && snake_direction != "down")
			{
				keyboard_queue.push("up"); 
				change_direction = false;
			} 
			else if(key == "39" && snake_direction != "left") 
			{
				keyboard_queue.push("right"); 
				change_direction = false;
			}
			else if(key == "40" && snake_direction != "up") 
			{
				keyboard_queue.push("down"); 
				change_direction = false;
			}
		}
	})
})
