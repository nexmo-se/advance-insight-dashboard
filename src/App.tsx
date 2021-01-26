import { Switch, Route } from "react-router-dom";

import LoginPage from "pages/LoginPage";
import MainPage from "pages/MainPage";

function App() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} exact />
      <Route path="/" component={MainPage} />
    </Switch>
  );
}

export default App;
