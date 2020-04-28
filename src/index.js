import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component{
//   // 細かく区切られた四角のコンポーネント
//   render() {
//     return(
//       // onClickでクリック時に発火するアクションを追加
//       // 下記ではステートの'value'を変更する処理を追加
//       // 下記のコードではBoardコンポーネントからのprops=onClickの値を取得する
//       <button className='square' onClick={() => this.props.onClick()}>
//         {/* propsで上位のコンポーネントからデータを引き継ぐ */}
//         {/* stateでステート状態を取得しレンダリング */}
//         {this.props.value}
//       </button>
//     );
//   }
// }

// 上記のSquareクラスを関数型コンポーネントに変更
// 独自の状態を持たないコンポーネントには、関数型コンポーネント使用した方が便利
// 後々、ReduxやReact Hookなどを使用するようになったら、基本的には関数型コンポーネントを使用する
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // コンストラクター及び継承の書き方は下記。
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    }
  }

  // コンポーネント内で使用するコンポーネントは下記のように書ける
  // コンポーネント内で他のコンポーネントを使用するには、関数を宣言する
  // squareがクリックされるとonClickというpropsに値が入力される
  renderSquare(i) {
    return <Square
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)}
    />
  }

  // ↑内onClickの中にあるhandleClick(i)に関する処理
  handleClick(i) {
    // sliceは配列の一部をシャローコピーする
    // 既存の配列を直接変更するよりも、新しいコピーを取得して必要な変更を加える
    // → 不変性を得ることができるので、「タイムトラベル」機能なども実装可能に
    // 変更点の差異などもすぐに確認できるため、コンポーネントがいつ再生成を必要とするかわかる
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });
  }

  // render&returnはどんなコンポーネントでも必要
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className='status'>{status}</div>
        <div className='board-row'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className='board-row'>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className='board-row'>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className='game'>
        <div className='game-board'>
          <Board />
        </div>
        <div className='game-info'>
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
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
      return squares[a];
    }
  }
  return null;
}

// Reactファイルは上→下に処理が走るため、単一ファイルでは最後にレンダリングする
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);