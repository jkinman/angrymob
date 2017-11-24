import * as THREE from 'three';
// import Globe from './globe/Globe3dComponent';
import Landscape from './ProceduralLandscape';

require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

class AppComponent extends React.Component {


  constructor(props, context) {
    super(props, context);
    this.logo = require('../images/angrymob-low.png');

  }

  componentDidMount() {
    this.mounted = true;
    // this.refs.globe.moveToBottom(
      // () => {},
      // new THREE.Vector3(50, -10, 190 )
    // );
    // setTimeout( () => this.showGlobalEvent(), 1000 );
  }

  showGlobalEvent() {
    // this.refs.globe.showGlobalEvent();
    // setTimeout( () => this.showGlobalEvent(), 10000 * Math.random() );
  }

  render() {



    return (
      <div className="index">
        {/* <img width="750px" src={this.logo} /> */}
        {/* <Globe ref="globe"/> */}
        <Landscape ref="3dscene" />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
