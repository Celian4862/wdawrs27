import { tiles } from "../data/tiles";
import Tile from "./Tile";

export default function Board() {
    return tiles.map((tile, i) => (
        <Tile key={i} disabled={tile === null} />
      ))
}