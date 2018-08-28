import Driver from "./driver";
import Exchange from "../models/schemas/exchangeDataSchema";

import { OKEX } from "../config/exchanges";
import proxyConfig from "../config/proxy";

export default class OkexDriver extends Driver {

    prepareUrl(): string {
        const fixedPair = this.pair.replace("/", "_").toLowerCase();

        if (!proxyConfig.usage[OKEX]) {
            return `https://www.okex.com/api/v1/ticker.do?symbol=${fixedPair}`;
        } else {
            const {
                URLs: proxyURLs
            } = proxyConfig;

            const proxyRandom = Math.floor(Math.random() * (proxyURLs.length + 1));

            if (proxyRandom < proxyURLs.length) {
                return `${proxyURLs[proxyRandom]}market=okex&coin=${fixedPair}`;
            } else {
                return `https://www.okex.com/api/v1/ticker.do?symbol=${fixedPair}`;
            }
        }

    }

    transformData(data: any): any {
        const exchange = data.ticker;
        return new Exchange({time: Date.now(), pairName: this.pair, ask: exchange.sell, bid: exchange.buy, exchangeName: OKEX});
    }

}