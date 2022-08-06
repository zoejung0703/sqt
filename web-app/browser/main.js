import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;

const nextT_grid_columns = 4;
const nextT_grid_rows = 2;

const heldT_grid_columns = 4;
const heldT_grid_rows = 2;

let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

document.documentElement.style.setProperty("--nextT_grid-rows", nextT_grid_rows);
document.documentElement.style.setProperty("--nextT_grid-columns", nextT_grid_columns);

document.documentElement.style.setProperty("--heldT_grid-rows", nextT_grid_rows);
document.documentElement.style.setProperty("--heldT_grid-columns", nextT_grid_columns);


const grid = document.getElementById("grid");
const nextT_grid = document.getElementById("nextT_grid");
const heldT_grid = document.getElementById("heldT_grid");

const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const cells = range(grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const nextT_cells = range(nextT_grid_rows).map(function () {

    const nextT_row = document.createElement("div");
    nextT_row.className = `nextT_row`;
    nextT_row.id = `nextT_row`;


    const nextT_rows = range(nextT_grid_columns).map(function () {
        const nextT_cell = document.createElement("div");
        nextT_cell.className = `nextT_cell`;
        nextT_cell.id = `nextT_cell`;

        nextT_row.append(nextT_cell);

        return nextT_cell;
    });

    nextT_grid.append(nextT_row);
    return nextT_rows;
});

const heldT_cells = range(heldT_grid_rows).map(function () {

    const heldT_row = document.createElement("div");
    heldT_row.className = `heldT_row`;
    heldT_row.id = `heldT_row`;

    const heldT_rows = range(heldT_grid_columns).map(function () {
        const heldT_cell = document.createElement("div");
        heldT_cell.className = `heldT_cell`;
        heldT_cell.id = `heldT_cell`;

        heldT_row.append(heldT_cell);

        return heldT_cell;
    });

    heldT_grid.append(heldT_row);
    return heldT_rows;
});




const update_grid = function () {
    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );
    
};

const update_nextT_grid = function () {

    let next_tetromino = game.next_tetromino;
    let tetromino_grid = next_tetromino.grid;
    let nextT_cell_empty = document.getElementById("nextT_cell");

    nextT_cell_empty.className = "nextT_cell empty";

    tetromino_grid.forEach(function (row, row_index) {
        row.forEach(function (block, column_index) {
            const nextT_cell = nextT_cells[row_index][column_index];
            nextT_cell.className = `nextT_cell ${block}`;
        });
    });

};

const update_heldT_grid = function () {
    let held_tetromino = game.held_tetromino;
    let block_type = held_tetromino.block_type;
    console.log(block_type);

    let tetromino_grid = held_tetromino.grid;

    if (held_tetromino !== "") {
        let heldT_cell_empty = document.getElementById("heldT_cell");
        heldT_cell_empty.className = "heldT_cell empty";

        tetromino_grid.forEach(function (row, row_index) {
            row.forEach(function (block, column_index) {
                const heldT_cell = heldT_cells[row_index][column_index];
                heldT_cell.className = `heldT_cell ${block}`;
            });
        });
    }

};



// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    if (event.key === "c") {
        game = Tetris.hold(game);
    }
    update_grid();
    //update_nextT_grid();
};

const timer_function = function () {
    game = Tetris.next_turn(game);
    update_grid();
    update_nextT_grid();
    update_heldT_grid();
    setTimeout(timer_function, 500);
};

setTimeout(timer_function, 500);

update_grid();
//update_nextT_grid();