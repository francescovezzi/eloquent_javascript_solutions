function Clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

class State {
  constructor(n_rows, n_cols) {
    this.n_cols = n_cols;
    this.n_rows = n_rows;
    this.node_state = Array.from({ length: n_rows }, () => new Array(n_cols));
  }
  Set(r, c, node) {
    this.node_state[r][c] = node;
  }
  Get(r, c) {
    return this.node_state[r][c];
  }
  GetStatus(r, c) {
    r = Clamp(r, 0, this.n_rows - 1);
    c = Clamp(c, 0, this.n_cols - 1);
    return this.node_state[r][c].checked;
  }
  SetStatus(r, c, new_state) {
    this.node_state[r][c].checked = new_state;
  }
  GetNeighbourStatus(r, c) {
    let neighbours = [];
    for (
      let i = Math.max(0, r - 1);
      i <= Math.min(this.n_rows - 1, r + 1);
      i++
    ) {
      for (
        let j = Math.max(0, c - 1);
        j <= Math.min(this.n_cols - 1, c + 1);
        j++
      ) {
        if (i !== r || j !== c) {
          neighbours.push(this.GetStatus(i, j));
        }
      }
    }
    return neighbours;
  }

  Update() {
    let new_status = Array.from(
      { length: this.n_rows },
      () => new Array(this.n_cols)
    );
    for (let i = 0; i < this.n_rows; i++) {
      for (let j = 0; j < this.n_cols; j++) {
        new_status[i][j] = this.ComputeCellState(
          this.GetStatus(i, j),
          this.GetNeighbourStatus(i, j)
        );
      }
    }
    this.UpdateFromState(new_status);
  }

  UpdateFromState(new_status) {
    for (let i = 0; i < this.n_rows; i++) {
      for (let j = 0; j < this.n_cols; j++) {
        this.SetStatus(i, j, new_status[i][j]);
      }
    }
  }

  ComputeCellState(current_state, neighbours) {
    if (current_state) {
      return this.WillLivingCellLive(neighbours);
    } else {
      return this.WillDiedCellLive(neighbours);
    }
  }

  ComputeAliveCount(neighbours) {
    return neighbours.filter(Boolean).length;
  }

  WillLivingCellLive(neighbours) {
    const alive_count = this.ComputeAliveCount(neighbours);
    return alive_count === 2 || alive_count === 3;
  }

  WillDiedCellLive(neighbours) {
    const alive_count = this.ComputeAliveCount(neighbours);
    return alive_count === 3;
  }
}

export { State };
