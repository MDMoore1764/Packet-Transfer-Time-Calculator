import { Link } from "./Link";
import { Packet } from "./Packet";

export class Router {
	constructor(
		private queueSize: number,
		private incomingLink: Link,
		private outgoingLink: Link
	) {}

	private packetSchedule = new Map<Packet, PacketScheduleDetails>();

	receivePacket(packet: Packet, transferStartTime: number) {
		const firstBitArrivesAt =
			transferStartTime + this.incomingLink.propogationRateMS;

		const thisQueuePosition = Array.from(this.packetSchedule.values()).filter(
			(packetScheduleDetails) =>
				packetScheduleDetails.completesTransferAt != null &&
				packetScheduleDetails.firstBitArrivesAt <= firstBitArrivesAt &&
				packetScheduleDetails.completesTransferAt > firstBitArrivesAt
		).length;

		const dropped = thisQueuePosition > this.queueSize;

		const fullyArrivesAt = dropped
			? null
			: transferStartTime +
			  this.incomingLink.propogationRateMS +
			  (1000 * packet.getBits()) / this.incomingLink.transmissionRateBPS;

		const lastToCompleteInSchedule = Math.max(
			...Array.from(this.packetSchedule.values())
				.filter((s) => s.completesTransferAt != null)
				.map((s) => s.completesTransferAt!)
		);

		const startsTransferAt = dropped
			? null
			: Math.max(lastToCompleteInSchedule, fullyArrivesAt!);

		const completesTransferAt = dropped
			? null
			: startsTransferAt! +
			  (1000 * packet.getBits()) / this.outgoingLink.transmissionRateBPS;

		const details = {
			firstBitArrivesAt,
			fullyArrivesAt,
			startsTransferAt,
			completesTransferAt,
			queuePosition: thisQueuePosition,
			dropped
		};

		this.packetSchedule.set(packet, details);
	}

	getPrintableSchedule() {
		return Array.from(this.packetSchedule).map((p) => ({
			id: p[0].id,
			...p[1]
		}));
	}

	sendPackets() {
		const distributionTimes: [number, Packet][] = [];
		for (const packet of this.packetSchedule.keys()) {
			const details = this.packetSchedule.get(packet);

			if (!details || details.dropped || details.startsTransferAt == null) {
				continue;
			}

			distributionTimes.push([details.startsTransferAt, packet]);
		}

		return distributionTimes;
	}
}
