// record the addresses which may change in one scanning block
const addresses = [];

function addAddress(addr) {
  addresses.push(addr);
}

function addAddresses(addrs = []) {
  addresses.push(...addrs);
}

function getAddresses() {
  return addresses;
}

function clearAddresses() {
  addresses.slice(0, addresses.length);
}

module.exports = {
  addAddress,
  addAddresses,
  getAddresses,
  clearAddresses,
};
