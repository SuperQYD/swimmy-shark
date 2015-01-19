/*-------------------------------------------*\
| Made by: Qasim Dove                         |
|                                             |
| You can find me at "emailqasim@gmail.com"   |
|                                             |
\*-------------------------------------------*/

var play_state = {

  //Initializes all sprites, audio, and variables//
  create: function() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.score = 0;
    this.rounds = 0;
    this.start = 0;

    this.space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.worldy = game.world.height;
    this.worldx = game.world.width;

    this.background_1 = game.add.tileSprite(0, 640, 920 , 640, 'background_1');
  
    this.swim = game.add.audio('swim', 0.5);
    this.bleep = game.add.audio('bleep');
    this.punch = game.add.audio('punch');
    this.underwater = game.add.audio('underwater', 0.5, true);

    this.shark = game.add.sprite(this.worldx/4, this.worldy/2, 'shark');
    this.shark.anchor.setTo(0.5, 0.5);
    this.shark.alive = true;

    this.underwater.play();

    this.start_text = game.add.text(this.worldx/2, 400, "...Press Space to Begin...");
    this.start_text.font = 'Arial';
    this.start_text.fontSize = 20;
    this.start_text.fontWeight = 'bold';
    this.start_text.stroke = '#000000';
    this.start_text.strokeThickness = 1.5;
    this.start_text.fill = '#ffffff';
    this.start_text.anchor.setTo(0.5, 0.5);
    this.start_text.fixedToCamera = true;

    this.title = game.add.text(this.worldx/2, 50, "Swimmy Shark");
    this.title.font = 'Arial';
    this.title.fontSize = 60;
    this.title.fontWeight = 'bold';
    this.title.stroke = '#000000';
    this.title.strokeThickness = 2.5;
    this.title.fill = '#ffffff';
    this.title.anchor.setTo(0.5, 0.5);
    this.title.fixedToCamera = true;
    
    this.obstacles = game.add.group();
    this.obstacles.enableBody = true;
    
    this.space_key.onDown.add(this.play, this);
    
    this.bloom = game.add.sprite(0, 0, 'bloom');
    this.bloom.alpha = 0;
    this.bloom.bringToTop();
  
  },

  //Starts the game//
  play: function(){

    if(this.start == 0){

      this.start = 1;

      this.space_key.onDown.add(this.jump, this);
    
      this.shark.enableBody = true;
      game.physics.enable(this.shark);
      this.shark.body.gravity.y = 400;
      this.shark.body.bounce.x = 0.75;
      this.shark.body.bounce.y = 0.75;
      this.jump();

      this.title.alpha = 0;
      this.start_text.alpha = 0;

      this.score_text = game.add.text(this.worldx/2, 50, "0");
      this.score_text.font = 'Arial';
      this.score_text.fontSize = 55;
      this.score_text.fontWeight = 'bold';
      this.score_text.stroke = '#000000';
      this.score_text.strokeThickness = 5; 
      this.score_text.fill = '#ffffff';
      this.score_text.anchor.setTo(0.5, 0.5);
      this.score_text.fixedToCamera = true;

      this.obstacle_start == true;
    
      this.timer = game.time.events.loop(1500, this.addObstacle, this);
      this.check = game.time.events.loop(1000, this.checkObstacle, this);
    }
  },

  //Adds an obstacle in the shark's way//
  addObstacle: function(){

    var orientation = utilities.randomizer(1, 3);
    var top_y = utilities.randomizer(100, this.worldy - 200);
    var bottom_y = top_y + 200;

    if(orientation == 1){
      this.top_obstacle = this.obstacles.create(560, top_y, 'anchor');
      this.top_obstacle.body.setSize(5, 600, 0, 0);
      this.top_obstacle.anchor.setTo(0.5, 1);
      this.top_obstacle.outOfBoundsKill = true;
      this.top_obstacle.body.velocity.x = -200;
      
      var length = utilities.randomizer(50, 75);
      var speed = (10000/this.score);
      var lift = game.add.tween(this.top_obstacle)
        .to({y: '+50'}, speed, Phaser.Easing.Linear.None, true)
        .to({y: '-50'}, speed, Phaser.Easing.Linear.None, true)
        .loop()
        .start();
    }

    if(orientation == 2){
      this.drum = this.obstacles.create(560, 0, 'drum');
      this.drum.anchor.setTo(0.5, 0.5);
      this.drum.outOfBoundsKill = true;
      game.physics.enable(this.drum);
      this.drum.body.velocity.x = -200;
      this.drum.body.gravity.y = 200;
      this.drum.body.bounce.y = 0.75;
      game.add.tween(this.drum).to({angle: '+20'}, 50, Phaser.Easing.Linear.None, true)
      .loop()
      .start();

    }

    this.bottom_obstacle = this.obstacles.create(560, bottom_y, 'rock_1');
    this.bottom_obstacle.body.setSize(5, 50, 0, 0);
    game.physics.enable(this.bottom_obstacle);
    this.bottom_obstacle.anchor.setTo(0.5, 0);
    this.bottom_obstacle.body.immovable = true;
    this.bottom_obstacle.outOfBoundsKill = true;
    this.bottom_obstacle.body.velocity.x = -200;
  
  },

  //Checks to see the position of the obstacle//
  checkObstacle: function(){
     
    this.obstacles.forEachAlive(function (p){
        if(p.x < this.shark.x && p.x > 0){
        
          this.score += 1;
          this.bleep.play();
          this.score_text.text = this.score;
        }
      },this);
 
  },

  //Makes the shark Jump//
  jump: function(){
    if(this.shark.alive == true){
      this.shark.body.velocity.y -= 250;
      this.swim.play();
      
      if(this.shark.angle > -45){
        game.add.tween(this.shark).to({angle: '-17'}, 100, Phaser.Easing.Linear.None, true);
      }
    }
  },

  //Kills the shark//
  death: function(){  
    if(this.shark.alive == true){ 
      game.time.events.remove(this.timer);
      game.time.events.remove(this.check);
      this.punch.play();
      this.obstacles.forEachAlive(function(p){
        p.body.velocity.x = 0;
        p.body.velocity.x += 15;
      },this);
      game.add.tween(this.shark).to({angle: '-50'}, 500, Phaser.Easing.Linear.None, true);
      var bloom = game.add.tween(this.bloom)
      .to({alpha: 1}, 100, Phaser.Easing.Linear.None, true)
      .to({alpha: 0}, 50, Phaser.Easing.Linear.None, true)
      .start();
      this.shark.alive = false;
    }
  },

  //Constantly updates variables//
  update: function(){
    this.background_1.tilePosition.x -= 3;

    if(this.start == 1){
      game.physics.arcade.overlap(this.shark, this.obstacles, this.death, null, this);
      this.obstacles.forEachAlive(function(p){game.physics.arcade.collide(p, this.obstacles);},this);

      if(this.shark.inWorld == false && this.shark.y > 0){
        this.restart();
      }
      
      if(this.shark.y < 0){
        this.shark.body.velocity.y = 250;
        game.add.tween(this.shark).to({angle: '45'}, 50, Phaser.Easing.Linear.None, true);
      }

      if(this.shark.angle < 45 && this.shark.alive == true){
        this.shark.angle += 0.5;
      }
    }
  },
  
  //Restarts the game after you die//
  restart: function(){
    this.start = 0;
    this.underwater.pause();
    game.state.start('play');
  },
};
