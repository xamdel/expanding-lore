import { Character } from "../types";

interface SlotProps {
  character: Character
}

const Slot = ({ character }: SlotProps) => {
  const style = {
    position: "absolute",
    //   left: `${/*x-position*/}%`,
    //   top: `${/*y-position*/}%`,
  };

  return (
    <div className="slot" style={style}>
      {character && <Character {character} />}
    </div>
  );
};

export default Slot;