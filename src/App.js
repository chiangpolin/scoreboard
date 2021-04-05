import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      players: [
        { name: 'Player 1', id: 1, score: 0 },
        { name: 'Player 2', id: 2, score: 0 },
      ],
    };
  }

  count = 2;

  addPlayer = (name) => {
    this.setState((prevState) => ({
      players: prevState.players.concat({
        name: name,
        score: 0,
        id: (this.count += 1),
      }),
    }));
  };

  removePlayer = (id) => {
    this.setState((prevState) => ({
      players: prevState.players.filter((p) => p.id !== id),
    }));
  };

  changeScore = (index, delta) => {
    this.setState((prevState) => {
      const updatedPlayers = [...prevState.players];
      const updatedPlayer = { ...updatedPlayers[index] };

      updatedPlayer.score += delta;
      updatedPlayers[index] = updatedPlayer;

      return { players: updatedPlayers };
    });
  };

  getHighScore = () => {
    const scores = this.state.players.map((p) => p.score);
    const highScore = Math.max(...scores);
    if (highScore) {
      return highScore;
    } else {
      return null;
    }
  };

  render() {
    const highScore = this.getHighScore();

    return (
      <div className="scoreboard">
        <Header title="Scoreboard" players={this.state.players} />
        {/* Players list */}
        {this.state.players.map((player, index) => (
          <Player
            name={player.name}
            id={player.id}
            key={player.id.toString()}
            index={index}
            score={player.score}
            removePlayer={this.removePlayer}
            changeScore={this.changeScore}
            isHighScore={highScore === player.score}
          />
        ))}
        <AddPlayerForm addPlayer={this.addPlayer} />
      </div>
    );
  }
}

const Header = ({ players, title }) => {
  return (
    <header>
      <Stats players={players} />
      <h1>{title}</h1>
      <Timer />
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  players: PropTypes.arrayOf(PropTypes.object),
};

Header.defaultProps = {
  title: 'Scoreboard',
};

const Stats = ({ players }) => {
  const totalPlayers = players.length;
  const totalPoints = players.reduce((total, player) => {
    return total + player.score;
  }, 0);

  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Points:</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  );
};

Stats.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      score: PropTypes.number,
    })
  ),
};

class Timer extends Component {
  constructor() {
    super();
    this.state = {
      isRunning: false,
      previousTime: 0,
      elapsedTime: 0,
    };
  }

  componentDidMount() {
    this.intervals = setInterval(() => this.tick(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.intervals);
  }

  tick = () => {
    if (this.state.isRunning) {
      const now = Date.now();
      this.setState((prevState) => ({
        previousTime: now,
        elapsedTime: prevState.elapsedTime + (now - this.state.previousTime),
      }));
    }
  };

  handleRunning = () => {
    this.setState((prevState) => ({ isRunning: !prevState.isRunning }));
    if (!this.state.isRunning) {
      this.setState({ previousTime: Date.now() });
    }
  };

  handleReset = () => {
    this.setState({ elapsedTime: 0 });
  };

  render() {
    const seconds = Math.floor(this.state.elapsedTime / 1000);
    return (
      <div className="timer">
        <span className="seconds">{seconds}</span>
        <div className="timer-buttons">
          <button onClick={this.handleRunning}>
            {this.state.isRunning ? 'stop' : 'start'}
          </button>
          <button onClick={this.handleReset}>Reset</button>
        </div>
      </div>
    );
  }
}

class Player extends PureComponent {
  static propTypes = {
    changeScore: PropTypes.func,
    removePlayer: PropTypes.func,
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    id: PropTypes.number,
    index: PropTypes.number,
  };

  render() {
    const {
      name,
      id,
      score,
      index,
      removePlayer,
      changeScore,
      isHighScore,
    } = this.props;
    return (
      <div className="player">
        <span className="player-icon">
          <button className="remove-player" onClick={() => removePlayer(id)}>
            x
          </button>
          <Icon isHighScore={isHighScore} />
        </span>
        <p className="player-name">{name}</p>
        <Counter index={index} score={score} changeScore={changeScore} />
      </div>
    );
  }
}

const Counter = ({ index, score, changeScore }) => {
  return (
    <div className="counter">
      <button
        className="counter-action decrement"
        onClick={() => changeScore(index, -1)}
      >
        {' '}
        -{' '}
      </button>
      <span className="counter-score">{score}</span>
      <button
        className="counter-action increment"
        onClick={() => changeScore(index, +1)}
      >
        {' '}
        +{' '}
      </button>
    </div>
  );
};

Counter.propTypes = {
  index: PropTypes.number,
  score: PropTypes.number,
  changeScore: PropTypes.func,
};

const Icon = ({ isHighScore }) => {
  if (isHighScore) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-star-fill"
        viewBox="0 0 16 16"
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-star"
        viewBox="0 0 16 16"
      >
        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
      </svg>
    );
  }
};

Icon.propTypes = { isHighScore: PropTypes.bool };

class AddPlayerForm extends Component {
  constructor() {
    super();
    this.state = { value: '' };
  }

  handleValueChange = (evt) => {
    this.setState({ value: evt.target.value });
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    this.props.addPlayer(this.state.value);
    this.setState({ value: '' });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className="form-input"
          type="text"
          value={this.state.value}
          onChange={this.handleValueChange}
          placeholder="Enter a player's name"
        />
        <input className="form-submit" type="submit" value="Add Player" />
      </form>
    );
  }
}

export default App;
