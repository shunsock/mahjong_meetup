{
  description = "DevShell for Mahjong Dashboard (React + TypeScript + Vite)";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            pnpm
            go-task
          ];

          shellHook = ''
            echo "Mahjong Dashboard dev shell ready: node $(node --version) / pnpm $(pnpm --version)"
          '';
        };
      });
}
