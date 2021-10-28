import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useHistory } from "react-router";
import { AuthContext } from "../../AuthProvider";
import "./login.css";

export function Login() {
  const history = useHistory();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const { login } = useContext(AuthContext);
  useEffect(() => {
    setError(false);
  }, [username, password]);
  return (
    <div className="Login">
      <ValidatorForm onSubmit={onSubmit}>
        <Card className="Login__card">
          <CardHeader title="Login" subheader="Login to Fabric" />
          <CardContent>
            <TextValidator
              id="username"
              fullWidth
              name="username"
              label="Username"
              value={username}
              margin="normal"
              variant="outlined"
              validators={["required"]}
              errorMessages={["Username is required"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
            <TextValidator
              id="password"
              fullWidth
              type="password"
              name="password"
              label="Password"
              value={password}
              margin="normal"
              variant="outlined"
              validators={["required"]}
              errorMessages={["Password is required"]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            {error ? (
              <Alert severity="error">
                Your credentials were not recognized
              </Alert>
            ) : null}
          </CardContent>
          <CardActions className="card__actions">
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </CardActions>
        </Card>
      </ValidatorForm>
    </div>
  );

  function onSubmit() {
    return login(username, password)
      .then((success: boolean) => {
        setError(!success);
        if (success) {
          history.push("/info");
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}
