import React from "react";
import { Provider } from "react-redux";
import store from "./src/core/redux/store";
import Navigation from "./src/core/router/Navigation";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
