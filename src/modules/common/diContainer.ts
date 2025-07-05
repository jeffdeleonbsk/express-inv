import { Container } from "brandi";
export const container = new Container();
export const TOKEN_MAP = new Map<string, any>();
export function getInstance(key: string): any {
    return container.get(TOKEN_MAP.get(key));
}
