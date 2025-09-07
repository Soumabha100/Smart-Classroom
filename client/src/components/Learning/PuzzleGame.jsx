import React, { useState, useEffect } from "react";

export default function Puzzle8({ onComplete }) {
  const [tiles, setTiles] = useState([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 1 min
  const [gameOver, setGameOver] = useState(false);
  const [bgColor, setBgColor] = useState("bg-indigo-100"); // default

  // 🎨 Random pastel colors
  const pastelColors = [
    "bg-indigo-200",
  "bg-purple-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-pink-200",
  "bg-yellow-200",
  "bg-rose-200",
  "bg-teal-200",
  ];

  // Initialize tiles + random color
  useEffect(() => {
    const initialTiles = [...Array(8).keys()].map((x) => x + 1).concat(0);
    shuffle(initialTiles);

    // Pick random pastel color
    const randomColor =
      pastelColors[Math.floor(Math.random() * pastelColors.length)];
    setBgColor(randomColor);
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      setMessage("❌ Time’s up! Puzzle Failed.");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const shuffle = (arr) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setMessage("");
    setTimeLeft(120);
    setGameOver(false);

    // change bg on shuffle too 🎨
    const randomColor =
      pastelColors[Math.floor(Math.random() * pastelColors.length)];
    setBgColor(randomColor);
  };

  const isSolved = (arr) => {
    for (let i = 0; i < 8; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[8] === 0;
  };

  const moveTile = (index) => {
    if (gameOver) return;

    const emptyIndex = tiles.indexOf(0);
    const validMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - 3, emptyIndex + 3];

    if (validMoves.includes(index)) {
      if (
        Math.floor(index / 3) !== Math.floor(emptyIndex / 3) &&
        (index === emptyIndex - 1 || index === emptyIndex + 1)
      )
        return;

      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);

      if (isSolved(newTiles)) {
        setMessage("🎉 Congratulations! Puzzle Solved!");
        setGameOver(true);
        if (onComplete) onComplete();
      }
    }
  };

  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-inner flex flex-col items-center`}>
      <h3 className="text-xl font-bold text-gray-800 mb-4">8 Puzzle Game (3x3)</h3>

      {/* Timer */}
      <div className="text-lg font-semibold text-gray-700 mb-2">
        ⏳ Time Left: {timeLeft}s
      </div>

      {/* Puzzle Grid */}
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            onClick={() => moveTile(idx)}
            disabled={gameOver}
            className={`w-16 h-16 font-bold text-lg rounded ${
              tile === 0
                ? "bg-gray-200"
                : gameOver
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            {tile !== 0 ? tile : ""}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() =>
            shuffle([...Array(8).keys()].map((x) => x + 1).concat(0))
          }
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
        >
          🔀 Shuffle & Restart
        </button>
      </div>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 font-semibold ${
            message.includes("Congratulations") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
