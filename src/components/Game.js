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
            playDisabled: false,
        };

    }

    resetGame(){
        this.setState({
            squares: Array(9).fill(null),
            xTurn: true,
            playDisabled: false
        })
    }

    switchGameMode(){
        this.setState({
            isLocalPlay: !this.state.isLocalPlay,
        });
        this.resetGame();
    }

    disablePlay() {
        this.setState({playDisabled: true});
    }

    enablePlay() {
        this.setState({playDisabled: false});
    }

    makeMove(moveLocation){
        let squares = this.state.squares.slice();
        squares[moveLocation] = (this.state.xTurn ? 'X' : 'O');
        this.setState({
            squares: squares,
            xTurn: !this.state.xTurn
        });
    }

    handleClick(i) {
        let squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i] || this.state.playDisabled) {
            return;
        }

        this.makeMove(i);
        if(!this.state.isLocalPlay) {
            this.disablePlay();
            setTimeout(() => {
                let move = minimaxMove(this.state.squares);
                this.makeMove(move);
                this.enablePlay();
            }, 400)
        }
    }

    render() {
        let playMode = this.state.isLocalPlay ? 'AI Mode' : 'Local Mode';

        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = (winner[0] === 'tie' ? 'It is a Tie!' :  'Winner: ' + winner[0]);
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
    if(squares.some((val) => {return val === null;})) {
        return null
    } else {
        return ['tie', null]
    }
}


function minimaxMove(squares) {
    if(calculateWinner(squares)){
        return
    }

    let maxScore = -Infinity;
    let move;
    let boardState = squares.slice();
    for (let i = 0; i < squares.length; i++) {
        if(boardState[i] === null){
            boardState[i] = 'O'; //make ai move
            let score = minimax(boardState, 0, false);
            boardState[i] = null; //undo the move made before minimax call
            if(score > maxScore){
                maxScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(boardState, depth, isMaximizing) {
    let scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    let winnerResult = calculateWinner(boardState);
    if(winnerResult !== null){
        return scores[winnerResult[0]];
    }

    if (isMaximizing){
        let maxScore = -Infinity;
        for (let i = 0; i < boardState.length; i++){
            if(boardState[i] === null){
                boardState[i] = 'O';
                let score = minimax(boardState, depth + 1, false);
                boardState[i] = null;
                maxScore = Math.max(score, maxScore);
            }
        }
        return maxScore;
    } else {
        let maxScore = Infinity;
        for (let i = 0; i < boardState.length; i++){
            if(boardState[i] === null){
                boardState[i] = 'X';
                let score = minimax(boardState, depth + 1, true);
                boardState[i] = null;
                maxScore = Math.min(score, maxScore);
            }
        }
        return maxScore;
    }
}

function randomMove(squares) {
    if(calculateWinner(squares)){
        return
    }

    let available = [];
    for (let i = 0; i < squares.length; i++) {
        if(squares[i] == null){
            available.push(i)
        }
    }
    return available[Math.floor(Math.random()*available.length)];
}

export default Game;