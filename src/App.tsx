import Board from "./components/Board";

export default function App() {
  return (
    <div className="grid w-fit grid-cols-2 gap-15">
      <Board />
      <div></div>
    </div>
  );
}
