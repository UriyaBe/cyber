// המערך המקורי
var ws = null;
var myColor = null; // ישמור 'white' או 'black'
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
// מערך חד ממדי של תמונות
const images = [
    'white.jpg',  // רקע לבן 0
    'black.png',  // 1 רקע שחור
    'WhiteT.PNG',  // חייל לבן 2
    'BlackT.PNG',  // 3 חייל שחור
    'WhiteC.PNG',//כתר לבן 4
    'BlackC.PNG'//כתר שחור 5
];

// מערך דו ממדי שמייצג את הלוח
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

        // כשהיריב שולח מהלך
        if (data.type === 'move') {
            if (data.isEat) {
                board[data.eatRow][data.eatCol] = 1; // מחיקת הכלי הנאכל
            }

            // בדיקת הכתרה של היריב
            if (board[data.fromRow][data.fromCol] === 2 && data.toRow === 0) {
                board[data.fromRow][data.fromCol] = 4;
            }
            if (board[data.fromRow][data.fromCol] === 3 && data.toRow === 7) {
                board[data.fromRow][data.fromCol] = 5;
            }

            // ציור המהלך על הלוח שלנו
            movePiece(data.fromRow, data.fromCol, data.toRow, data.toCol);
        }

        // כשהיריב מסיים את התור שלו
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
// פונקציה להצגת הלוח
function displayBoard() {
    blackwin = 0
    whitewin = 0
    var idnum = 0;
    const boardElement = document.getElementById('board');
    for (var i = 0; i < board.length; i++) {//עובר על השורות
        for (var j = 0; j < board[i].length; j++) {//עובר על העמודות
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
// מערך גלובלי שיחזיק את רשימת האובייקטים של המהלכים המותרים לכלי שנבחר
var validMoves = [];

// פונקציית העל שמופעלת בכל לחיצה על משבצת בלוח
function handleCellClick(event) {
    //if (vsComputer && !isWhiteTurn) {
    //    error();
    //    return;
    //}
    // שליפת האלמנט הספציפי (הכפתור) שעליו לחץ המשתמש
    const cell = event.target;
    // חישוב מספר השורה (0 עד 7) לפי ה-ID חלקי 8 ועיגול כלפי מטה
    const row = Math.floor(cell.id / 8);
    // חישוב מספר העמודה (0 עד 7) באמצעות שארית החלוקה ב-8
    const col = cell.id % 8;

    // בדיקה: אם המשתנה firstclick ריק, זו הלחיצה הראשונה בתור (בחירת כלי)
    if (!firstclick) {
        // קריאה לפונקציה שמטפלת בבחירת הכלי
        handleSelectPiece(cell, row, col);
    }
    // אחרת, כבר נבחר כלי קודם וזו הלחיצה השנייה (בחירת יעד)
    else {
        // קריאה לפונקציה שמטפלת בביצוע ההזזה או האכילה
        handleMovePiece(cell, row, col);
    }
}

// פונקציה לטיפול בלחיצה הראשונה: אימות הכלי וסימון אפשרויות תנועה
function handleSelectPiece(cell, row, col) {
    // שליפת הערך המספרי של המשבצת מתוך המערך הדו-ממדי board
    const piece = board[row][col];
    // בדיקה האם זה תורו של הלבן (playerturn זוגי מחזיר true)
    let isWhiteTurn;
    if (playerturn % 2 === 0) {
        isWhiteTurn = true;
    } else {
        isWhiteTurn = false;
    }
    if (isOnlineGame) {
        if (myColor === 'white' && !isWhiteTurn) return; // לא התור שלך
        if (myColor === 'black' && isWhiteTurn) return; // לא התור שלך
    }
    if (vsComputer && !isWhiteTurn) {
        return; // המחשב חושב עכשיו, השחקן לא יכול לבחור כלים שחורים
    }
    /*const isWhiteTurn = (playerturn % 2 === 0);*/
    // בדיקה האם המשבצת שנלחצה מכילה חייל לבן (2) או מלך לבן (4)
    let isWhitePiece;
    if (piece === 2 || piece === 4) {
        isWhitePiece = true;
    } else {
        isWhitePiece = false;
    }
    /*const isWhitePiece = (piece === 2 || piece === 4);*/
    // בדיקה האם המשבצת שנלחצה מכילה חייל שחור (3) או מלך שחור (5)
    let isBlackPiece;
    if (piece === 3 || piece === 5) {
        isBlackPiece = true;
    }
    else {
        isBlackPiece = false;
    }
    /*const isBlackPiece = (piece === 3 || piece === 5);*/

    // בדיקה: האם שחקן לחץ על כלי שלא שייך לו או על משבצת ריקה
    if ((isWhiteTurn && !isWhitePiece) || (!isWhiteTurn && !isBlackPiece)) {
        // השמעת צליל שגיאה והצגת הודעת שגיאה
        error();
        // יציאה מוקדמת מהפונקציה כדי למנוע המשך פעולה
        return;
    }

    // קריאה לפונקציה שמחשבת את כל המהלכים החוקיים ושמירתם במערך
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
    // בדיקה האם המערך ריק (כלומר לכלי הנבחר אין שום צעד או אכילה אפשריים)
    if (validMoves.length === 0) {
        // הפעלת חיווי שגיאה
        noValidMoves();
        // יציאה מהפונקציה
        return;
    }

    // שמירת אלמנט הכפתור הנבחר במשתנה הגלובלי firstclick
    firstclick = cell;
    // שמירת השורה של הכלי הנבחר
    firstrow = row;
    // שמירת העמודה של הכלי הנבחר
    firstcol = col;
    // הדגשת הכלי שנבחר במסגרת ירוקה
    cell.style.border = "2px solid green";

    // לולאה שעוברת על כל המהלכים המותרים שנמצאו עבור הכלי
    for (let i = 0; i < validMoves.length; i++) {
        // שליפת אובייקט המהלך הנוכחי מתוך המערך
        const move = validMoves[i];
        // המרת השורה והעמודה של היעד בחזרה למספר ID בודד (0 עד 63)
        const targetId = move.toRow * 8 + move.toCol;
        // מציאת אלמנט הכפתור של משבצת היעד בדף
        const targetCell = document.getElementById(targetId);

        // אם המהלך הוא תנועה רגילה של צעד אחד
        if (move.type === 'move') {

            // צביעת מסגרת משבצת היעד באדום
            targetCell.style.border = "2px solid red";
        }
        // אם המהלך הוא אכילה בדילוג
        else if (move.type === 'eat') {
            //צביעת מסגרת הכלי הנאכל
            const EatenMiddlePieceId = move.eatRow * 8 + move.eatCol;
            const EatenMiddlePiece = document.getElementById(EatenMiddlePieceId);
            EatenMiddlePiece.style.border = '2px solid red';
            // צביעת מסגרת משבצת היעד בזהב
            targetCell.style.border = "2px solid gold";
        }
    }
}

// פונקציה לטיפול בלחיצה השנייה: אימות היעד והזזת הכלי
function handleMovePiece(cell, row, col) {
    // שליפת אלמנט כפתור הויתור על המשך אכילה
    const skipBtn = document.getElementById('skipEatBtn');

    // בדיקה: האם המשתמש לחץ שוב על אותו הכלי שבחר קודם
    // הערה: נאפשר ביטול רק אם השחקן לא נמצא כרגע באמצע רצף אכילה מחייב
    if (cell === firstclick && !isEatingStreak) {
        // מחיקת כל המסגרות הצבעוניות מהלוח
        clearHighlights();
        // איפוס משתנה הבחירה הראשונה
        firstclick = null;
        // ריקון רשימת המהלכים
        validMoves = [];
        // יציאה מהפונקציה (ביטול הבחירה)
        return;
    }

    // משתנה שיחזיק את המהלך התואם מתוך הרשימה, מתחיל כריק
    let chosenMove = null;
    // לולאה קלאסית שבודקת האם המשבצת שנלחצה קיימת ברשימת המהלכים המותרים
    for (let i = 0; i < validMoves.length; i++) {
        // השוואת השורה והעמודה שנלחצו לשורת ועמודת היעד של המהלך
        if (validMoves[i].toRow === row && validMoves[i].toCol === col) {
            // שמירת המהלך התואם
            chosenMove = validMoves[i];
            // עצירת הלולאה ברגע שנמצאה התאמה
            break;
        }
    }

    // בדיקה: אם chosenMove נשאר null, המשתמש לחץ על משבצת לא חוקית
    if (!chosenMove) {
        // אם לא נמצאים באמצע רצף אכילה, מנקים בחירה
        if (!isEatingStreak) {
            // מחיקת הסימונים והמסגרות
            clearHighlights();
            // איפוס בחירת הכלי
            firstclick = null;
            // ריקון רשימת המהלכים
            validMoves = [];
        }
        // הפעלת חיווי שגיאה
        error();
        // יציאה מהפונקציה
        return;
    }

    // שמירת אינדיקציה האם המהלך הנוכחי היה אכילה
    let wasEat;
    if (chosenMove.type === 'eat') {
        wasEat = true;
    }
    else {
        wasEat = false;
    }
    /*const wasEat = (chosenMove.type === 'eat');*/

    // בדיקה: האם המהלך שנבחר הוא מהלך של אכילה
    if (wasEat) {
        // עדכון המשבצת של הכלי הנאכל במערך ל-1 (הפיכתה למשבצת כהה ריקה)
        board[chosenMove.eatRow][chosenMove.eatCol] = 1;
    }

    // בדיקה: האם חייל לבן (2) הגיע לשורה העליונה ביותר (שורה 0)
    if (board[firstrow][firstcol] === 2 && row === 0) {
        // הפיכת החייל הלבן למלך לבן (4)
        board[firstrow][firstcol] = 4;
    }
    // בדיקה: האם חייל שחור (3) הגיע לשורה התחתונה ביותר (שורה 7)
    if (board[firstrow][firstcol] === 3 && row === 7) {
        // הפיכת החייל השחור למלך שחור (5)
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
    // קריאה לפונקציה המקורית שמבצעת החלפה בלוח, מנקה HTML ומציירת מחדש
    movePiece(firstrow, firstcol, row, col);

    // ניקוי המסגרות שנשארו מסומנות על הלוח
    clearHighlights();
    // איפוס משתנה הבחירה לקראת התור הבא
    firstclick = null;
    // ריקון רשימת המהלכים לקראת התור הבא
    validMoves = [];

    // בדיקה: אם בוצעה אכילה, האם יש אפשרות לאכילה נוספת מאותה משבצת חדשה
    if (wasEat) {
        // חישוב המהלכים האפשריים מהמיקום החדש וסינון רק לאכילות
        const allMoves = getValidMoves(row, col);
        const nextMoves = [];
        for (let i = 0; i < allMoves.length; i++) {
            if (allMoves[i].type === 'eat') {
                nextMoves.push(allMoves[i]);
            }
        }
        /*const nextMoves = getValidMoves(row, col).filter(m => m.type === 'eat');*/

        // אם יש אכילות נוספות אפשריות
        if (nextMoves.length > 0) {
            isEatingStreak = true;
            // מציאת האלמנט של הכלי במיקומו החדש
            const currentCell = document.getElementById(row * 8 + col);
            // בחירה מחודשת וסימון אוטומטי של הכלי על הלוח
            handleSelectPiece(currentCell, row, col);
            // עדכון המהלכים המותרים לאכילות בלבד
            /*validMoves = nextMoves;*/

            // הצגת כפתור שמאפשר לשחקן לוותר על המשך האכילה
            if (skipBtn) {
                skipBtn.style.display = 'block';
            }
            // עצירת הפונקציה כאן כדי לא להעביר את התור לשחקן הבא
            return;
        }
    }

    // סיום התור כרגיל והעברתו לשחקן הבא
    finishTurn();
}

// פונקציה לחישוב כל המהלכים החוקיים (צעדים ואכילות) עבור מיקום מסוים
function getValidMoves(row, col) {
    // שליפת סוג הכלי שנמצא במשבצת הנתונה
    const piece = board[row][col];
    // בדיקה בוליאנית: האם הכלי הוא לבן (רגיל או מלך
    let isWhite;
    if (piece === 2 || piece === 4) {
        isWhite = true;
    }
    else {
        isWhite = false;
    }
    /*const isWhite = (piece === 2 || piece === 4);*/
    // בדיקה בוליאנית: האם הכלי הוא מלך (לבן או שחור)
    let isKing;
    if (piece === 4 || piece === 5) {
        isKing = true;
    }
    else {
        isKing = false;
    }
    /*const isKing = (piece === 4 || piece === 5);*/
    // יצירת מערך ריק שיצבור את כל המהלכים שימצאו
    const moves = [];

    // קביעת כיווני השורות: מלך מקבל [-1, 1], לבן מקבל [-1], שחור מקבל [1]
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
    // כיווני העמודות: תמיד שמאלה (-1) וימינה (1)
    const colDirections = [-1, 1];

    // לולאה חיצונית שעוברת על כיווני השורות המותרים
    for (let i = 0; i < rowDirections.length; i++) {
        // שליפת כיוון השורה הנוכחי (-1 או 1)
        const rDir = rowDirections[i];

        // לולאה פנימית שעוברת על כיווני העמודות
        for (let j = 0; j < colDirections.length; j++) {
            // שליפת כיוון העמודה הנוכחי (-1 או 1)
            const cDir = colDirections[j];

            // חישוב שורת היעד עבור צעד בודד
            const nextRow = row + rDir;
            // חישוב עמודת היעד עבור צעד בודד
            const nextCol = col + cDir;

            // בדיקה: האם משבצת הצעד הבודד נמצאת בגבולות הלוח והיא ריקה (ערך 1)
            if (isOnBoard(nextRow, nextCol) && board[nextRow][nextCol] === 1) {
                // הוספת אובייקט מהלך תנועה רגיל למערך
                moves.push({ type: 'move', toRow: nextRow, toCol: nextCol });
            }

            // חישוב שורת היעד לנחיתה בדילוג (קפיצה כפולה של 2 משבצות)
            const jumpRow = row + rDir * 2;
            // חישוב עמודת היעד לנחיתה בדילוג (קפיצה כפולה של 2 משבצות)
            const jumpCol = col + cDir * 2;

            // בדיקה: האם משבצת הנחיתה נמצאת בלוח והיא ריקה (ערך 1)
            if (isOnBoard(jumpRow, jumpCol) && board[jumpRow][jumpCol] === 1) {
                // שליפת הערך של הכלי שעומד באמצע (הכלי שקופצים מעליו)
                const middlePiece = board[nextRow][nextCol];
                // בדיקה האם הכלי שבאמצע שייך ליריב
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

                // אם אכן עומד שם כלי יריב, זו אכילה חוקית
                if (isOpponent) {
                    // הוספת אובייקט מהלך אכילה עם פרטי הנחיתה והכלי הנאכל
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
    // החזרת מערך המהלכים המלא בסיום כל הבדיקות
    return moves;
}

// פונקציית עזר לבדיקה האם קואורדינטה מסוימת חוקית על לוח של 8x8
function isOnBoard(r, c) {
    // מחזירה true רק אם השורה והעמודה שתיהן בין 0 ל-7 כולל
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

// פונקציה שמנקה את כל מסגרות הצבע מכל המשבצות בלוח
function clearHighlights() {
    // שליפת כל האלמנטים בעלי הקלאס 'cell' בדף לתוך רשימה
    const cells = document.querySelectorAll('.cell');
    // מעבר בלולאה קלאסית על כל המשבצות שנמצאו
    for (let i = 0; i < cells.length; i++) {
        // איפוס מאפיין המסגרת למחרוזת ריקה (הסרת הצבע)
        cells[i].style.border = '';
    }
}
function movePiece(fromRow, fromCol, toRow, toCol) {
    // שמור את הערך של התא המקורי במשתנה temp
    const temp = board[fromRow][fromCol];

    // העתק את הערך של תא היעד לתא המקורי
    board[fromRow][fromCol] = board[toRow][toCol];

    // העתק את הערך של temp לתא היעד
    board[toRow][toCol] = temp;

    console.log(`Moved piece from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);
    updateBoard();
}
function updateBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    displayBoard();
}


// הצגת הלוח
/*displayBoard();*/
function changecolor() {
    divturn.style.color = 'red'
    setTimeout(function black() {
        divturn.style.color = 'black'; // החזרת הצבע המקורי לאחר 2.5 שניות
    }, 2500);
}
function error() {
    var errorsound = new Audio('errorsound2.mp3')
    errorsound.play()
    error1.style.visibility = 'visible';
    error1.style.opacity = '1';
    setTimeout(function () {
        error1.style.opacity = '0'; // החזרת הצבע המקורי לאחר 2.5 שניות
    }, 1000);
}
function noValidMoves() {
    var errorsound = new Audio('errorsound2.mp3')
    error1.innerHTML = "<strong>No valid moves</strong>";
    errorsound.play()
    error1.style.visibility = 'visible';
    error1.style.opacity = '1';
    setTimeout(function () {
        error1.style.opacity = '0'; // החזרת הצבע המקורי לאחר 2.5 שניות
    }, 1000);
    setTimeout(function () {
        error1.innerHTML = "<strong>error!</strong>";
    }, 1300);
}
// פונקציה שמעבירה את התור ומנקה מצב
function finishTurn() {
    if (isOnlineGame) {
        // נבדק האם אני זה שסיים עכשיו את התור, כדי שלא יהיה לופ אינסופי
        const isMyTurn = (myColor === 'white' && playerturn % 2 === 0) || (myColor === 'black' && playerturn % 2 !== 0);
        if (isMyTurn && ws.readyState === 1) { // 1 אומר שהחיבור פתוח
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
        // השהיה קלה של חצי שנייה כדי שהתנועה תיראה טבעית
        setTimeout(playComputerTurn, 600);
    }
}

// מופעלת בלחיצה על הכפתור "סיים תור" שהוספת ב-HTML
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
    // עובר שורה-שורה
    for (let i = 0; i < boardArr.length; i++) {
        let newRow = [];
        // עובר תא-תא בכל שורה ומעתיק את הערך
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

    // מחיקת כלי שנאכל
    if (move.type === 'eat') {
        newBoard[move.eatRow][move.eatCol] = 1;
    }

    // בדיקת הכתרה
    if (piece === 2 && move.toRow === 0) piece = 4;
    else if (piece === 3 && move.toRow === 7) piece = 5;

    // הצבה ישירה וריקון המשבצת הקודמת (בלי temp)
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
        // תור השחור (המחשב) - מקסום הציון
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
        // תור הלבן - מזעור הציון
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