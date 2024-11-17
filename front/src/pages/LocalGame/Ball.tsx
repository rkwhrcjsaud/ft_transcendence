interface BallProps {
    left: string;
    top: string;
  }
  
  const Ball = (props: BallProps) => {
    return (
      <div
        style={{
          position: "absolute",
          width: "20px",
          height: "20px",
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