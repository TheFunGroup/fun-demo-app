export const isContract = async (address, provider) => {
  try {
    const code = await provider.getCode(address);
    if (code != '0x') return true;
  } catch (error) {
    return false
  }
  return false
}
