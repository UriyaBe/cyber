// äîòøê äî÷åøé
var ws = null;
var myColor = null; // éùîåø 'white' àå 'black'
var isOnlineGame = false;
var isEatingStreak = false;
var playerturn = 0;
var firstrow = null;
var firstcol = null;
const divturn = document.getElementById('turn')
var firstclickid = null;
var firstclick = null;
var error1 = document.getElementById('error1')
var whitewin = 0;
var blackwin = 0;
var errorsound = new Audio('errorsound2.mp3')
var rightbody = document.getElementById('rightbody')
var topbody = document.getElementById('topbody')
var winsound = new Audio('winsound.mp3')
var vsComputer = false;
var gameOver = false;
// îòøê çã îîãé ùì úîåðåú
const images = [
    'white.jpg',  // ø÷ò ìáï 0
    'black.png',  // 1 ø÷ò ùçåø
    'WhiteT.png',  // çééì ìáï 2
    'BlackT.png',  // 3 çééì ùçåø
    'WhiteC.png',//ëúø ìáï 4
    'BlackC.png'//ëúø ùçåø 5
];

// îòøê ãå îîãé ùîééöâ àú äìåç
var board = [
    [0, 3, 0, 3, 0, 3, 0, 3],
    [3, 0, 3, 0, 3, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
];
function chooseMode() {
    const v = `<div class="mode-container" id="modeDiv">
        <div class="mode-title">choose mode!</div>
        <div class="mode-buttons">
            <button class="mode-btn friend-btn" onclick="showPlayerName()">play local friend!</button>
            <button class="mode-btn ai-btn" onclick="playerVScomputerNAME()">play against computer!</button>
            <button class="mode-btn" style="background-color:#f39c12;" onclick="startOnlineGame()">play ONLINE!</button>
        </div>
    </div>`
    document.getElementById("startdiv").innerHTML = v;
}
function showPlayerName() {
    var s = `<label id="label" style="left:40%;" class="start" for="playerName">first player name:</label>
        <label id="label2" class="start" for="playerName2">second player name:</label>
        <br />
        <input class="start" type="text" id="playerName" name="playerName">
        <input class="start" type="text" id="playerName2" name="playerName2">
        <br />
        <button class="c" id="start" onclick="start()">click here to start the game</button>`;
    document.getElementById("startdiv").innerHTML = s;
}
function playerVScomputerNAME() {
    var f = `<label id="label" style="left:40%;" class="start" for="playerName">what's your name?</label>
        <br />
        <input class="start" type="text" id="playerName" name="playerName">
        <br />
        <button class="c" id="start" onclick="playerVScomputer()">click here to start the game</button>`;
    document.getElementById("startdiv").innerHTML = f;
}
function startOnlineGame() {
    isOnlineGame = true;
    ws = new WebSocket('ws://192.168.1.154:8765');

    ws.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (data.type === 'init') {
            myColor = data.color;
            document.getElementById("startdiv").innerHTML = `<div style="font-size: 30px; color: white; text-align: center; margin-top: 20%; font-family: Arial;">Connected as ${myColor}. Waiting for opponent...</div>`;
        }

        if (data.type === 'start') {
            document.getElementById("startdiv").remove();
            document.getElementById("container").style.visibility = 'visible';

            if (myColor === 'white') {
                playername = "White (You)";
                playername2 = "Black (Opponent)";
            } else {
                playername = "White (Opponent)";
                playername2 = "Black (You)";
            }
            divturn.innerHTML = "White's turn";
            displayBoard();
        }

        // ëùäéøéá ùåìç îäìê
        if (data.type === 'move') {
            if (data.isEat) {
                board[data.eatRow][data.eatCol] = 1; // îçé÷ú äëìé äðàëì
            }

            // áãé÷ú äëúøä ùì äéøéá
            if (board[data.fromRow][data.fromCol] === 2 && data.toRow === 0) {
                board[data.fromRow][data.fromCol] = 4;
            }
            if (board[data.fromRow][data.fromCol] === 3 && data.toRow === 7) {
                board[data.fromRow][data.fromCol] = 5;
            }

            // öéåø äîäìê òì äìåç ùìðå
            movePiece(data.fromRow, data.fromCol, data.toRow, data.toCol);
        }

        // ëùäéøéá îñééí àú äúåø ùìå
        if (data.type === 'finishTurn') {
            finishTurn();
        }
    };
}
function playerVScomputer() {
    vsComputer = true;
    start();
}
function start() {
    window.playername = document.getElementById("playerName").value;
    window.playername2 = 'computer';
    if (vsComputer == true) {
        document.getElementById("container").style.visibility = 'visible'
        playername = document.getElementById("playerName").value;
        /*playername2 = document.getelementbyid("playername2").value*/
        divturn.innerHTML = "" + playername + "'s turn"
        document.getElementById("startdiv").remove()
        displayBoard()

    }
    else {
        playername = document.getElementById("playerName").value;
        playername2 = document.getElementById("playerName2").value;
        if (playername != "" && playername2 != "") {
            document.getElementById("container").style.visibility = 'visible'
            playername = document.getElementById("playerName").value;
            playername2 = document.getElementById("playerName2").value
            divturn.innerHTML = "" + playername + "'s turn"
            document.getElementById("startdiv").remove()
            displayBoard()
        }
    }
    //window.playername = document.getElementById("playerName").value;
    //window.playername2 = document.getElementById("playerName2").value
    //if (playername != "" && playername2 != "") {
    //    document.getElementById("container").style.visibility = 'visible'
    //    playername = document.getElementById("playerName").value;
    //    playername2 = document.getElementById("playerName2").value
    //    divturn.innerHTML = "" + playername + "'s turn"
    //    document.getElementById("startdiv").remove()
    //    displayBoard()
    //}
}
// ôåð÷öéä ìäöâú äìåç
function displayBoard() {
    blackwin = 0
    whitewin = 0
    var idnum = 0;
    const boardElement = document.getElementById('board');
    for (var i = 0; i < board.length; i++) {//òåáø òì äùåøåú
        for (var j = 0; j < board[i].length; j++) {//òåáø òì äòîåãåú
            const cell = document.createElement('button');
            cell.style.backgroundImage = `url(${images[board[i][j]]})`;
            cell.classList.add('cell');
            if (board[i][j] == 0) {
                cell.classList = ('whitecell')
            }
            if (board[i][j] !== 3 && board[i][j] !== 5) {
                whitewin++;
            }
            if (board[i][j] !== 2 && board[i][j] !== 4) {
                blackwin++;
            }
            cell.id = idnum.toString();
            cell.onclick = handleCellClick;
            /*cell.onclick = (event) => handleCellClick(event);*/
            /* cell.addEventListener('click', () => handleCellClick(i-1, j-1));*/
            boardElement.appendChild(cell);
            idnum++;
            //if (whitewin == 64) {
            //    gameOver = true;
            //    winsound.play()
            //    boardElement.classList = ('boardwin')
            //    boardElement.innerHTML = "" + playername + " won!!";
            //    topbody.innerHTML = "";
            //    rightbody.innerHTML = "";
            //    divturn.remove();
            //    const skipBtn = document.getElementById('skipEatBtn');
            //    if (skipBtn) skipBtn.style.display = 'none';
            //}
            //if (blackwin == 64) {
            //    gameOver = true;
            //    winsound.play()
            //    boardElement.classList = ('boardwin')
            //    boardElement.innerHTML = "" + playername2 + " won!!";
            //    topbody.innerHTML = "";
            //    rightbody.innerHTML = "";
            //    divturn.remove();
            //    const skipBtn = document.getElementById('skipEatBtn');
            //    if (skipBtn) skipBtn.style.display = 'none';
            //}
        }
    }
    const isWhiteWin = false;
    const isWhiteTurn = (playerturn % 2 === 0);
    const checkMovesForWhite = isWhiteTurn ? false : true;
    const moves = getAllTurnOptions(board, checkMovesForWhite);
    if (moves.length === 0) {
        finishGame(isWhiteTurn);
    }
    else if (whitewin == 64) {
        isWhiteWin = true;
        finishGame(isWhiteWin);
    }
    else if (blackwin == 64) {
        isWhiteWin = false;
        finishGame(isWhiteWin);
    }
}
function finishGame(isWhiteWin) {
    const boardElement = document.getElementById('board');
    gameOver = true;
    winsound.play();
    boardElement.classList = ('boardwin');
    if (isWhiteWin) {
        boardElement.innerHTML = "" + playername + " won!!";
    }
    else {
        boardElement.innerHTML = "" + playername2 + " won!!";
    }
    topbody.innerHTML = "";
    rightbody.innerHTML = "";
    divturn.remove();
    const skipBtn = document.getElementById('skipEatBtn');
    if (skipBtn) skipBtn.style.display = 'none';
}
// îòøê âìåáìé ùéçæé÷ àú øùéîú äàåáéé÷èéí ùì äîäìëéí äîåúøéí ìëìé ùðáçø
var validMoves = [];

// ôåð÷öééú äòì ùîåôòìú áëì ìçéöä òì îùáöú áìåç
function handleCellClick(event) {
    //if (vsComputer && !isWhiteTurn) {
    //    error();
    //    return;
    //}
    // ùìéôú äàìîðè äñôöéôé (äëôúåø) ùòìéå ìçõ äîùúîù
    const cell = event.target;
    // çéùåá îñôø äùåøä (0 òã 7) ìôé ä-ID çì÷é 8 åòéâåì ëìôé îèä
    const row = Math.floor(cell.id / 8);
    // çéùåá îñôø äòîåãä (0 òã 7) áàîöòåú ùàøéú äçìå÷ä á-8
    const col = cell.id % 8;

    // áãé÷ä: àí äîùúðä firstclick øé÷, æå äìçéöä äøàùåðä áúåø (áçéøú ëìé)
    if (!firstclick) {
        // ÷øéàä ìôåð÷öéä ùîèôìú ááçéøú äëìé
        handleSelectPiece(cell, row, col);
    }
    // àçøú, ëáø ðáçø ëìé ÷åãí åæå äìçéöä äùðééä (áçéøú éòã)
    else {
        // ÷øéàä ìôåð÷öéä ùîèôìú ááéöåò ääææä àå äàëéìä
        handleMovePiece(cell, row, col);
    }
}

// ôåð÷öéä ìèéôåì áìçéöä äøàùåðä: àéîåú äëìé åñéîåï àôùøåéåú úðåòä
function handleSelectPiece(cell, row, col) {
    // ùìéôú äòøê äîñôøé ùì äîùáöú îúåê äîòøê äãå-îîãé board
    const piece = board[row][col];
    // áãé÷ä äàí æä úåøå ùì äìáï (playerturn æåâé îçæéø true)
    let isWhiteTurn;
    if (playerturn % 2 === 0) {
        isWhiteTurn = true;
    } else {
        isWhiteTurn = false;
    }
    if (isOnlineGame) {
        if (myColor === 'white' && !isWhiteTurn) return; // ìà äúåø ùìê
        if (myColor === 'black' && isWhiteTurn) return; // ìà äúåø ùìê
    }
    if (vsComputer && !isWhiteTurn) {
        return; // äîçùá çåùá òëùéå, äùç÷ï ìà éëåì ìáçåø ëìéí ùçåøéí
    }
    /*const isWhiteTurn = (playerturn % 2 === 0);*/
    // áãé÷ä äàí äîùáöú ùðìçöä îëéìä çééì ìáï (2) àå îìê ìáï (4)
    let isWhitePiece;
    if (piece === 2 || piece === 4) {
        isWhitePiece = true;
    } else {
        isWhitePiece = false;
    }
    /*const isWhitePiece = (piece === 2 || piece === 4);*/
    // áãé÷ä äàí äîùáöú ùðìçöä îëéìä çééì ùçåø (3) àå îìê ùçåø (5)
    let isBlackPiece;
    if (piece === 3 || piece === 5) {
        isBlackPiece = true;
    }
    else {
        isBlackPiece = false;
    }
    /*const isBlackPiece = (piece === 3 || piece === 5);*/

    // áãé÷ä: äàí ùç÷ï ìçõ òì ëìé ùìà ùééê ìå àå òì îùáöú øé÷ä
    if ((isWhiteTurn && !isWhitePiece) || (!isWhiteTurn && !isBlackPiece)) {
        // äùîòú öìéì ùâéàä åäöâú äåãòú ùâéàä
        error();
        // éöéàä îå÷ãîú îäôåð÷öéä ëãé ìîðåò äîùê ôòåìä
        return;
    }

    // ÷øéàä ìôåð÷öéä ùîçùáú àú ëì äîäìëéí äçå÷ééí åùîéøúí áîòøê
    validMoves = getValidMoves(row, col);
    if (isEatingStreak) {
        let onlyEatMoves = [];
        for (let i = 0; i < validMoves.length; i++) {
            if (validMoves[i].type === 'eat') {
                onlyEatMoves.push(validMoves[i]);
            }
        }
        validMoves = onlyEatMoves;
    }
    // áãé÷ä äàí äîòøê øé÷ (ëìåîø ìëìé äðáçø àéï ùåí öòã àå àëéìä àôùøééí)
    if (validMoves.length === 0) {
        // äôòìú çéååé ùâéàä
        noValidMoves();
        // éöéàä îäôåð÷öéä
        return;
    }

    // ùîéøú àìîðè äëôúåø äðáçø áîùúðä äâìåáìé firstclick
    firstclick = cell;
    // ùîéøú äùåøä ùì äëìé äðáçø
    firstrow = row;
    // ùîéøú äòîåãä ùì äëìé äðáçø
    firstcol = col;
    // äãâùú äëìé ùðáçø áîñâøú éøå÷ä
    cell.style.border = "2px solid green";

    // ìåìàä ùòåáøú òì ëì äîäìëéí äîåúøéí ùðîöàå òáåø äëìé
    for (let i = 0; i < validMoves.length; i++) {
        // ùìéôú àåáéé÷è äîäìê äðåëçé îúåê äîòøê
        const move = validMoves[i];
        // äîøú äùåøä åäòîåãä ùì äéòã áçæøä ìîñôø ID áåãã (0 òã 63)
        const targetId = move.toRow * 8 + move.toCol;
        // îöéàú àìîðè äëôúåø ùì îùáöú äéòã áãó
        const targetCell = document.getElementById(targetId);

        // àí äîäìê äåà úðåòä øâéìä ùì öòã àçã
        if (move.type === 'move') {

            // öáéòú îñâøú îùáöú äéòã áàãåí
            targetCell.style.border = "2px solid red";
        }
        // àí äîäìê äåà àëéìä áãéìåâ
        else if (move.type === 'eat') {
            //öáéòú îñâøú äëìé äðàëì
            const EatenMiddlePieceId = move.eatRow * 8 + move.eatCol;
            const EatenMiddlePiece = document.getElementById(EatenMiddlePieceId);
            EatenMiddlePiece.style.border = '2px solid red';
            // öáéòú îñâøú îùáöú äéòã áæäá
            targetCell.style.border = "2px solid gold";
        }
    }
}

// ôåð÷öéä ìèéôåì áìçéöä äùðééä: àéîåú äéòã åäææú äëìé
function handleMovePiece(cell, row, col) {
    // ùìéôú àìîðè ëôúåø äåéúåø òì äîùê àëéìä
    const skipBtn = document.getElementById('skipEatBtn');

    // áãé÷ä: äàí äîùúîù ìçõ ùåá òì àåúå äëìé ùáçø ÷åãí
    // äòøä: ðàôùø áéèåì ø÷ àí äùç÷ï ìà ðîöà ëøâò áàîöò øöó àëéìä îçééá
    if (cell === firstclick && !isEatingStreak) {
        // îçé÷ú ëì äîñâøåú äöáòåðéåú îäìåç
        clearHighlights();
        // àéôåñ îùúðä äáçéøä äøàùåðä
        firstclick = null;
        // øé÷åï øùéîú äîäìëéí
        validMoves = [];
        // éöéàä îäôåð÷öéä (áéèåì äáçéøä)
        return;
    }

    // îùúðä ùéçæé÷ àú äîäìê äúåàí îúåê äøùéîä, îúçéì ëøé÷
    let chosenMove = null;
    // ìåìàä ÷ìàñéú ùáåã÷ú äàí äîùáöú ùðìçöä ÷ééîú áøùéîú äîäìëéí äîåúøéí
    for (let i = 0; i < validMoves.length; i++) {
        // äùååàú äùåøä åäòîåãä ùðìçöå ìùåøú åòîåãú äéòã ùì äîäìê
        if (validMoves[i].toRow === row && validMoves[i].toCol === col) {
            // ùîéøú äîäìê äúåàí
            chosenMove = validMoves[i];
            // òöéøú äìåìàä áøâò ùðîöàä äúàîä
            break;
        }
    }

    // áãé÷ä: àí chosenMove ðùàø null, äîùúîù ìçõ òì îùáöú ìà çå÷éú
    if (!chosenMove) {
        // àí ìà ðîöàéí áàîöò øöó àëéìä, îð÷éí áçéøä
        if (!isEatingStreak) {
            // îçé÷ú äñéîåðéí åäîñâøåú
            clearHighlights();
            // àéôåñ áçéøú äëìé
            firstclick = null;
            // øé÷åï øùéîú äîäìëéí
            validMoves = [];
        }
        // äôòìú çéååé ùâéàä
        error();
        // éöéàä îäôåð÷öéä
        return;
    }

    // ùîéøú àéðãé÷öéä äàí äîäìê äðåëçé äéä àëéìä
    let wasEat;
    if (chosenMove.type === 'eat') {
        wasEat = true;
    }
    else {
        wasEat = false;
    }
    /*const wasEat = (chosenMove.type === 'eat');*/

    // áãé÷ä: äàí äîäìê ùðáçø äåà îäìê ùì àëéìä
    if (wasEat) {
        // òãëåï äîùáöú ùì äëìé äðàëì áîòøê ì-1 (äôéëúä ìîùáöú ëää øé÷ä)
        board[chosenMove.eatRow][chosenMove.eatCol] = 1;
    }

    // áãé÷ä: äàí çééì ìáï (2) äâéò ìùåøä äòìéåðä áéåúø (ùåøä 0)
    if (board[firstrow][firstcol] === 2 && row === 0) {
        // äôéëú äçééì äìáï ìîìê ìáï (4)
        board[firstrow][firstcol] = 4;
    }
    // áãé÷ä: äàí çééì ùçåø (3) äâéò ìùåøä äúçúåðä áéåúø (ùåøä 7)
    if (board[firstrow][firstcol] === 3 && row === 7) {
        // äôéëú äçééì äùçåø ìîìê ùçåø (5)
        board[firstrow][firstcol] = 5;
    }
    if (isOnlineGame) {
        ws.send(JSON.stringify({
            type: 'move',
            fromRow: firstrow,
            fromCol: firstcol,
            toRow: row,
            toCol: col,
            isEat: wasEat,
            eatRow: wasEat ? chosenMove.eatRow : null,
            eatCol: wasEat ? chosenMove.eatCol : null
        }));
    }
    // ÷øéàä ìôåð÷öéä äî÷åøéú ùîáöòú äçìôä áìåç, îð÷ä HTML åîöééøú îçãù
    movePiece(firstrow, firstcol, row, col);

    // ðé÷åé äîñâøåú ùðùàøå îñåîðåú òì äìåç
    clearHighlights();
    // àéôåñ îùúðä äáçéøä ì÷øàú äúåø äáà
    firstclick = null;
    // øé÷åï øùéîú äîäìëéí ì÷øàú äúåø äáà
    validMoves = [];

    // áãé÷ä: àí áåöòä àëéìä, äàí éù àôùøåú ìàëéìä ðåñôú îàåúä îùáöú çãùä
    if (wasEat) {
        // çéùåá äîäìëéí äàôùøééí îäîé÷åí äçãù åñéðåï ø÷ ìàëéìåú
        const allMoves = getValidMoves(row, col);
        const nextMoves = [];
        for (let i = 0; i < allMoves.length; i++) {
            if (allMoves[i].type === 'eat') {
                nextMoves.push(allMoves[i]);
            }
        }
        /*const nextMoves = getValidMoves(row, col).filter(m => m.type === 'eat');*/

        // àí éù àëéìåú ðåñôåú àôùøéåú
        if (nextMoves.length > 0) {
            isEatingStreak = true;
            // îöéàú äàìîðè ùì äëìé áîé÷åîå äçãù
            const currentCell = document.getElementById(row * 8 + col);
            // áçéøä îçåãùú åñéîåï àåèåîèé ùì äëìé òì äìåç
            handleSelectPiece(currentCell, row, col);
            // òãëåï äîäìëéí äîåúøéí ìàëéìåú áìáã
            /*validMoves = nextMoves;*/

            // äöâú ëôúåø ùîàôùø ìùç÷ï ìååúø òì äîùê äàëéìä
            if (skipBtn) {
                skipBtn.style.display = 'block';
            }
            // òöéøú äôåð÷öéä ëàï ëãé ìà ìäòáéø àú äúåø ìùç÷ï äáà
            return;
        }
    }

    // ñéåí äúåø ëøâéì åäòáøúå ìùç÷ï äáà
    finishTurn();
}

// ôåð÷öéä ìçéùåá ëì äîäìëéí äçå÷ééí (öòãéí åàëéìåú) òáåø îé÷åí îñåéí
function getValidMoves(row, col) {
    // ùìéôú ñåâ äëìé ùðîöà áîùáöú äðúåðä
    const piece = board[row][col];
    // áãé÷ä áåìéàðéú: äàí äëìé äåà ìáï (øâéì àå îìê
    let isWhite;
    if (piece === 2 || piece === 4) {
        isWhite = true;
    }
    else {
        isWhite = false;
    }
    /*const isWhite = (piece === 2 || piece === 4);*/
    // áãé÷ä áåìéàðéú: äàí äëìé äåà îìê (ìáï àå ùçåø)
    let isKing;
    if (piece === 4 || piece === 5) {
        isKing = true;
    }
    else {
        isKing = false;
    }
    /*const isKing = (piece === 4 || piece === 5);*/
    // éöéøú îòøê øé÷ ùéöáåø àú ëì äîäìëéí ùéîöàå
    const moves = [];

    // ÷áéòú ëéååðé äùåøåú: îìê î÷áì [-1, 1], ìáï î÷áì [-1], ùçåø î÷áì [1]
    let rowDirections;
    if (isKing) {
        rowDirections = [-1, 1];
    }
    else {
        if (isWhite) {
            rowDirections = [-1];
        }
        else {
            rowDirections = [1];
        }
    }
    /*const rowDirections = isKing ? [-1, 1] : [isWhite ? -1 : 1];*/
    // ëéååðé äòîåãåú: úîéã ùîàìä (-1) åéîéðä (1)
    const colDirections = [-1, 1];

    // ìåìàä çéöåðéú ùòåáøú òì ëéååðé äùåøåú äîåúøéí
    for (let i = 0; i < rowDirections.length; i++) {
        // ùìéôú ëéååï äùåøä äðåëçé (-1 àå 1)
        const rDir = rowDirections[i];

        // ìåìàä ôðéîéú ùòåáøú òì ëéååðé äòîåãåú
        for (let j = 0; j < colDirections.length; j++) {
            // ùìéôú ëéååï äòîåãä äðåëçé (-1 àå 1)
            const cDir = colDirections[j];

            // çéùåá ùåøú äéòã òáåø öòã áåãã
            const nextRow = row + rDir;
            // çéùåá òîåãú äéòã òáåø öòã áåãã
            const nextCol = col + cDir;

            // áãé÷ä: äàí îùáöú äöòã äáåãã ðîöàú áâáåìåú äìåç åäéà øé÷ä (òøê 1)
            if (isOnBoard(nextRow, nextCol) && board[nextRow][nextCol] === 1) {
                // äåñôú àåáéé÷è îäìê úðåòä øâéì ìîòøê
                moves.push({ type: 'move', toRow: nextRow, toCol: nextCol });
            }

            // çéùåá ùåøú äéòã ìðçéúä áãéìåâ (÷ôéöä ëôåìä ùì 2 îùáöåú)
            const jumpRow = row + rDir * 2;
            // çéùåá òîåãú äéòã ìðçéúä áãéìåâ (÷ôéöä ëôåìä ùì 2 îùáöåú)
            const jumpCol = col + cDir * 2;

            // áãé÷ä: äàí îùáöú äðçéúä ðîöàú áìåç åäéà øé÷ä (òøê 1)
            if (isOnBoard(jumpRow, jumpCol) && board[jumpRow][jumpCol] === 1) {
                // ùìéôú äòøê ùì äëìé ùòåîã áàîöò (äëìé ù÷åôöéí îòìéå)
                const middlePiece = board[nextRow][nextCol];
                // áãé÷ä äàí äëìé ùáàîöò ùééê ìéøéá
                let isOpponent = false;
                if (isWhite) {
                    if (middlePiece === 3 || middlePiece === 5) {
                        isOpponent = true;
                    }
                }
                else {
                    if (middlePiece === 2 || middlePiece === 4) {
                        isOpponent = true;
                    }
                }
                //const isOpponent = isWhite
                //    ? (middlePiece === 3 || middlePiece === 5)
                //    : (middlePiece === 2 || middlePiece === 4);

                // àí àëï òåîã ùí ëìé éøéá, æå àëéìä çå÷éú
                if (isOpponent) {
                    // äåñôú àåáéé÷è îäìê àëéìä òí ôøèé äðçéúä åäëìé äðàëì
                    moves.push({
                        type: 'eat',
                        toRow: jumpRow,
                        toCol: jumpCol,
                        eatRow: nextRow,
                        eatCol: nextCol
                    });
                }
            }
        }
    }
    // äçæøú îòøê äîäìëéí äîìà áñéåí ëì äáãé÷åú
    return moves;
}

// ôåð÷öééú òæø ìáãé÷ä äàí ÷åàåøãéðèä îñåéîú çå÷éú òì ìåç ùì 8x8
function isOnBoard(r, c) {
    // îçæéøä true ø÷ àí äùåøä åäòîåãä ùúéäï áéï 0 ì-7 ëåìì
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

// ôåð÷öéä ùîð÷ä àú ëì îñâøåú äöáò îëì äîùáöåú áìåç
function clearHighlights() {
    // ùìéôú ëì äàìîðèéí áòìé ä÷ìàñ 'cell' áãó ìúåê øùéîä
    const cells = document.querySelectorAll('.cell');
    // îòáø áìåìàä ÷ìàñéú òì ëì äîùáöåú ùðîöàå
    for (let i = 0; i < cells.length; i++) {
        // àéôåñ îàôééï äîñâøú ìîçøåæú øé÷ä (äñøú äöáò)
        cells[i].style.border = '';
    }
}
function movePiece(fromRow, fromCol, toRow, toCol) {
    // ùîåø àú äòøê ùì äúà äî÷åøé áîùúðä temp
    const temp = board[fromRow][fromCol];

    // äòú÷ àú äòøê ùì úà äéòã ìúà äî÷åøé
    board[fromRow][fromCol] = board[toRow][toCol];

    // äòú÷ àú äòøê ùì temp ìúà äéòã
    board[toRow][toCol] = temp;

    console.log(`Moved piece from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);
    updateBoard();
}
function updateBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    displayBoard();
}


// äöâú äìåç
/*displayBoard();*/
function changecolor() {
    divturn.style.color = 'red'
    setTimeout(function black() {
        divturn.style.color = 'black'; // äçæøú äöáò äî÷åøé ìàçø 2.5 ùðéåú
    }, 2500);
}
function error() {
    var errorsound = new Audio('errorsound2.mp3')
    errorsound.play()
    error1.style.visibility = 'visible';
    error1.style.opacity = '1';
    setTimeout(function () {
        error1.style.opacity = '0'; // äçæøú äöáò äî÷åøé ìàçø 2.5 ùðéåú
    }, 1000);
}
function noValidMoves() {
    var errorsound = new Audio('errorsound2.mp3')
    error1.innerHTML = "<strong>No valid moves</strong>";
    errorsound.play()
    error1.style.visibility = 'visible';
    error1.style.opacity = '1';
    setTimeout(function () {
        error1.style.opacity = '0'; // äçæøú äöáò äî÷åøé ìàçø 2.5 ùðéåú
    }, 1000);
    setTimeout(function () {
        error1.innerHTML = "<strong>error!</strong>";
    }, 1300);
}
// ôåð÷öéä ùîòáéøä àú äúåø åîð÷ä îöá
function finishTurn() {
    if (isOnlineGame) {
        // ðáã÷ äàí àðé æä ùñééí òëùéå àú äúåø, ëãé ùìà éäéä ìåô àéðñåôé
        const isMyTurn = (myColor === 'white' && playerturn % 2 === 0) || (myColor === 'black' && playerturn % 2 !== 0);
        if (isMyTurn && ws.readyState === 1) { // 1 àåîø ùäçéáåø ôúåç
            ws.send(JSON.stringify({ type: 'finishTurn' }));
        }
    }
    const skipBtn = document.getElementById('skipEatBtn');
    if (skipBtn) skipBtn.style.display = 'none';

    isEatingStreak = false;

    clearHighlights();
    firstclick = null;
    validMoves = [];

    playerturn++;
    divturn.innerHTML = (playerturn % 2 === 0)
        ? "" + playername + "'s turn"
        : "" + playername2 + "'s turn";
    const isWhiteTurn = (playerturn % 2 === 0);
    if (vsComputer && !isWhiteTurn) {
        // äùäéä ÷ìä ùì çöé ùðééä ëãé ùäúðåòä úéøàä èáòéú
        setTimeout(playComputerTurn, 600);
    }
}

// îåôòìú áìçéöä òì äëôúåø "ñééí úåø" ùäåñôú á-HTML
function endTurnManually() {
    finishTurn();
}
////////////////////////////////////////////////////////////////////////////
function playComputerTurn() {
    if (gameOver) return;
    const depth = 4;
    const result = minimax(board, depth, false, -Infinity, Infinity);
    if (!result.path || result.path.length === 0) {
        finishTurn();
        return;
    }
    executePath(result.path, 0);
}

function cloneBoard(boardArr) {
    let newBoard = [];
    // òåáø ùåøä-ùåøä
    for (let i = 0; i < boardArr.length; i++) {
        let newRow = [];
        // òåáø úà-úà áëì ùåøä åîòúé÷ àú äòøê
        for (let j = 0; j < boardArr[i].length; j++) {
            newRow.push(boardArr[i][j]);
        }
        newBoard.push(newRow);
    }
    return newBoard;
}

function getValidMovesOnBoard(boardArr, row, col) {
    const piece = boardArr[row][col];
    const isWhite = (piece === 2 || piece === 4);
    const isKing = (piece === 4 || piece === 5);
    const moves = [];
    const rowDirections = isKing ? [-1, 1] : (isWhite ? [-1] : [1]);
    const colDirections = [-1, 1];

    for (let i = 0; i < rowDirections.length; i++) {
        const rDir = rowDirections[i];
        for (let j = 0; j < colDirections.length; j++) {
            const cDir = colDirections[j];

            const nextRow = row + rDir;
            const nextCol = col + cDir;

            if (isOnBoard(nextRow, nextCol) && boardArr[nextRow][nextCol] === 1) {
                moves.push({ type: 'move', toRow: nextRow, toCol: nextCol });
            }

            const jumpRow = row + rDir * 2;
            const jumpCol = col + cDir * 2;

            if (isOnBoard(jumpRow, jumpCol) && boardArr[jumpRow][jumpCol] === 1) {
                const middlePiece = boardArr[nextRow][nextCol];
                let isOpponent = false;
                if (isWhite) {
                    if (middlePiece === 3 || middlePiece === 5) isOpponent = true;
                } else {
                    if (middlePiece === 2 || middlePiece === 4) isOpponent = true;
                }
                if (isOpponent) {
                    moves.push({
                        type: 'eat',
                        toRow: jumpRow,
                        toCol: jumpCol,
                        eatRow: nextRow,
                        eatCol: nextCol
                    });
                }
            }
        }
    }
    return moves;
}
function applyMove(boardArr, fromRow, fromCol, move) {
    const newBoard = cloneBoard(boardArr);
    let piece = newBoard[fromRow][fromCol];

    // îçé÷ú ëìé ùðàëì
    if (move.type === 'eat') {
        newBoard[move.eatRow][move.eatCol] = 1;
    }

    // áãé÷ú äëúøä
    if (piece === 2 && move.toRow === 0) piece = 4;
    else if (piece === 3 && move.toRow === 7) piece = 5;

    // äöáä éùéøä åøé÷åï äîùáöú ä÷åãîú (áìé temp)
    newBoard[move.toRow][move.toCol] = piece;
    newBoard[fromRow][fromCol] = 1;

    return newBoard;
}
function getAllTurnOptions(boardArr, isWhiteTurn) {
    const options = [];
    for (let r = 0; r < boardArr.length; r++) {
        for (let c = 0; c < boardArr.length; c++) {
            const piece = boardArr[r][c];
            const pieceIsWhite = (piece === 2 || piece === 4);
            const pieceIsBlack = (piece === 3 || piece === 5);
            if ((isWhiteTurn && !pieceIsWhite) || (!isWhiteTurn && !pieceIsBlack)) {
                continue;
            }
            const movesForThisPiece = getValidMovesOnBoard(boardArr, r, c);
            for (let i = 0; i < movesForThisPiece.length; i++) {
                if (movesForThisPiece[i].type === 'move') {
                    const resultBoard = applyMove(boardArr, r, c, movesForThisPiece[i]);
                    options.push({ board: resultBoard, path: [{ fromRow: r, fromCol: c, move: movesForThisPiece[i] }] });
                }
                else {
                    exploreEatChain(boardArr, r, c, movesForThisPiece[i], [{ fromRow: r, fromCol: c, move: movesForThisPiece[i] }], options);
                }
            }
        }
    }
    return options;
}
function exploreEatChain(boardArr, fromRow, fromCol, move, pathSoFar, options) {
    const boardAfterThisEat = applyMove(boardArr, fromRow, fromCol, move);

    options.push({ board: boardAfterThisEat, path: pathSoFar.slice() });

    const furtherMoves = getValidMovesOnBoard(boardAfterThisEat, move.toRow, move.toCol);
    for (let i = 0; i < furtherMoves.length; i++) {
        if (furtherMoves[i].type === 'eat') {
            exploreEatChain(
                boardAfterThisEat,
                move.toRow,
                move.toCol,
                furtherMoves[i],
                pathSoFar.concat([{ fromRow: move.toRow, fromCol: move.toCol, move: furtherMoves[i] }]),
                options
            );
        }
    }
}
function minimax(boardArr, depth, isWhiteTurn, alpha, beta) {
    const turnOptions = getAllTurnOptions(boardArr, isWhiteTurn);
    if (depth === 0 || turnOptions.length === 0) {
        return { score: evaluateBoard(boardArr), path: null };
    }
    let bestPath = null;
    if (!isWhiteTurn) {
        // úåø äùçåø (äîçùá) - î÷ñåí äöéåï
        let maxEval = -Infinity;
        for (let i = 0; i < turnOptions.length; i++) {
            const option = turnOptions[i];
            const result = minimax(option.board, depth - 1, true, alpha, beta);
            if (result.score > maxEval) {
                maxEval = result.score;
                bestPath = option.path;
            }
            alpha = Math.max(alpha, result.score);
            if (beta <= alpha) {
                break;
            }
        }
        return { score: maxEval, path: bestPath };
    } else {
        // úåø äìáï - îæòåø äöéåï
        let minEval = Infinity;
        for (let i = 0; i < turnOptions.length; i++) {
            const option = turnOptions[i];
            const result = minimax(option.board, depth - 1, false, alpha, beta);
            if (result.score < minEval) {
                minEval = result.score;
                bestPath = option.path;
            }
            beta = Math.min(beta, result.score);
            if (beta <= alpha) break;
        }
        return { score: minEval, path: bestPath };
    }
}
function evaluateBoard(boardArr) {
    let score = 0;
    for (let r = 0; r < boardArr.length; r++) {
        for (let c = 0; c < boardArr.length; c++) {
            const piece = boardArr[r][c];
            if (piece === 3) {
                score += 10;
                score += r * 0.3;
            }
            else if (piece === 2) {
                score -= 10;
                score -= (7 - r) * 0.3;
            }
            else if (piece === 5) score += 16;
            else if (piece === 4) score -= 16;
        }
    }
    return score;
}
function executePath(path, index) {
    if (gameOver) return;

    if (index >= path.length) {
        finishTurn();
        return;
    }

    const step = path[index];
    const fromRow = step.fromRow;
    const fromCol = step.fromCol;
    const move = step.move;

    if (move.type === 'eat') {
        board[move.eatRow][move.eatCol] = 1;
    }
    if (board[fromRow][fromCol] === 3 && move.toRow === 7) {
        board[fromRow][fromCol] = 5;
    }

    movePiece(fromRow, fromCol, move.toRow, move.toCol);

    setTimeout(function () {
        executePath(path, index + 1);
    }, 400);
}
