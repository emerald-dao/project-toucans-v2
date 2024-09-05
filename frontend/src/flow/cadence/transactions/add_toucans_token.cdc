import "ToucansTokens"
import "stFlowToken"

transaction() {
  
  prepare(admin: auth(Storage) &Account) {
    let adminRef = admin.storage.borrow<&ToucansTokens.Admin>(from: /storage/ToucansTokensAdmin)!
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
