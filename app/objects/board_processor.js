import Ember from 'ember';

export default Ember.Object.extend({

	/* "board" must be passed on creation.
			Note that board is used only upon load, since after that all the logic is in the server side.
	*/
	/* "room_id" must be passed on creation. */
	pieces: [],
	row_size: 0,
	active_tiles: [],
	active_piece: [],

	init() {
		var board = this.get('board');
		this.set('row_size', board[0]);
		this.set('piece_count', 0);

		this.createPiecesArray();
	},




	// Piece Array Creation Methods -----------------------------------

	createPiecesArray() {
		var pieces = [];
		var board = this.get('board');
		for (var i = 1; i < board.length; i++) {
			if (board[i] !== "o") {
				pieces.push( this.generatePiece(i) );
			}
		}
		this.set('pieces', pieces);
	},

	generatePiece(index) {
		var counter = this.get('piece_count');
		var type = this.get('board')[index];
		var name = type + counter;
		var path = "images/" + type + ".svg";
		var row = this.findPieceRow(index);
		var column = this.findPieceColumn(index);

		this.set('piece_count', counter+1);
		// This is important, to understand how pieces are saved.
		return { "name": name, "type": type, "path": path, "row": row, "column": column };
	},

	findPieceRow(index) {
		return Math.ceil( index / this.get('row_size') );
	},

	findPieceColumn(index) {
		var row = Math.ceil( index / this.get('row_size') );
		return index - (row-1)*this.get('row_size');		
	},





	// Piece Positioning Methods --------------------------------------

	positionAllPieces() {
		for(var i = 0; i < this.get('pieces').length; i++) {
			var piece = this.get('pieces')[i];
			this.positionPiece(piece.name, piece.row, piece.column);
		}
	},

	positionPiece(name, row, column) {
		var piece_id = "#"+name;
		var x_position = this.calculateXFromColumn(column);
		var y_position = this.calculateYFromRow(row);
		$(piece_id).css({
			top: y_position,
			left: x_position
		});
	},

	calculateXFromColumn(column) {
		var width = $("#board").width();
		var tile_width = width / this.get('row_size');
		// Reference point is top left corner

		return tile_width * (column-1);
	},

	calculateYFromRow(row){
		var height = $("#board").height();
		var tile_height = height / this.get('row_size');
		// !!!!!!!!! Might need to change in case of non-square boards. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		// Reference point is top left corner
		return tile_height * (row-1);
	},

	// Making a move:

	useResponseToMakeMove(response) {
		var source = response.source;
		var target = response.target;
		var action = target.action;
		
		// Maybe move this line to somewhere else?
		this.set('board', response.board);
		
		switch(action) {
			case "MOVE":
				this.pieceMove(source, target);
				break;
			case "TAKE":
				this.pieceTake(source, target);
				break;
			case "CONVERT":
				this.pieceConvert(source, target);
				break;
		}
	},

	pieceMove(source, target) {
		var piece = this.pieceInTile(source.row, source.column);
		this.positionPiece(piece.name, target.row, target.column);
		this.updatePiece(source.row, source.column, target.row, target.column);
	},

	pieceTake(source, target) {
		var piece = this.pieceInTile(source.row, source.column);
		this.deletePiece(target.row, target.column);
		this.updatePiece(source.row, source.column, target.row, target.column);
		this.positionPiece(piece.name, target.row, target.column);
	},

	pieceConvert(source, target) {
		// MAKE THIS ALGORITHM BETTER FOR GOD'S SAKE!!!!!
		this.deletePiece(target.row, target.column);
		this.createPiecesArray();
		Ember.run.scheduleOnce('afterRender', this, () => {
			this.positionAllPieces();
		});
	},







	// Board click control --------------------------------------------

	handleTileClick(row, column) {
		// Returns an ACTION for the server, to be processed by the controller.

		var move = this.validMove(row, column);
		var clicked_piece = this.pieceInTile(row, column);
		
		if(move !== false) {
			var message = this.buildMoveMessage(move, this.active_piece);
			return { type: "MAKE_MOVE", message: message };
		}
		else if(clicked_piece !== undefined) {
			clicked_piece["id"] = this.room_id;
			this.active_piece = clicked_piece;
			return { type: "GET_MOVES", message: clicked_piece };
		}
		else {
			return { type: "IDLE" };
		}

		// I need to somehow trigger the events on the server, maybe this logic SHOULD go in the controller...
	},





	showAllMoves(moves) {
		console.log(moves);
		for(var i = 0; i < moves.length; i++) {
			this.showMove( moves[i] );
		}
	},

	showMove(move) {
		var row    = move[0];
		var column = move[1];
		var code   = move[2];

		var $tile_dim = $("#tile-"+row+"-"+column).find(".tile-dim");

		this.active_tiles.push(move);

		switch(code) {
			case "MOVE":
				$tile_dim.addClass("tile-move");
				break;
			case "TAKE":
				$tile_dim.addClass("tile-take");
				break;
			case "CONVERT":
				$tile_dim.addClass("tile-convert");
				break;
		}
	},




	validMove(row, column){
		var clicked_tile = [row, column];
		var active_tile;

		for(var i = 0; i < this.get('active_tiles').length; i++) {
			active_tile = this.active_tiles[i];
			if (clicked_tile[0] === active_tile[0] && clicked_tile[1] === active_tile[1]) {
				return active_tile;
			}
		}
		return false;
	},

	disableActiveTiles() {
		for(var i = 0; i < this.active_tiles.length; i++) {
			var row = this.active_tiles[i][0];
			var column = this.active_tiles[i][1];
			var $tile = $("#tile-"+row+"-"+column);

			$tile.find(".tile-dim").removeClass("tile-move").removeClass("tile-take")
														 .removeClass("tile-convert");
		}
		this.set('active_tiles', []);
	},

	buildMoveMessage(move, source) {
		var message = {};
		
		message.id = this.room_id;
		message.source =  {
			row: source.row,
			column: source.column
		};
		message.target = {
			row: move[0],
			column: move[1],
			action: move[2]
		};

		return message;
	},






	// Handy methods --------------------------------

	pieceInTile(row, column) {
		var pieces = this.get('pieces');
		var piece_in_tile;

		for(var i = 0; i < pieces.length; i++) {
			if(pieces[i].column === column && pieces[i].row === row) {
				piece_in_tile = pieces[i];
				break;
			}
		}

		return piece_in_tile;
	},

	pieceIndex(row, column) {
		var index;
		var pieces = this.get('pieces');

		for(var i = 0; i < pieces.length; i++) {
			if(pieces[i].column === column && pieces[i].row === row) {
				index = i;
				break;
			}
		}
		return index;
	},

	pieceBoardIndex(row, column) {
		return ( (row - 1)*this.get('row_size') + column );
	},

	updatePiece(row, column, new_row, new_column) {
		var pieces = this.get('pieces');
		var index = this.pieceIndex(row, column);
		pieces[index].row = new_row;
		pieces[index].column = new_column;
		this.set('pieces', pieces);
	},

	deletePiece(row, column) {
		var pieces = this.get('pieces');
		var index = this.pieceIndex(row, column);
		var name = pieces[index].name;
		pieces.splice(index, 1);
		this.set('pieces', pieces);
		// Also delete the piece in the view;
		$("#"+name).remove();
	}

});