import * as fcl from "@onflow/fcl";
import { supabase } from "../supabaseClient";

export async function fetchFlowPrice() {
  const { data } = await supabase.from("price_api").select("price").eq("id", 1);
  return data[0].price;
}

export async function fetchCoinMarketCapFlowPrice() {
  try {
    const response = await fetch(
      "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=4558",
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_PRO_API_KEY,
        },
      }
    );
    let json = await response.json();
    let flowPrice = json.data[4558].quote.USD.price;
    return flowPrice;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const fetchStFlowPrice = async (flowPrice) => {
  try {
    let tokenInKey = "A.1654653399040a61.FlowToken";

    let stFlowPriceRelativeToFlow = await fcl.query({
      cadence: `
      import FlowToken from 0x1654653399040a61
      import stFlowToken from 0xd6f80565193ad727
      import SwapFactory from 0xb063c16cac85dbd1
      import SwapInterfaces from 0xb78ef7afa52ff906
      import SwapConfig from 0xb78ef7afa52ff906

      // stable pair is generally better so we use 
      // that for now. but if we want to compare between
      // v1 and stable, then uncomment the code below
      pub fun main(amountIn: UFix64, tokenInKey: String): UFix64 {
          // let pairv1Address: Address = 0x396c0cda3302d8c5
          // let pairv1PublicRef = getAccount(pairv1Address)
          //     .getCapability<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
          //     .borrow()
          //     ?? panic("cannot borrow reference to PairPublic resource")

          // let pairv1Info = pairv1PublicRef.getPairInfo()

          let pairStableAddress: Address = 0xc353b9d685ec427d
          let pairStablePublicRef = getAccount(pairStableAddress)
              .getCapability<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
              .borrow()
              ?? panic("cannot borrow reference to PairPublic resource")

          let amountOut = pairStablePublicRef.getAmountOut(amountIn: amountIn, tokenInKey: tokenInKey)

          // if pairv1Info[5] as! UFix64 > pairStableInfo[5] as! UFix64 {
          //     return pairv1Info
          // } else {
          //     return pairStableInfo
          // }

          return amountOut
      }
      `,
      args: (arg, t) => [arg("1.0", t.UFix64), arg(tokenInKey, t.String)],
    });
    return Number(stFlowPriceRelativeToFlow) * flowPrice;
  } catch (e) {
    console.log("Error in fetchStFlowPriceRelativeToFlow", e);
    throw new Error("Error in fetchStFlowPriceRelativeToFlow");
  }
};
