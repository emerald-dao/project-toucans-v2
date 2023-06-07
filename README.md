# Toucans

Create a token. Launch a DAO.

https://toucans.ecdao.org

## Contract Addresses

**Mainnet**

- Toucans: `0x577a3c409c5dcb5e`
- ToucansUtils: `0x577a3c409c5dcb5e`
- ToucansActions: `0x577a3c409c5dcb5e`
- ToucansTokens: `0x577a3c409c5dcb5e`

## Adding New Payment Currency

1. Add to `ECurrencies`
2. Add to `switchToToken` in flow/utils.ts
3. Add to `ToucansTokens` contract
4. Add to `get_balances.cdc` script
5. Add to `get_project.cdc` script
6. Add to `CurrencyInput.svelte`
7. Add to `CurrencySelect` params
8. Add to `TokenStore`