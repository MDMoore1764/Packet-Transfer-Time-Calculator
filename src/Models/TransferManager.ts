import { Host } from "./Host";
import { Router } from "./Router";

export class TransferManager {
	constructor(
		private source: Host,
		private destination: Host,
		private routers: Router[]
	) {}

	performTransmission(nPackets: number, packetBytes: number) {
		let sentPackets = this.source.sendPackets(nPackets, packetBytes);

		for (let i = 0; i < this.routers.length; i++) {
			const router = this.routers[i];

			for (const [time, packet] of sentPackets) {
				router.receivePacket(packet, time);
			}

			sentPackets = router.sendPackets();
		}

		for (const [time, packet] of sentPackets) {
			this.destination.receivePacket(packet, time);
		}

		return this.destination.getReceivedPackets();
	}
}
