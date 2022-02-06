
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const scoreEl = document.querySelector('#score-el')
const scoreText = document.getElementById('score-text')
const title = document.getElementById('title')
const start = document.getElementById('start')
const gameOverDisplay = document.getElementById('game-over')
const restart = document.getElementById('restart')


setTimeout(function () { start.style.display = " block" }, 2200);

// start game when user presses enter key
addEventListener('keydown', ({key}) => {
    switch (key) {
      case 'Enter':
      //prevent user from starting game before start display
      if (start.style.display == "block") {
      //make canvas and score appear and arcade, title, & start dissapear
        title.style.display = 'none';
        start.style.display = 'none';
        arcade.style.display = "none";
        canvas.style.display = "block";
        scoreText.style.display = 'block';
        scoreEl.style.display = "inline";
      }
    }
  }
)

//Sizing the canvas
canvas.width = 1024
canvas.height = 576

//Create a player
class Player {
  constructor() {

    this.velocity = {
      x: 0
    }

    this.opacity = 1

    const image = new Image()
    image.src = 'img/ship.png'
    image.onload = () => {
      this.image = image
      // width and height properties for box collision detection
      const scale = .12
      this.width = image.width * scale
      this.height = image.height * scale
      //properties to move around screen
      this.position = {
        //center spaceship
        x: canvas.width / 2 - this.width / 2,
        // move spaceship to bottom
        y: canvas.height - this.height - 30
      }
    }
  }

  draw() {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.drawImage(this.image,
                  this.position.x,
                  this.position.y,
                  this.width,
                  this.height)
    ctx.restore()
  }

  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x
    }
  }
}

//Create projectiles
class Projectile {
  constructor({position, velocity}){
    this.position = position
    this.velocity = velocity
    this.width = 6
    this.height = 10
    this.color = "red";
  }

  draw() {
    ctx.beginPath()
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.closePath()

  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

// explosion particles
class Particle {
  constructor({position, velocity, radius, color, fades}){
    this.position = position
    this.velocity = velocity

      this.radius = radius
      this.color = color
      this.opacity = 1

      this.fades = fades
  }

  draw() {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
    ctx.restore()

  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.fades)
    this.opacity -= 0.01
  }

}

//Invader projectiles
class InvaderProjectile {
  constructor({position, velocity}){
    this.position = position
    this.velocity = velocity
    this.width = 6
    this.height = 10
    this.color = "white";
  }

  draw() {
    ctx.beginPath()
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.closePath()

  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

//Create an invader
class Invader {
  constructor({position}) {

    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = 'img/invader.png'
    image.onload = () => {
      this.image = image
      // width and height properties for box collision detection
      const scale = .03
      this.width = image.width * scale
      this.height = image.height * scale
      //properties to move around screen
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    ctx.drawImage(this.image,
                  this.position.x,
                  this.position.y,
                  this.width,
                  this.height)
  }

  update({velocity}) {
    if (this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }

  shoot(invaderProjectiles){
    invaderProjectiles.push(new InvaderProjectile({
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height
      },
      velocity: {
        x: 0,
        y: 5
      }
    }))
  }
}

class Grid{
  constructor() {
    this.position = {
      x: 0,
      y:0
    }

    this.velocity = {
      x: 3,
      y: 0
    }

    this.invaders = []

// randomize the amount of rows and columns
const columns = Math.floor(Math.random() * 10 + 5)
const rows = Math.floor(Math.random() * 4 + 2)

this.width = columns * 42
//create multiple invaders
    for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      this.invaders.push(new Invader({position: {
        x: x * 42,
        y: y * 42
      }
    })
    )
  }
}
}

  update() {
    // move invaders
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0

    if(this.position.x +this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      //move invaders down when they hit the sides of the canvas
      this.velocity.y = 42
    }
  }
}


const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []

//monitor if keys are being pressed down
const keys = {
  arrowLeft: {
    pressed: false
  },
  arrowRight: {
    pressed: false
  }
}

// the speed at which a player moves
var speed = 6

let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)
let game = {
  over: false,
  active: true
}
let score = 0

for (let i = 0; i < 100; i++) {
particles.push(new Particle({
  position: {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  },
  velocity: {
    x: 0,
    y: 0.4
  },
  radius: Math.random() * 1.2,
  color: 'white'
}))
}

function createParticles({object, color, fades}) {
  for (let i = 0; i < 15; i++) {
  particles.push(new Particle({
    position: {
      x: object.position.x + object.width / 2,
      y: object.position.y + object.height / 2
    },
    velocity: {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    },
    radius: Math.random() * 3,
    color: color || "HotPink",
    fades
  }))
}
}


function animate() {
  if (!game.active) return
  requestAnimationFrame(animate)
  //to style canvas from js instead of css:
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  particles.forEach((particle, i) => {

    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = -particle.radius
    }
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1)
      }, 0)
    } else {
      particle.update()
    }
  })

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
      setTimeout(() =>{
        invaderProjectiles.splice(index, 1)
      }, 0)
    } else invaderProjectile.update()

//projectile hits player
    if (invaderProjectile.position.y + invaderProjectile.height >=
    player.position.y && invaderProjectile.position.x +
  invaderProjectile.width >= player.position.x &&
invaderProjectile.position.x <= player.position.x + player.width) {

      setTimeout(() =>{
        invaderProjectiles.splice(index, 1)
        player.opacity = 0
        game.over = true
        setTimeout(()=> {
          canvas.style.display = "none"
          gameOverDisplay.style.display = "flex"
          restart.style.display = 'block'
          addEventListener('keydown', ({key}) => {
            if (restart.style.display = 'block')
            switch (key) {
            case 'r':
            location.reload()
            state = null;
            break
          }
          })
        }, 3000)
      }, 0)

      setTimeout(() =>{
        game.active = false
      }, 1000)

      console.log('you lose')
      createParticles({
        object: player,
        color: 'white',
        fades: true
      })
    }
  })
  //projectiles hit enemeies
  projectiles.forEach((projectile, index) => {
    // remove projectiles off screen
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() =>{
        projectiles.splice(index, 1)
      }, 0)
    } else {
      projectile.update()
    }
  })

  grids.forEach((grid, gridIndex) => {
    grid.update()
    //spawn projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0 ) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    }
    grid.invaders.forEach((invader, i) => {
      invader.update({velocity: grid.velocity})

      projectiles.forEach((projectile, j) => {
        if (projectile.position.y - projectile.height / 2 <=
            invader.position.y + invader.height &&
            projectile.position.x + projectile.width / 2 >=
            invader.position.x &&
            projectile.position.x - projectile.width / 2 <=
            invader.position.x + invader.width &&
            projectile.position.y + projectile.height / 2 >=
            invader.position.y) {


          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader)
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile)

            //remove inavder and projectile when collision detected
            if (invaderFound && projectileFound) {
              score += 100
              scoreEl.innerHTML = score
              createParticles({
                object: invader,
                fades: true
              })
            grid.invaders.splice(i, 1)
            projectiles.splice(j, 1)

            //determine new grid width after invaders removed
            if (grid.invaders.length > 0) {
              const firstInvader = grid.invaders[0]
              const lastInvader = grid.invaders[grid.invaders.length - 1]

              grid.width = lastInvader.position.x -
              firstInvader.position.x + lastInvader.width

              grid.position.x = firstInvader.position.x
            } else {
              grids.splice(gridIndex, 1)
            }
          }
          }, 0)
        }
      })
    })
  })

// move ship until it hits the borders of the canvas
  if (keys.arrowLeft.pressed && player.position.x >=0) {
    player.velocity.x = -speed
  } else if (keys.arrowRight.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = speed
  } else {
    player.velocity.x = 0
  }

//spawn a grid of enemeies randomly
  if (frames % randomInterval ===0) {
    grids.push(new Grid())
    randomInterval = Math.floor((Math.random() * 500) + 500)
    frames = 0
  }

  frames++
}

animate()

//Move spaceship left/right on keydown of left and right arrow keys
addEventListener('keydown', ({key}) => {
  if (game.over) return
  switch (key) {
  case 'ArrowLeft':
  keys.arrowLeft.pressed = true
  break
  case 'ArrowRight':
  keys.arrowRight.pressed = true
  break
  // ' ' string is the spacebar key
  case ' ':
  projectiles.push(new Projectile({
    position: {
      x: player.position.x + player.width / 2 - 2,
      y: player.position.y
    },
    velocity: {
      x: 0,
      y: -7
    }
  }))
  break
}
})

//Move spaceship left/right on keydown of left and right arrow keys
addEventListener('keyup', ({key}) => {
  switch (key) {
  case 'ArrowLeft':
  keys.arrowLeft.pressed = false
  break
  case 'ArrowRight':
  keys.arrowRight.pressed = false
  break
  // ' ' string is the spacebar key
  case ' ':
  break
}
})
