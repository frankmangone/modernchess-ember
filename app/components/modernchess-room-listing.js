import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		deleteClick() {
			this.sendAction('action', this.get('room').id);
		}
	}
});