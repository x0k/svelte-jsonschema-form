{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-25.11";
    nixpkgs-unstable.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    playwright.url = "github:pietdevries94/playwright-web-flake/1.59.0";
    mk.url = "github:x0k/mk";
  };
  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-unstable,
      mk,
      playwright,
    }:
    let
      system = "x86_64-linux";
      overlay = final: prev: {
        inherit (playwright.packages.${system}) playwright-test playwright-driver;
      };
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ overlay ];
      };
      unstablePkgs = import nixpkgs-unstable {
        inherit system;
      };
      playwright-browsers = (
        pkgs.playwright-driver.browsers.override {
          withWebkit = false;
        }
      );
    in
    {
      devShells.${system} = {
        default = pkgs.mkShell {
          nativeBuildInputs = [
            playwright-browsers
          ];
          buildInputs = [
            mk.packages.${system}.default
            pkgs.nodejs_24
            pkgs.pnpm
          ];
          shellHook = ''
            export PLAYWRIGHT_BROWSERS_PATH=${playwright-browsers}
            source <(COMPLETE=''${SHELL##*/} mk)
          '';
        };
      };
    };
}
