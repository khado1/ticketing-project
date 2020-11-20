const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const { cloneDeep } = require("lodash");

const stations = [
  { name: "Oslo", id: 1 },
  { name: "Sandnes", id: 2 },
  { name: "Stavanger", id: 3 },
  { name: "Bergen", id: 4 },
  { name: "Trondheim", id: 5 },
];

const HOURS_PER_DAY = 24;
const DAYS = 10;

const generateDepartureDates = () => {
  const departureDates = [];

  const baseDate = new Date();
  const baseHours = baseDate.getHours();

  for (let days = 0; days <= DAYS; days++) {
    for (let hours = 1; hours <= HOURS_PER_DAY; hours++) {
      const hoursOffset = days * HOURS_PER_DAY + hours;

      const departureDate = new Date(baseDate);
      departureDate.setHours(baseHours + hoursOffset, 0, 0, 0);

      departureDates.push(departureDate.getTime());
    }
  }

  return departureDates;
};

const ROWS = 4;
const SEATS_PER_ROW = 4;

const generateSeats = () => {
  return Array.from({ length: ROWS }).fill(
    Array.from({ length: SEATS_PER_ROW }).fill(null)
  );
};

const generateDepartures = () => {
  const departures = [];
  const departureDates = generateDepartureDates();

  for (let i = 0; i < stations.length; i++) {
    for (let j = 0; j < stations.length; j++) {
      if (j === i) {
        continue;
      }

      departureDates.forEach((date) => {
        const departure = {
          id: uuid(),
          from: stations[i].id,
          to: stations[j].id,
          availableTickets: ROWS * SEATS_PER_ROW,
          seats: generateSeats(),
          date,
        };

        departures.push(departure);
      });
    }
  }

  return departures;
};

const populateDatabase = (db) => {
  db.defaults({
    users: [],
    stations,
    departures: generateDepartures(),
    tickets: [],
  }).write();
};

const initializeDatabase = () => {
  const adapter = new FileSync("db.json");
  const db = lowdb(adapter);

  populateDatabase(db);

  return db;
};

const getUserById = (db, id) => {
  return db.get("users").find({ id }).value();
};

const getUserByEmail = (db, email) => {
  return db.get("users").find({ email }).value();
};

const registerUser = (db, { email, password }) => {
  db.get("users").push(newUser(email, password)).write();
};

const newUser = (email, password) => {
  return { id: uuid(), email, password: bcrypt.hashSync(password, 10) };
};

const getStations = (db) => {
  return db.get("stations").value();
};

const getDepartures = ({ db, from, to, date, adults, children, students }) => {
  const baseDate = new Date(date);

  const startDate = baseDate.getTime();
  const endDate = new Date(startDate).setHours(baseDate.getHours() + 6);

  const numberOfTickets = Number(adults) + Number(children) + Number(students);

  return db
    .get("departures")
    .filter({ from: Number(from), to: Number(to) })
    .value()
    .filter(({ date, availableTickets }) => {
      return (
        date >= startDate &&
        date <= endDate &&
        availableTickets >= numberOfTickets
      );
    });
};

const saveTicket = ({ db, tickets, seats, departureId, userId }) => {
  const ticketId = uuid();

  db.get("tickets")
    .push({
      id: ticketId,
      userId,
      tickets,
      departureId,
    })
    .write();

  const departure = db
    .get("departures")
    .find({ id: departureId })
    .cloneDeep()
    .value();

  const newSeats = departure.seats.map((row) => cloneDeep(row));

  seats.forEach(([row, seat]) => {
    newSeats[row][seat] = ticketId;
  });

  const newAvailableTickets = departure.availableTickets - seats.length;

  db.get("departures")
    .find({ id: departureId })
    .assign({
      ...departure,
      seats: newSeats,
      availableTickets: newAvailableTickets,
    })
    .write();
};

const getTickets = (db, userId) => {
  const tickets = db.get("tickets").filter({ userId }).value();
  const stations = db.get("stations").value();

  const responseJson = [];

  tickets.forEach((ticket) => {
    const { id, departureId, tickets } = ticket;

    const departure = db.get("departures").find({ id: departureId }).value();

    responseJson.push({
      id,
      tickets,
      from: stations.find(({ id }) => id === departure.from).name,
      to: stations.find(({ id }) => id === departure.to).name,
      date: departure.date,
      seats: departure.seats,
    });
  });

  return responseJson;
};

module.exports = {
  initializeDatabase,
  getUserById,
  getUserByEmail,
  registerUser,
  getStations,
  getDepartures,
  saveTicket,
  getTickets,
};
