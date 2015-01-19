var utilities  = {

  randomizer: function(min, max, exclude){
    
    function pickRandom(min, max){
      return Math.round(Math.random() * (max - min) + min)
    }
    random_number = pickRandom(min, max);

    while(random_number == exclude){
      random_number = pickRandom(min, max);
    }
    return random_number
  },
};
