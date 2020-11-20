const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

const applyStrategy = require("./passportConfig");
const {
  initializeDatabase,
  getUserByEmail,
  registerUser,
  getStations,
  getDepartures,
  saveTicket,
  getTickets,
} = require("./database");

dotenv.config();

const db = initializeDatabase();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser(process.env.SECRET));

app.use(passport.initialize());
app.use(passport.session());
applyStrategy(passport, db);

const authGuard = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.sendStatus(401);
};

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(info);
      throw err;
    }

    if (!user) {
      return res.send({ error: "Email or password is incorrect" });
    }

    req.logIn(user, (err) => {
      if (err) {
        throw err;
      }

      res.send({ success: "Successfully authenticated" });
    });
  })(req, res, next);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  const existingUser = getUserByEmail(db, email);

  if (existingUser) {
    return res.send({ error: "User with this email already exists" });
  }

  registerUser(db, {
    email,
    password,
  });

  res.send({ success: "User created" });
});

app.post("/logout", (req, res) => {
  req.logOut();
  res.sendStatus(200);
});

app.get("/isAuthenticated", authGuard, (_req, res) => {
  res.sendStatus(200);
});

app.get("/stations", (req, res) => {
  res.send(getStations(db));
});

app.get("/departures", (req, res) => {
  const { from, to, date, adults, children, students } = req.query;

  res.send(getDepartures({ db, from, to, date, adults, children, students }));
});

app.post("/orderTicket", (req, res) => {
  const { tickets, seats, departureId } = req.body;
  const userId = req.user.id;

  saveTicket({ db, tickets, seats, departureId, userId });

  res.sendStatus(200);
});

app.get("/tickets", (req, res) => {
  const userId = req.user.id;

  res.send(getTickets(db, userId));
});

app.listen(4000);
