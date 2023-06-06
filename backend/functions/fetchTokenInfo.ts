export async function fetchTokenInfo(contractName: string, contractAddress: string) {
  try {
    const response = await fetch(`https://app.increment.fi/info/tokeninfo?token=A.${contractAddress.slice(2)}.${contractName}`, {
    });
    return await response.json();
  } catch (e) {
    console.log(e);
    return null;
  }
}