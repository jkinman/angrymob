import Globe from './globe/Globe3dComponent';

require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

class AppComponent extends React.Component {

  componentDidMount() {
    this.mounted = true;
    this.refs.globe.moveToBottom();
  }

  render() {
    return (
      <div className="index">
        <Globe ref="globe"/>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
