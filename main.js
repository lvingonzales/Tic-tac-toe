function GameBoard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const chooseCell = (row, column, player) => {
        if (board[row][column].getValue() !== 0) return;

        board[row][column].stamp(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    const checkRows = () => {
        const checkSingleRow = (row) => {
            row.every((cell) => cell === row[0]); 
        }

        const winningRows = board.map((row) => checkSingleRow(row));

        console.log (winningRows);
    }

    return {printBoard, chooseCell, checkRows}
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

    const players = [
        {
            name: playerOneName,
            mark: 1
        },
        {
            name: playerTwoName,
            mark: 2
        }
    ]

    let activePlayer = players[0];

    const changeTurns = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    }

    const checkForWinner = () => {
        board.checkRows();
    }

    printNewRound();

    const playRound = (row, column) => {
        console.log (
            `${getActivePlayer().name} chose to stamp cell ${row}, ${column}`
        );
        board.chooseCell(row, column, getActivePlayer().mark)

        if (checkForWinner() === true) {
            console.log ( `${getActivePlayer().name} WINS!`);
        }
        changeTurns();
        printNewRound();
    }

    return {playRound, getActivePlayer};
}

const game = GameController();
