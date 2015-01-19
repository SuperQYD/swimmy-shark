var load_state = {

  preload: function() {

    game.stage.backgroundColor = '#005470';

    game.load.image('shark', 'assets/images/shark.png');
    game.load.image('rock_1', 'assets/images/rock_1.png');
    game.load.image('rock_2', 'assets/images/rock_2.png');
    game.load.image('anchor', 'assets/images/anchor.png');
    game.load.image('background_1', 'assets/images/background_1.png');
    game.load.image('bloom', 'assets/images/bloom.png');
    game.load.image('drum', 'assets/images/drum.png');
    
    game.load.audio('swim', 'assets/sounds/swim.wav');
    game.load.audio('underwater', 'assets/sounds/underwater.wav');
    game.load.audio('bleep', 'assets/sounds/bleep.wav');
    game.load.audio('punch', 'assets/sounds/punch.wav');

  },

  create: function() {

    game.state.start('play');
  }
};
