import chai from "chai";
import path from "path";
import { F1Field, Scalar } from "ffjavascript";

export const p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(p);

const assert = chai.assert;

const wasm_tester = require("circom_tester").wasm;

const fs = require('fs');

describe("Venmo amount", function () {
    jest.setTimeout(10 * 60 * 1000); // 10 minutes

    let cir;

    beforeAll(async () => {
        cir = await wasm_tester(
            path.join(__dirname, "../mocks/test_venmo_amount.circom"),
            {
                include: path.join(__dirname, "../../node_modules"),
                output: path.join(__dirname, "../../build/test_venmo_amount"),
                recompile: true,
                verbose: true,
            }
        );
    });


    it("Should generate witnesses", async () => {
        const input = {
            "msg": [
                "101","101","101","101","101","32","101","101","101","101","101","32","36",
                "50","44","53","48","48","46","48","48", // Regex match
                "13","10","109","105","109","101"
            ]
        };
        const witness = await cir.calculateWitness(
            input,
            true
        );

        assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
    });

    it("Should match regex once", async () => {
        const input = {
            "msg": [
                "101","101","101","101","101","32","101","101","101","101","101","32","36",
                "50","44","53","48","48","46","48","48", // Regex match
                "13","10","109","105","109","101"
            ]
        };
        const witness = await cir.calculateWitness(
            input,
            true
        );

        assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)));
    });

    it("Should reveal regex correctly", async () => {
        const input = {
            "msg": [
                "101","101","101","101","101","32","101","101","101","101","101","32","36",
                "50","44","53","48","48","46","48","48", // Regex match
                "13","10","109","105","109","101"
            ]
        };
        const witness = await cir.calculateWitness(
            input,
            true
        );
        const expected = [
            "0","0","0","0","0","0","0","0","0","0","0","0","0",
            "50","44","53","48","48","46","48","48", // Regex match
            "0","0","0","0","0","0"
        ]
        const result = witness.slice(2, 27 + 2);

        assert.equal(JSON.stringify(result), JSON.stringify(expected), true);
    });

    it("Should fail to match regex", async () => {
        const input = {
            "msg": [
                "101","101","101","101","101","32","101","101","101","101","101","32","68", // Update to 68
                "50","44","53","48","48","46","48","48",
                "13","10","109","105","109","101"
            ]
        };
        const witness = await cir.calculateWitness(
            input,
            true
        );

        assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
    });
});