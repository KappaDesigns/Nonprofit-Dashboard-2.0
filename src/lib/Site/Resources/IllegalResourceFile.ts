export class IllegalResourceFile extends Error {
	constructor(message: string) {
		super(message);
		this.name = "IllegalResourceFile";
	}
}