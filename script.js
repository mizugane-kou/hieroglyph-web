const adviceList = [
    "「これ、語順をこう…グッと寄せるのがコツなのよ(笑)」",
    "「余計な情報は捨てちゃって。気持ちで伝わるから大丈夫！」",
    "「シャノンさん？よく知らないけど、もっと気楽にやればいいのにねえ。」",
    "「あら、そんなに細かく書かなくていいのよ。これ一文字で十分！」",
    "「見て。この鳥さんの向き。これで意味が全然変わるのよ(笑)」",
    "「ほら、子音だけ並べるとそれっぽいでしょ？これが古の圧縮術よ。」",
    "「シャノンさんもびっくり。意味が伝わるギリギリを攻めるのがコツね。」",
];    

// ヒエログリフ一子音文字マッピング
const phonogramMap = {
    'あ': '𓄿', 'い': '𓇋', 'う': '𓅱', 'え': '𓇋', 'お': '𓅱',
    'か': '𓎗', 'き': '𓎗', 'く': '𓎗', 'け': '𓎗', 'こ': '𓎗',
    'が': '𓎼', 'ぎ': '𓎼', 'ぐ': '𓎼', 'げ': '𓎼', 'ご': '𓎼',
    'さ': '𓊃', 'し': '𓈓', 'す': '𓊃', 'せ': '𓊃', 'そ': '𓊃',
    'ざ': '𓊃', 'じ': '𓆓', 'ず': '𓊃', 'ぜ': '𓊃', 'ぞ': '𓊃',
    'た': '𓏏', 'ち': '𓍿', 'つ': '𓏏', 'て': '𓏏', 'と': '𓏏',
    'だ': '𓂧', 'ぢ': '𓆓', 'づ': '𓂧', 'で': '𓂧', 'ど': '𓂧',
    'な': '𓈖', 'に': '𓈖', 'ぬ': '𓈖', 'ね': '𓈖', 'の': '𓈖',
    'は': '𓉔', 'ひ': '𓉔', 'ふ': '𓆑', 'へ': '𓉔', 'ほ': '𓉔',
    'ば': '𓃀', 'び': '𓃀', 'ぶ': '𓃀', 'べ': '𓃀', 'ぼ': '𓃀',
    'ぱ': '𓊪', 'ぴ': '𓊪', 'ぷ': '𓊪', 'ぺ': '𓊪', 'ぽ': '𓊪',
    'ま': '𓅓', 'み': '𓅓', 'む': '𓅓', 'め': '𓅓', 'も': '𓅓',
    'や': '𓇌', 'ゆ': '𓇌', 'よ': '𓇌',
    'ら': '𓂋', 'り': '𓂋', 'る': '𓂋', 'れ': '𓂋', 'ろ': '𓂋',
    'わ': '𓅱', 'を': '𓅱', 'ん': '𓈖',
    'a': '𓄿', 'b': '𓃀', 'c': '𓎗', 'd': '𓂧', 'e': '𓇋', 'f': '𓆑', 'g': '𓎼',
    'h': '𓉔', 'i': '𓇋', 'j': '𓆓', 'k': '𓎗', 'l': '𓂋', 'm': '𓅓', 'n': '𓈖',
    'o': '𓅱', 'p': '𓊪', 'q': '𓈎', 'r': '𓂋', 's': '𓊃', 't': '𓏏', 'u': '𓅱',
    'v': '𓆑', 'w': '𓅱', 'x': '𓎗𓊃', 'y': '𓇌', 'z': '𓊃'
};

const subMap = { 'ゃ': '𓇌', 'ゅ': '𓇌', 'ょ': '𓇌', 'っ': '', 'ー': '', ' ': '' };
const fillers = ['𓏛', '𓏲', '𓍢', '𓈓', '𓇳', '𓆰', '𓈗', '𓊖'];
const auntFavoriteGlyphs = ['𓁙', '𓀀', '𓃠', '𓅓', '𓆗', '𓃻', '𓉐'];

function katakanaToHiragana(src) {
    return src.replace(/[\u30a1-\u30f6]/g, m => String.fromCharCode(m.charCodeAt(0) - 0x60));
}

function getRandomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

document.getElementById('compressBtn').addEventListener('click', () => {
    let input = document.getElementById('inputText').value;
    const outputElement = document.getElementById('outputGlyphs');
    const adviceElement = document.getElementById('adviceText');

    if (!input.trim()) {
        adviceElement.innerText = "「あら、何か書かないと圧縮できないわよ？」";
        return;
    }

    input = katakanaToHiragana(input);

    let glyphResult = [];
    for (let char of input) {
        const lowerChar = char.toLowerCase();
        if (phonogramMap[lowerChar]) {
            glyphResult.push(phonogramMap[lowerChar]);
        } else if (subMap[lowerChar] !== undefined) {
            if (subMap[lowerChar] !== '') glyphResult.push(subMap[lowerChar]);
        } else {
            const dice = Math.random();
            if (dice < 0.4) glyphResult.push(getRandomFrom(auntFavoriteGlyphs));
            else if (dice < 0.7) continue;
            else if (glyphResult.length > 0) glyphResult.push(glyphResult[glyphResult.length - 1]);
        }
    }

    if (glyphResult.length === 0) glyphResult = ['𓏛'];

    // --- おばさんの「見た目」物理改行ロジック ---
    
    // 1. 1行あたりの文字数を決定（ルートをとって四角く）
    let sideCount = Math.ceil(Math.sqrt(glyphResult.length));
    if (sideCount < 2) sideCount = 2;

    // 長くなりすぎないよう上限を設ける
    if (sideCount > 8) sideCount = 8;

    // 2. フィラーで埋めて、完璧なブロック（四角形）にする
    const rowCount = Math.ceil(glyphResult.length / sideCount);
    const totalSlots = sideCount * rowCount;
    while (glyphResult.length < totalSlots) {
        glyphResult.push(getRandomFrom(fillers));
    }

    // 3. おばさんの書字方向
    const isRTL = Math.random() > 0.5;
    
    // 4. 改行を物理的に挿入して文字列を構築
    let finalLines = [];
    for (let i = 0; i < rowCount; i++) {
        let row = glyphResult.slice(i * sideCount, (i + 1) * sideCount);
        if (isRTL) row.reverse();
        finalLines.push(row.join(""));
    }

    // 5. 文字サイズを動的に調整（おばさんの気遣い）
    // 文字数が多いほど小さくする
    let fontSize = 4;
    if (glyphResult.length > 30) fontSize = 3;
    if (glyphResult.length > 60) fontSize = 2.5;
    outputElement.style.fontSize = fontSize + "rem";

    // 反転表示（左右）
    outputElement.style.direction = isRTL ? 'rtl' : 'ltr';

    outputElement.innerText = finalLines.join("\n");

    const randomAdvice = adviceList[Math.floor(Math.random() * adviceList.length)];
    adviceElement.innerText = (isRTL ? "「こうしてみるのはどうかしら？」\n" : "") + randomAdvice;

    outputElement.style.opacity = 0;
    setTimeout(() => {
        outputElement.style.opacity = 1;
        outputElement.style.transition = "opacity 0.5s";
    }, 50);
});
