# Statescan
Statescan allows you to explorer and search the Kusama | Polkadot blockchain for assets.


# overview
The repo is split into a number of packages, each representing an application or a module. These are -
- [account-sync](/tree/master/packages/account-sync)
- [asset-scan](/tree/master/packages/asset-scan)
- [block-sync](/tree/master/packages/block-sync)
- [common](/tree/master/packages/common) Shared utilities for backend & scan packages.
- [next](/tree/master/packages/next) The SSR frontend pages, represents all UI components.
- [nft-scan](/tree/master/packages/nft-scan)
- [price](/tree/master/packages/price)
- [scan](/tree/master/packages/scan)
- [xcm-relay-scan](/tree/master/packages/xcm-relay-scan)
- [xcm-scan](/tree/master/packages/xcm-scan)

## Development
The repo uses yarn workspaces to organize the code. As such, after cloning dependencies should be installed via yarn, not via npm, the latter will result in broken dependencies.

1. To get started -
Clone the repo, `git clone https://github.com/opensquare-network/statescan.git`
2. Install dependency `yarn install`, node version >= 16 is required.
3. TBD Scan? SetDB? 
3. Launch frontend, `cd packages/next` `yarn dev`
4. Access the UI `http://localhost:6001`


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
