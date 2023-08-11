import { env } from '$env/dynamic/public';

export async function fetchFlowPrice() {
    try {
        const response = await fetch('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=4558', {
            headers: {
                'X-CMC_PRO_API_KEY': env.PUBLIC_CMC_PRO_API_KEY,
            },
        });
        let json = await response.json();
        let flowPrice = json.data[4558].quote.USD.price;
        return flowPrice;
    } catch (e) {
        console.log(e);
        return null;
    }
}