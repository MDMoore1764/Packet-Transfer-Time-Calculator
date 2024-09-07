export class Packet {
	constructor(public id: number, private bytes: number) {}
	getBits() {
		return this.bytes * 8;
	}

	getBytes() {
		return this.bytes;
	}

	getEndToEndDelay() {
		return this.endTime - this.startTime;
	}

	getSummary() {
		return {
			id: this.id,
			startTime: this.startTime,
			endTime: this.endTime,
			endToEndDelay: this.getEndToEndDelay()
		};
	}

	public startTime: number = 0;
	public endTime: number = 0;
}
