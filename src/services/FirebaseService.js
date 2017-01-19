let firebase = require('firebase');


// let instance = null;
let singleton = Symbol();
let singletonEnforcer = Symbol();

class FirebaseService {
    constructor(enforcer) {

        if (enforcer !== singletonEnforcer) {
            throw 'Cannot construct singleton'
        }
        // TODO extract constants to a consts file
        if( !this[singleton] ) {
            this.fbConfig = {
              apiKey: 'AIzaSyDcFEgdcQgWD_Bm6BOu94FWgAhXbIidYzI',
              authDomain: 'iq-visions.firebaseapp.com',
              databaseURL: 'https://iq-visions.firebaseio.com/',
              storageBucket: 'iq-visions.appspot.com'
            };

            this.conn = firebase.initializeApp( this.fbConfig );
        }
        return singleton;
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new FirebaseService(singletonEnforcer);
        }
        return this[singleton];
    }
}
export default FirebaseService;
