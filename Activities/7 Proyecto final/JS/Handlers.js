// JavaScript source code
//NEEDS WORK
function initControls() {
    //Unlock controls
    document.getElementById('start').addEventListener('click', function () {
        player.controls.lock();
    }, false);

    //ADD PLAYER CONTROLS EVENT LISTENERS FROM EXAMPLE

    player.controls.addEventListener('lock', function () {
        player.controls.lock();
        game.paused = false;
        document.getElementById('pauseScreen').style.visibility = "hidden";
        canvas.style.visibility = "visible";
        document.getElementById('Overlay').style.visibility = 'visible';
        //document.getElementById('Overlay').style.backgroundColor = 'rgba(50, 50, 50, 0.3)';
    }, false);
    //When controls locked
    player.controls.addEventListener('unlock', function () {
        player.controls.unlock();
        game.paused = true;
        document.getElementById('pauseScreen').style.visibility = "visible";
        document.getElementById('Overlay').style.visibility = 'hidden';
    }, false);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * 
 * @param {any} event
 */
function onKeyDown(event) {
    switch ((String.fromCharCode(event.which)).toUpperCase()) {
        case 'W':
            //console.log((String.fromCharCode(event.which)).toUpperCase());
            player.isMoving = true;
            player.isForward = true;
            break;
        case 'S':
            player.isMoving = true;
            player.isBackward = true;
            break;
        case 'A':
            player.isMoving = true;
            player.isLeft = true;
            break
        case 'D':
            player.isMoving = true;
            player.isRight = true;
            break;
        case 'R':
            player.reload();
            break;
    }
}

function onKeyUp(event) {
    switch ((String.fromCharCode(event.which)).toUpperCase()) {
        case 'W':
            //console.log((String.fromCharCode(event.which)).toUpperCase());
            player.isForward = false;
            break;
        case 'S':
            player.isBackward = false;
            break;
        case 'A':
            player.isLeft = false;
            break;
        case 'D':
            player.isRight = false;
            break;
    }
    if (!player.isForward && !player.isBackward && !player.isLeft && !player.isRight)
        player.isMoving = false;
}

function onMouseDown(event) {
    event.preventDefault();
    if (player.controls.isLocked) {
        switch (event.which) {
            //Left click
            //Shoot
            case 1:
                player.isShooting = true;
                break;
            //Right click
            //Aim
            case 3:
                console.log('down');
                player.isAiming = true;
                break;
        }
    }
}

function onMouseUp(event) {
    event.preventDefault();
    if (player.controls.isLocked) {
        switch (event.which) {
            //Left click
            //Stop shooting
            case 1:
                player.isShooting = false;
                break;
            //Right click
            //Stop aiming
            case 3:
                console.log('up');
                player.isAiming = false;
                break;
        }
    }
}

/*function onScroll(event) {
    //Do nothing
    //Multiple weapons not yet implemented
    /*if (!game.paused) {
        if (player.activeWeapon === 0)
            player.activeWeapon = 1;
        else
            player.activeWeapon = 0;
        console.log(player.activeWeapon);
    }*/
}*/

function listen() {
    //initControls();
    //Aditional listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', (event) => onKeyDown(event), false);
    window.addEventListener('keyup', (event) => onKeyUp(event), false);
    window.addEventListener('mousedown', (event) => onMouseDown(event), false);
    window.addEventListener('mouseup', (event) => onMouseUp(event), false);
    window.addEventListener('scroll', (event) => onScroll(event), false);
}