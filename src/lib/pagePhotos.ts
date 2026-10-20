import type { PhotoKey } from "./photos";

/** Two photographs for each page opening, chosen by path. */
const byPath: [string, [PhotoKey, PhotoKey]][] = [
  ["/services", ["openOffice", "calculator"]],
  ["/fraud-types", ["pettyCash", "retailCheckout"]],
  ["/case-types", ["cardCatalog", "officeSafe"]],
  ["/who-we-help/employers-hr", ["factoryBuilding", "punchClock"]],
  ["/who-we-help/solicitors-law-firms", ["glassBuilding", "cardCatalog"]],
  ["/who-we-help", ["openOffice", "warehouseLoading"]],
  ["/investigation-process", ["mailboxCorridor", "addingMachine"]],
  ["/how-to-instruct", ["officeDesk", "calculator"]],
  ["/qualifications", ["cardCatalog", "addingMachine"]],
  ["/what-is-employee-fraud", ["storeCheckouts", "pettyCash"]],
  ["/guides", ["mailboxCorridor", "officeDesk"]],
  ["/glossary", ["addingMachine", "cardCatalog"]],
  ["/blog", ["parcelConveyor", "electronicsShop"]],
  ["/contact", ["glassBuilding", "officeSafe"]],
  ["/thank-you", ["openOffice", "punchClock"]],
  ["/privacy", ["officeDesk", "mailboxCorridor"]],
  ["/terms", ["cardCatalog", "officeDesk"]],
  ["/cookies", ["officeDesk", "calculator"]],
  ["/image-credits", ["groceryCheckout", "warehouseLoading"]],
];

export function photosFor(path: string): [PhotoKey, PhotoKey] {
  const hit = byPath.find(([p]) => path === p || path.startsWith(`${p}/`));
  return hit ? hit[1] : ["storeCheckouts", "officeSafe"];
}
