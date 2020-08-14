var database ,dog,dog1,dog2
var position
//var form
var feed,add
var foodobject
var Feedtime
var Lastfeed
var readState,changingState,gameState
//Create variables here

function preload()

{
  dogimg1 = loadImage("images/dogImg.png")
  dogimg2 = loadImage("images/dogImg1.png")
  bedroom =loadImage("images/Bed Room.png")
  garden = loadImage("images/Garden.png")
  washroom = loadImage("images/Wash Room.png")
  saddog = loadImage("images/sad dog.jpg");
	//load images here
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  console.log(database);
 
  foodobject=new Food()
  dog = createSprite(550,250,10,10);
  dog.addImage(dogimg1)
  dog.scale=0.2
 
  var dogo = database.ref('Food');
  dogo.on("value", readPosition, showError);
  feed = createButton("FEED HENRY")
  feed.position(500,15)
  feed.mousePressed(FeedDog)
  add = createButton("ADD FOOD")
  add.position(400,15)
  add.mousePressed(AddFood)

  readState = database.ref('gameState');
  readState.on("value",function(data){
  gameState=data.val();
  });

} 

function draw(){
 background(46,139,87);

 foodobject.display()
 
 drawSprites();
  
 fill(255,255,254);
 textSize(15);

drawSprites();
}
function readPosition(data){
  position = data.val();
  foodobject.updateFoodStock(position)
}

function showError(){
  console.log("Error in writing to the database");
}

function writePosition(nazo){
  if(nazo>0){
    nazo=nazo-1
  }
  else{
    nazo=0
  }
  database.ref('/').set({
    'Food': nazo
  })

  if (gameState!="Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  } else {
    feed.show();
    adddFood.show();
    dog.addImage(saddog);
  }
  currentTime = hour();
  if (currentTime == (lastFed+1)) {
    update("Playing");
    foodobject.garden();
  } else if(currentTime == (lastFed+2)){
    update("Sleeping");
    foodobject.bedroom();
  } else if(currentTime>(last+2)&&currentTime<=(lastFed+4)){
    update("Bathing");
    foodobject.washroom();
  }else{
    update("Hungry");
    foodobject.display();
  }
}
function AddFood(){
position++
database.ref('/').update({
  Food:position
}

)
}
function FeedDog(){

dog.addImage(dogimg2)
foodobject.updateFoodStock(foodobject.getFoodStock()-1)
 database.ref('/').update({
   Food:foodobject.getFoodStock(),
   FeedTime:hour ()
 })
}
function update(state){
database.ref('/').update({
  gameState:state
});
}