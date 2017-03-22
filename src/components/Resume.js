require('../styles/orbittheme/css/styles.css');
require('../styles/resume.scss');
require('normalize.css/normalize.css');

global.$ = require('jquery');
global.jQuery = global.$;
require( 'bootstrap' );
require( 'fontawesome' );

import React from 'react';
import Barchart from './Barchart'
// import NeuralNet from './NeuralNet'
import BackgroundScene from './BackgroundScene/BackgroundScene';

class ResumeComponent extends React.Component {


  constructor(props, context) {
    super(props, context);
    // this.logo = require('../images/angrymob-low.png');
    this.profile = require( '../images/joelprofile.jpg');
    this.experiance = [
      {
        company: 'iQmetrix',
        city: 'Vancouver',
        role: 'Sr Software Engineer',
        time: 'Jan 2016 - PRESENT',
        body: 'Sr developer on sparklab, iQmetrix’s R&D team. We do rapid product development and architecture, as well as development coaching.',
        bullets: [
          'Visions: Real Time data analytics dashboard system. React application delivered as electron desktop app, iOS/Android mobile controller app, .NET REST service spawning docker instances',
          'Nimble: Internal company management application',
          'Ready: Restaurant payment app. Hybrid native mobile app'
        ],
        tech: 'JS (ES6, TypeScript), React, Riot, Angular2, Aurelia, Backbone / Marionette, Node (express), .NET, MongoDB, MsSql, Docker, Websockets (firebase), Phonegap, Electron, WebGL (THREE.js), 2d Canvas (D3), Mocha, Jasmine'
      },
      {
        company: 'iQmetrix',
        city: 'Vancouver',
        role: 'Sr Software Engineer',
        time: 'Jan 2016 - PRESENT',
        body: 'Sr developer on sparklab, iQmetrix’s R&D team. We do rapid product development and architecture, as well as development coaching.',
        bullets: [
          'Visions: Real Time data analytics dashboard system. React application delivered as electron desktop app, iOS/Android mobile controller app, .NET REST service spawning docker instances',
          'Nimble: Internal company management application',
          'Ready: Restaurant payment app. Hybrid native mobile app'
        ],
        tech: 'JS (ES6, TypeScript), React, Riot, Angular2, Aurelia, Backbone / Marionette, Node (express), .NET, MongoDB, MsSql, Docker, Websockets (firebase), Phonegap, Electron, WebGL (THREE.js), 2d Canvas (D3), Mocha, Jasmine'
      }
    ];

    this.skills = [
      { skilltype: 'javascript',
        data: [
          {title: 'React',      percent: 80 },
          {title: 'Angular 2',  percent: 50 },
          {title: 'Angular',    percent: 90 },
          {title: 'TypeScript',  percent: 72 },
          {title: 'Node',  percent: 70 },
          {title: 'Angular 2',  percent: 80 },
        ]
      },
      { skilltype: 'JS Frameworks',
        data: [
          {title: 'React',      percent: 80 },
          {title: 'Angular 2',  percent: 80 }
        ]
      },
    ];


  }

  componentDidMount() {
    this.mounted = true;

    // this.refs.globe.moveToBottom(
      // () => {},
      // new THREE.Vector3(50, -10, 190 )
    // );

  }

  render() {
    global.$('.level-bar-inner').css('width', '0');
    global.$('.level-bar-inner').each( () => {
        console.log( 'hitit' );
        var itemWidth = global.$(this).data('level');
        global.$(this).animate({
            width: itemWidth
        }, 800);
    });

    // <Globe ref="globe"/>
    return (
      <div className="wrapper">
      <BackgroundScene className="backgroundscene" />

          <div className="sidebar-wrapper">
              <div className="profile-container">
                  <img className="profile" src={this.profile} alt="" />
                  <h1 className="name">Joel Kinman</h1>
                  <h3 className="tagline">Full Stack Developer</h3>
              </div>

              <div className="contact-container container-block">
                  <ul className="list-unstyled contact-list">
                      <li className="email"><i className="fa fa-envelope"></i><a href="mailto: joel.kinman@gmail.com">joel.kinman@gmail.com</a></li>
                      <li className="phone"><i className="fa fa-phone"></i><a href="tel:778 788 1455">778-788-1455</a></li>
                      <li className="linkedin"><i className="fa fa-linkedin"></i><a href="#" target="_blank">linkedin.com/in/alandoe</a></li>
                      <li className="github"><i className="fa fa-github"></i><a href="#" target="_blank">github.com/jkinman</a></li>
                  </ul>
              </div>
              <div className="skills-container container-block">
                  <h2 className="container-block-title">Skills</h2>
                  <div className="item">
                      <h4 className="degree">MSc in Computer Science</h4>
                      <h5 className="meta">University of London</h5>
                      <div className="time">2011 - 2012</div>
                  </div>
                  <div className="item">
                      <h4 className="degree">BSc in Applied Mathematics</h4>
                      <h5 className="meta">Bristol University</h5>
                      <div className="time">2007 - 2011</div>
                  </div>
              </div>

              <div className="languages-container container-block">
                  <h2 className="container-block-title">Languages</h2>
                  <ul className="list-unstyled interests-list">
                      <li>English <span className="lang-desc">(Native)</span></li>
                      <li>French <span className="lang-desc">(Professional)</span></li>
                      <li>Spanish <span className="lang-desc">(Professional)</span></li>
                  </ul>
              </div>


          </div>

          <div className="main-wrapper">

              <section className="section summary-section">
                  <h2 className="section-title"><i className="fa fa-user"></i>Career Profile</h2>
                  <div className="summary">
                      <p>I like making cool s*%t. My medium is software, my tools are design patterns. I’ve been writing javascript since day one. I make frontend and backend web, iOS and Android apps. I’ve been creating and consuming REST APIs for 6 years. I made AAA video games for 7 years. I’ve shipped over 13 titles in my career as a game developer. I moved to  the web world because i love the collaboration and agile development of open source. I’ve successfully been on both sides of contracting. I’ve learned the importance of concise, explicit documentation when getting work done by third parties. I’ve worked on development teams of 30 plus people and lead smaller teams. I’m a software engineer and architect  so I can divide and conquer and solve interesting problems. I see myself in junior engineers and try to bring the best out of them.
  </p>
                  </div>
              </section>

              <section className="section experiences-section">
                  <h2 className="section-title"><i className="fa fa-briefcase"></i>Experience</h2>

                  {this.experiance.map( (e, i) => {
                    return (

                  <div className="item" key={`exp${i}`}>
                      <div className="meta">
                          <div className="upper-row">
                              <h3 className="job-title">{e.role}</h3>
                              <div className="time">{e.time}</div>
                          </div>
                          <div className="company">{e.company}, {e.city}</div>
                      </div>
                      <div className="details">
                          <p>{e.body}</p>
                            <p>Products developed:</p>
                            <ul>
                            {e.bullets.map( ( bullet, j ) => {
                              return(
                                <li key={`bullet${j}`}>{bullet}</li>
                              )
                            })}
                          </ul>
                          <h5>{e.tech}</h5>
                      </div>
                  </div>
                )
              })}


              </section>

              <section className="section projects-section">
                  <h2 className="section-title"><i className="fa fa-archive"></i>Projects</h2>
                  <div className="intro">
                      <p>You can list your side projects or open source libraries in this section. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et ligula in nunc bibendum fringilla a eu lectus.</p>
                  </div>
                  <div className="item">
                      <span className="project-title"><a href="#hook">Velocity</a></span> - <span className="project-tagline">A responsive website template designed to help startups promote, market and sell their products.</span>

                  </div>
                  <div className="item">
                      <span className="project-title"><a href="http://themes.3rdwavemedia.com/website-templates/responsive-bootstrap-theme-web-development-agencies-devstudio/" target="_blank">DevStudio</a></span> -
                      <span className="project-tagline">A responsive website template designed to help web developers/designers market their services. </span>
                  </div>
                  <div className="item">
                      <span className="project-title"><a href="http://themes.3rdwavemedia.com/website-templates/responsive-bootstrap-theme-for-startups-tempo/" target="_blank">Tempo</a></span> - <span className="project-tagline">A responsive website template designed to help startups promote their products or services and to attract users &amp; investors</span>
                  </div>
                  <div className="item">
                      <span className="project-title"><a href="hhttp://themes.3rdwavemedia.com/website-templates/responsive-bootstrap-theme-mobile-apps-atom/" target="_blank">Atom</a></span> - <span className="project-tagline">A comprehensive website template solution for startups/developers to market their mobile apps. </span>
                  </div>
                  <div className="item">
                      <span className="project-title"><a href="http://themes.3rdwavemedia.com/website-templates/responsive-bootstrap-theme-for-mobile-apps-delta/" target="_blank">Delta</a></span> - <span className="project-tagline">A responsive Bootstrap one page theme designed to help app developers promote their mobile apps</span>
                  </div>
              </section>

              {this.skills.map( (e, i) => {
                return(
                <section className="skills-section section" key={`skills-section${i}`}>
                    <h2 className="section-title"><i className="fa fa-rocket"></i>{e.skilltype}</h2>
                    <div className="wrapper skill">
                        <div className="container skill">
                            <div className="row">
                              <div className="col-md-12">

                            {e.data.map( (data, i) => {
                              return(
                                <Barchart percent={data.percent} title={data.title} key={`skill${i}`} ></Barchart>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                  </div>
                </section>
              )
            })}
          </div>
      </div>
    );
  }
}

ResumeComponent.defaultProps = {
};

export default ResumeComponent;
