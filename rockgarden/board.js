document.addEventListener("DOMContentLoaded", () => {
    console.log("Rock Garden script loaded!");

    const urlParams = new URLSearchParams(window.location.search);
    const gameMode = urlParams.get("mode");
    let isAIPlayer1 = (gameMode === "ai-p1");
    let isAIPlayer2 = (gameMode === "ai-p2");

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
        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        console.log(`Clicked on (${x}, ${y}) - Current state: ${board[x][y]}`);

        if (!isValidMove(x, y)) {
            console.log("Move not allowed!");
            return;
        }

        applyMove(x, y);
        switchTurn();
        renderBoard();

        if ((isAIPlayer1 && currentPlayer === 1) || (isAIPlayer2 && currentPlayer === 2)) {
            setTimeout(aiMove, 500);
        }
    }

    function isValidMove(x, y) {
        return !(
            board[x][y] === -5 ||
            (board[x][y] === -1 && currentPlayer === 2) ||
            (board[x][y] === -4 && currentPlayer === 1)
        );
    }

    function applyMove(x, y) {
        if (board[x][y] === 0 || board[x][y] === -1 || board[x][y] === -4) {
            board[x][y] = currentPlayer;
        } else if (board[x][y] === currentPlayer) {
            board[x][y] = currentPlayer === 1 ? -2 : -3;
            blockOpponentAdjacent(x, y, currentPlayer);
        }
    }

    function switchTurn() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;

        if (noMoreMoves()) endGame();
    }

    function aiMove() {
        let bestMove = getAIMove(board, currentPlayer);
        if (bestMove.row !== -1 && bestMove.col !== -1) {
            applyMove(bestMove.row, bestMove.col);
            switchTurn();
            renderBoard();
        }
    }

    function getAIMove(board, currentPlayer) {
        let bestMove = { row: -1, col: -1 };
        let maxValue = -Infinity;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] === 0) {
                    let value = evaluateMove(r, c, board, currentPlayer);
                    if (value > maxValue) {
                        maxValue = value;
                        bestMove = { row: r, col: c };
                    }
                }
            }
        }

        return bestMove;
    }

    function evaluateMove(r, c, board, player) {
        let score = 0;

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                let nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                    if (board[nr][nc] === player) score += 2;
                    if (board[nr][nc] === 3 - player) score -= 1;
                }
            }
        }

        return score;
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

    if (isAIPlayer1) {
        setTimeout(aiMove, 500);
    }
});
