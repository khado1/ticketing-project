import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import styles from "./AvailableDepartures.module.css";
import api from "../api";
import SeatSelector from "./SeatSelector";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const AvailableDepartures = () => {
  const history = useHistory();

  const { from, to, date, adults, children, students } = getFromSearchParams([
    "from",
    "to",
    "date",
    "adults",
    "children",
    "students",
  ]);

  const [departures, setDepartures] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState(null);

  const numberOfSeats = Number(adults) + Number(children) + Number(students);
  const selectedEnoughtSeats = numberOfSeats === selectedSeats.length;

  const toggleSelectedSeat = (row, seat) => {
    const filteredSeats = selectedSeats.filter(
      ([r, s]) => r !== row || s !== seat
    );

    if (filteredSeats.length < selectedSeats.length) {
      return setSelectedSeats(filteredSeats);
    }

    if (selectedEnoughtSeats) {
      if (numberOfSeats === 1) {
        setSelectedSeats([[row, seat]]);
      }

      return;
    }

    setSelectedSeats((seats) => [...seats, [row, seat]]);
  };

  useEffect(() => {
    const getDepartures = async () => {
      const { data: departures } = await api.getDepartures({
        from,
        to,
        date,
        adults,
        children,
        students,
      });

      setDepartures(departures);
    };

    getDepartures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderTicket = async () => {
    await api.orderTicket({
      tickets: {
        adults: Number(adults),
        children: Number(children),
        students: Number(students),
      },
      seats: selectedSeats,
      departureId: selectedDeparture.id,
    });

    history.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {selectedDeparture ? "Select seats" : "Available departures"}
        </h1>

        {selectedDeparture && (
          <SeatSelector
            seats={selectedDeparture.seats}
            selectedSeats={selectedSeats}
            onToggleSeat={toggleSelectedSeat}
          />
        )}

        {!selectedDeparture && (
          <div className={styles.list}>
            {departures.map((departure) => (
              <Row
                key={departure.id}
                departure={departure}
                onSelect={() => setSelectedDeparture(departure)}
                tickets={{ adults, children, students }}
              />
            ))}
          </div>
        )}

        {selectedDeparture && (
          <Button
            disabled={!selectedEnoughtSeats}
            color="primary"
            variant="contained"
            onClick={orderTicket}
          >
            Order ticket
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvailableDepartures;

const Row = ({ departure, onSelect, tickets }) => {
  const formatedDate = format(departure.date, "dd LLLL HH:MM");

  return (
    <div className={styles.row} onClick={onSelect}>
      <span>{formatedDate}</span>

      <span>{getTotalPrice(tickets)}kr</span>
    </div>
  );
};

const getFromSearchParams = (keys) => {
  const searchParams = new URLSearchParams(window.location.search);

  return keys.reduce((acc, key) => {
    acc[key] = searchParams.get(key) || null;

    return acc;
  }, {});
};

const getTotalPrice = (tickets) => {
  const prices = {
    adults: Math.floor(150 + Math.random() * 150),
    children: Math.floor(50 + Math.random() * 50),
    students: Math.floor(60 + Math.random() * 60),
  };

  let totalPrice = 0;

  Object.entries(tickets).forEach(([key, count]) => {
    totalPrice += prices[key] * Number(count);
  });

  return totalPrice;
};
