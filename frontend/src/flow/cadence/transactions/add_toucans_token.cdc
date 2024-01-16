import ToucansTokens from "../ToucansTokens.cdc"
import stFlowToken from "../utility/stFlowToken.cdc"

transaction() {
  
  prepare(admin: AuthAccount) {
    let adminRef = admin.borrow<&ToucansTokens.Admin>(from: /storage/ToucansTokensAdmin)!
    adminRef.addToken(tokenInfo: ToucansTokens.TokenInfo(
        "stFlowToken", 
        ToucansTokens.stringToAddress(stringAddress: stFlowToken.getType().identifier.slice(from: 2, upTo: 18)), 
        "stFlow", 
        /public/stFlowTokenReceiver, 
        /public/stFlowTokenBalance,
        /storage/stFlowTokenVault
    ))
  }

  execute {
    
  }
}
