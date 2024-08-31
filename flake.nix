{
    description = "BETH Stack";

    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    };

    outputs = { self, nixpkgs, flake-utils }:
        flake-utils.lib.eachDefaultSystem ( system:
        let
            pkgs = nixpkgs.legacyPackages.${ system };
        in {
            devShell = with pkgs; pkgs.mkShell { # rec {
                buildInputs = [
                    bun
                    nodejs_20
                    turso-cli
                    sqlite
                    sqld
                    flyctl
                    # python3Full
                    # cmake
                    # rustc
                    # pkg-config
                    # openssl
                    # python312Packages.protobuf
                    # python312Packages.numpy
                    # python312Packages.pybind11
                    # python312Packages.pip
                    # libstdcxx5
                    # cargo
                ];

                # shellHook = ''
                #   export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath buildInputs}:$LD_LIBRARY_PATH"
                #   export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib.outPath}/lib:$LD_LIBRARY_PATH" 
                #   export Protobuf_LIBRARIES="${pkgs.lib.getLib pkgs.python312Packages.protobuf}"
                #   export RUSTFLAGS="-A invalid_reference_casting"
                # '';
            };
        }
    );
}
