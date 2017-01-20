import Globe from './globe/Globe3dComponent';

require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

class AppComponent extends React.Component {

  componentDidMount() {
    this.logo = require('../images/angrymob-low.png');
    this.mounted = true;
    this.refs.globe.moveToBottom(
      // () => {},
      // new THREE.Vector3(50, -10, 190 )
    );

    setTimeout( () => this.showGlobalEvent(), 1000 );
  }

  showGlobalEvent() {
    this.refs.globe.showGlobalEvent();

    setTimeout( () => this.showGlobalEvent(), 10000 * Math.random() );

  }

  render() {



    return (
      <div className="index">
        <Globe ref="globe"/>
        <img width="750px" src={this.logo} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
