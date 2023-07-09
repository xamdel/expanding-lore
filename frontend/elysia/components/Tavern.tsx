import useFetchCharacters from "../hooks/useFetchCharacter";
import Slot from "./Slot";

const Tavern = () => {
    const { characters } = useFetchCharacters();
  
    // Create predefined positions for characters to occupy
    const slots = [
      { slotPosition: { x: 10, y: 20 }, character: characters[0] },
      { slotPosition: { x: 20, y: 30 }, character: characters[1] },
    ];
  
    return (
      <div className="tavern">
        {slots.map((slot, index) => (
          <Slot key={index} {...slot} />
        ))}
      </div>
    );
  };