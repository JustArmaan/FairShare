{
    description = "BETH Stack";

    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    };

    outputs = { self, nixpkgs, flake-utils }:
        flake-utils.lib.eachDefaultSystem ( system:
        let
            pkgs = import nixpkgs { inherit system; };
            nodejs = pkgs.nodejs-18_x;
        in with pkgs; rec {
            devShell = mkShell { 
                buildInputs = [
                    bun
                    nodejs_20
                    turso-cli
                    sqlite
                    sqld
                    flyctl
                    python311
                    node2nix
                ] ++ (with python311Packages; [
                    protobuf
                    numpy
                    pybind11
                    pillow
                    torch
                    transformers
                    flask
                    flask-cors
                    gunicorn
                ]);
            };

            packages.bunApp = stdenv.mkDerivation {
              pname = "bun-app";
              version = "1.0.0";
              src = ./.;

              buildInputs = [ nodejs bun ];


              buildPhase = ''
              '';

              installPhase = ''
                mkdir -p $out
                cp -r . $out/
              '';

              postInstall = ''
                cd $out
                echo "Building tailwind... "
                bun i
                bun tailwind-build 
                bun run build
              '';
            };

            packages.pythonApp = stdenv.mkDerivation {
                pname = "python-app";
                version = "1.0.0";
                src = ./.;

                buildInputs = [ python311 ] ++ (with python311Packages; [
                  protobuf
                  numpy
                  pybind11
                  pillow
                  torch
                  transformers
                  flask
                  flask-cors
                  gunicorn
                ]) ++ (nodePackages.sources);

                installPhase = ''
                  mkdir -p $out
                  cp -r . $out/
                '';
            };


          defaultPackage = packages.bunApp;
      }
    );
}
