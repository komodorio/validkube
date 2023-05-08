import React, {useEffect} from "react";
import { Switch, Route } from "react-router-dom";

import MainView from "../MainView";
import TestView from "../TestView";
import sendToSegment from "../../utils/analytics";

const PrivateRoutes: React.FC = () => {
    useEffect(() => {
        sendToSegment("validKubeInitiallized", {})
    }, [])
  return (
    <Switch>
      <Route path="/test" component={TestView} />
      <Route path="/" component={MainView} />
    </Switch>
  );
};

export default PrivateRoutes;
