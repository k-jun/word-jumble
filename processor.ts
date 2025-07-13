// Wikipediaダンプファイルのダウンロードとタイトル抽出を行うスクリプト

import { gunzip } from "https://deno.land/x/compress@v0.4.5/mod.ts";

const WIKIPEDIA_DUMP_URL = "https://dumps.wikimedia.org/jawiki/latest/";
const TITLES_FILE = "jawiki-latest-all-titles-in-ns0.gz";
const OUTPUT_FILE = "./words.txt";

async function download(): Promise<void> {
    const response = await fetch(`${WIKIPEDIA_DUMP_URL}${TITLES_FILE}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const compressedData = await response.arrayBuffer();
    const decompressedData = gunzip(new Uint8Array(compressedData));
    const text = new TextDecoder().decode(decompressedData);
    
    await Deno.writeTextFile(OUTPUT_FILE, text);
}

export function isSpecialCharacter(title: string): boolean {
    // 特殊文字・記号・空白文字で始まる場合はtrueを返す
    // \p{P} = 句読点 (Punctuation)
    // \p{S} = 記号 (Symbol)  
    // \p{Z} = 区切り文字 (Separator)
    // \s = 空白文字 (Whitespace)
    return /^[\p{P}\p{S}\p{Z}\s]/u.test(title);
}

export function isYear(title: string): boolean {
    return /^[0-9]{4}年/.test(title);
}

export function isPrefecture(title: string): boolean {
    const prefecturePattern = /^(北海道|東京都|大阪府|京都府|青森県|岩手県|宮城県|秋田県|山形県|福島県|茨城県|栃木県|群馬県|埼玉県|千葉県|神奈川県|新潟県|富山県|石川県|福井県|山梨県|長野県|岐阜県|静岡県|愛知県|三重県|滋賀県|兵庫県|奈良県|和歌山県|鳥取県|島根県|岡山県|広島県|山口県|徳島県|香川県|愛媛県|高知県|福岡県|佐賀県|長崎県|熊本県|大分県|宮崎県|鹿児島県|沖縄県)/;
    return prefecturePattern.test(title);
}

function trimGrep(title: string): string {
    // タイトルが '_(...)' というパターン（例: "記事名_(曖昧さ回避)"）にマッチした場合に削除する
    // 例: "タイトル_(XXX)" → "タイトル"
    // 戻り値: マッチした場合は空文字列、そうでなければ元のタイトル
    return title.trim().replace(/_\(.+\)$/, "");
}

async function filter(): Promise<void> {
    const text = await Deno.readTextFile(OUTPUT_FILE);
    const lines = text.split('\n');
    const titles = new Set<string>();

    for (let i = 0; i < lines.length; i++) {
        if (i === 0 && lines[i].trim() === 'page_title') {
            continue;
        }

        const title = trimGrep(lines[i]);
        if (isSpecialCharacter(title)) {
           continue 
        }
        if (isYear(title)) {
            continue
        }
        if (isPrefecture(title)) {
            continue
        }

        titles.add(title);
    }

    await Deno.writeTextFile(OUTPUT_FILE, Array.from(titles).join('\n'));
}

async function process(): Promise<void> {
    await download();
    await filter();
}

async function main(): Promise<void> {
    try {
        await process();
    } catch (error: unknown) {
        const errorMessage = new TextEncoder().encode(`Error: ${error}\n`);
        await Deno.stdout.write(errorMessage);
        Deno.exit(1);
    }
}

if (import.meta.main) {
    main();
} 