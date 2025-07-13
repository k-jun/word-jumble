import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import { isSpecialCharacter } from "./main.ts";

describe("isSpecialCharacter", () => {
  describe("when title starts with punctuation", () => {
    const punctuationCases = [
      "!Hello",
      "!!",
      "!!!Fuck_You!!!",
      "!BYE_BYE",
      "!_(曖昧さ回避)",
      "!wagero!",
      "!［ai-ou］",
    ];

    punctuationCases.forEach((testCase) => {
      it(`should return true for "${testCase}"`, () => {
        expect(isSpecialCharacter(testCase)).toBe(true);
      });
    });
  });

  describe("when title starts with numbers", () => {
    const numberCases = [
      "123abc",
      "7ORDER_LIVE_TOUR",
      "3人のゴースト",
    ];

    numberCases.forEach((testCase) => {
      it(`should return true for "${testCase}"`, () => {
        expect(isSpecialCharacter(testCase)).toBe(false);
      });
    });
  });

  describe("when title starts with symbols", () => {
    const symbolCases = [
      "$money",
      "#hashtag",
      "￥記号",
      "🕴",
    ];

    symbolCases.forEach((testCase) => {
      it(`should return true for "${testCase}"`, () => {
        expect(isSpecialCharacter(testCase)).toBe(true);
      });
    });
  });

  describe("when title starts with whitespace", () => {
    const whitespaceCases = [
      " Hello",
      "\tTabbed",
    ];

    whitespaceCases.forEach((testCase) => {
      it(`should return true for "${testCase.replace(/\t/g, "\\t")}"`, () => {
        expect(isSpecialCharacter(testCase)).toBe(true);
      });
    });
  });

  describe("when title starts with Japanese characters", () => {
    const japaneseCases = [
      "あいうえお",
      "カタカナ",
      "漢字タイトル",
    ];

    japaneseCases.forEach((testCase) => {
      it(`should return false for "${testCase}"`, () => {
        expect(isSpecialCharacter(testCase)).toBe(false);
      });
    });
  });

  describe("when title starts with Latin letters", () => {
    const latinCases = [
      "Hello",
      "Music",
      "Open_Music_Cabinet",
    ];

    latinCases.forEach((testCase) => {
      it(`should return false for "${testCase}"`, () => {
        expect(isSpecialCharacter(testCase)).toBe(false);
      });
    });
  });

  describe("when title is empty or invalid", () => {
    it("should return false for empty string", () => {
      expect(isSpecialCharacter("")).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isSpecialCharacter(undefined as unknown as string)).toBe(false);
    });

    it("should return false for null", () => {
      expect(isSpecialCharacter(null as unknown as string)).toBe(false);
    });
  });

  describe("記号で始まるリスト", () => {
    const symbolCases = [
      "!test",
      '"quote',
      "$dollar",
      "%percent",
      "&and",
      "'single",
      "(paren",
      ")paren",
      "*star",
      "+plus",
      ",comma",
      "-dash",
      ".dot",
      "/slash",
    ];

    symbolCases.forEach((testCase) => {
      it(`should return true for "${testCase}"`, () => {
        expect(isSpecialCharacter(testCase)).toBe(true);
      });
    });
  });
});
