  interface ScoreBoardProps {
    leftScore: number;
    rightScore: number;
  }
  
  export const ScoreBoard = (props: ScoreBoardProps) => {
    return (
      <div style={{ 
        position: 'absolute', 
        top: '0px', 
        width: '100%', 
        display: 'flex',
        justifyContent: 'center',
        color: 'white', 
        fontSize: '4em',
        zIndex: '2' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '30%'
        }}>
          <div>{props.leftScore}</div>
          <div>{props.rightScore}</div>
      </div>
      </div>
    );
  };
  
  interface TimerProps {
    minutes: number;
    seconds: number;
  }
  
  export const Timer = (props: TimerProps) => {
    const formattedSeconds = `${props.seconds}`.padStart(2, '0');
    return (
      <div style={{ 
        position: 'absolute', 
        width: '99%', 
        textAlign: 'right',
        color: 'grey', 
        fontSize: '2em', 
        zIndex: '2' }}>
        {props.minutes} : {formattedSeconds}
      </div>
    );
  };