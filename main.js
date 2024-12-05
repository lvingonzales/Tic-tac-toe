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

    const chooseCell = (row, column, player) => {
        validMove = false;
        if (row < 0 || column < 0 || row >= gridSize || column >= gridSize) {
            console.log (`Row ${row} and column ${column} is not within the board!`);

        } else if (board[row][column].getValue() !== 0){
            console.log (`That space is already occupied`);

        } else if (player !== -1 && player !== 1){
            console.log (`Invalid Player`);

        } else {
            board[row][column].stamp(player);
            validMove = true;
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return {printBoard, chooseCell, checkIfValid}
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
        if (rowSum[row] === Math.abs(3) || colSum[column] === Math.abs(3) || diagSum === Math.abs(3) || revDiagSum === Math.abs(3)) {
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

            board.chooseCell(row, column, getActivePlayer().mark)

            if (board.checkIfValid()){
                if (getWinner()) {
                    console.log (`The board is decided!`);
                    return;
                } 

                rowSum[row] += getActivePlayer().mark;
                colSum[column] += getActivePlayer().mark;

                if (row === column) {
                    diagSum += getActivePlayer().mark;
                }

                if (row === (3-1) - column) {
                    revDiagSum += getActivePlayer().mark;
                }

                checkWinner(row, column);
                changeTurns();
                printNewRound();
            }
            
    }

    return {playRound, getActivePlayer};
}

const game = GameController();
