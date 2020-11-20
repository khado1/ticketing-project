import axios from "axios";

const agent = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL || "/",
  withCredentials: true,
});

const api = {
  login: (email, password) => {
    return agent.post("/login", {
      email,
      password,
    });
  },

  register: (email, password) => {
    return agent.post("/register", {
      email,
      password,
    });
  },

  logout: () => {
    return agent.post("/logout");
  },

  isAuthenticated: () => {
    return agent.get("/isAuthenticated");
  },

  getStations: () => {
    return agent.get("/stations");
  },

  getDepartures: ({ from, to, date, adults, children, students }) => {
    const params = new URLSearchParams({
      from,
      to,
      date,
      adults,
      children,
      students,
    });

    return agent.get("/departures", {
      params,
    });
  },

  orderTicket: ({ tickets, seats, departureId }) => {
    return agent.post("/orderTicket", { tickets, seats, departureId });
  },

  getTickets: () => {
    return agent.get("/tickets");
  },
};

export default api;
