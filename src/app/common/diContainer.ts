import { Container } from "brandi";
export const container = new Container();
export function getInstance(key: any): any {
    return container.get(key);
}
