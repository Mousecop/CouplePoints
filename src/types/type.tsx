export interface Game {
	gameName: string;
	players: string[];
	points: string[];
	rules: Rule[];
	gameId: string;
}

export interface Rule {
	id: number;
	rule: string;
}

export interface User {
	email: string;
	firstName: string;
	game: string;
	lastName: string;
	points: number;
	profilePicture: string;
	playerId: string;
}
