import "./App.css";
import { Fragment, useContext } from "react";
import AuthScreen from "./pages/AuthScreen";
import HomeScreen from "./pages/HomeScreen";
import AuthContext from "./store/auth-context";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return <Fragment>{isLoggedIn ? <HomeScreen /> : <AuthScreen />}</Fragment>;
}

export default App;
