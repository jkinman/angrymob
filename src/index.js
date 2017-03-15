import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
// import App from './components/Main';
import Resume from './components/Resume';
require( 'fontawesome' );

// Render the main component into the dom
ReactDOM.render(<Resume />, document.getElementById('app'));
