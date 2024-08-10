"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaParking } from "react-icons/fa"; // Import parking icon
import "./ParkingStatus.css"; // Import CSS styles

const numRows = 16;
const numCols = 14; // Updated to 14 columns
const slotCount = 72; // Total parking slots

const createInitialGrid = () => {
  const grid = Array.from({ length: numRows }, () => Array(numCols).fill(" "));
  let slotNumber = 1;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (
        slotNumber <= slotCount &&
        row >= 2 &&
        row < numRows - 2 &&
        (col % 4 === 2 || col % 4 === 3)
      ) {
        grid[row][col] = `P${slotNumber}`;
        slotNumber++;
      }
    }
  }
  return grid;
};

const initialGrid = createInitialGrid();

const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const heuristic = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const ParkingStatus = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);
  const [status, setStatus] = useState("");
  const canvasRef = useRef(null);

  const astarSearch = (start, end, grid) => {
    let openSet = [{ position: start, f: 0 }];
    let cameFrom = {};
    let gScore = { [`${start[0]},${start[1]}`]: 0 };
    let fScore = { [`${start[0]},${start[1]}`]: heuristic(start, end) };

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift().position;

      if (current[0] === end[0] && current[1] === end[1]) {
        let path = [];
        let temp = current;
        while (temp) {
          path.push(temp);
          temp = cameFrom[`${temp[0]},${temp[1]}`];
        }
        return path.reverse();
      }

      directions.forEach(([dx, dy]) => {
        const neighbor = [current[0] + dx, current[1] + dy];
        if (
          neighbor[0] >= 0 &&
          neighbor[0] < numRows &&
          neighbor[1] >= 0 &&
          neighbor[1] < numCols
        ) {
          if (
            (grid[neighbor[0]][neighbor[1]] !== "S" &&
              !grid[neighbor[0]][neighbor[1]].startsWith("P")) ||
            (neighbor[0] === end[0] && neighbor[1] === end[1])
          ) {
            const tentativeGScore = gScore[`${current[0]},${current[1]}`] + 1;
            if (
              tentativeGScore <
              (gScore[`${neighbor[0]},${neighbor[1]}`] || Infinity)
            ) {
              cameFrom[`${neighbor[0]},${neighbor[1]}`] = current;
              gScore[`${neighbor[0]},${neighbor[1]}`] = tentativeGScore;
              fScore[`${neighbor[0]},${neighbor[1]}`] =
                tentativeGScore + heuristic(neighbor, end);
              if (
                !openSet.some(
                  (node) =>
                    node.position[0] === neighbor[0] &&
                    node.position[1] === neighbor[1]
                )
              ) {
                openSet.push({
                  position: neighbor,
                  f: fScore[`${neighbor[0]},${neighbor[1]}`],
                });
              }
            }
          }
        }
      });
    }
    return [];
  };

  const handleCellClick = (row, col) => {
    const newGrid = grid.map((row) => row.slice());

    if (!start) {
      setStart([row, col]);
      setStatus("");
      newGrid[row][col] = "S";
    } else if (start && grid[row][col].startsWith("P")) {
      if (end) {
        // Clear previous end point
        newGrid[end[0]][end[1]] = `P${grid[end[0]][end[1]].slice(1)}`;
      }
      const newEnd = [row, col];
      setEnd(newEnd);
      setStatus("Calculating...");
      setPath([]); // Clear previous path

      // Update grid with new end point
      newGrid[row][col] = "E";

      const newPath = astarSearch(start, newEnd, newGrid);
      if (newPath.length > 0) {
        setPath(newPath);
        setStatus("");
      } else {
        setStatus("No path found");
      }
    }
    setGrid(newGrid);
  };

  const getCellClass = (row, col) => {
    if (grid[row][col] === "S") return "parking-start";
    if (grid[row][col] === "E") return "parking-end";
    if (grid[row][col].startsWith("P")) return "parking-spaces";
    if (path.some((p) => p[0] === row && p[1] === col)) return "parking-path";
    return "parking-pathway";
  };

  const drawPath = (path) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "blue";
    path.forEach(([row, col]) => {
      ctx.fillRect(col * 25, row * 25, 25, 25);
    });
  };

  useEffect(() => {
    if (path.length > 0) {
      drawPath(path);
    }
  }, [path]);

  return (
    <div className="p-4 max-w-4xl mx-auto" id="center">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex items-center p-4 bg-blue-500 text-white">
          <FaParking className="text-2xl mr-2" />
          <h1 className="text-xl font-bold">Parking Status</h1>
        </div>
        <div className="p-4">
          <p className="mb-4 text-gray-700">
            Click on a cell to set your start and destination points. The grid
            will calculate and display the optimal path to the selected parking
            spot.
          </p>
          <div id="center" className="parking-container flex flex-col md:flex-row">
            <div className="parking-grid grid grid-cols-14 gap-1">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`parking-cell border border-gray-300 ${
                      getCellClass(rowIndex, colIndex)
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="mt-4 md:mt-0 md:ml-4 border border-gray-300"
            ></canvas>
          </div>
          {status && (
            <div className="mt-4 text-red-500 text-center">{status}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingStatus;
