import { IncomingMessage, ServerResponse } from "http"
import { Socket } from "net"

type TrustFn = (remoteAddress: string | undefined) => boolean

export interface Options {
  trustProxy: boolean | TrustFn
}

type Protocol = "http" | "https"

export const getProtocol = (
  trustFn: TrustFn,
  req: IncomingMessage
): Protocol => {
  const connection: Socket & { encrypted?: true } = req.connection

  const proto: Protocol = connection.encrypted ? "https" : "http"

  if (!trustFn(connection.remoteAddress)) {
    return proto
  }

  // Note: X-Forwarded-Proto is normally only ever a
  //       single value, but this is to be safe.
  const header = (req.headers["x-forwarded-proto"] as string) || proto
  const index = header.indexOf(",")

  return (index !== -1 ? header.slice(0, index) : header)
    .trim()
    .toLowerCase() as Protocol
}

const protocol = <I extends IncomingMessage, R extends ServerResponse>(
  innerListener: (req: I & { protocol?: string }, res: R) => void,
  options?: Partial<Options>
): ((req: I, res: R) => void) => {
  const _options: Options = { trustProxy: false, ...options }
  const trustFn =
    typeof _options.trustProxy === "function"
      ? _options.trustProxy
      : ((() => _options.trustProxy) as TrustFn)
  const _getProtocol = getProtocol.bind(null, trustFn)

  return (req, res) =>
    innerListener(Object.assign(req, { protocol: _getProtocol(req) }), res)
}

export default protocol
