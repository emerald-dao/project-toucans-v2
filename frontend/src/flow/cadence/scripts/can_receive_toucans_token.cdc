import "FungibleToken"
import "ToucansTokens"

access(all) fun main(user: Address, tokenSymbol: String): Bool {

  // if the token symbol is for payments
  if let tokenInfo = ToucansTokens.getTokenInfoFromSymbol(symbol: tokenSymbol) {
    let vault = getAccount(user).capabilities.borrow<&{FungibleToken.Receiver}>(tokenInfo.receiverPath)

    return vault != nil
  }

  return false
}