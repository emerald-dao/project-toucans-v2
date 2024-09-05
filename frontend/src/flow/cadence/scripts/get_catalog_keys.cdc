import NFTCatalog from "../utility/NFTCatalog.cdc"

access(all) fun main(): [String] {
  return NFTCatalog.getCatalogKeys()
}