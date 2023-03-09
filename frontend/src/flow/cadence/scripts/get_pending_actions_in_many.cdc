import Toucans from "../Toucans.cdc"

pub fun main(projectOwners: [Address], projectIds: [String]): [{UInt64: String}] {
  pre {
    projectOwners.length == projectIds.length: "Must input same number of inputs."
  }
  let answer: [{UInt64: String}] = []
  var i = 0
  while i < projectOwners.length {
    let projectCollection = getAccount(projectOwners[i]).getCapability(Toucans.CollectionPublicPath)
                .borrow<&Toucans.Collection{Toucans.CollectionPublic}>()
                ?? panic("User does not have a Toucans Collection")

    answer.append(projectCollection.borrowProjectPublic(projectId: projectIds[i])!.borrowManagerPublic().getIntents())
  }

  return answer
}

