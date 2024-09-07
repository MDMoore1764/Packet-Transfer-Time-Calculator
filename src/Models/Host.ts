import { Link } from "./Link";
import { Packet } from "./Packet";

export class Host {
	constructor(private connection: Link) {}

	private receivedPackets: Packet[] = [];

	receivePacket(packet: Packet, transferStartTime: number) {
		packet.endTime =
			transferStartTime +
			this.connection.propogationRateMS +
			(1000 * packet.getBits()) / this.connection.transmissionRateBPS;

		this.receivedPackets.push(packet);
	}

	getReceivedPackets() {
		return [...this.receivedPackets];
	}

	sendPackets(count: number, bytes: number) {
		const distributionTimes: [number, Packet][] = [];

		let time = 0;
		for (let i = 0; i < count; i++) {
			const packet = new Packet(i + 1, bytes);
			packet.startTime = time;

			//Can send each packet as soon as the packet has finished transmission (not propogation)
			distributionTimes.push([time, packet]);
			time += (1000 * packet.getBits()) / this.connection.transmissionRateBPS;
		}

		return distributionTimes;
	}
}
