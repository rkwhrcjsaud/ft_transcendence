interface BallProps {
    left: string;
    top: string;
  }
  
  const Ball = (props: BallProps) => {
    return (
      <div
        style={{
          position: "absolute",
          width: "1.5%",
          height: "2%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "black",
          borderRadius: "50%",
          left: props.left,
          top: props.top,
        }}
      />
    );
  };
  
  export default Ball;