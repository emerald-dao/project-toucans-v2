import FungibleToken from "../utility/FungibleToken.cdc"
import ToucansTokens from "../ToucansTokens.cdc"

pub fun main(user: Address, tokenSymbol: String): Bool {

  // if the token symbol is for payments
  if let tokenInfo = ToucansTokens.getTokenInfoFromSymbol(symbol: tokenSymbol) {
    let vault = getAccount(user).getCapability(tokenInfo.receiverPath)
              .borrow<&{FungibleToken.Receiver}>()

    return vault != nil
  }

  return false
}