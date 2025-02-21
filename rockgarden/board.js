document.addEventListener("DOMContentLoaded", () => {
    console.log("Rock Garden script loaded!");

    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get("mode"); // "local", "ai-p1", or "ai-p2"

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

                if (board[x][y] === 1) {
                    square.classList.add("p1");
                } else if (board[x][y] === 2) {
                    square.classList.add("p2");
                } else if (board[x][y] === -2) {
                    square.classList.add("p1");
                    drawCircle(square);
                } else if (board[x][y] === -3) {
                    square.classList.add("p2");
                    drawCircle(square);
                } else if (board[x][y] === -1) {
                    square.classList.add("blocked-p1");
                } else if (board[x][y] === -4) {
                    square.classList.add("blocked-p2");
                } else if (board[x][y] === -5) {
                    square.classList.add("blocked-both");
                }

                square.addEventListener("click", handleMove);
                gameBoard.appendChild(square);
            }
        }
    }

    function handleMove(event) {
        if ((gameMode === "ai-p1" && currentPlayer === 2) || (gameMode === "ai-p2" && currentPlayer === 1)) {
            return;
        }

        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        if (!isValidMove(x, y)) return;

        makeMove(x, y);
        if (noMoreMoves()) endGame();
        renderBoard();

        if (!noMoreMoves() && isAITurn()) {
            setTimeout(aiMove, 500);
        }
    }

    function isValidMove(x, y) {
        return (
            board[x][y] === 0 ||
            (board[x][y] === currentPlayer) ||
            (board[x][y] === -1 && currentPlayer === 1) ||
            (board[x][y] === -4 && currentPlayer === 2)
        );
    }

    function makeMove(x, y) {
        if (board[x][y] === currentPlayer) {
            board[x][y] = currentPlayer === 1 ? -2 : -3;
            blockOpponentAdjacent(x, y, currentPlayer);
        } else {
            board[x][y] = currentPlayer;
        }
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function blockOpponentAdjacent(x, y, player) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let nx = x + dx;
                let ny = y + dy;

                if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                    if (board[nx][ny] === 0) {
                        board[nx][ny] = player === 1 ? -1 : -4;
                    } else if (board[nx][ny] === -1 && player === 2) {
                        board[nx][ny] = -5;
                    } else if (board[nx][ny] === -4 && player === 1) {
                        board[nx][ny] = -5;
                    }
                }
            }
        }
    }

    function noMoreMoves() {
        return !board.flat().includes(0) && !board.flat().includes(-1) && !board.flat().includes(-4);
    }

    function endGame() {
        let p1Score = board.flat().filter(v => v === 1 || v === -2).length;
        let p2Score = board.flat().filter(v => v === 2 || v === -3).length;
        gameStatus.textContent = `Game Over! Player 1: ${p1Score}, Player 2: ${p2Score}`;
    }

    function drawCircle(square) {
        const circle = document.createElement("div");
        circle.classList.add("promotion-circle");
        square.appendChild(circle);
    }

    function isAITurn() {
        return (gameMode === "ai-p1" && currentPlayer === 2) || (gameMode === "ai-p2" && currentPlayer === 1);
    }

    function aiMove() {
        let bestMove = minimax(board, 2, true, currentPlayer).move;

        if (bestMove) {
            makeMove(bestMove.x, bestMove.y);
            renderBoard();
        }

        if (!noMoreMoves() && isAITurn()) {
            setTimeout(aiMove, 500);
        }
    }

    function minimax(board, depth, isMaximizing, player) {
        if (depth === 0 || noMoreMoves()) {
            return { score: evaluateBoard(board) };
        }

        let bestMove = null;
        let bestScore = isMaximizing ? -Infinity : Infinity;

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (!isValidMove(x, y)) continue;

                let temp = board[x][y];
                board[x][y] = player;
                let score = minimax(board, depth - 1, !isMaximizing, player === 1 ? 2 : 1).score;
                board[x][y] = temp;

                if (isMaximizing) {
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { x, y };
                    }
                } else {
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = { x, y };
                    }
                }
            }
        }

        return { score: bestScore, move: bestMove };
    }

    function evaluateBoard(board) {
        let p1Score = board.flat().filter(v => v === 1 || v === -2).length;
        let p2Score = board.flat().filter(v => v === 2 || v === -3).length;
        let blockScore = board.flat().filter(v => v === -1 || v === -4).length;

        return p2Score - p1Score + (blockScore * 0.5); // AI values blocking a little
    }

    renderBoard();
    if (isAITurn()) {
        setTimeout(aiMove, 500);
    }
});
