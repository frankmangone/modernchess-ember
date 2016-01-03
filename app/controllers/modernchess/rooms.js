import Ember from 'ember';

export default Ember.Controller.extend({

	actions: {
		createRoom() {
			var room = this.get('store').createRecord('modernchess/room', {
				game_type: "modernchess",
				turn: "CAP"
			});
			room.save();
		},

		deleteRoom(room_id) {
			this.get('store').find('modernchess/room', room_id).then( function(room){
				room.destroyRecord();
			});
		}
	}

});
