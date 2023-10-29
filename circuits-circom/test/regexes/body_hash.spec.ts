import chai from "chai";
import path from "path";
import { F1Field, Scalar } from "ffjavascript";

export const p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(p);

const assert = chai.assert;

const wasm_tester = require("circom_tester").wasm;

const fs = require('fs');

describe("Body Hash  Regex", function () {
    jest.setTimeout(10 * 60 * 1000); // 10 minutes

    let cir;

    function textToAsciiArray(text: string): string[] {
        return Array.from(text).map(char => char.charCodeAt(0).toString());
    }

    beforeAll(async () => {
        cir = await wasm_tester(
            path.join(__dirname, "../mocks/test_body_hash_regex.circom"),
            {
                include: path.join(__dirname, "../../node_modules"),
                output: path.join(__dirname, "../../build/test_body_hash_regex"),
                recompile: true,
                verbose: true,
            }
        );
    });


    it("Should generate witnesses", async () => {
        const input = {
            "msg": ["102", "114", "111", "109", "58", "86", "101", "110", "109", "111", "32", "60", "118", "101", "110", "109", "111", "64", "118", "101", "110", "109", "111", "46", "99", "111", "109", "62", "13", "10", "114", "101", "112", "108", "121", "45", "116", "111", "58", "86", "101", "110", "109", "111", "32", "78", "111", "45", "114", "101", "112", "108", "121", "32", "60", "110", "111", "45", "114", "101", "112", "108", "121", "64", "118", "101", "110", "109", "111", "46", "99", "111", "109", "62", "13", "10", "116", "111", "58", "114", "105", "99", "104", "97", "114", "100", "108", "105", "97", "110", "103", "50", "48", "49", "53", "64", "117", "46", "110", "111", "114", "116", "104", "119", "101", "115", "116", "101", "114", "110", "46", "101", "100", "117", "13", "10", "115", "117", "98", "106", "101", "99", "116", "58", "89", "111", "117", "32", "112", "97", "105", "100", "32", "76", "97", "32", "70", "108", "101", "117", "114", "32", "83", "97", "108", "111", "110", "32", "36", "51", "48", "46", "48", "48", "13", "10", "109", "105", "109", "101", "45", "118", "101", "114", "115", "105", "111", "110", "58", "49", "46", "48", "13", "10", "99", "111", "110", "116", "101", "110", "116", "45", "116", "121", "112", "101", "58", "109", "117", "108", "116", "105", "112", "97", "114", "116", "47", "97", "108", "116", "101", "114", "110", "97", "116", "105", "118", "101", "59", "32", "98", "111", "117", "110", "100", "97", "114", "121", "61", "34", "45", "45", "45", "45", "61", "95", "80", "97", "114", "116", "95", "56", "57", "49", "50", "56", "57", "95", "57", "54", "49", "50", "51", "55", "48", "55", "57", "46", "49", "54", "56", "51", "54", "55", "51", "52", "51", "57", "55", "50", "56", "34", "13", "10", "109", "101", "115", "115", "97", "103", "101", "45", "105", "100", "58", "60", "48", "49", "48", "48", "48", "49", "56", "56", "48", "50", "99", "49", "100", "100", "101", "100", "45", "49", "55", "55", "54", "101", "55", "55", "52", "45", "98", "52", "51", "102", "45", "52", "56", "98", "51", "45", "56", "48", "56", "48", "45", "99", "102", "49", "99", "48", "100", "51", "52", "54", "53", "98", "99", "45", "48", "48", "48", "48", "48", "48", "64", "101", "109", "97", "105", "108", "46", "97", "109", "97", "122", "111", "110", "115", "101", "115", "46", "99", "111", "109", "62", "13", "10", "100", "97", "116", "101", "58", "84", "117", "101", "44", "32", "57", "32", "77", "97", "121", "32", "50", "48", "50", "51", "32", "50", "51", "58", "48", "51", "58", "53", "57", "32", "43", "48", "48", "48", "48", "13", "10", "100", "107", "105", "109", "45", "115", "105", "103", "110", "97", "116", "117", "114", "101", "58", "118", "61", "49", "59", "32", "97", "61", "114", "115", "97", "45", "115", "104", "97", "50", "53", "54", "59", "32", "113", "61", "100", "110", "115", "47", "116", "120", "116", "59", "32", "99", "61", "114", "101", "108", "97", "120", "101", "100", "47", "115", "105", "109", "112", "108", "101", "59", "32", "115", "61", "121", "122", "108", "97", "118", "113", "51", "109", "108", "52", "106", "108", "52", "108", "116", "54", "100", "108", "116", "98", "103", "109", "110", "111", "102", "116", "120", "102", "116", "107", "108", "121", "59", "32", "100", "61", "118", "101", "110", "109", "111", "46", "99", "111", "109", "59", "32", "116", "61", "49", "54", "56", "51", "54", "55", "51", "52", "51", "57", "59", "32", "104", "61", "70", "114", "111", "109", "58", "82", "101", "112", "108", "121", "45", "84", "111", "58", "84", "111", "58", "83", "117", "98", "106", "101", "99", "116", "58", "77", "73", "77", "69", "45", "86", "101", "114", "115", "105", "111", "110", "58", "67", "111", "110", "116", "101", "110", "116", "45", "84", "121", "112", "101", "58", "77", "101", "115", "115", "97", "103", "101", "45", "73", "68", "58", "68", "97", "116", "101", "59", "32", "98", "104", "61", "108", "48", "67", "109", "66", "48", "113", "74", "74", "103", "90", "49", "120", "120", "99", "98", "85", "51", "117", "80", "73", "83", "102", "101", "70", "76", "66", "69", "65", "102", "107", "66", "43", "118", "74", "104", "48", "82", "120", "54", "118", "54", "103", "61", "59", "32", "98", "61", "128"]
        };
        console.log(input.msg.length)
        const witness = await cir.calculateWitness(
            input,
            true
        );

        assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
    });

    it.only("Should match regex once", async () => {
        const input = {
            "msg": ["102", "114", "111", "109", "58", "86", "101", "110", "109", "111", "32", "60", "118", "101", "110", "109", "111", "64", "118", "101", "110", "109", "111", "46", "99", "111", "109", "62", "13", "10", "114", "101", "112", "108", "121", "45", "116", "111", "58", "86", "101", "110", "109", "111", "32", "78", "111", "45", "114", "101", "112", "108", "121", "32", "60", "110", "111", "45", "114", "101", "112", "108", "121", "64", "118", "101", "110", "109", "111", "46", "99", "111", "109", "62", "13", "10", "116", "111", "58", "114", "105", "99", "104", "97", "114", "100", "108", "105", "97", "110", "103", "50", "48", "49", "53", "64", "117", "46", "110", "111", "114", "116", "104", "119", "101", "115", "116", "101", "114", "110", "46", "101", "100", "117", "13", "10", "115", "117", "98", "106", "101", "99", "116", "58", "89", "111", "117", "32", "112", "97", "105", "100", "32", "76", "97", "32", "70", "108", "101", "117", "114", "32", "83", "97", "108", "111", "110", "32", "36", "51", "48", "46", "48", "48", "13", "10", "109", "105", "109", "101", "45", "118", "101", "114", "115", "105", "111", "110", "58", "49", "46", "48", "13", "10", "99", "111", "110", "116", "101", "110", "116", "45", "116", "121", "112", "101", "58", "109", "117", "108", "116", "105", "112", "97", "114", "116", "47", "97", "108", "116", "101", "114", "110", "97", "116", "105", "118", "101", "59", "32", "98", "111", "117", "110", "100", "97", "114", "121", "61", "34", "45", "45", "45", "45", "61", "95", "80", "97", "114", "116", "95", "56", "57", "49", "50", "56", "57", "95", "57", "54", "49", "50", "51", "55", "48", "55", "57", "46", "49", "54", "56", "51", "54", "55", "51", "52", "51", "57", "55", "50", "56", "34", "13", "10", "109", "101", "115", "115", "97", "103", "101", "45", "105", "100", "58", "60", "48", "49", "48", "48", "48", "49", "56", "56", "48", "50", "99", "49", "100", "100", "101", "100", "45", "49", "55", "55", "54", "101", "55", "55", "52", "45", "98", "52", "51", "102", "45", "52", "56", "98", "51", "45", "56", "48", "56", "48", "45", "99", "102", "49", "99", "48", "100", "51", "52", "54", "53", "98", "99", "45", "48", "48", "48", "48", "48", "48", "64", "101", "109", "97", "105", "108", "46", "97", "109", "97", "122", "111", "110", "115", "101", "115", "46", "99", "111", "109", "62", "13", "10", "100", "97", "116", "101", "58", "84", "117", "101", "44", "32", "57", "32", "77", "97", "121", "32", "50", "48", "50", "51", "32", "50", "51", "58", "48", "51", "58", "53", "57", "32", "43", "48", "48", "48", "48", "13", "10", "100", "107", "105", "109", "45", "115", "105", "103", "110", "97", "116", "117", "114", "101", "58", "118", "61", "49", "59", "32", "97", "61", "114", "115", "97", "45", "115", "104", "97", "50", "53", "54", "59", "32", "113", "61", "100", "110", "115", "47", "116", "120", "116", "59", "32", "99", "61", "114", "101", "108", "97", "120", "101", "100", "47", "115", "105", "109", "112", "108", "101", "59", "32", "115", "61", "121", "122", "108", "97", "118", "113", "51", "109", "108", "52", "106", "108", "52", "108", "116", "54", "100", "108", "116", "98", "103", "109", "110", "111", "102", "116", "120", "102", "116", "107", "108", "121", "59", "32", "100", "61", "118", "101", "110", "109", "111", "46", "99", "111", "109", "59", "32", "116", "61", "49", "54", "56", "51", "54", "55", "51", "52", "51", "57", "59", "32", "104", "61", "70", "114", "111", "109", "58", "82", "101", "112", "108", "121", "45", "84", "111", "58", "84", "111", "58", "83", "117", "98", "106", "101", "99", "116", "58", "77", "73", "77", "69", "45", "86", "101", "114", "115", "105", "111", "110", "58", "67", "111", "110", "116", "101", "110", "116", "45", "84", "121", "112", "101", "58", "77", "101", "115", "115", "97", "103", "101", "45", "73", "68", "58", "68", "97", "116", "101", "59", "32", "98", "104", "61", "108", "48", "67", "109", "66", "48", "113", "74", "74", "103", "90", "49", "120", "120", "99", "98", "85", "51", "117", "80", "73", "83", "102", "101", "70", "76", "66", "69", "65", "102", "107", "66", "43", "118", "74", "104", "48", "82", "120", "54", "118", "54", "103", "61", "59", "32", "98", "61", "128"]
        };
        const witness = await cir.calculateWitness(
            input,
            true
        );
        console.log(witness)
        assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)));
    });

    it("Should reveal regex correctly", async () => {
        const input = {
            "msg": textToAsciiArray("dkim-signature: v=1; a=rsa-sha256; c=relaxed/relaxed; s=5nXKKHgBnyGAcLwvMLZIq; d=aclmobile.net;h=Message-Id:Date:Mime-Version:Content-Type:To:Subject:From;bh=OYed8sPd8110+xJpSdFNiyJFGKysqXSXzULZNqtDwRU=;b=t0cQx++BSWRHt")
        };
        const witness = await cir.calculateWitness(
            input,
            true
        );
        const expected = Array(12).fill("0").concat(textToAsciiArray("venmo@venmo.com")).concat(Array(23).fill("0"));
        const result = witness.slice(2, 50 + 2);

        assert.equal(JSON.stringify(result), JSON.stringify(expected), true);
    });

    it("Should fail to match regex", async () => {
        const input = {
            "msg": textToAsciiArray("dkim-signature: v=1; a=rsa-sha256; c=relaxed/relaxed; s=5nXKKHgBnyGAcLwvMLZIq; d=aclmobile.net;h=Message-Id:Date:Mime-Version:Content-Type:To:Subject:From;bh=OYed8sPd8110+xJpSdFNiyJFGKysqXSXzULZNqtDwRU=;b=t0cQx++BSWRHt")
        };
        const witness = await cir.calculateWitness(
            input,
            true
        );

        assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)));
    });
});
