/**

# Factory contract for creating new trading pairs.

# Author: Increment Labs

*/
import FungibleToken from "./FungibleToken.cdc"
import SwapError from "./SwapError.cdc"
import SwapConfig from "./SwapConfig.cdc"
import SwapInterfaces from "./SwapInterfaces.cdc"

access(all) contract SwapFactory {
    /// Account which has deployed pair template contract
    access(all) var pairContractTemplateAddress: Address

    /// All pairs' address array
    access(self) let pairs: [Address]
    /// pairMap[token0Identifier][token1Identifier] == pairMap[token1Identifier][token0Identifier]
    access(self) let pairMap: { String: {String: Address} }

    /// Pair admin key might be attached in the beginning for the sake of safety reasons,
    /// but it'll be revoked in future for a pure decentralized exchange.
    access(all) var pairAccountPublicKey: String?

    /// Fee receiver address
    access(all) var feeTo: Address?

    /// Reserved parameter fields: {ParamName: Value}
    access(self) let _reservedFields: {String: AnyStruct}

    /// Events
    access(all) event PairCreated(token0Key: String, token1Key: String, pairAddress: Address, numPairs: Int)
    access(all) event PairTemplateAddressChanged(oldTemplate: Address, newTemplate: Address)
    access(all) event FeeToAddressChanged(oldFeeTo: Address?, newFeeTo: Address?)
    access(all) event PairAccountPublicKeyChanged(oldPublicKey: String?, newPublicKey: String?)

  

    
    
    access(all) fun getPairAddress(token0Key: String, token1Key: String): Address? {
        let pairExist0To1 = self.pairMap.containsKey(token0Key) && self.pairMap[token0Key]!.containsKey(token1Key)
        let pairExist1To0 = self.pairMap.containsKey(token1Key) && self.pairMap[token1Key]!.containsKey(token0Key)
        if (pairExist0To1 && pairExist1To0) {
            return self.pairMap[token0Key]![token1Key]!
        } else {
            return nil
        }
    }

    // access(all) fun getPairInfo(token0Key: String, token1Key: String): AnyStruct? {
    //     var pairAddr = self.getPairAddress(token0Key: token0Key, token1Key: token1Key)
    //     if pairAddr == nil {
    //         return nil
    //     }
    //     return getAccount(pairAddr!).getCapability<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath).borrow()!.getPairInfo()
    // }

    access(all) fun getAllPairsLength(): Int {
        return self.pairs.length
    }




    /// Admin function to update feeTo and pair template
    ///
    access(all) resource Admin {
        access(all) fun setPairContractTemplateAddress(newAddr: Address) {
            emit PairTemplateAddressChanged(oldTemplate: SwapFactory.pairContractTemplateAddress, newTemplate: newAddr)
            SwapFactory.pairContractTemplateAddress = newAddr
        }
        access(all) fun setFeeTo(feeToAddr: Address) {
            emit FeeToAddressChanged(oldFeeTo: SwapFactory.feeTo, newFeeTo: feeToAddr)
            SwapFactory.feeTo = feeToAddr
        }
        access(all) fun setPairAccountPublicKey(publicKey: String?) {
            emit PairAccountPublicKeyChanged(oldPublicKey: SwapFactory.pairAccountPublicKey, newPublicKey: publicKey)
            SwapFactory.pairAccountPublicKey = publicKey
        }
    }

    init() {
        self.pairContractTemplateAddress = 0xf8d6e0586b0a20c7
        self.pairs = []
        self.pairMap = {}
        self.pairAccountPublicKey = nil
        self.feeTo = nil
        self._reservedFields = {}

    }
}