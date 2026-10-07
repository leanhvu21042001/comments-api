export default function buildMakeSource ({ isValidIp }) {
  class Source {
    constructor ({ ip, browser, referrer } = {}) {
      if (!ip) {
        throw new Error('Comment source must contain an IP.')
      }
      if (!isValidIp(ip)) {
        throw new RangeError('Comment source must contain a valid IP.')
      }

      this.ip = ip
      this.browser = browser
      this.referrer = referrer
    }

    getIp () {
      return this.ip
    }

    getBrowser () {
      return this.browser
    }

    getReferrer () {
      return this.referrer
    }
  }

  return function makeSource (sourceInfo) {
    return new Source(sourceInfo)
  }
}
