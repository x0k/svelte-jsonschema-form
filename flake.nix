{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-25.05";
    nixpkgs-unstable.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    mk.url = "github:x0k/mk";
  };
  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-unstable,
      mk,
    }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      unstablePkgs = import nixpkgs-unstable {
        inherit system;
      };
    in
    {
      devShells.${system} = {
        default = pkgs.mkShell {
          nativeBuildInputs = [
            unstablePkgs.playwright.browsers
          ];
          buildInputs = [
            mk.packages.${system}.default
            pkgs.nodejs_24
            pkgs.pnpm
          ];
          shellHook = ''
            export PLAYWRIGHT_BROWSERS_PATH=${unstablePkgs.playwright.browsers}
            source <(COMPLETE=''${SHELL##*/} mk)
          '';
        };
      };
    };
}
