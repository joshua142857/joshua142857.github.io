document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get("mode");
    let isAIPlayer1 = (gameMode === "ai-p1");
    let isAIPlayer2 = (gameMode === "ai-p2");

    let board = Array(8).fill(null).map(() => Array(8).fill(0));
    let currentPlayer = 1;

    const boardElement = document.getElementById("board");

    function createBoard() {
        boardElement.innerHTML = "";
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener("click", () => makeMove(r, c));
                boardElement.appendChild(cell);
            }
        }
    }

    function makeMove(row, col) {
        if (board[row][col] !== 0) return;
        board[row][col] = currentPlayer;
        updateBoard();
        currentPlayer = 3 - currentPlayer;

        if ((isAIPlayer1 && currentPlayer === 1) || (isAIPlayer2 && currentPlayer === 2)) {
            setTimeout(aiMove, 500);
        }
    }

    function aiMove() {
        let move = getMove(board, currentPlayer);
        if (move.row !== -1 && move.col !== -1) {
            makeMove(move.row, move.col);
        }
    }

    function updateBoard() {
        document.querySelectorAll(".cell").forEach(cell => {
            let r = parseInt(cell.dataset.row);
            let c = parseInt(cell.dataset.col);
            cell.classList.remove("player1", "player2");
            if (board[r][c] === 1) cell.classList.add("player1");
            if (board[r][c] === 2) cell.classList.add("player2");
        });
    }

    function getMove(board, currentPlayerOne) {
        const baseArray = Array(14).fill(null).map(() => Array(14).fill(0));

        for (let r = 3; r <= 10; r++) {
            for (let c = 3; c <= 10; c++) {
                baseArray[r][c] = (r === 3 || r === 10 || c === 3 || c === 10) ? 3 : 2;
            }
        }

        let bestMove = { row: -1, col: -1 };
        let maxValue = -Infinity;

        for (let r = 1; r <= 8; r++) {
            for (let c = 1; c <= 8; c++) {
                let targetValue = board[r][c];

                let skew = Array(7).fill(null).map(() => Array(7).fill(1));

                if (targetValue === 0) {
                    skew = [
                        [1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1.1, 1.1, 1.1, 1, 1],
                        [1, 1, 1.1, 1, 1.1, 1, 1],
                        [1, 1, 1.1, 1.1, 1.1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 1, 1, 1]
                    ];
                }

                for (let i = 0; i < 7; i++) {
                    for (let j = 0; j < 7; j++) {
                        let rowIdx = r - 1 + i;
                        let colIdx = c - 1 + j;
                        if (rowIdx < 14 && colIdx < 14) {
                            baseArray[rowIdx][colIdx] *= skew[i][j];
                        }
                    }
                }
            }
        }

        for (let r = 2; r < 12; r++) {
            for (let c = 2; c < 12; c++) {
                if (board[r][c] === 0 && baseArray[r][c] > maxValue) {
                    maxValue = baseArray[r][c];
                    bestMove = { row: r, col: c };
                }
            }
        }

        return bestMove;
    }

    createBoard();

    if (isAIPlayer1) {
        setTimeout(aiMove, 500);
    }
});
