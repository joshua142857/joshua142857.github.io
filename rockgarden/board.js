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
            return; // Prevent human from playing AI's turn
        }

        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        if (!isValidMove(x, y, currentPlayer)) return;

        board[x][y] = currentPlayer;
        if (canPromote(x, y, currentPlayer)) {
            board[x][y] = currentPlayer === 1 ? -2 : -3; // Promote the piece
        }

        nextTurn();
        renderBoard();

        if (!gameOverCheck() && isAITurn()) {
            setTimeout(aiMove, 500);
        }
    }

    function isValidMove(x, y, player) {
        return (
            board[x][y] === 0 ||
            (board[x][y] === -1 && player === 1) ||
            (board[x][y] === -4 && player === 2) ||
            (player === 1 && board[x][y] === -2) ||
            (player === 2 && board[x][y] === -3)
        );
    }

    function canPromote(x, y, player) {
        return (player === 1 && y === 7) || (player === 2 && y === 0);
    }

    function nextTurn() {
        let previousPlayer = currentPlayer;
        do {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            if (gameOverCheck()) return;
        } while (!canPlayerMove(currentPlayer) && currentPlayer !== previousPlayer);

        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function canPlayerMove(player) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (isValidMove(x, y, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    function gameOverCheck() {
        if (!canPlayerMove(1) && !canPlayerMove(2)) {
            endGame();
            return true;
        }
        return false;
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

    function isAITurn() {
        return (gameMode === "ai-p1" && currentPlayer === 2) || (gameMode === "ai-p2" && currentPlayer === 1);
    }

    function aiMove() {
        let bestMove = minimax(board, 2, true).move;

        if (bestMove) {
            board[bestMove.x][bestMove.y] = currentPlayer;
            if (canPromote(bestMove.x, bestMove.y, currentPlayer)) {
                board[bestMove.x][bestMove.y] = currentPlayer === 1 ? -2 : -3;
            }
            nextTurn();
            renderBoard();
        }

        if (!gameOverCheck() && isAITurn()) {
            setTimeout(aiMove, 500);
        }
    }

    function minimax(board, depth, isMaximizing) {
        if (depth === 0 || gameOverCheck()) {
            return { score: evaluateBoard(board) };
        }

        let bestMove = null;
        let bestScore = isMaximizing ? -Infinity : Infinity;

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (isValidMove(x, y, currentPlayer)) {
                    let temp = board[x][y];
                    board[x][y] = currentPlayer;
                    let score = minimax(board, depth - 1, !isMaximizing).score;
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
        }

        return { score: bestScore, move: bestMove };
    }

    function evaluateBoard(board) {
        let p1Score = board.flat().filter(v => v === 1 || v === -2).length;
        let p2Score = board.flat().filter(v => v === 2 || v === -3).length;
        return p1Score - p2Score; // AI prefers higher scores
    }

    renderBoard();
    if (isAITurn()) {
        setTimeout(aiMove, 500);
    }
});
