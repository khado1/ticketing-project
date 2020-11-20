import React, { useEffect } from "react";
import { useState } from "react";
import api from "../api";
import { ArrowForward } from "@material-ui/icons";
import { format } from "date-fns";
import styles from "./MyTickets.module.css";
import TicketView from "./TicketView";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const getTickets = async () => {
      const { data: tickets } = await api.getTickets();

      setTickets(tickets);
      setLoading(false);
    };

    getTickets();
  }, []);

  const hasTickets = !!tickets.length;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>My tickets</h1>

        {loading && <p>Loading...</p>}

        {!loading && !hasTickets && <p>No tickets</p>}

        {!loading && hasTickets && (
          <div className={styles.list}>
            {tickets.map((ticket) => {
              const formatedDate = format(
                new Date(ticket.date),
                "dd MMMM HH:MM"
              );

              return (
                <div
                  className={styles.listRow}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className={styles.locations}>
                    <span>{ticket.from}</span>

                    <ArrowForward />

                    <span>{ticket.to}</span>
                  </div>

                  <div>
                    <span>{formatedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedTicket && (
          <TicketView
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MyTickets;
