pub contract interface ToucanToken {
  pub resource Vault {
    pub var balance: UFix64
  }

  pub resource Minter {
    pub fun mint(amount: UFix64): @Vault {
      post {
        result.balance == amount: "You did not mint the correct amount."
      }
    }
  }
}