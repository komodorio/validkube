import React from "react";
import { Switch, Route } from "react-router-dom";

import MainView from "../MainView";
import TestView from "../TestView";

const PrivateRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/test" component={TestView} />
      <Route path="/" component={MainView} />
    </Switch>
  );
};

export default PrivateRoutes;
