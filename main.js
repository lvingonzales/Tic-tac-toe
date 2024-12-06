function GameBoard () {
    const gridSize = 3;
    const board = [];

    let validMove = false;
    const checkIfValid = () => validMove;

    for (let i = 0; i < gridSize; i++) {
        board[i] = [];
        for (let j = 0; j < gridSize; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const chooseCell = (row, column, player) => {
        validMove = false;
            board[row][column].stamp(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return {printBoard, chooseCell, checkIfValid, getBoard}
} 

function Cell () {
    let value = 0;

    const stamp = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {getValue, stamp};
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

    const players = [
        {
            name: playerOneName,
            mark: 1
        },
        {
            name: playerTwoName,
            mark: -1
        }
    ]

    let activePlayer = players[0];
    let winner = null;

    const changeTurns = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    }

    const checkWinner = (row, column) => {
        if (Math.abs(rowSum[row]) === 3 || Math.abs(colSum[column]) === 3 || Math.abs(diagSum) === 3 || Math.abs(revDiagSum) === 3) {
            winner = activePlayer;
        }
        return getWinner();
    }

    const getWinner = () => winner; 

    printNewRound();

    const playRound = (row, column) => {
            console.log (
                `${getActivePlayer().name} chose to stamp cell ${row}, ${column}`
            );

        if (row < 0 || column < 0 || row >= 3 || column >= 3) {
            console.log (`Row ${row} and column ${column} is not within the board!`);
            return;
        } else if (board.getBoard()[row][column].getValue() !== 0){
            console.log (`That space is already occupied`);
            return;
        } else if (activePlayer.mark !== -1 && activePlayer.mark !== 1){
            console.log (`Invalid Player`);
            return;
        } else if (getWinner()) {
            console.log (`The board is decided!`);
            return;
        } else {
            board.chooseCell(row, column, getActivePlayer().mark)

            rowSum[row] += getActivePlayer().mark;
            colSum[column] += getActivePlayer().mark;
            if (row === column) {
                diagSum += getActivePlayer().mark;
            }

            if (row === 2 - column) {
                revDiagSum += getActivePlayer().mark;
            }
            checkWinner(row, column);
            changeTurns();
            printNewRound();    
        }  
    }

    return {playRound, getActivePlayer, getWinner, getBoard: board.getBoard};
}

function UIController () {
    const game = GameController();
    const PLAYER_TURN_DIV = document.querySelector(".turn");
    const BOARD_DIV = document.querySelector(".board");

    const updateScreen = () => {
        BOARD_DIV.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        PLAYER_TURN_DIV.textContent = `${activePlayer.name}'s turn...`;

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
    BOARD_DIV.addEventListener("click", BoardEventHandler)

    updateScreen();
}

UIController();
