type PacketScheduleDetails = {
	firstBitArrivesAt: number;
	fullyArrivesAt: number | null;
	startsTransferAt: number | null;
	completesTransferAt: number | null;
	queuePosition: number;
	dropped: boolean;
};
