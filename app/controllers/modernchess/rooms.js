import Ember from 'ember';

export default Ember.Controller.extend({

	actions: {
		createGame() {
			var room = this.get('store').createRecord('modernchess/room', {
				game_type: "modernchess",
				turn: "CAP"
			});
			room.save();
		}
	}

});
