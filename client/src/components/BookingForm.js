import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-US";
import styles from "./BookingForm.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { Button, IconButton, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { useEffect } from "react";
import api from "../api";
import { useHistory } from "react-router-dom";

registerLocale("en", en);

const INPUT_WIDTH = 250;

const BookingForm = () => {
  const history = useHistory();

  const [stations, setStations] = useState([]);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [tickets, setTickets] = useState({
    adults: 1,
    children: 0,
    students: 0,
  });

  const [errors, setErrors] = useState({
    fromLocation: "",
    toLocation: "",
    departureDate: "",
    tickets: "",
  });

  const travelFromStations = stations.filter(({ id }) => id !== toLocation?.id);
  const travelToStations = stations.filter(({ id }) => id !== fromLocation?.id);

  const incrementTicketCount = (key) => {
    setErrors({});

    setTickets((tickets) => {
      return {
        ...tickets,
        [key]: tickets[key] + 1,
      };
    });
  };

  const decrementTicketCount = (key) => {
    if (tickets[key] === 0) {
      return;
    }

    setErrors((errors) => ({ ...errors, tickets: null }));

    setTickets((tickets) => {
      return {
        ...tickets,
        [key]: tickets[key] - 1,
      };
    });
  };

  useEffect(() => {
    const getStations = async () => {
      const { data } = await api.getStations();

      setStations(data);
    };

    getStations();
  }, []);

  const onGetDepartures = () => {
    const numberOfTickets = Object.values(tickets).reduce(
      (acc, v) => acc + v,
      0
    );

    const hasErrors =
      !fromLocation || !toLocation || !departureDate || numberOfTickets < 1;

    if (hasErrors) {
      setErrors({
        fromLocation: fromLocation ? "" : "Please select location",
        toLocation: toLocation ? "" : "Please select location",
        departureDate: departureDate ? "" : "Please select a date",
        tickets: numberOfTickets > 0 ? "" : "You must select atleast 1 ticket",
      });

      return;
    }

    history.push({
      pathname: "/availableDepartures",
      search: new URLSearchParams({
        from: fromLocation.id,
        to: toLocation.id,
        date: departureDate,
        ...tickets,
      }).toString(),
    });
  };

  const handleChangeFromLocation = (_e, location) => {
    setFromLocation(location);
    setErrors((errors) => ({ ...errors, fromLocation: null }));
  };

  const handleChangeToLocation = (_e, location) => {
    setToLocation(location);
    setErrors((errors) => ({ ...errors, toLocation: null }));
  };

  const handleChangeDepartureDate = (date) => {
    setDepartureDate(date);
    setErrors((errors) => ({ ...errors, departureDate: null }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Order ticket</h1>

        <div className={styles.locationContainer}>
          <Autocomplete
            options={travelFromStations}
            getOptionLabel={(option) => option.name}
            style={{ width: INPUT_WIDTH }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Travel from"
                variant="outlined"
                error={!!errors.fromLocation}
                helperText={errors.fromLocation}
              />
            )}
            onChange={handleChangeFromLocation}
            value={fromLocation}
          />

          <Autocomplete
            options={travelToStations}
            getOptionLabel={(option) => option.name}
            style={{ width: INPUT_WIDTH }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Travel to"
                variant="outlined"
                error={!!errors.toLocation}
                helperText={errors.toLocation}
              />
            )}
            onChange={handleChangeToLocation}
            value={toLocation}
          />
        </div>

        <div>
          <DatePicker
            selected={departureDate}
            onChange={handleChangeDepartureDate}
            showTimeSelect
            locale="en"
            dateFormat="dd.MM.yyyy HH:mm"
            timeIntervals={60}
            timeFormat="HH:mm"
            customInput={
              <TextField
                label="Date and time"
                variant="outlined"
                style={{ width: INPUT_WIDTH }}
                error={!!errors.departureDate}
                helperText={errors.departureDate}
              />
            }
            minDate={new Date()}
          />
        </div>

        <div className={styles.ticketCountInputs}>
          <TicketCountInput
            valueKey="adults"
            onIncrement={() => incrementTicketCount("adults")}
            onDecrement={() => decrementTicketCount("adults")}
            value={tickets.adults}
          />

          <TicketCountInput
            valueKey="children"
            onIncrement={() => incrementTicketCount("children")}
            onDecrement={() => decrementTicketCount("children")}
            value={tickets.children}
          />

          <TicketCountInput
            valueKey="students"
            onIncrement={() => incrementTicketCount("students")}
            onDecrement={() => decrementTicketCount("students")}
            value={tickets.students}
          />

          {errors.tickets && (
            <p className={styles.error}>Please select atleast one ticket</p>
          )}
        </div>

        <Button onClick={onGetDepartures} variant="contained" color="primary">
          Get departures
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;

const TicketCountInput = ({ valueKey, onIncrement, onDecrement, value }) => {
  const disableDecrement = value === 0;

  return (
    <div className={styles.ticketCountInput}>
      <IconButton
        disabled={disableDecrement}
        onClick={onDecrement}
        size="small"
        color={disableDecrement ? "default" : "primary"}
      >
        <RemoveCircle fontSize="large" />
      </IconButton>

      <span className={styles.ticketCount}>{value}</span>

      <IconButton onClick={onIncrement} color="primary" size="small">
        <AddCircle fontSize="large" />
      </IconButton>

      <span>{valueKey}</span>
    </div>
  );
};
