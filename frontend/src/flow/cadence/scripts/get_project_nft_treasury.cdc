import Toucans from "../Toucans.cdc"
import MetadataViews from "../utility/MetadataViews.cdc"
import NFTCatalog from "../utility/NFTCatalog.cdc"

access(all) fun main(projectOwner: Address, projectId: String): {String: [NFTData]} {
    let res: {String: [NFTData]} = {}
    let projectCollection = getAccount(projectOwner).capabilities.borrow<&Toucans.Collection>(Toucans.CollectionPublicPath)
                ?? panic("User does not have a Toucans Collection")
    let project = projectCollection.borrowProjectPublic(projectId: projectId)!

    for collectionType in project.getCollectionTypesInTreasury() {
        let nftRefs = project.getNFTRefs(collectionType: collectionType)
        if nftRefs.length == 0 {
            continue
        }
        let nftDatas: [NFTData] = []
        let nftTypeIdentifier: String = nftRefs[0].getType().identifier
        // let collectionIdentifier = NFTCatalog.getCollectionsForType(nftTypeIdentifier: nftTypeIdentifier)!.keys[0]
        for nftRef in nftRefs {
            let display = nftRef.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
            var serialNum: UInt64? = nil
            if let serialView = nftRef.resolveView(Type<MetadataViews.Serial>()) {
                if let serial = serialView as? MetadataViews.Serial {
                    serialNum = serial.number
                }
            }
            var traitsOpt: MetadataViews.Traits? = nil
            if let traitsView = nftRef.resolveView(Type<MetadataViews.Traits>()) {
                if let traits = traitsView as? MetadataViews.Traits {
                    traitsOpt = traits
                }
            }
            nftDatas.append(NFTData(nftRef.uuid, nftRef.id, display.name, display.thumbnail.uri(), serialNum, traitsOpt))
        }
        res[collectionType.identifier] = nftDatas
    }
    return res
}

access(all) struct NFTData {
    access(all) let uuid: UInt64
    access(all) let id: UInt64
    access(all) let name: String
    access(all) let thumbnail: String
    access(all) let serial: UInt64?
    access(all) let traits: [MetadataViews.Trait]

    init(_ uuid: UInt64, _ id: UInt64, _ name: String, _ thumbnail: String, _ serial: UInt64?, _ traits: MetadataViews.Traits?) {
        self.uuid = uuid
        self.id = id
        self.name = name
        self.thumbnail = thumbnail
        self.serial = serial
        self.traits = traits?.traits ?? []
    }
}

