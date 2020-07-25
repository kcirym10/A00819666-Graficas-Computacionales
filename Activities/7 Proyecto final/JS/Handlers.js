// JavaScript source code
//NEEDS WORK
function initControls() {
    //Unlock controls
    window.addEventListener('click', function () {
        player.controls.lock();
        game.isPaused = false;
        canvas.hidden = false;
    }, false);
    //When controls locked

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
        case ' ':
            //player.isMoving = true;
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
            case 1:
                player.isShooting = true;
                console.log(player.position);
                break;
            case 3:
                console.log('down');
                player.isAiming = true;
                break;
            case 2:
                //Do nothing
        }
    }
}

function onMouseUp(event) {
    event.preventDefault();
    if (player.controls.isLocked) {
        switch (event.which) {
            case 1:
                player.isShooting = false;
                break;
            case 3:
                console.log('up');
                player.isAiming = false;
                break;
            case 2:
            //Do nothing
        }
    }
}

function onScroll(event) {
    if (player.controls.isLocked)
        alert('Scroll');
}

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