document.addEventListener("DOMContentLoaded", () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(0));
    let currentPlayer = 1;

    const gameBoard = document.getElementById("gameBoard");
    const turnIndicator = document.getElementById("turnIndicator");
    const gameStatus = document.getElementById("gameStatus");

    function renderBoard() {
        gameBoard.innerHTML = "";
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const square = document.createElement("div");
                square.classList.add("square");
                square.dataset.x = x;
                square.dataset.y = y;

                if (board[x][y] === 1) square.classList.add("p1");
                if (board[x][y] === 2) square.classList.add("p2");
                if (board[x][y] === -1) square.classList.add("blocked");

                square.addEventListener("click", handleMove);
                gameBoard.appendChild(square);
            }
        }
    }

    function handleMove(event) {
        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        if (board[x][y] === 0) {
            board[x][y] = currentPlayer;
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
        } else if (board[x][y] === currentPlayer) {
            // Promote piece
            board[x][y] = -1;
            blockAdjacent(x, y);
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
        }

        if (noMoreMoves()) endGame();
        renderBoard();
    }

    function blockAdjacent(x, y) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (x + dx >= 0 && x + dx < 8 && y + dy >= 0 && y + dy < 8 && board[x + dx][y + dy] === 0) {
                    board[x + dx][y + dy] = -1;
                }
            }
        }
    }

    function noMoreMoves() {
        return !board.flat().includes(0);
    }

    function endGame() {
        let p1Score = board.flat().filter(v => v === 1).length;
        let p2Score = board.flat().filter(v => v === 2).length;
        gameStatus.textContent = `Game Over! Player 1: ${p1Score}, Player 2: ${p2Score}`;
    }

    renderBoard();
});
