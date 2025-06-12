{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-25.05";
    mk.url = "github:x0k/mk";
  };
  outputs =
    {
      self,
      nixpkgs,
      mk,
    }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.${system} = {
        default = pkgs.mkShell {
          nativeBuildInputs = [
            pkgs.playwright.browsers
          ];
          buildInputs = [
            mk.packages.${system}.default
            pkgs.nodejs_24
            pkgs.pnpm
          ];
          shellHook = ''
            export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright.browsers}
            source <(COMPLETE=''${SHELL##*/} mk)
          '';
        };
      };
    };
}
