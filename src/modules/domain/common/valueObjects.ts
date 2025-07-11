export class Money {
  constructor(public readonly amount: number, public readonly currency: string) {}
}

export class Quantity {
  constructor(public readonly value: number, public readonly unit: string = "pcs") {}
}
