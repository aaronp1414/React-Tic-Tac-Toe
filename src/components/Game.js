import React from "react";
import Board from "./Board";
import Button from "@material-ui/core/Button";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.boardElement = React.createRef();
        this.state = {
            isLocalPlay: true,
            squares: Array(9).fill(null),
            xTurn: true,
        };

    }

    resetGame(){
        this.setState({
            squares: Array(9).fill(null),
            xTurn: true,
        })
    }

    switchGameMode(){
        this.setState({
            isLocalPlay: !this.state.isLocalPlay,
        });
        this.resetGame();
    }

    handleClick(i) {
        let squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = (this.state.xTurn ? 'X' : 'O');
        this.setState({
            squares: squares,
            xTurn: !this.state.xTurn
        });
    }

    render() {
        let playMode = this.state.isLocalPlay ? 'AI Mode' : 'Local Mode';

        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner[0];
        } else {
            status = 'Next player: ' + (this.state.xTurn ? 'X' : 'O') +
                (this.state.isLocalPlay ? '' : (this.state.xTurn ? ' (You)' : ' (AI)'));
        }

        return (
            <div className="game">
                <div className="status">{status}</div>
                <div className="game-board">
                    <Board ref={this.boardElement}
                           squares={this.state.squares}
                           winningSquares={winner ? winner[1] : null }
                           handleClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="button">
                    <Button variant="contained" color="primary"
                            onClick={() => this.switchGameMode()}>Switch to {playMode}</Button>
                </div>
                <div className="button">
                    <Button variant="contained" color="secondary" onClick={() => this.resetGame()}>Reset</Button>
                </div>
            </div>
        )
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return null;
}

export default Game;