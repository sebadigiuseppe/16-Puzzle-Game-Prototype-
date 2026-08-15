import { Difficulty, TileState } from '../types';

export const GRID_SIZE = 4; // 4x4 for a 16-puzzle
export const TOTAL_TILES = GRID_SIZE * GRID_SIZE; // 16
export const BLANK_ID = 15; // 0..14 are image slices, 15 is blank

// Create the initial solved board state
export function createInitialBoard(): TileState[] {
  const tiles: TileState[] = [];
  for (let i = 0; i < TOTAL_TILES; i++) {
    tiles.push({
      id: i,
      originalPos: i,
      currentPos: i,
      isBlank: i === BLANK_ID,
    });
  }
  return tiles;
}

// Convert index (0..15) to row and col
export function getRowCol(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

// Convert row and col to index
export function getIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

// Check if a tile can move (directly adjacent to blank)
export function getDirectNeighbors(pos: number): number[] {
  const { row, col } = getRowCol(pos);
  const neighbors: number[] = [];

  if (row > 0) neighbors.push(getIndex(row - 1, col)); // Up
  if (row < GRID_SIZE - 1) neighbors.push(getIndex(row + 1, col)); // Down
  if (col > 0) neighbors.push(getIndex(row, col - 1)); // Left
  if (col < GRID_SIZE - 1) neighbors.push(getIndex(row, col + 1)); // Right

  return neighbors;
}

// Check if clicking a tile can slide towards blank (either adjacent or in same row/column)
export function getSlidePath(clickedPos: number, blankPos: number): number[] | null {
  if (clickedPos === blankPos) return null;

  const clicked = getRowCol(clickedPos);
  const blank = getRowCol(blankPos);

  // Same row
  if (clicked.row === blank.row) {
    const path: number[] = [];
    if (clicked.col < blank.col) {
      // Clicked is to the left of blank, move rightwards
      for (let c = blank.col - 1; c >= clicked.col; c--) {
        path.push(getIndex(clicked.row, c));
      }
    } else {
      // Clicked is to the right of blank, move leftwards
      for (let c = blank.col + 1; c <= clicked.col; c++) {
        path.push(getIndex(clicked.row, c));
      }
    }
    return path;
  }

  // Same col
  if (clicked.col === blank.col) {
    const path: number[] = [];
    if (clicked.row < blank.row) {
      // Clicked is above blank, move downwards
      for (let r = blank.row - 1; r >= clicked.row; r--) {
        path.push(getIndex(r, clicked.col));
      }
    } else {
      // Clicked is below blank, move upwards
      for (let r = blank.row + 1; r <= clicked.row; r++) {
        path.push(getIndex(r, clicked.col));
      }
    }
    return path;
  }

  return null;
}

// Check if puzzle is solved
export function isPuzzleSolved(tiles: TileState[]): boolean {
  for (const tile of tiles) {
    if (tile.currentPos !== tile.originalPos) {
      return false;
    }
  }
  return true;
}

// Shuffle difficulty moves
export const SHUFFLE_STEPS: Record<Difficulty, number> = {
  easy: 35,
  medium: 85,
  hard: 200,
  master: 320,
};

// Shuffle board using valid random walks from solved state to guarantee solvability
export function shuffleBoard(difficulty: Difficulty): TileState[] {
  let tiles = createInitialBoard();
  const steps = SHUFFLE_STEPS[difficulty];

  let currentBlankPos = BLANK_ID;
  let lastMovedPos = -1;

  for (let i = 0; i < steps; i++) {
    const neighbors = getDirectNeighbors(currentBlankPos).filter(p => p !== lastMovedPos);
    const chosenPos = neighbors.length > 0
      ? neighbors[Math.floor(Math.random() * neighbors.length)]
      : getDirectNeighbors(currentBlankPos)[0];

    // Swap tile at chosenPos with blankPos
    const blankTileIdx = tiles.findIndex(t => t.currentPos === currentBlankPos);
    const chosenTileIdx = tiles.findIndex(t => t.currentPos === chosenPos);

    tiles[blankTileIdx].currentPos = chosenPos;
    tiles[chosenTileIdx].currentPos = currentBlankPos;

    lastMovedPos = currentBlankPos;
    currentBlankPos = chosenPos;
  }

  // If accidentally ended up solved, make one more valid swap
  if (isPuzzleSolved(tiles)) {
    const neighbors = getDirectNeighbors(currentBlankPos);
    const chosenPos = neighbors[0];
    const blankTileIdx = tiles.findIndex(t => t.currentPos === currentBlankPos);
    const chosenTileIdx = tiles.findIndex(t => t.currentPos === chosenPos);

    tiles[blankTileIdx].currentPos = chosenPos;
    tiles[chosenTileIdx].currentPos = currentBlankPos;
  }

  return tiles;
}

// Format seconds into MM:SS.s
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds * 10) % 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
}

export function formatTimeCompact(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}
