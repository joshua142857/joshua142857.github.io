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
        if ((gameMode === "ai-p1" && currentPlayer === 1) || (gameMode === "ai-p2" && currentPlayer === 2)) {
            return; // Prevent human from playing AI's turn
        }

        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        if (!isValidMove(x, y, currentPlayer)) return;

        board[x][y] = currentPlayer;
        nextTurn();
        renderBoard();

        if (isAITurn()) {
            setTimeout(aiMove, 500);
        }
    }

    function isValidMove(x, y, player) {
        return (
            board[x][y] === 0 ||
            board[x][y] === player ||
            (board[x][y] === -1 && player === 1) ||
            (board[x][y] === -4 && player === 2)
        );
    }

    function nextTurn() {
        do {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        } while (!canPlayerMove(currentPlayer) && !gameOverCheck());

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
        let bestMove = null;
        let bestScore = -Infinity;

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (isValidMove(x, y, currentPlayer)) {
                    let score = evaluateMove(x, y, currentPlayer);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { x, y };
                    }
                }
            }
        }

        if (bestMove) {
            board[bestMove.x][bestMove.y] = currentPlayer;
            nextTurn();
            renderBoard();
        }

        if (!gameOverCheck() && isAITurn()) {
            setTimeout(aiMove, 500);
        }
    }

    function evaluateMove(x, y, player) {
        let score = 0;

        // Prioritize center squares
        score += 10 - (Math.abs(x - 3.5) + Math.abs(y - 3.5));

        // Give bonus for blocking opponent
        if (player === 1) {
            if (board[x][y] === -4 || board[x][y] === -5) score += 5;
        } else {
            if (board[x][y] === -1 || board[x][y] === -5) score += 5;
        }

        // Bonus for moves that allow future plays
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let nx = x + dx;
                let ny = y + dy;

                if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[nx][ny] === 0) {
                    score += 3;
                }
            }
        }

        return score;
    }

    renderBoard();
    if (isAITurn()) {
        setTimeout(aiMove, 500);
    }
});
