import Ember from 'ember';
import BoardProcessor from '../../objects/board_processor';

export default Ember.Controller.extend({
	onRouteLoad(room_id) {
		this.set('room_id', room_id);

		this.dispatcher = new WebSocketRails('localhost:3000/websocket');
		this.dispatcher.trigger('api.v1.modernchess.load_room', { "id": room_id });

		this.dispatcher.bind('load_room_response', (response) => { this.handleRoomLoad(response) });
		this.dispatcher.bind('moves_response',     (response) => { this.handleMovesResponse(response) });

		this.channel = this.dispatcher.subscribe(room_id);
		this.channel.bind('move_done', (response) => { this.handleMoveDone(response) });

		// Piece wrapper positioning
		Ember.run.scheduleOnce('afterRender', this, () => {
			this.positionPieceWrapper();
		});
	},



// UI methods------------------------------------

	positionPieceWrapper() {
		var board_height = $("#board").height();
		var $pieces = $("#pieces-wrapper");
		var $game = $("#game");

		$pieces.css({
			top: -board_height,
			width: board_height,
			height: board_height
		});

		$game.css({
			height: board_height
		});
	},

	//

	addBoardListener() {
		var $pieces_wrapper = $("#pieces-wrapper");
		var offset = $pieces_wrapper.offset();
		var offsetX = offset.left;
		var offsetY = offset.top;

		var tile_side = $("#board").width() / this.get("row_size");

		$("#pieces-wrapper").click( (event) => {
			var x = event.pageX - offsetX;
			var y = event.pageY - offsetY;
			var row    = Math.ceil( y / tile_side );
			var column = Math.ceil( x / tile_side );

			var action = this.board_processor.handleTileClick(row, column);
			this.sendActionToServer(action);
		});
	},





	// Websocket methods-----------------------------

	handleRoomLoad(response) {
		var room = response.room;
		this.set('row_size', room.board[0]);
		var board_processor = BoardProcessor.create({ 
			board:   room.board,
			room_id: this.get('room_id')
		});
		this.set('board_processor', board_processor);
		// Next line is important because pieces aren't rendered otherwise
		this.set('pieces', board_processor.pieces);

		this.addBoardListener();

		// Position pieces only after they are rendered
		Ember.run.scheduleOnce('afterRender', this, () => {
			this.board_processor.positionAllPieces();
		});
	},


	sendActionToServer(action) {
		switch(action.type) {
			case "MAKE_MOVE":
				this.dispatcher.trigger('api.v1.modernchess.make_move', action.message);
				break;
			case "GET_MOVES":
				this.dispatcher.trigger('api.v1.modernchess.calculate_moves', action.message);
				break;
			case "IDLE":
				this.board_processor.disableActiveTiles();
				break;
		}
	},

	// Server response handlers:

	handleMovesResponse(response) {
		this.board_processor.disableActiveTiles();
		this.board_processor.showAllMoves(response.moves);
	},

	handleMoveDone(response) {
		this.board_processor.disableActiveTiles();
		this.board_processor.useResponseToMakeMove(response);
		this.controlPiecesArray();
	},

	controlPiecesArray() {
		if(this.get('pieces') !== this.board_processor.pieces) {
			this.set('pieces', this.board_processor.pieces);
			this.board_processor.positionAllPieces();
		}
	}

});