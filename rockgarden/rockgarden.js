document.addEventListener("DOMContentLoaded", () => {
    console.log("Rock Garden script loaded!");

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

                // Player pieces
                if (board[x][y] === 1) {
                    square.classList.add("p1");
                } else if (board[x][y] === 2) {
                    square.classList.add("p2");
                }
                // Promotion markers
                else if (board[x][y] === -2) {
                    square.classList.add("p1");
                    drawCircle(square);
                } else if (board[x][y] === -3) {
                    square.classList.add("p2");
                    drawCircle(square);
                }
                // Blocking logic: Different colors for different players
                else if (board[x][y] === -1) {
                    square.classList.add("blocked-p1"); // Blocked by Player 1 (only Player 2 is blocked)
                } else if (board[x][y] === -4) {
                    square.classList.add("blocked-p2"); // Blocked by Player 2 (only Player 1 is blocked)
                } else if (board[x][y] === -5) {
                    square.classList.add("blocked-both"); // Blocked by both players
                }

                square.addEventListener("click", handleMove);
                gameBoard.appendChild(square);
            }
        }
    }

    function handleMove(event) {
        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        console.log(`Clicked on (${x}, ${y}) - Current state: ${board[x][y]}`);

        // Check if move is allowed
        if (
            board[x][y] === -5 || // Fully blocked by both players
            (board[x][y] === -1 && currentPlayer === 2) || // P2 can't move onto P1's block
            (board[x][y] === -4 && currentPlayer === 1) // P1 can't move onto P2's block
        ) {
            console.log("Move not allowed - blocked by opponent!");
            return;
        }

        // Normal placement of a piece
        if (board[x][y] === 0 || board[x][y] === -1 || board[x][y] === -4) {
            board[x][y] = currentPlayer;
            console.log(`Player ${currentPlayer} placed piece at (${x}, ${y})`);
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }
        // Promotion of an existing piece
        else if (board[x][y] === currentPlayer) {
            board[x][y] = currentPlayer === 1 ? -2 : -3;
            console.log(`Player ${currentPlayer} promoted piece at (${x}, ${y})`);
            blockOpponentAdjacent(x, y, currentPlayer);
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }
        // Invalid move
        else {
            console.log("Invalid move!");
            return;
        }

        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;

        if (noMoreMoves()) endGame();
        renderBoard();
    }

    function blockOpponentAdjacent(x, y, player) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let nx = x + dx;
                let ny = y + dy;

                if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                    // Block only the opponent
                    if (board[nx][ny] === 0) {
                        board[nx][ny] = player === 1 ? -1 : -4; // -1 blocks P2, -4 blocks P1
                    } else if (board[nx][ny] === -1 && player === 2) {
                        board[nx][ny] = -5; // Blocked by both players
                    } else if (board[nx][ny] === -4 && player === 1) {
                        board[nx][ny] = -5; // Blocked by both players
                    }
                }
            }
        }
    }

    function noMoreMoves() {
        return !board.flat().includes(0);
    }

    function endGame() {
        let p1Score = board.flat().filter(v => v === 1 || v === -2).length;
        let p2Score = board.flat().filter(v => v === 2 || v === -3).length;
        gameStatus.textContent = `Game Over! Player 1: ${p1Score}, Player 2: ${p2Score}`;
        console.log(`Game Over! Scores - P1: ${p1Score}, P2: ${p2Score}`);
    }

    function drawCircle(square) {
        const circle = document.createElement("div");
        circle.classList.add("promotion-circle");
        square.appendChild(circle);
    }

    renderBoard();
});
