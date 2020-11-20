import React from "react";
import cn from "classnames";
import styles from "./SeatSelector.module.css";

const SeatSelector = ({ seats, selectedSeats, onToggleSeat }) => {
  const handleClick = (seatStatus, i, j) => {
    if (typeof seatStatus === "string") {
      return;
    }

    onToggleSeat(i, j);
  };

  return (
    <div className={styles.container}>
      {seats.map((row, i) => {
        return (
          <div key={i} className={styles.row}>
            {row.map((seatStatus, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => handleClick(seatStatus, i, j)}
                className={cn(styles.seat, {
                  [styles.selected]: selectedSeats.some(
                    ([row, seat]) => row === i && seat === j
                  ),
                  [styles.taken]: typeof seatStatus === "string",
                })}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default SeatSelector;
