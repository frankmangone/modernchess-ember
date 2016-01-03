import Ember from 'ember';

export default Ember.Controller.extend({
	errors: [],

	actions: {
		createSession() {
			var session = this.get('store').createRecord('session', {
				email: this.get('email'),
				password: this.get('password')
			});

			session.save().then(
				// Success
				(response) => {
					session.deleteRecord();
					console.log(response);
				},

				// Reject
				(response) => {
					session.deleteRecord(); // Delete does not PERSIST the record so no request gets sent to the 
					this.set('errors', response.errors);
				}
			);
		}
	}
});
