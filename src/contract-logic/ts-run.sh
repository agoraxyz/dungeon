cargo run --manifest-path ../../zgen-solana/zgsol-glue/Cargo.toml -- --wasm ../../zgen-solana/zgsol-dungeon-client --schema ../../zgen-solana/zgsol-dungeon-contract --standalone
rm -r ../../wasm-factory
mv ../../zgen-solana/zgsol-dungeon-client/wasm-factory ../../
cp contract-logic/schema.ts ./
rm -r contract-logic
ts-node index.ts
