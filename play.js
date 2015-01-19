var play_state = {

  create: function() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.score = 0;

    this.start = 0;

    this.space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.worldy = game.world.height;
    this.worldx = game.world.width;

    this.background_1 = game.add.tileSprite(0, 640, 920 , 640, 'background_1');
    
    this.shark = game.add.sprite(this.worldx/4, this.worldy/2, 'shark');
    this.shark.anchor.setTo(0.5, 0.5);
    this.shark.alive = true;

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

  play: function(){

    if(this.start == 0){

      this.start = 1;

      this.space_key.onDown.add(this.jump, this);
    
      this.shark.enableBody = true;
      game.physics.enable(this.shark);
      this.shark.body.gravity.y = 400;
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
    
      this.timer = game.time.events.loop(2500, this.addObstacle, this);
    }
  },

  addObstacle: function(){

    var top_y = utilities.randomizer(100, this.worldy - 150);
    var bottom_y = top_y + 150;

    this.top_obstacle = this.obstacles.create(560, top_y, 'anchor');
    this.top_obstacle.anchor.setTo(0.5, 1);
    this.top_obstacle.outOfBoundsKill = true;
    this.top_obstacle.body.velocity.x = -200;
    
    var speed = this.score * 0.5
    var lift = game.add.tween(this.top_obstacle)
      .to({y: '-50'}, speed * 1000, Phaser.Easing.Linear.None, true)
      .to({y: '+50'}, speed * 1000, Phaser.Easing.Linear.None, true)
      .loop()
      .start();

    this.bottom_obstacle = this.obstacles.create(560, bottom_y, 'rock_1');
    this.bottom_obstacle.body.setSize(10, 50, 0, 0);
    this.bottom_obstacle.anchor.setTo(0.5, 0);
    this.bottom_obstacle.outOfBoundsKill = true;
    this.bottom_obstacle.body.velocity.x = -200;

    if(this.score % 5 == 0 && this.score != 0){
      var y = utilities.randomizer(140, 540);
      this.drum = this.obstacles.create(460, y, 'drum');
      this.drum.anchor.setTo(0.5, 0.5);
      game.add.tween(this.drum).to({x: -200}, 4000, Phaser.Easing.Linear.None, true);
      game.add.tween(this.drum).to({angle: '+20'}, 50, Phaser.Easing.Linear.None, true)
      .loop()
      .start();
    }
   
    this.score += 1;
    this.score_text.text = this.score;

  },

  jump: function(){
    if(this.shark.alive == true){
      this.shark.body.velocity.y -= 250;
      
      if(this.shark.angle > -45){
        game.add.tween(this.shark).to({angle: '-15'}, 100, Phaser.Easing.Linear.None, true);
      }
    }
  },

  death: function(){  
    if(this.shark.alive == true){ 
      game.time.events.remove(this.timer);
      this.obstacles.forEachAlive(function(p){p.body.velocity.x = 0;},this);
      var bloom = game.add.tween(this.bloom)
      .to({alpha: 1}, 100, Phaser.Easing.Linear.None, true)
      .to({alpha: 0}, 50, Phaser.Easing.Linear.None, true)
      .start();
      this.shark.alive = false;
    }
  },

  update: function(){
    this.background_1.tilePosition.x -= 3;

    if(this.start == 1){
      game.physics.arcade.overlap(this.shark, this.obstacles, this.death, null, this);

      if(this.shark.inWorld == false && this.shark.y > 0){
        this.restart();
      }
      
      if(this.shark.y < 0){
        this.shark.body.velocity.y = 0;
      }

      if(this.shark.angle < 45 && this.shark.alive == true){
        this.shark.angle += 0.5;
      }
    }
  },
  
  restart: function(){
    this.start = 0;
    game.state.start('play');
  },

};
