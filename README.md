# Secret Sharing

Split a secret into shares using [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing) scheme. Need at least k of n shares to recover the original secret.

[Try it online](https://grabczak.github.io/secret-sharing/)

## Quick Start

```bash
npm install
npm run dev
```

## Usage

1. Enter a secret and set threshold (k) and total shares (n)
2. Click "Generate Shares" to split
3. Paste k or more shares and click "Reconstruct Secret" to recover

## License

GPLv3 © [grabczak](https://github.com/grabczak) 2026

## Credits

Uses [shamir-secret-sharing](https://github.com/privy-io/shamir-secret-sharing) by [Privy](https://github.com/privy-io)
