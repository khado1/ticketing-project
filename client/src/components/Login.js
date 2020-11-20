import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";
import api from "../api";
import styles from "./Login.module.css";

const INPUT_WIDTH = 300;

const Login = ({ onLogin }) => {
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values, { setErrors }) => {
      const { email, password } = values;

      if (!email) {
        setErrors({
          email: "Email can't be empty",
        });

        return;
      }

      if (!password) {
        setErrors({
          password: "Password can't be empty",
        });
        return;
      }

      try {
        const {
          data: { error },
        } = await api.login(email, password);

        if (error) {
          setErrors({
            email: error,
            password: error,
          });
          return;
        }

        onLogin();

        history.push("/");
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

        <div className={styles.buttons}>
          <Button color="primary" variant="contained" type="submit">
            Login
          </Button>

          <Button
            color="primary"
            variant="text"
            type="button"
            onClick={() => history.push("/register")}
          >
            Go to registration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
