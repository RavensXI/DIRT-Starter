const misconceptions = {
    // Organized by main categories for easier filtering
    causes: [
        {
            term: "Militarism",
            misconception: "Means countries joining together for protection.",
            correction: "Militarism refers to building up armed forces aggressively."
        },
        {
            term: "Alliances",
            misconception: "Means countries competing to build bigger empires.",
            correction: "Alliances were agreements between countries promising mutual support in case of war."
        },
        {
            term: "Imperialism",
            misconception: "Means having the strongest army.",
            correction: "Refers to countries expanding their empires and colonies."
        },
        {
            term: "Nationalism",
            misconception: "Means forming large alliances.",
            correction: "Means strong pride and loyalty to one's own nation."
        },
        {
            term: "Assassination of Franz Ferdinand",
            misconception: "He was assassinated by Germans or Russians.",
            correction: "Assassinated by Gavrilo Princip of the Serbian group, the Black Hand."
        }
    ],
    
    trenchLife: [
        {
            term: "Trench Foot",
            misconception: "Mainly caused by poison gas.",
            correction: "Caused by prolonged wet, cold conditions."
        },
        {
            term: "Daily Life in Trenches",
            misconception: "Soldiers spent most time fighting.",
            correction: "Soldiers spent most time waiting or in boredom."
        },
        {
            term: "Trench Conditions",
            misconception: "Trenches were comfortable and safe.",
            correction: "Conditions were filthy, dangerous, muddy, and disease-ridden."
        },
        {
            term: "No-Man's-Land",
            misconception: "Was a safe zone for negotiation.",
            correction: "The dangerous area between opposing trenches."
        },
        {
            term: "Rats in Trenches",
            misconception: "Rats were harmless or just minor nuisances.",
            correction: "Rats spread disease, contaminated food, and caused significant distress."
        }
    ],

    warTechnology: [
        {
            term: "Machine Guns",
            misconception: "Machine guns were rarely used or ineffective.",
            correction: "Machine guns significantly contributed to trench warfare stalemate."
        },
        {
            term: "Artillery",
            misconception: "Artillery was ineffective because of trenches.",
            correction: "Artillery caused significant casualties and shaped battlefield strategies."
        },
        {
            term: "Gas Attacks",
            misconception: "Gas attacks were the leading cause of death in trenches.",
            correction: "Artillery and machine-gun fire caused more casualties."
        },
        {
            term: "Poison Gas Masks",
            misconception: "Gas masks always protected soldiers completely.",
            correction: "Early masks could fail or leak; exposure still occurred."
        },
        {
            term: "Impact of Tanks",
            misconception: "Tanks immediately won battles easily.",
            correction: "Early tanks were unreliable and slow, initially limited in impact."
        }
    ],

    battlesAndEvents: [
        {
            term: "Battle of the Somme",
            misconception: "Ended WW1 or was a major German victory.",
            correction: "Remembered for the high casualties, especially on the first day."
        },
        {
            term: "Battle of Passchendaele",
            misconception: "Quickly broke the trench stalemate.",
            correction: "Resulted in a costly, slow-moving battle with limited territorial gain."
        },
        {
            term: "Shell Shock",
            misconception: "Shell shock was just soldiers being scared.",
            correction: "Shell shock was a serious psychological condition caused by warfare trauma."
        },
        {
            term: "Role of Women",
            misconception: "Women were soldiers on the frontline trenches.",
            correction: "Women primarily served in support roles (nurses, factory workers, etc.)."
        },
        {
            term: "End of the War",
            misconception: "Germany surrendered after being invaded.",
            correction: "Germany agreed to an armistice due to exhaustion, unrest at home, and allies withdrawing."
        }
    ]
};

class TicTacToeGame {
    constructor() {
        this.currentPlayer = 'X';
        this.board = Array(9).fill(null);
        this.gameActive = true;
        this.currentMisconceptions = [];
        this.selectedCategory = 'all';
        
        // DOM elements
        this.boardElement = document.getElementById('gameBoard');
        this.playerDisplay = document.querySelector('.current-player');
        this.resetButton = document.getElementById('resetGame');
        this.correctionDisplay = document.getElementById('correctionDisplay');
        this.correctionText = document.getElementById('correctionText');
        this.switchPlayerButton = document.getElementById('switchPlayer');

        // Event listeners
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.switchPlayerButton.addEventListener('click', () => this.switchCurrentPlayer());

        // Add tracking for used misconceptions
        this.usedMisconceptions = new Set();

        // Add winning patterns with their line properties
        this.winPatterns = [
            { cells: [0, 1, 2] }, // Top row
            { cells: [3, 4, 5] }, // Middle row
            { cells: [6, 7, 8] }, // Bottom row
            { cells: [0, 3, 6] }, // Left column
            { cells: [1, 4, 7] }, // Middle column
            { cells: [2, 5, 8] }, // Right column
            { cells: [0, 4, 8] }, // Diagonal
            { cells: [2, 4, 6] }  // Diagonal
        ];

        // Initialize the game
        this.initializeGame();
    }

    initializeGame() {
        console.log('Initializing game...');
        console.log('Misconceptions:', misconceptions);
        console.log('Board element:', this.boardElement);
        
        // Clear the board
        this.boardElement.innerHTML = '';
        this.board = Array(9).fill(null);
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.updatePlayerDisplay();

        // Get misconceptions for the selected category
        this.currentMisconceptions = this.getMisconceptions();

        // Create the board cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;

            // Add misconception content
            const misconception = this.currentMisconceptions[i];
            const termDiv = document.createElement('div');
            termDiv.className = 'term';
            termDiv.textContent = misconception.term;

            const misconceptionDiv = document.createElement('div');
            misconceptionDiv.className = 'misconception';
            misconceptionDiv.textContent = misconception.misconception;

            cell.appendChild(termDiv);
            cell.appendChild(misconceptionDiv);

            cell.addEventListener('click', () => this.handleCellClick(i, misconception));
            this.boardElement.appendChild(cell);
        }
    }

    getMisconceptions() {
        // Get all misconceptions in a single array
        let allMisconceptions = [];
        Object.values(misconceptions).forEach(category => {
            allMisconceptions = allMisconceptions.concat(category);
        });

        // Filter out previously used misconceptions
        const availableMisconceptions = allMisconceptions.filter(m => !this.usedMisconceptions.has(m.term));

        // If we're running low on misconceptions, reset the used set
        if (availableMisconceptions.length < 9) {
            this.usedMisconceptions.clear();
            return this.shuffleArray(allMisconceptions).slice(0, 9);
        }

        // Get 9 random unused misconceptions
        const selectedMisconceptions = this.shuffleArray(availableMisconceptions).slice(0, 9);
        
        // Add these to the used set
        selectedMisconceptions.forEach(m => this.usedMisconceptions.add(m.term));

        return selectedMisconceptions;
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    handleCellClick(index, misconception) {
        const cell = this.boardElement.children[index];
        
        // Check if cell is already marked or game is not active
        if (this.board[index] || !this.gameActive) return;

        // Show correction
        this.correctionText.textContent = misconception.correction;
        this.correctionDisplay.style.display = 'block';

        // Clear existing content and add player mark
        cell.innerHTML = ''; // Clear the cell content
        this.board[index] = this.currentPlayer;
        const playerMark = document.createElement('div');
        playerMark.className = 'player-mark';
        playerMark.textContent = this.currentPlayer;
        playerMark.style.opacity = '1'; // Make X/O fully visible since there's no text behind it
        cell.appendChild(playerMark);
        cell.classList.add('marked');

        // Check for win or draw
        if (this.checkWin()) {
            this.showWinMessage(this.currentPlayer);
            this.gameActive = false;
            return;
        }

        if (this.checkDraw()) {
            alert("It's a draw!");
            this.gameActive = false;
            return;
        }

        // Switch player
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updatePlayerDisplay();
    }

    checkWin() {
        for (let pattern of this.winPatterns) {
            const [a, b, c] = pattern.cells;
            if (this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]) {
                this.drawWinningLine(pattern);
                return true;
            }
        }
        return false;
    }

    drawWinningLine(lineProps) {
        const cells = document.querySelectorAll('.cell');
        const line = document.createElement('div');
        line.className = 'winning-line';
        
        // Get the first and last cell of the winning line
        const startCell = cells[lineProps.cells[0]];
        const endCell = cells[lineProps.cells[2]];
        
        // Get the positions
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        const boardRect = this.boardElement.getBoundingClientRect();
        
        // Calculate line position and length
        const x1 = startRect.left + startRect.width / 2 - boardRect.left;
        const y1 = startRect.top + startRect.height / 2 - boardRect.top;
        const x2 = endRect.left + endRect.width / 2 - boardRect.left;
        const y2 = endRect.top + endRect.height / 2 - boardRect.top;
        
        // Calculate length and angle
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        // Position the line
        Object.assign(line.style, {
            position: 'absolute',
            left: `${x1}px`,
            top: `${y1}px`,
            width: `${length}px`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'left center'
        });
        
        this.boardElement.appendChild(line);
    }

    showWinMessage(winner) {
        this.correctionDisplay.style.display = 'block';
        this.correctionText.textContent = `Player ${winner} wins!`;
    }

    checkDraw() {
        return this.board.every(cell => cell !== null);
    }

    updatePlayerDisplay() {
        this.playerDisplay.textContent = `Current Player: ${this.currentPlayer}`;
    }

    resetGame() {
        this.initializeGame();
    }

    switchCurrentPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updatePlayerDisplay();
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToeGame();
}); 