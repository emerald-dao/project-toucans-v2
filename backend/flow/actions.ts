import "./config";
import * as fcl from "@onflow/fcl";
import { formatFix, getCadenceCode, replaceWithProperValues } from "./utils";

export const getTrendingData = async (
  projectIds: string[],
  contractAddresses: string[]
) => {
  try {
    return await fcl.query({
      cadence: getCadenceCode("get_trending_data.cdc", undefined, undefined),
      args: (arg, t) => [
        arg(projectIds, t.Array(t.String)),
        arg(contractAddresses, t.Array(t.Address)),
      ],
    });
  } catch (e) {
    console.log("Error in getTrendingData", e);
    return null;
  }
};

async function getSwapPairInfo(pairAddr) {
  const response = await fcl.query({
    cadence: `
      import SwapInterfaces from 0xb78ef7afa52ff906
      import SwapConfig from 0xb78ef7afa52ff906

      access(all) fun main(pairAddr: Address): [AnyStruct] {
        let pairPublicRef = getAccount(pairAddr)
          .capabilities.borrow<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
          ?? panic("cannot borrow reference to PairPublic resource")

        return pairPublicRef.getPairInfo()
      }
    `,
    args: (arg, t) => [arg(pairAddr, t.Address)],
  });
  return response;
}

export const calcTokenPrice = {
  FLOW: getQuoteToFlowPriceFromDex,
  USDC: getQuoteToUSDCPriceFromDex,
};

export function getLiquidityAmount(info) {
  if (info[0].includes("FlowToken")) {
    return parseFloat(info[2]);
  } else if (info[1].includes("FlowToken")) {
    return parseFloat(info[3]);
  } else if (info[0].includes("FiatToken")) {
    return parseFloat(info[2]);
  } else if (info[1].includes("FiatToken")) {
    return parseFloat(info[3]);
  } else {
    return null;
  }
}

function getQuoteToFlowPriceFromDex(info) {
  let numFlow = 0.0;
  let numQuote = 0.0;
  if (info[0].includes("FlowToken")) {
    numFlow = parseFloat(info[2]);
    // if (numFlow < 100) {
    //   return null;
    // }
    numQuote = parseFloat(info[3]);
  } else if (info[1].includes("FlowToken")) {
    numFlow = parseFloat(info[3]);
    // if (numFlow < 100) {
    //   return null;
    // }
    numQuote = parseFloat(info[2]);
  } else {
    return null;
  }
  // 1 quote token = xx flow
  return numFlow / numQuote || 0;
}

function getQuoteToUSDCPriceFromDex(info) {
  let numUsdc = 0.0;
  let numQuote = 0.0;
  if (info[0].includes("FiatToken")) {
    numUsdc = parseFloat(info[2]);
    // if (numUsdc < 100) {
    //   return null;
    // }
    numQuote = parseFloat(info[3]);
  } else if (info[1].includes("FiatToken")) {
    numUsdc = parseFloat(info[3]);
    // if (numUsdc < 100) {
    //   return null;
    // }
    numQuote = parseFloat(info[2]);
  } else {
    return null;
  }
  // 1 quote token = xx usdc
  return numUsdc / numQuote || 0;
}

export const getTrendingDatav2 = async (
  projectIds: string[],
  contractAddresses: string[],
  projectOwners: string[]
) => {
  try {
    const response = await fcl.query({
      cadence: replaceWithProperValues(
        generateGetTrendingDataScript(
          projectIds,
          contractAddresses,
          projectOwners
        ),
        undefined,
        undefined
      ),
      args: (arg, t) => [],
    });
    return response;
  } catch (e) {
    console.log("Error in getTrendingDatav2", e);
    return null;
  }
};

function generateGetTrendingDataScript(
  projectIds: string[],
  contractAddresses: (string | undefined)[],
  projectOwners: string[]
) {
  let imports = "";
  for (let i = 0; i < projectIds.length; i++) {
    if (contractAddresses[i] !== undefined) {
      let contractName =
        projectIds[i] == "FlovatarDAO" ? "FlovatarDustToken" : projectIds[i];
      imports += `\nimport ${contractName} from ${contractAddresses[i]}`;
    }
  }
  let mainCode = projectIds
    .map((v, i) => {
      if (contractAddresses[i] !== undefined) {
        let contractName = v === "FlovatarDAO" ? "FlovatarDustToken" : v;
        let maxSupply =
          v === "FlovatarDAO" ? "nil" : `${contractName}.maxSupply`;
        let holders =
          v === "FlovatarDAO" ? "[]" : `${contractName}.getBalances().keys`;
        return `\n
      let projectCollection${i} = getAccount(${projectOwners[i]}).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("User does not have a Toucans Collection")
  
      let project${i} = projectCollection${i}.borrowProjectPublic(projectId: "${v}")!
  
      let projectCurrencyIdentifier${i}: String = project${i}.projectTokenInfo.tokenType.identifier
      let paymentCurrencyIdentifier${i}: String = project${i}.paymentTokenInfo.tokenType.identifier
      var pairInfo${i}: [AnyStruct]? = nil
      if let pairAddress: Address = SwapFactory.getPairAddress(
        token0Key: projectCurrencyIdentifier${i}.slice(from: 0, upTo: projectCurrencyIdentifier${i}.length - 6), 
        token1Key: paymentCurrencyIdentifier${i}.slice(from: 0, upTo: paymentCurrencyIdentifier${i}.length - 6)
      ) {
        // GET PRICE
        let pairPublicRef = getAccount(pairAddress)
              .capabilities.borrow<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
              ?? panic("cannot borrow reference to PairPublic resource")
  
        pairInfo${i} = pairPublicRef.getPairInfo()
      }
  
      let treasuryBalances${i} = {
        "FLOW": project${i}.getVaultBalanceInTreasury(vaultType: Type<@FlowToken.Vault>()) ?? 0.0,
        "USDC": project${i}.getVaultBalanceInTreasury(vaultType: Type<@FiatToken.Vault>()) ?? 0.0,
        "stFlow": project${i}.getVaultBalanceInTreasury(vaultType: Type<@stFlowToken.Vault>()) ?? 0.0,
        project${i}.paymentTokenInfo.symbol: project${i}.getVaultBalanceInTreasury(vaultType: project${i}.paymentTokenInfo.tokenType) ?? 0.0,
        project${i}.projectTokenInfo.symbol: project${i}.getVaultBalanceInTreasury(vaultType: Type<@${contractName}.Vault>()) ?? 0.0
      }
      answer["${v}"] = Info(${contractName}.totalSupply, pairInfo${i}, project${i}.paymentTokenInfo.symbol, project${i}.borrowManagerPublic().getIDs().length, treasuryBalances${i}, ${maxSupply}, project${i}.totalFunding, project${i}.getFunders().keys, ${holders})
      `;
      } else {
        return `\n
      let projectCollection${i} = getAccount(${projectOwners[i]}).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                  ?? panic("User does not have a Toucans Collection")

      let project${i} = projectCollection${i}.borrowProjectPublic(projectId: "${v}")!

      let paymentCurrencyIdentifier${i}: String = project${i}.paymentTokenInfo.tokenType.identifier

      let treasuryBalances${i} = {
        "FLOW": project${i}.getVaultBalanceInTreasury(vaultType: Type<@FlowToken.Vault>()) ?? 0.0,
        "USDC": project${i}.getVaultBalanceInTreasury(vaultType: Type<@FiatToken.Vault>()) ?? 0.0,
        "stFlow": project${i}.getVaultBalanceInTreasury(vaultType: Type<@stFlowToken.Vault>()) ?? 0.0,
        project${i}.paymentTokenInfo.symbol: project${i}.getVaultBalanceInTreasury(vaultType: project${i}.paymentTokenInfo.tokenType) ?? 0.0
      }
      answer["${v}"] = Info(nil, nil, project${i}.paymentTokenInfo.symbol, project${i}.borrowManagerPublic().getIDs().length, treasuryBalances${i}, nil, project${i}.totalFunding, project${i}.getFunders().keys, [])
      `;
      }
    })
    .join("");
  let script = `
  import FungibleToken from "../utility/FungibleToken.cdc"
  import Toucans from "../Toucans.cdc"
  import FiatToken from "../utility/FiatToken.cdc"
  import FlowToken from "../utility/FlowToken.cdc"
  import SwapInterfaces from "../utility/SwapInterfaces.cdc"
  import SwapConfig from "../utility/SwapConfig.cdc"
  import SwapFactory from "../utility/SwapFactory.cdc"
  import stFlowToken from "../utility/stFlowToken.cdc"
  ${imports}

  access(all) fun main(): {String: Info} {
    let answer: {String: Info} = {}
    ${mainCode}
    return answer
  }

  access(all) struct Info {
    access(all) let totalSupply: UFix64?
    access(all) let pairInfo: [AnyStruct]?
    access(all) let paymentCurrency: String
    access(all) let numProposals: Int
    access(all) let treasuryBalances: {String: UFix64}
    access(all) let maxSupply: UFix64?
    access(all) let totalFunding: UFix64
    access(all) let funders: [Address]
    access(all) let holders: [Address]
  
    init(_ ts: UFix64?, _ pi: [AnyStruct]?, _ pc: String, _ np: Int, _ tb: {String: UFix64}, _ ms: UFix64?, _ tf: UFix64, _ f: [Address], _ h: [Address]) {
      self.totalSupply = ts
      self.pairInfo = pi
      self.paymentCurrency = pc
      self.numProposals = np
      self.treasuryBalances = tb
      self.maxSupply = ms
      self.totalFunding = tf
      self.funders = f
      self.holders = h
    }
  }
  `;
  return script;
}
