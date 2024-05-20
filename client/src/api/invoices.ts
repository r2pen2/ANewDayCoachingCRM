import { Invoice } from "./dbManager.ts";

const todayLimbo = new Invoice("V5pnONtawsWjkMo42ZnzsNdGTZm2", 2, false, 100, new Date(), null, new Date(), "https://www.joed.dev/", "V5pnONtawsWjkMo42ZnzsNdGTZm2");
todayLimbo.paidAt = new Date();

const late = new Invoice("V5pnONtawsWjkMo42ZnzsNdGTZm2", 1, false, 200, Invoice.getDaysBefore(7),  null, Invoice.getDaysBefore(2), "https://www.joed.dev/", "V5pnONtawsWjkMo42ZnzsNdGTZm2");

const dueInFuture = new Invoice("V5pnONtawsWjkMo42ZnzsdGTZm2", 3, false, 200, new Date(),  null, Invoice.getDaysBefore(-2), "https://www.joed.dev/", "V5pnONtawsWjkMo42ZnzsNdGTZm2");
const dueInFuturePaid = new Invoice("V5pnONtawsWjkMo42ZnzsdGTZm2", 4, true, 200, new Date(), new Date(), Invoice.getDaysBefore(-2), "https://www.joed.dev/", "V5pnONtawsWjkMo42ZnzsNdGTZm2");

export const exampleInvoicesClassed : Invoice[] = [
  dueInFuturePaid,
  dueInFuture,
  todayLimbo,
  late,
];