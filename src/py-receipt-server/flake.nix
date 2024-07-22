{
    description = "Python runtime";

    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    };

    outputs = { self, nixpkgs, flake-utils }:
        flake-utils.lib.eachDefaultSystem ( system:
        let
            pkgs = nixpkgs.legacyPackages.${ system };
        in {
            devShell = with pkgs; pkgs.mkShell rec {
                buildInputs = [
                    python3Full
                    cmake
                    rustc
                    pkg-config
                    openssl
                    python312Packages.protobuf
                    python312Packages.numpy
                    python312Packages.pybind11
                    libstdcxx5
                ];
                  
                shellHook = ''
                  export Protobuf_LIBRARIES="${pkgs.lib.getLib pkgs.python312Packages.protobuf}"
                  export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath buildInputs}:$LD_LIBRARY_PATH"
                  export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib.outPath}/lib:$LD_LIBRARY_PATH" 
                  export RUSTFLAGS="-A invalid_reference_casting"

                  # export CMAKE_ARGS="-DONNX_USE_PROTOBUF_SHARED_LIBS=OFF"

                  if [ ! -d "./.venv" ]; then
                    python -m venv .venv
                    echo ".venv directory created."
                  else
                    echo ".venv directory already exists."
                  fi

                  source .venv/bin/activate
                  pip install -r requirements.txt
                  
                '';
            };
        }
    );
}
