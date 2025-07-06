import {describe, expect, test} from "@jest/globals";
import { DomainError } from "../../modules/common/domainError";
import { Result } from "../../modules/common/result";
import { Address } from "../../modules/purchaseOrders/domain/address";
import { LineItem, LineItemStatus } from "../../modules/purchaseOrders/domain/lineItem";
import { Location } from "../../modules/purchaseOrders/domain/location";
import { Product } from "../../modules/purchaseOrders/domain/product";
import { OrderStatus, PurchaseOrder } from "../../modules/purchaseOrders/domain/purchaseOrder";
import { Vendor } from "../../modules/purchaseOrders/domain/vendor";
import { Warehouse } from "../../modules/purchaseOrders/domain/warehouse";

describe("can add valid user", () => {
    let address1 = null;
    let address2 = null;
    let addressVendor = null;
    let addressVendor2 = null;

    let vendor = null;
    let vendor2 = null;
    let location1 = null;
    let location2 = null;

    let wareHomeRef = null;
    let wareHomeStock = null;
    let wareLegRef = null;
    let wareLegStock = null;

    let productCup = null;
    let productMilk = null;

    beforeEach(() => {
        address1 = new Address( "San Rafael", "Guinobatan", "4503", "Albay", "PH");
        address2 = new Address( "Embarcadero", "Legazpi", "4500", "Albay", "PH");

        addressVendor = new Address ("Somewhere in leg", "Legazpi", "4500", "Albay", "PH");
        addressVendor2 = new Address ("vendor2 in leg", "Legazpi", "4500", "Albay", "PH");

        vendor = new Vendor(1, "Cup Seller", true, addressVendor);
        vendor2 = new Vendor(2, "Milk Seller", true, addressVendor2);

        location1 = new Location( "HOME", "Home Location", "bahay", true, address1);
        location2 = new Location( "SHOP", "Main kiosk", "Shop at embarcadero", true, address2);

        wareHomeRef = new Warehouse("HOME_REF", "ref at home", "", true, true, location1);
        wareHomeStock = new Warehouse("HOME_STOCK", "Stock at home", "", false, true, location1);

        wareLegRef = new Warehouse("EMBARCADERO_REF", "ref at embarcadero", "", true, true, location2);
        wareLegStock = new Warehouse("EMBARCADERO_STOCK", "Stock at embarcadero", "", false, true, location2);

        productCup = new Product(1, "16_OZ+CUPS", 0.50, false, true);
        productMilk = new Product(2, "FRESH_MILK", 200.00, true, true);

    });
    test("add valid purchase order", () => {
        const po = PurchaseOrder.createNew(1, vendor!, new Date(), "");
        expect(po.orderStatusCode).toBe(OrderStatus.Draft);
        expect(po.canBeSetOrdered()).toBe(false);
        expect(po.canBeDraftCancelled()).toBe(true);

        const line1 = LineItem.createNew(1, productCup!, wareHomeStock!, 10, 0.4);
        po.addLineItem(line1);
        expect(po.canBeSetOrdered()).toBe(true);

    });
    test("add valid purchase order test can be ordered", () => {
        const po = PurchaseOrder.createNew(1, vendor!, new Date(), "Ordered now");
        expect(po.orderStatusCode).toBe(OrderStatus.Draft);
        expect(po.canBeSetOrdered()).toBe(false);
        expect(po.canBeDraftCancelled()).toBe(true);

        const line1 = LineItem.createNew(1, productCup!, wareHomeStock!, 10, 0.4);
        po.addLineItem(line1);
        expect(po.canBeSetOrdered()).toBe(true);
        po.setOrdered(new Date(), "All cool");
        expect(po.orderStatusCode).toBe(OrderStatus.Ordered);
        po.lineItems.forEach((item) => {
            expect(item.lineStatusCode).toBe(LineItemStatus.Ordered);
        });
    });
    test("Line item must make sure product is matched with correct warehouse", () => {
        // valid
        const line1 = LineItem.createNew(1, productCup!, wareHomeStock!, 10, 0.4);
        expect(line1).toBeDefined();
        // invalid,must throw exception
        let line2 = null;
        try {
            line2 = LineItem.createNew(1, productMilk!, wareHomeStock!, 10, 0.4);
        } catch (e: any) {
            expect(e.message).toBe("Products that require refrigeration must be assigned to refrigerated storage");
        }
        expect(line2).toBeNull();
    });

});
