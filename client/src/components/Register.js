import { Button, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import api from "../api";
import styles from "./Register.module.css";

const INPUT_WIDTH = 300;

const Register = () => {
  const history = useHistory();

  // eslint-disable-next-line no-control-regex
  const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },

    onSubmit: async (values, { setErrors }) => {
      const { email, password, repeatPassword } = values;

      if (!email) {
        setErrors({ email: "Email can't be empty" });
        return;
      }

      if (!password) {
        setErrors({ password: "Password can't be empty" });
        return;
      }

      if (!emailRegex.test(email)) {
        setErrors({ email: "Invalid email address" });
        return;
      }

      if (password.length < 8) {
        setErrors({ password: "Password has to be atleast 8 characters long" });
        return;
      }

      if (repeatPassword !== password) {
        setErrors({ repeatPassword: "Passwords don't match" });
        return;
      }

      try {
        const {
          data: { error },
        } = await api.register(email, password);

        if (error) {
          setErrors({
            email: error,
          });

          return;
        }

        history.push("/login");
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    formik.handleSubmit(e);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          id="email"
          name="email"
          label="Email"
          variant="outlined"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={!!formik.errors.email}
          helperText={formik.errors.email}
          style={{ width: INPUT_WIDTH }}
        />

        <TextField
          id="password"
          name="password"
          type="password"
          variant="outlined"
          label="Password"
          onChange={formik.handleChange}
          value={formik.values.password}
          error={!!formik.errors.password}
          helperText={formik.errors.password}
          style={{ width: INPUT_WIDTH }}
        />

        <TextField
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          variant="outlined"
          label="Repeat password"
          onChange={formik.handleChange}
          value={formik.values.repeatPassword}
          error={!!formik.errors.repeatPassword}
          helperText={formik.errors.repeatPassword}
          style={{ width: INPUT_WIDTH }}
        />

        <div className={styles.buttons}>
          <Button color="primary" variant="contained" type="submit">
            Register
          </Button>

          <Button
            color="primary"
            variant="text"
            type="button"
            onClick={() => history.push("/login")}
          >
            Go to login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
