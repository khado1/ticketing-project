import React from "react";
import SeatViewer from "./SeatViewer";
import { Close } from "@material-ui/icons";
import styles from "./TicketView.module.css";
import { IconButton } from "@material-ui/core";

const TicketView = ({ ticket, onClose }) => {
  const { tickets, seats, id } = ticket;

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <IconButton
          className={styles.closeButton}
          size="small"
          onClick={onClose}
        >
          <Close />
        </IconButton>

        <div className={styles.tickets}>
          <h4 className={styles.ticketsTitle}>Tickets</h4>
          <div className={styles.ticket}>Adults: {tickets.adults}</div>
          <div className={styles.ticket}>Children: {tickets.children}</div>
          <div className={styles.ticket}>Student: {tickets.students}</div>
        </div>

        <div className={styles.controllCode}>Controll code: {ticket.id}</div>

        <SeatViewer seats={seats} ticketId={id} />
      </div>
    </div>
  );
};

export default TicketView;
