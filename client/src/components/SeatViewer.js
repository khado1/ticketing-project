import React from "react";
import cn from "classnames";
import styles from "./SeatViewer.module.css";

const SeatViewer = ({ seats, ticketId }) => {
  return (
    <div className={styles.container}>
      {seats.map((row, i) => {
        return (
          <div key={i} className={styles.row}>
            {row.map((seatStatus, j) => (
              <div
                key={`${i}-${j}`}
                className={cn(styles.seat, {
                  [styles.selected]: seatStatus === ticketId,
                  [styles.taken]: seatStatus && seatStatus !== ticketId,
                })}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default SeatViewer;
