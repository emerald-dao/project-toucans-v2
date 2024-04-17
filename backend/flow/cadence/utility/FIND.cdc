access(all) contract FIND {

	/// lookup if an address has a .find name, if it does pick either the default one or the first registered
	access(all) fun reverseLookup(_ address: Address): String? {
    return "jacob"
	}

	
}