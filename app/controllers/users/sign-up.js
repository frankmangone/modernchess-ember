import Ember from 'ember';

export default Ember.Controller.extend({
	errors: [],
	
	actions: {
		createUser() {
			var user = this.get('store').createRecord('user', {
				name: this.get('name'),
				email: this.get('email'),
				password: this.get('password'),
				password_confirmation: this.get('password_confirmation')	
			});

			user.save().then(
				//success
				(response) => {
					console.log(response);
					console.log('transicionaría a la página de usuario con alguna bobada.');
				},

				//reject
				(response) => {
					user.deleteRecord(); // Delete does not PERSIST the record so no request gets sent to the 
					this.set('errors', response.errors);
				}
			);
		}
	}
});
