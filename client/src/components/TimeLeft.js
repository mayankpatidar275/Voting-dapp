import React, { useState, useEffect, useCallback } from 'react';
import EllipsisAnimation from '../assets/Ellipsis.gif';

const TimeLeft = ({ startTime, votingDuration, loader }) => {
  const gifWidth = 60; // Set the desired width
  const gifHeight = 60; // Set the desired height

  const calculateTimeLeft = useCallback(() => {
    const difference = startTime * 1000 + votingDuration * 1000 - +new Date();
    if (difference <= 0) {
      return { timeUp: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const min = Math.floor((difference / (1000 * 60)) % 60);
    const sec = Math.floor((difference / 1000) % 60);

    return { days, hrs, min, sec };
  }, [startTime, votingDuration]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [newLoader, setNewLoader] = useState(loader);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft.timeUp) {
        setNewLoader(false); // Update loader after calculations complete
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [calculateTimeLeft]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        style={{
          width: '40vw', // Set to half of screen width
          height: '100px',
          // minWidth: '300px', // Set minimum width if needed
          display: 'flex',
          flexDirection: 'row', // Arrange elements horizontally
          alignItems: 'center', // Align elements vertically
          padding: '1rem', // Add padding as needed
        }}
      >
        <div> {/* Container for "Time left:" */}
          <h4 className="mt-3">Time left: </h4>
        </div>
        <div
          style={{
            flex: 1, // Take remaining space
            display: 'flex',
            justifyContent: 'center', // Center elements horizontally
            alignItems: 'center', // Center elements vertically
          }}
        > {/* Container for animation or time value */}
          {newLoader ? (
            <div className="mt-4 text-center" style={{ color: "#000000" }}>
              <img src={EllipsisAnimation} alt="Loading" width={gifWidth} height={gifHeight} />
            </div>
          ) : timeLeft.timeUp ? (
            <h2 className="text-danger" style={{ textAlign: 'right' }}>
              Time's up!
            </h2>
          ) : (
            Object.keys(timeLeft).map(interval => (
              <div key={interval}>
                <h4 className="ml-3 mt-3">
                  {timeLeft[interval]} {interval}
                </h4>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeLeft;
