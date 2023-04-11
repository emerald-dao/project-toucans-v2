import NFTCatalog from "../utility/NFTCatalog.cdc"

pub fun main(): [String] {
  return NFTCatalog.getCatalogKeys()
}