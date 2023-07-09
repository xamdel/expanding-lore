const Slot = ({ character }) => {
  const style = {
    position: "absolute",
    //   left: `${/*x-position*/}%`,
    //   top: `${/*y-position*/}%`,
  };

  return (
    <div className="slot" style={style}>
      {character && <Character {...character} />}
    </div>
  );
};

export default Slot;