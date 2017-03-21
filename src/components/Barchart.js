
import React from 'react';
require('styles/Barchart.scss');
require('styles/orbittheme/plugins/bootstrap/css/bootstrap.css');

class BarchartComponent extends React.Component {


  constructor(props, context) {
    super(props, context);

  }

  componentDidMount() {
    this.mounted = true;

  }

  render( ) {
    return(
      <div className="skillbar" data-percent={`${this.props.percent}%`}>
          <div className="skillbar-title">{this.props.title}</div>
          <div className="skill-bar-percent">{`${this.props.percent}%`}</div>
          <div className="skillbar-bar" style={{width:`${this.props.percent}%`}}></div>
      </div>
    )
  }
}

BarchartComponent.defaultProps = {
  title: 'none',
  percent: 25
};

export default BarchartComponent;
