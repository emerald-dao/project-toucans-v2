import EmeraldIdentity from "../utility/EmeraldIdentity.cdc"
import FIND from "../utility/FIND.cdc"
access(all) fun main(discordIds: [String]): {String: AnyStruct} {
  // value is either a string (.find name) or address
  let answer: {String: AnyStruct} = {}
  for discordId in discordIds {
    let emeraldIds: [Address] = EmeraldIdentity.getEmeraldIDs(discordID: discordId).values
    if emeraldIds.length == 0 {
      answer[discordId] = "N/A"
    }
    for address in emeraldIds {
      if let name: String = FIND.reverseLookup(address) {
        answer[discordId] = name
        break
      }
    }
    if answer[discordId] == nil {
      answer[discordId] = emeraldIds[0]
    }
  }
  return answer
}