function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter(event => {
    const { phase } = event
    return !phase.isNull && phase.value.toNumber() === extrinsicIndex
  })
}

function isExtrinsicSuccess(events) {
  return events.some(e => e.event.method === 'ExtrinsicSuccess')
}

function getExtrinsicSigner(extrinsic) {
  let signer = extrinsic._raw.signature.get("signer").toString();
  return signer;
}

module.exports = {
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  getExtrinsicSigner,
}
