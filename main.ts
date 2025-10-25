let playerY = 4
let jumping = false
let jumpStep = 0
let obstacles: number[][] = []
let cheatActive = false
let score = 0
let gameSpeed = 150

basic.forever(function () {
    basic.clearScreen()

    // Spawn new obstacle safely: at least 2 empty columns after previous
    let canSpawn = true
    for (let obs of obstacles) {
        if (obs[0] >= 2) { // at least 2 columns away
            canSpawn = false
        }
    }

    if (canSpawn && Math.randomRange(0, 3) == 0) {
        obstacles.push([4, 4, 0]) // [x, y, scored flag]
    }

    // Move obstacles left
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i][0] -= 1
    }

    // Increase score only once per obstacle
    for (let obs of obstacles) {
        if (obs[0] == 0 && obs[2] == 0) {
            score += 1
            obs[2] = 1
            gameSpeed = Math.max(50, gameSpeed - 1)
        }
    }

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obs => obs[0] >= 0)

    // Draw obstacles
    for (let obs of obstacles) {
        led.plot(obs[0], obs[1])
    }

    // Jump logic (2-pixel jump)
    if (jumping) {
        if (jumpStep == 0) {
            playerY = 2
            jumpStep += 1
        } else {
            playerY = 4
            jumping = false
            jumpStep = 0
        }
    }

    // Cheat jump logic: only first obstacle in column 1
    if (cheatActive) {
        for (let obs of obstacles) {
            if (obs[0] == 1 && obs[1] == 4) {
                if (!jumping) {
                    jumping = true
                }
                break
            }
        }
    }

    // Draw player
    led.plot(0, playerY)

    // Collision detection
    for (let obs of obstacles) {
        if (obs[0] == 0 && obs[1] == playerY) {
            basic.showNumber(score)
            // reset game
            obstacles = []
            playerY = 4
            jumping = false
            jumpStep = 0
            score = 0
            gameSpeed = 150
        }
    }

    // End game when score reaches 60
    if (score >= 60) {
        basic.showNumber(score)
        // reset game
        obstacles = []
        playerY = 4
        jumping = false
        jumpStep = 0
        score = 0
        gameSpeed = 150
    }

    basic.pause(gameSpeed)
})

// Normal jump = Button A
input.onButtonPressed(Button.A, function () {
    if (!jumping) {
        jumping = true
    }
})

// Toggle cheat = Button B
input.onButtonPressed(Button.B, function () {
    cheatActive = !cheatActive
})
