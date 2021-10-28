import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import "./info.css";

export function Info() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="Info">
      <Card className="Info__card">
        <CardHeader title="Welcome to Fabric" subheader="Enjoy your stay!" />
        <CardContent>
          <table>
            <tbody>
              <tr>
                <td>Username</td>
                <td>{user ? user.username : ""}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{user ? user.currentTime : ""}</td>
              </tr>
              <tr>
                <td>Application Local Path</td>
                <td>{user ? user.applicationPath : ""}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
        <CardActions className="card__actions">
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </CardActions>
      </Card>
    </div>
  );
  function handleLogout() {
    logout();
  }
}
