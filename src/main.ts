import { Host } from "./Models/Host";
import { Link } from "./Models/Link";
import { Router } from "./Models/Router";
import { TransferManager } from "./Models/TransferManager";

//Problem 4.d.a:
console.log("Problem 4: d, part a.");
const link1 = new Link(1_000_000, 2);
const hostA = new Host(link1);
const link2 = new Link(500_000, 20);
let router1 = new Router(5, link1, link2);
const link3 = new Link(1_000_000, 30);
let router2 = new Router(5, link2, link3);
const link4 = new Link(2_000_000, 2);
let router3 = new Router(5, link3, link4);
const hostB = new Host(link4);

let manager = new TransferManager(hostA, hostB, [router1, router2, router3]);
let transferredPackets = manager.performTransmission(20, 1500);

// console.log(router1.getPrintableSchedule());
// console.log(router2.getPrintableSchedule());
// console.log(router3.getPrintableSchedule());
console.log(transferredPackets.map((t) => t.getSummary()));

console.log("Problem 4: d, part b.");
router3 = new Router(5, link4, link3);
router2 = new Router(5, link3, link2);
router1 = new Router(5, link2, link1);

manager = new TransferManager(hostB, hostA, [router3, router2, router1]);
transferredPackets = manager.performTransmission(20, 1500);

// console.log(router3.getPrintableSchedule());
// console.log(router2.getPrintableSchedule());
// console.log(router1.getPrintableSchedule());
console.log(transferredPackets.map((t) => t.getSummary()));
