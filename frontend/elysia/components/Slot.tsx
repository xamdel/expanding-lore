import { Character as CharacterType} from "../types";
import Character from "./Character";

interface SlotPosition {
  x: number;
  y: number;
}

interface SlotProps {
  slotPosition: SlotPosition;
  character: CharacterType | null;
}

const Slot = ({ slotPosition, character }: SlotProps) => {
  const { x, y } = slotPosition;

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${x}%`,
    top: `${y}%`,
  };

  return (
    <div className="slot" style={style}>
      {character && <Character character={character} />}
    </div>
  );
};

export default Slot;