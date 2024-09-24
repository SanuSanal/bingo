import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [grid, setGrid] = useState(Array(5).fill().map(() => Array(5).fill(null))); // Initialize the grid as 5x5 empty
  const [currentNumber, setCurrentNumber] = useState(1); // For manual input
  const [markedGrid, setMarkedGrid] = useState(Array(5).fill().map(() => Array(5).fill(false))); // Track marked cells
  const [bingoState, setBingoState] = useState([false, false, false, false, false]); // Tracks marked BINGO letters
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(false);

  // Randomly fill grid
  const randomFill = () => {
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    const shuffled = numbers.sort(() => Math.random() - 0.5);
    const newGrid = [];
    for (let i = 0; i < 5; i++) {
      newGrid.push(shuffled.slice(i * 5, i * 5 + 5));
    }
    setGrid(newGrid);
  };

  // Handle manual cell entry before the game starts
  const handleCellClick = (rowIndex, colIndex) => {
    if (!gameStarted && currentNumber <= 25) {
      if (grid[rowIndex][colIndex] == null) {
        const newGrid = grid.map((row, i) =>
          row.map((cell, j) => (i === rowIndex && j === colIndex ? currentNumber : cell))
        );
        setGrid(newGrid);
        setCurrentNumber(currentNumber + 1);
      }
    } else if (gameStarted && grid[rowIndex][colIndex]) {
      markCell(rowIndex, colIndex);
    }
  };

  // Mark a cell when the number is called
  const markCell = (rowIndex, colIndex) => {
    const newMarkedGrid = markedGrid.map((row, i) =>
      row.map((cell, j) => (i === rowIndex && j === colIndex ? true : cell))
    );
    setMarkedGrid(newMarkedGrid);
    checkBingo(newMarkedGrid);
  };

  // Check for bingo (rows, columns, diagonals)
  const checkBingo = (newMarkedGrid) => {
    const isComplete = (arr) => arr.every(Boolean);
    let completedRows = 0;

    // Check rows
    for (let row of newMarkedGrid) {
      if (isComplete(row)) completedRows++;
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      if (isComplete(newMarkedGrid.map((row) => row[col]))) completedRows++;
    }

    // Check diagonals
    const leftDiagonal = newMarkedGrid.map((row, i) => row[i]);
    const rightDiagonal = newMarkedGrid.map((row, i) => row[4 - i]);
    if (isComplete(leftDiagonal)) completedRows++;
    if (isComplete(rightDiagonal)) completedRows++;

    markBingoLetters(completedRows);
  };

  // Mark BINGO letters based on completed rows/columns/diagonals
  const markBingoLetters = (completedRows) => {
    const newBingoState = [...bingoState];
    for (let i = 0; i < completedRows && i < 5; i++) {
      newBingoState[i] = true;
    }
    setBingoState(newBingoState);

    // Declare winner if all BINGO letters are marked
    if (newBingoState.every(Boolean)) {
      setWinner(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    setGrid(Array(5).fill().map(() => Array(5).fill(null)));
    setMarkedGrid(Array(5).fill().map(() => Array(5).fill(false)));
    setBingoState([false, false, false, false, false]);
    setCurrentNumber(1);
    setGameStarted(false);
    setWinner(false);
  };

  return (
    <div className="app">
      <header className="header">Bingo Game</header>
      <div className="controls">
        {!gameStarted && (
          <>
            <button className="button" onClick={randomFill}>Random Fill</button>
            <button className="button" onClick={startGame}>Start Game</button>
          </>
        )}
        {gameStarted && <button className="button" onClick={restartGame}>Restart Game</button>}
      </div>

      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${markedGrid[rowIndex][colIndex] ? 'marked' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bingo-letters">
        {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
          <div
            key={index}
            className={`bingo-letter ${bingoState[index] ? `marked-${letter}` : ''}`}
          >
            {letter}
          </div>
        ))}
      </div>

      {winner && (
        <div className="winner-popup">
          <h2>🎉 Bingo! You Win! 🎉</h2>
        </div>
      )}
    </div>
  );
};

export default App;
