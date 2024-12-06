function GameBoard () {
    const gridSize = 3;
    const board = [];

    for (let i = 0; i < gridSize; i++) {
        board[i] = [];
        for (let j = 0; j < gridSize; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const clearBoard = () => {
        board.forEach (row => {
            row.forEach((cell) => {
                cell.resetValue();
            })
        })
    }

    const chooseCell = (row, column, player) => {
            board[row][column].stamp(player);
    }

    return {chooseCell, getBoard, clearBoard}
} 

function Cell () {
    let value = 0;

    const stamp = (player) => {
        value = player;
    }

    const getValue = () => value;
    const resetValue = () => value = 0;

    return {getValue, stamp, resetValue};
}

function GameController (
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = GameBoard();
    let rowSum = [0, 0, 0];
    let colSum = [0, 0, 0];
    let diagSum = 0;
    let revDiagSum = 0;
    let turnCount = 1;
    let result;

    const players = [
        {
            name: playerOneName,
            mark: 1,
            score: 0
        },
        {
            name: playerTwoName,
            mark: -1,
            score: 0
        }
    ]

    let activePlayer = players[0];
    let winner = null;

    const resetGame = () => {
        board.clearBoard();
        turnCount = 1;
        rowSum = [0, 0, 0];
        colSum = [0, 0, 0];
        diagSum = 0;
        revDiagSum = 0;
        activePlayer = players[0];
        winner = null;
        result = "";
    }

    const changeTurns = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        turnCount++;
    };

    const getActivePlayer = () => activePlayer;

    const setResult = (text) => result = text;

    const getResult = () => result;

    const getPlayerScore = (index) => players[index].score;

    const checkWinner = (row, column) => {
        if (Math.abs(rowSum[row]) === 3 || Math.abs(colSum[column]) === 3 || Math.abs(diagSum) === 3 || Math.abs(revDiagSum) === 3) {
            winner = activePlayer;
            winner.score ++;
        }
        return getWinner();
    }

    const changeName = (name1, name2) => {
        players[0].name = name1;
        players[1].name = name2;
    }

    const getWinner = () => winner; 

    const playRound = (row, column) => {
        setResult (
            `${getActivePlayer().name} chose to stamp cell ${row}, ${column}`
        );

        if (row < 0 || column < 0 || row >= 3 || column >= 3) {
            setResult (`Row ${row} and column ${column} is not within the board!`);
            return;
        } else if (board.getBoard()[row][column].getValue() !== 0){
            setResult (`That space is already occupied`);
            return;
        } else if (activePlayer.mark !== -1 && activePlayer.mark !== 1){
            setResult (`Invalid Player`);
            return;
        } else if (getWinner()) {
            setResult (`The board is decided!`);
            return;
        } else {
            board.chooseCell(row, column, getActivePlayer().mark)

            rowSum[row] += getActivePlayer().mark;
            colSum[column] += getActivePlayer().mark;
            if (row === column) {
                diagSum += getActivePlayer().mark;
            }

            if (row == 2 - column) {
                revDiagSum += getActivePlayer().mark;
            }
            checkWinner(row, column);
            if (turnCount === 9 ){
                setResult(`The Game is TIED`);
            } else {
                changeTurns();
            }     
        }  
    }

    return {playRound, getActivePlayer, getWinner, getBoard: board.getBoard, changeName, resetGame, getPlayerScore, getResult};
}

function UIController () {
    const game = GameController();
    const PLAYER_TURN_DIV = document.querySelector(".turn");
    const BOARD_DIV = document.querySelector(".board");
    const RESET_BUTTON = document.querySelector(".reset");
    const CHANGE_NAME = document.querySelector(".change-name");
    const NAMES = document.querySelectorAll(".nameplate");
    const SCORES = document.querySelectorAll(".score");
    const RESULT = document.querySelector(".result");
    
    const setScore = (index) => SCORES[index].innerText = game.getPlayerScore(index);

    const getName = (index) => NAMES[index].innerText;

    const updateScreen = () => {
        BOARD_DIV.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        setScore(0);
        setScore(1);

        PLAYER_TURN_DIV.textContent = `${activePlayer.name}'s turn...`;
        RESULT.textContent = game.getResult();

        board.forEach(row => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.column = index;
                cellButton.dataset.row = board.indexOf(row);
                cellButton.textContent = cell.getValue();
                if (cell.getValue() === 1){
                    cellButton.textContent = 'X';
                } else if (cell.getValue() === -1) {
                    cellButton.textContent = 'O';
                } else {
                    cellButton.textContent = '';
                }
                if (game.getWinner()) {
                    PLAYER_TURN_DIV.textContent = `${game.getWinner().name} WINS!`;
                    cellButton.disabled = true;
                }
                BOARD_DIV.appendChild(cellButton);
            })
        })
    }

    function BoardEventHandler (e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn && !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    function ChangeNameEvent (e) {
        game.changeName(getName(0), getName(1));
        updateScreen();
    }

    function ResetGameEvent (e) {
        game.resetGame();
        updateScreen();
    }

    RESET_BUTTON.addEventListener("click", ResetGameEvent);
    BOARD_DIV.addEventListener("click", BoardEventHandler)
    CHANGE_NAME.addEventListener("click", ChangeNameEvent);
    
    game.changeName(getName(0), getName(1));
    updateScreen();
    return {updateScreen};
} 

UIController();
