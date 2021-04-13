import './styles/App.global.scss';

import React, { useEffect } from 'react';
import AppContainer from './AppContainer';
import { CortexDriver } from './modules/CortexDriver';

export default function App() {
  useEffect(() => {
    const start = async () => {
      let driver: CortexDriver = CortexDriver.getInstance();
      await driver.awaitSocketOpening();
    };
    start();
  });
  return (<AppContainer/>);
}
