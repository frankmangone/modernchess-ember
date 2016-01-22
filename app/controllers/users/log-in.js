import Ember from 'ember';

export default Ember.Controller.extend({
	errors: [],
	session: Ember.inject.service('session'),

	actions: {
		authenticate() {
			let { email, password } = this.getProperties('email', 'password');
      return this.get('session').authenticate('authenticator:devise', email, password).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
		}
	}
});
