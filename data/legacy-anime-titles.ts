// Legacy title aliases only: used to migrate selectedAnime, never to populate the catalog.

type AnimeItem = {
  titleZh: string
  titleEn: string
  titleJa: string
}

type Data = {
  [key: string]: AnimeItem[]
}

const data: Data = {
  "2006": [
    {
      titleZh: "死亡笔记",
      titleEn: "Death Note",
      titleJa: "DEATH NOTE",
    },
    { titleZh: "银魂", titleEn: "Gintama", titleJa: "銀魂" },
    {
      titleZh: "寒蝉鸣泣之时",
      titleEn: "Higurashi When They Cry",
      titleJa: "ひぐらしのなく頃に",
    },
    {
      titleZh: "Code Geass 反叛的鲁路修",
      titleEn: "Code Geass: Lelouch of the Rebellion",
      titleJa: "コードギアス 反逆のルルーシュ",
    },
    {
      titleZh: "欢迎加入NHK！",
      titleEn: "Welcome to the N.H.K.",
      titleJa: "NHKにようこそ!",
    },
    {
      titleZh: "Fate/stay night",
      titleEn: "Fate/stay night",
      titleJa: "Fate/stay night",
    },
    {
      titleZh: "凉宫春日的忧郁",
      titleEn: "The Melancholy of Haruhi Suzumiya",
      titleJa: "涼宮ハルヒの憂鬱",
    },
    {
      titleZh: "零之使魔",
      titleEn: "The Familiar of Zero",
      titleJa: "ゼロの使い魔",
    },
    {
      titleZh: "黑礁",
      titleEn: "Black Lagoon",
      titleJa: "BLACK LAGOON",
    },
    { titleZh: "Kanon", titleEn: "Kanon", titleJa: "Kanon" },
    { titleZh: "娜娜", titleEn: "NANA", titleJa: "NANA" },
    {
      titleZh: "×××HOLiC",
      titleEn: "×××HOLiC",
      titleJa: "×××HOLiC",
    },
    {
      titleZh: "家庭教师HITMAN REBORN!",
      titleEn: "Katekyo Hitman Reborn!",
      titleJa: "家庭教師ヒットマンREBORN!",
    },
    {
      titleZh: "樱兰高校男公关部",
      titleEn: "Ouran High School Host Club",
      titleJa: "桜蘭高校ホスト部",
    },
    {
      titleZh: "蜂蜜与四叶草II",
      titleEn: "Honey and Clover II",
      titleJa: "ハチミツとクローバーII",
    },
  ],
  "2007": [
    {
      titleZh: "幸运星",
      titleEn: "Lucky Star",
      titleJa: "らき☆すた",
    },
    { titleZh: "CLANNAD", titleEn: "CLANNAD", titleJa: "CLANNAD" },
    {
      titleZh: "天元突破 红莲螺岩",
      titleEn: "Tengen Toppa Gurren Lagann",
      titleJa: "天元突破グレンラガン",
    },
    {
      titleZh: "旋风管家",
      titleEn: "Hayate the Combat Butler",
      titleJa: "ハヤテのごとく！",
    },
    {
      titleZh: "火影忍者疾风传",
      titleEn: "Naruto Shippuden",
      titleJa: "NARUTO -ナルト- 疾風伝",
    },
    {
      titleZh: "悠久之翼",
      titleEn: "ef: A Tale of Memories",
      titleJa: "ef - a tale of memories.",
    },
    {
      titleZh: "赌博默示录",
      titleEn: "Kaiji: Ultimate Survivor",
      titleJa: "賭博黙示録カイジ",
    },
    {
      titleZh: "永生之酒",
      titleEn: "Baccano!",
      titleJa: "バッカーノ！",
    },
    {
      titleZh: "机动战士高达00",
      titleEn: "Mobile Suit Gundam 00",
      titleJa: "機動戦士ガンダム00",
    },
    {
      titleZh: "再见绝望先生",
      titleEn: "Sayonara, Zetsubou-Sensei",
      titleJa: "さよなら絶望先生",
    },
    {
      titleZh: "日在校园",
      titleEn: "School Days",
      titleJa: "スクールデイズ",
    },
    {
      titleZh: "南家三姐妹",
      titleEn: "Minami-ke",
      titleJa: "みなみけ",
    },
    {
      titleZh: "DARKER THAN BLACK -黑之契约者-",
      titleEn: "Darker than Black",
      titleJa: "DARKER THAN BLACK -黒の契約者-",
    },
    {
      titleZh: "濑户的花嫁",
      titleEn: "My Bride is a Mermaid",
      titleJa: "瀬戸の花嫁",
    },
    {
      titleZh: "电脑线圈",
      titleEn: "Dennō Coil",
      titleJa: "電脳コイル",
    },
    { titleZh: "物怪", titleEn: "Mononoke", titleJa: "モノノ怪" },
    {
      titleZh: "向阳素描",
      titleEn: "Hidamari Sketch",
      titleJa: "ひだまりスケッチ",
    },
    {
      titleZh: "零之使魔 双月骑士",
      titleEn: "The Familiar of Zero: Knight of the Twin Moons",
      titleJa: "ゼロの使い魔〜双月の騎士〜",
    },
    { titleZh: "sola", titleEn: "Sola", titleJa: "sola" },
  ],
  "2008": [
    {
      titleZh: "出包王女",
      titleEn: "To Love-Ru",
      titleJa: "To LOVEる -とらぶる-",
    },
    {
      titleZh: "龙与虎",
      titleEn: "Toradora!",
      titleJa: "とらドラ！",
    },
    {
      titleZh: "魔法禁书目录",
      titleEn: "A Certain Magical Index",
      titleJa: "とある魔術の禁書目録",
    },
    {
      titleZh: "狼与香辛料",
      titleEn: "Spice and Wolf",
      titleJa: "狼と香辛料",
    },
    {
      titleZh: "夏目友人帐",
      titleEn: "Natsume's Book of Friends",
      titleJa: "夏目友人帳",
    },
    {
      titleZh: "真实之泪",
      titleEn: "True Tears",
      titleJa: "true tears",
    },
    { titleZh: "神薙", titleEn: "Kannagi", titleJa: "かんなぎ" },
    {
      titleZh: "我的狐仙女友",
      titleEn: "Kanokon",
      titleJa: "かのこん",
    },
    {
      titleZh: "噬魂师",
      titleEn: "Soul Eater",
      titleJa: "ソウルイーター",
    },
    { titleZh: "黑执事", titleEn: "Black Butler", titleJa: "黒執事" },
    {
      titleZh: "俗・再见绝望先生",
      titleEn: "Zoku Sayonara Zetsubou Sensei",
      titleJa: "俗・さよなら絶望先生",
    },
    {
      titleZh: "鹡鸰女神",
      titleEn: "Sekirei",
      titleJa: "セキレイ",
    },
    {
      titleZh: "强袭魔女",
      titleEn: "Strike Witches",
      titleJa: "ストライクウィッチーズ",
    },
  ],
  "2009": [
    { titleZh: "轻音少女", titleEn: "K-ON!", titleJa: "けいおん!" },
    {
      titleZh: "钢之炼金术师 FULLMETAL ALCHEMIST",
      titleEn: "Fullmetal Alchemist: Brotherhood",
      titleJa: "鋼の錬金術師 FULLMETAL ALCHEMIST",
    },
    {
      titleZh: "化物语",
      titleEn: "Bakemonogatari",
      titleJa: "化物語",
    },
    {
      titleZh: "凉宫春日的忧郁 2009",
      titleEn: "The Melancholy of Haruhi Suzumiya (2009)",
      titleJa: "涼宮ハルヒの憂鬱 (2009)",
    },
    {
      titleZh: "某科学的超电磁炮",
      titleEn: "A Certain Scientific Railgun",
      titleJa: "とある科学の超電磁砲",
    },
    {
      titleZh: "学生会的一己之见",
      titleEn: "Student Council's Discretion",
      titleJa: "生徒会の一存",
    },
    {
      titleZh: "天降之物",
      titleEn: "Heaven's Lost Property",
      titleJa: "そらのおとしもの",
    },
    {
      titleZh: "天才麻将少女",
      titleEn: "Saki",
      titleJa: "咲-Saki-",
    },
    {
      titleZh: "白色相簿",
      titleEn: "White Album",
      titleJa: "WHITE ALBUM",
    },
    {
      titleZh: "妖精的尾巴",
      titleEn: "Fairy Tail",
      titleJa: "FAIRY TAIL",
    },
    {
      titleZh: "好想告诉你",
      titleEn: "Kimi ni Todoke",
      titleJa: "君に届け",
    },
  ],
  "2010": [
    {
      titleZh: "吊带袜天使",
      titleEn: "Panty & Stocking with Garterbelt",
      titleJa: "パンティ&ストッキングwithガーターベルト",
    },
    {
      titleZh: "四叠半神话大系",
      titleEn: "The Tatami Galaxy",
      titleJa: "四畳半神話大系",
    },
    {
      titleZh: "妄想学生会",
      titleEn: "Seitokai Yakuindomo",
      titleJa: "生徒会役員共",
    },
    {
      titleZh: "缘之空",
      titleEn: "Yosuga no Sora",
      titleJa: "ヨスガノソラ",
    },
    {
      titleZh: "笨蛋，测验，召唤兽",
      titleEn: "Baka and Test",
      titleJa: "バカとテストと召喚獣",
    },
    {
      titleZh: "天使的心跳！",
      titleEn: "Angel Beats!",
      titleJa: "Angel Beats!",
    },
    {
      titleZh: "无头骑士异闻录",
      titleEn: "Durarara!!",
      titleJa: "デュラララ!!",
    },
    {
      titleZh: "只有神知道的世界",
      titleEn: "The World God Only Knows",
      titleJa: "神のみぞ知るセカイ",
    },
    {
      titleZh: "圣诞之吻SS",
      titleEn: "Amagami SS",
      titleJa: "アマガミSS",
    },
    {
      titleZh: "我的妹妹哪有这么可爱！",
      titleEn: "Oreimo",
      titleJa: "俺の妹がこんなに可愛いわけがない",
    },
    {
      titleZh: "女仆咖啡厅",
      titleEn: "And Yet the Town Moves",
      titleJa: "それでも町は廻っている",
    },
    {
      titleZh: "亲吻姐姐",
      titleEn: "Kiss × Sis",
      titleJa: "kiss×sis",
    },
    {
      titleZh: "迷糊餐厅",
      titleEn: "Working!",
      titleJa: "WORKING!!",
    },
    {
      titleZh: "学园默示录 HIGHSCHOOL OF THE DEAD",
      titleEn: "High School of the Dead",
      titleJa: "学園黙示録 HIGHSCHOOL OF THE DEAD",
    },
    {
      titleZh: "荒川爆笑团",
      titleEn: "Arakawa Under the Bridge",
      titleJa: "荒川アンダー ザ ブリッジ",
    },
    {
      titleZh: "天降之物f",
      titleEn: "Heaven's Lost Property f",
      titleJa: "そらのおとしものf",
    },
    {
      titleZh: "爆漫王。",
      titleEn: "Bakuman",
      titleJa: "バクマン。",
    },
    {
      titleZh: "会长是女仆大人！",
      titleEn: "Maid Sama!",
      titleJa: "会長はメイド様！",
    },
    {
      titleZh: "圣痕炼金士",
      titleEn: "Seikon no Qwaser",
      titleJa: "聖痕のクェイサー",
    },
    {
      titleZh: "空之音",
      titleEn: "Sound of the Sky",
      titleJa: "ソ・ラ・ノ・ヲ・ト",
    },
  ],
  "2011": [
    {
      titleZh: "命运石之门",
      titleEn: "Steins;Gate",
      titleJa: "STEINS;GATE",
    },
    { titleZh: "日常", titleEn: "Nichijou", titleJa: "日常" },
    {
      titleZh: "Fate/Zero",
      titleEn: "Fate/Zero",
      titleJa: "Fate/Zero",
    },
    {
      titleZh: "魔法少女小圆",
      titleEn: "Puella Magi Madoka Magica",
      titleJa: "魔法少女まどか☆マギカ",
    },
    {
      titleZh: "回转企鹅罐",
      titleEn: "Penguindrum",
      titleJa: "輪るピングドラム",
    },
    {
      titleZh: "摇曳百合",
      titleEn: "YuruYuri",
      titleJa: "ゆるゆり",
    },
    {
      titleZh: "我们仍未知道那天所看见的花的名字。",
      titleEn: "AnoHana",
      titleJa: "あの日見た花の名前を僕達はまだ知らない。",
    },
    {
      titleZh: "罪恶王冠",
      titleEn: "Guilty Crown",
      titleJa: "ギルティクラウン",
    },
    {
      titleZh: "花开伊吕波",
      titleEn: "Hanasaku Iroha",
      titleJa: "花咲くいろは",
    },
    {
      titleZh: "偶像大师",
      titleEn: "The Idolmaster",
      titleJa: "アイドルマスター",
    },
    { titleZh: "GOSICK", titleEn: "GOSICK", titleJa: "GOSICK" },
    {
      titleZh: "我的朋友很少",
      titleEn: "Haganai",
      titleJa: "僕は友達が少ない",
    },
    {
      titleZh: "猎人",
      titleEn: "Hunter x Hunter",
      titleJa: "HUNTER×HUNTER",
    },
    {
      titleZh: "未来日记",
      titleEn: "Future Diary",
      titleJa: "未来日記",
    },
    {
      titleZh: "电波女与青春男",
      titleEn: "Ground Control to Psychoelectric Girl",
      titleJa: "電波女と青春男",
    },
    {
      titleZh: "这个是僵尸吗？",
      titleEn: "Is This a Zombie?",
      titleJa: "これはゾンビですか？",
    },
    {
      titleZh: "赌博默示录 破戒录篇",
      titleEn: "Kaiji: Against All Rules",
      titleJa: "逆境無頼カイジ 破戒録篇",
    },
    {
      titleZh: "迷茫管家与懦弱的我",
      titleEn: "Mayo Chiki!",
      titleJa: "まよチキ！",
    },
    {
      titleZh: "纯白交响曲",
      titleEn: "Mashiro-iro Symphony",
      titleJa: "ましろ色シンフォニー",
    },
    {
      titleZh: "神的记事本",
      titleEn: "Heaven's Memo Pad",
      titleJa: "神様のメモ帳",
    },
    { titleZh: "BLOOD-C", titleEn: "BLOOD-C", titleJa: "BLOOD-C" },
    {
      titleZh: "丹特丽安的书架",
      titleEn: "The Mystic Archives of Dantalian",
      titleJa: "ダンタリアンの書架",
    },
  ],
  "2012": [
    { titleZh: "冰菓", titleEn: "Hyouka", titleJa: "氷菓" },
    {
      titleZh: "JOJO的奇妙冒险",
      titleEn: "JoJo's Bizarre Adventure",
      titleJa: "ジョジョの奇妙な冒険",
    },
    {
      titleZh: "男子高中生的日常",
      titleEn: "Daily Lives of High School Boys",
      titleJa: "男子高校生の日常",
    },
    {
      titleZh: "中二病也要谈恋爱！",
      titleEn: "Love, Chunibyo & Other Delusions!",
      titleJa: "中二病でも恋がしたい！",
    },
    {
      titleZh: "来自新世界",
      titleEn: "From the New World",
      titleJa: "新世界より",
    },
    {
      titleZh: "伪物语",
      titleEn: "Nisemonogatari",
      titleJa: "偽物語",
    },
    { titleZh: "Another", titleEn: "Another", titleJa: "Another" },
    {
      titleZh: "樱花庄的宠物女孩",
      titleEn: "The Pet Girl of Sakurasou",
      titleJa: "さくら荘のペットな彼女",
    },
    {
      titleZh: "心理测量者",
      titleEn: "Psycho-Pass",
      titleJa: "PSYCHO-PASS サイコパス",
    },
    {
      titleZh: "恶魔高校 D×D",
      titleEn: "High School DxD",
      titleJa: "ハイスクールD×D",
    },
    {
      titleZh: "刀剑神域",
      titleEn: "Sword Art Online",
      titleJa: "ソードアート・オンライン",
    },
    {
      titleZh: "人类衰退之后",
      titleEn: "Humanity Has Declined",
      titleJa: "人類は衰退しました",
    },
    {
      titleZh: "Little Busters!",
      titleEn: "Little Busters!",
      titleJa: "リトルバスターズ！",
    },
    {
      titleZh: "潜行吧！奈亚子",
      titleEn: "Nyaruko: Crawling with Love",
      titleJa: "這いよれ！ニャル子さん",
    },
    {
      titleZh: "邻座的怪同学",
      titleEn: "My Little Monster",
      titleJa: "となりの怪物くん",
    },
    {
      titleZh: "猫物语（黑）",
      titleEn: "Nekomonogatari (Black)",
      titleJa: "猫物語（黒）",
    },
    {
      titleZh: "少女与战车",
      titleEn: "Girls und Panzer",
      titleJa: "ガールズ&パンツァー",
    },
    {
      titleZh: "心灵链环",
      titleEn: "Kokoro Connect",
      titleJa: "ココロコネクト",
    },
    {
      titleZh: "TARI TARI",
      titleEn: "TARI TARI",
      titleJa: "TARI TARI",
    },
    {
      titleZh: "谜样女友X",
      titleEn: "Mysterious Girlfriend X",
      titleJa: "謎の彼女X",
    },
    {
      titleZh: "就算是哥哥只要有爱就没问题对吧",
      titleEn: "OniAi",
      titleJa: "お兄ちゃんだけど愛さえあれば関係ないよねっ",
    },
    {
      titleZh: "散华礼弥",
      titleEn: "Sankarea: Undying Love",
      titleJa: "さんかれあ",
    },
  ],
  "2013": [
    {
      titleZh: "进击的巨人",
      titleEn: "Attack on Titan",
      titleJa: "進撃の巨人",
    },
    {
      titleZh: "斩服少女",
      titleEn: "Kill la Kill",
      titleJa: "キルラキル",
    },
    {
      titleZh: "我的青春恋爱物语果然有问题",
      titleEn: "My Teen Romantic Comedy SNAFU",
      titleJa: "やはり俺の青春ラブコメはまちがっている。",
    },
    {
      titleZh: "悠哉日常大王",
      titleEn: "Non Non Biyori",
      titleJa: "のんのんびより",
    },
    {
      titleZh: "玉子市场",
      titleEn: "Tamako Market",
      titleJa: "たまこまーけっと",
    },
    {
      titleZh: "向山进发",
      titleEn: "Yama no Susume",
      titleJa: "ヤマノススメ",
    },
    {
      titleZh: "约会大作战",
      titleEn: "Date A Live",
      titleJa: "デート・ア・ライブ",
    },
    {
      titleZh: "噬血狂袭",
      titleEn: "Strike the Blood",
      titleJa: "ストライク・ザ・ブラッド",
    },
    {
      titleZh: "来自风平浪静的明天",
      titleEn: "Nagi-Asu: A Lull in the Sea",
      titleJa: "凪のあすから",
    },
    {
      titleZh: "我的妹妹哪有这么可爱。2",
      titleEn: "Oreimo 2",
      titleJa: "俺の妹がこんなに可愛いわけがない。",
    },
    {
      titleZh: "我不受欢迎，怎么想都是你们的错！",
      titleEn: "WataMote",
      titleJa: "私がモテないのはどう考えてもお前らが悪い！",
    },
    {
      titleZh: "境界的彼方",
      titleEn: "Beyond the Boundary",
      titleJa: "境界の彼方",
    },
    {
      titleZh: "我的脑内选项正在全力妨碍学园恋爱喜剧",
      titleEn:
        "My Brain's Little Options Are Doing Their Best to Hinder My School Romance Comedy",
      titleJa: "俺の脳内選択肢が、学園ラブコメを全力で邪魔している",
    },
    {
      titleZh: "Fate/kaleid liner 魔法少女☆伊莉雅",
      titleEn: "Fate/kaleid liner 魔法少女☆イリヤ",
      titleJa: "Fate/kaleid liner プリズマ☆イリヤ",
    },
    { titleZh: "GJ部", titleEn: "GJ Club", titleJa: "GJ部" },
    {
      titleZh: "弹丸论破 希望学园与绝望高中生",
      titleEn: "Danganronpa: The Animation",
      titleJa: "ダンガンロンパ 希望の学園と絶望の高校生 THE ANIMATION",
    },
    {
      titleZh: "黄金拼图",
      titleEn: "Golden Time",
      titleJa: "ゴールデンタイム",
    },
    {
      titleZh: "Love Live!",
      titleEn: "Love Live!",
      titleJa: "ラブライブ！",
    },
    {
      titleZh: "我女友与青梅竹马的惨烈修罗场",
      titleEn: "Oreshura",
      titleJa: "俺の彼女と幼なじみが修羅場すぎる",
    },
    {
      titleZh: "我的朋友很少NEXT",
      titleEn: "Haganai NEXT",
      titleJa: "僕は友達が少ないNEXT",
    },
  ],
  "2014": [
    { titleZh: "白箱", titleEn: "Shirobako", titleJa: "SHIROBAKO" },
    {
      titleZh: "四月是你的谎言",
      titleEn: "Your Lie in April",
      titleJa: "四月は君の嘘",
    },
    {
      titleZh: "Fate/stay night [Unlimited Blade Works]",
      titleEn: "Fate/stay night [Unlimited Blade Works]",
      titleJa: "Fate/stay night [Unlimited Blade Works]",
    },
    {
      titleZh: "游戏人生",
      titleEn: "No Game No Life",
      titleJa: "ノーゲーム・ノーライフ",
    },
    {
      titleZh: "乒乓",
      titleEn: "Ping Pong",
      titleJa: "ピンポン THE ANIMATION",
    },
    {
      titleZh: "甘城光辉游乐园",
      titleEn: "Amagi Brilliant Park",
      titleJa: "甘城ブリリアントパーク",
    },
    {
      titleZh: "寄生兽 生命的准则",
      titleEn: "Parasyte -the maxim-",
      titleJa: "寄生獣 セイの格率",
    },
    { titleZh: "伪恋", titleEn: "Nisekoi", titleJa: "ニセコイ" },
    {
      titleZh: "月刊少女野崎君",
      titleEn: "Monthly Girls' Nozaki-kun",
      titleJa: "月刊少女野崎くん",
    },
    {
      titleZh: "请问您今天要来点兔子吗？",
      titleEn: "Is the Order a Rabbit?",
      titleJa: "ご注文はうさぎですか？",
    },
    {
      titleZh: "斩·赤红之瞳！",
      titleEn: "Akame ga Kill!",
      titleJa: "アカメが斬る！",
    },
    {
      titleZh: "太空丹迪",
      titleEn: "Space Dandy",
      titleJa: "スペース☆ダンディ",
    },
    {
      titleZh: "妄想学生会＊",
      titleEn: "Seitokai Yakuindomo",
      titleJa: "生徒会役員共＊",
    },
    {
      titleZh: "东京喰种",
      titleEn: "Tokyo Ghoul",
      titleJa: "東京喰種トーキョーグール",
    },
    {
      titleZh: "凭物语",
      titleEn: "Owarimonogatari: End Tale",
      titleJa: "憑物語",
    },
    {
      titleZh: "灰色的果实",
      titleEn: "The Fruit of Grisaia",
      titleJa: "グリザイアの果実",
    },
    {
      titleZh: "花物语",
      titleEn: "Hanamonogatari ",
      titleJa: "花物語",
    },
    { titleZh: "农林", titleEn: "Nourin", titleJa: "のうりん" },
    {
      titleZh: "魔法科高校的劣等生",
      titleEn: "The Irregular at Magic High School",
      titleJa: "魔法科高校の劣等生",
    },
    { titleZh: "野良神", titleEn: "Noragami", titleJa: "ノラガミ" },
  ],
  "2015": [
    {
      titleZh: "路人女主的养成方法",
      titleEn: "Saekano: How to Raise a Boring Girlfriend",
      titleJa: "冴えない彼女の育てかた",
    },
    {
      titleZh: "暗杀教室",
      titleEn: "Assassination Classroom",
      titleJa: "暗殺教室",
    },
    {
      titleZh: "一拳超人",
      titleEn: "One Punch Man",
      titleJa: "ワンパンマン",
    },
    {
      titleZh: "新妹魔王的契约者",
      titleEn: "The Testament of Sister New Devil",
      titleJa: "新妹魔王の契約者",
    },
    {
      titleZh: "夏洛特",
      titleEn: "Charlotte",
      titleJa: "シャーロット",
    },
    {
      titleZh: "OVERLORD",
      titleEn: "Overlord",
      titleJa: "オーバーロード",
    },
    {
      titleZh: "监狱学园",
      titleEn: "Prison School",
      titleJa: "監獄学園",
    },
    {
      titleZh: "可塑性记忆",
      titleEn: "Plastic Memories",
      titleJa: "プラスティック・メモリーズ",
    },
    {
      titleZh: "在地下城寻求邂逅是否搞错了什么",
      titleEn: "Is it wrong to Try to Pick Up Girls in a Dungeon?",
      titleJa: "ダンジョンに出会いを求めるのは間違っているだろうか",
    },
    {
      titleZh: "干物妹！小埋",
      titleEn: "Himouto! Umaru-chan",
      titleJa: "干物妹！うまるちゃん",
    },
    {
      titleZh: "吹响！悠风号",
      titleEn: "Sound! Euphonium",
      titleJa: "響け！ユーフォニアム",
    },
    {
      titleZh: "终物语",
      titleEn: "Owarimonogatari",
      titleJa: "終物語",
    },
    {
      titleZh: "旋转少女",
      titleEn: "The Rolling Girls",
      titleJa: "ローリング☆ガールズ",
    },
    {
      titleZh: "落第骑士英雄谭",
      titleEn: "Chivalry of a Failed Knight",
      titleJa: "落第騎士の英雄譚",
    },
    {
      titleZh: "没有黄段子存在的无聊世界",
      titleEn: "Shimoneta",
      titleJa: "下ネタという概念が存在しない退屈な世界",
    },
  ],
  "2016": [
    {
      titleZh: "为美好的世界献上祝福！",
      titleEn: "Kono Suba",
      titleJa: "この素晴らしい世界に祝福を！",
    },
    {
      titleZh: "3月的狮子",
      titleEn: "March Comes in Like a Lion",
      titleJa: "3月のライオン",
    },
    { titleZh: "ReLIFE", titleEn: "ReLIFE", titleJa: "ReLIFE" },
    {
      titleZh: "齐木楠雄的灾难",
      titleEn: "The Disastrous Life of Saiki K.",
      titleJa: "斉木楠雄のΨ難",
    },
    {
      titleZh: "Re：从零开始的异世界生活",
      titleEn: "Re:Zero ",
      titleJa: "Re:ゼロから始める異世界生活",
    },
    {
      titleZh: "只有我不存在的城市",
      titleEn: "Erased",
      titleJa: "僕だけがいない街",
    },
    {
      titleZh: "灵能百分百",
      titleEn: "Mob Psycho 100",
      titleJa: "モブサイコ100",
    },
    {
      titleZh: "灰与幻想的格林姆迦尔",
      titleEn: "Grimgar of Fantasy and Ash",
      titleJa: "灰と幻想のグリムガル",
    },
    {
      titleZh: "这个美术社大有问题！",
      titleEn: "This Art Club Has a Problem!",
      titleJa: "この美術部には問題がある！",
    },
    {
      titleZh: "轻拍翻转小魔女",
      titleEn: "Flip Flappers",
      titleJa: "フリップフラッパーズ",
    },
    {
      titleZh: "飞翔的魔女",
      titleEn: "Flying Witch",
      titleJa: "ふらいんぐうぃっち",
    },
    {
      titleZh: "NEW GAME!",
      titleEn: "NEW GAME!",
      titleJa: "NEW GAME!",
    },
    {
      titleZh: "在下坂本，有何贵干？",
      titleEn: "Haven't You Heard? I'm Sakamoto",
      titleJa: "坂本ですが？",
    },
    {
      titleZh: "昭和元禄落语心中",
      titleEn: "Descending Stories: Showa Genroku Rakugo Shinju",
      titleJa: "昭和元禄落語心中",
    },
    {
      titleZh: "无彩限的怪灵世界",
      titleEn: "Myriad Colors Phantom World",
      titleJa: "無彩限のファントム・ワールド",
    },
    {
      titleZh: "线上游戏的老婆不可能是女生？",
      titleEn: "And You Thought There Is Never a Girl Online? ",
      titleJa: "ネトゲの嫁は女の子じゃないと思った？",
    },
    {
      titleZh: "亚人",
      titleEn: "Ajin: Demi-Human",
      titleJa: "亜人",
    },
    {
      titleZh: "甲铁城的卡巴内利",
      titleEn: "Kabaneri of the Iron Fortress",
      titleJa: "甲鉄城のカバネリ",
    },
    {
      titleZh: "剑风传奇",
      titleEn: "Berserk",
      titleJa: "ベルセルク",
    },
  ],
  "2017": [
    {
      titleZh: "少女终末旅行",
      titleEn: "Girls' Last Tour",
      titleJa: "少女終末旅行",
    },
    {
      titleZh: "来自深渊",
      titleEn: "Made in Abyss",
      titleJa: "メイドインアビス",
    },
    {
      titleZh: "小林家的龙女仆",
      titleEn: "Miss Kobayashi's Dragon Maid",
      titleJa: "小林さんちのメイドラゴン",
    },
    {
      titleZh: "狂赌之渊",
      titleEn: "Kakegurui",
      titleJa: "賭ケグルイ",
    },
    {
      titleZh: "末日时在做什么？有没有空？可以来拯救吗？",
      titleEn: "WorldEnd",
      titleJa: "終末なにしてますか？忙しいですか？救ってもらっていいですか？",
    },
    {
      titleZh: "月色真美",
      titleEn: "Tsuki ga Kirei",
      titleJa: "月がきれい",
    },
    {
      titleZh: "重启咲良田",
      titleEn: "Sagrada Reset",
      titleJa: "サクラダリセット",
    },
    {
      titleZh: "BanG Dream!",
      titleEn: "BanG Dream!",
      titleJa: "BanG Dream!",
    },
    {
      titleZh: "幼女战记",
      titleEn: "Saga of Tanya the Evil",
      titleJa: "幼女戦記",
    },
    {
      titleZh: "小魔女学园",
      titleEn: "Little Witch Academia",
      titleJa: "リトルウィッチアカデミア",
    },
    {
      titleZh: "Just Because!",
      titleEn: "Just Because!",
      titleJa: "Just Because!",
    },
    {
      titleZh: "埃罗芒阿老师",
      titleEn: "Eromanga Sensei",
      titleJa: "エロマンガ先生",
    },
    {
      titleZh: "人渣的本愿",
      titleEn: "Scum's Wish",
      titleJa: "クズの本懐",
    },
    {
      titleZh: "珈百璃的堕落",
      titleEn: "Gabriel DropOut",
      titleJa: "ガヴリールドロップアウト",
    },
    {
      titleZh: "笨女孩",
      titleEn: "Aho-Girl",
      titleJa: "アホガール",
    },
    {
      titleZh: "黑色五叶草",
      titleEn: "Black Clover",
      titleJa: "ブラッククローバー",
    },
    {
      titleZh: "如果有妹妹就好了。",
      titleEn: "A Sister's All You Need",
      titleJa: "妹さえいればいい。",
    },
    {
      titleZh: "徒然喜欢你",
      titleEn: "Tsuredure Children",
      titleJa: "徒然チルドレン",
    },
    {
      titleZh: "不正经的魔术讲师与禁忌教典",
      titleEn: "Akashic Records of Bastard Magic Instructor",
      titleJa: "ロクでなし魔術講師と禁忌教典",
    },
  ],
  "2018": [
    {
      titleZh: "摇曳露营△",
      titleEn: "Yuru Camp△",
      titleJa: "ゆるキャン△",
    },
    {
      titleZh: "碧蓝之海",
      titleEn: "Grand Blue",
      titleJa: "ぐらんぶる",
    },
    {
      titleZh: "赛马娘 Pretty Derby",
      titleEn: "Umamusume Pretty Derby",
      titleJa: "ウマ娘 プリティーダービー",
    },
    {
      titleZh: "紫罗兰永恒花园",
      titleEn: "Violet Evergarden",
      titleJa: "ヴァイオレット・エヴァーガーデン",
    },
    {
      titleZh: "强风吹拂",
      titleEn: "Run with the Wind",
      titleJa: "風が強く吹いている",
    },
    {
      titleZh: "少女☆歌剧 Revue Starlight",
      titleEn: "Shoujo☆Kageki Revue Starlight",
      titleJa: "少女☆歌劇 レヴュースタァライト",
    },
    {
      titleZh: "擅长捉弄的高木同学",
      titleEn: "Teasing Master Takagi-san",
      titleJa: "からかい上手の高木さん",
    },
    {
      titleZh: "佐贺偶像是传奇",
      titleEn: "Zombie Land Saga",
      titleJa: "ゾンビランドサガ",
    },
    {
      titleZh: "比宇宙更远的地方",
      titleEn: "A Place Further Than the Universe",
      titleJa: "宇宙よりも遠い場所",
    },
    {
      titleZh: "青春笨蛋少年不做兔女郎学姐的梦",
      titleEn: "Rascal Does Not Dream of Bunny Girl Senpai",
      titleJa: "青春ブタ野郎はバニーガール先輩の夢を見ない",
    },
    {
      titleZh: "哥布林杀手",
      titleEn: "Goblin Slayer",
      titleJa: "ゴブリンスレイヤー",
    },
    {
      titleZh: "终将成为你",
      titleEn: "Bloom into You",
      titleJa: "やがて君になる",
    },
    {
      titleZh: "DARLING in the FRANXX",
      titleEn: "DARLING in the FRANXX",
      titleJa: "ダーリン・イン・ザ・フランキス",
    },
    {
      titleZh: "来玩游戏吧",
      titleEn: "Gamers!",
      titleJa: "ゲーマーズ！",
    },
    {
      titleZh: "邪神与厨二病少女",
      titleEn: "Dropkick on My Devil!",
      titleJa: "邪神ちゃんドロップキック",
    },
    {
      titleZh: "恋如雨止",
      titleEn: "After the Rain",
      titleJa: "恋は雨上がりのように",
    },
    {
      titleZh: "关于我转生变成史莱姆这档事",
      titleEn: "That Time I Got Reincarnated as a Slime",
      titleJa: "転生したらスライムだった件",
    },
    {
      titleZh: "黄金神威",
      titleEn: "Golden Kamuy",
      titleJa: "ゴールデンカムイ",
    },
  ],
  "2019": [
    {
      titleZh: "冰海战记",
      titleEn: "Vinland Saga",
      titleJa: "ヴィンランド・サガ",
    },
    {
      titleZh: "辉夜大小姐想让我告白～天才们的恋爱头脑战～",
      titleEn: "Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunōsen",
      titleJa: "かぐや様は告らせたい～天才たちの恋愛頭脳戦～",
    },
    {
      titleZh: "街角魔族",
      titleEn: "The Demon Girl Next Door",
      titleJa: "まちカドまぞく",
    },
    {
      titleZh: "鬼灭之刃",
      titleEn: "Demon Slayer",
      titleJa: "鬼滅の刃",
    },
    {
      titleZh: "炎炎消防队",
      titleEn: "Fire Force",
      titleJa: "炎炎ノ消防隊",
    },
    {
      titleZh: "女高中生的无所事事",
      titleEn: "Wasteful Days of High School Girls",
      titleJa: "女子高生の無駄づかい",
    },
    {
      titleZh: "慎重勇者 ～这个勇者明明超强却过分慎重～",
      titleEn: "Cautious Hero: ",
      titleJa: "慎重勇者～この勇者が俺TUEEEくせに慎重すぎる～",
    },
    {
      titleZh: "天使降临到了我身边！",
      titleEn: "Angels' 3Piece!",
      titleJa: "私に天使が舞い降りた！",
    },
    {
      titleZh: "不吉波普不笑",
      titleEn: "Boogiepop and Others",
      titleJa: "ブギーポップは笑わない",
    },
    {
      titleZh: "笨拙之极的上野",
      titleEn: "How Clumsy You Are, Miss Ueno",
      titleJa: "上野さんは不器用",
    },
    {
      titleZh: "五等分的新娘",
      titleEn: "The Quintessential Quintuplets",
      titleJa: "五等分の花嫁",
    },
    {
      titleZh: "约定的梦幻岛",
      titleEn: "Yakusoku no Neverland",
      titleJa: "約束のネバーランド",
    },
    {
      titleZh: "只要可爱即使是变态你也会喜欢我吧？",
      titleEn: "Hensuki",
      titleJa: "可愛ければ変態でも好きになってくれますか？",
    },
    {
      titleZh: "Fate/Grand Order -绝对魔兽战线巴比伦尼亚-",
      titleEn: "Fate/Grand Order -Absolute Demonic Front: Babylonia-",
      titleJa: "Fate/Grand Order -絶対魔獣戦線バビロニア-",
    },
    {
      titleZh: "家有女友",
      titleEn: "Kanojo, Okarishimasu",
      titleJa: "彼女、お借りします",
    },
    {
      titleZh: "君主·埃尔梅罗二世事件簿 魔眼收集列车 Grace note",
      titleEn: "The Case Files of Lord El-Melloi II: Rail Zeppelin Grace Note",
      titleJa: "ロード・エルメロイII世の事件簿 -魔眼蒐集列車 Grace note-",
    },
    {
      titleZh: "石纪元",
      titleEn: "Dr. Stone",
      titleJa: "Dr.STONE",
    },
  ],
  "2020": [
    {
      titleZh: "异种族风俗娘评鉴指南",
      titleEn: "Ishuzoku Reviewers",
      titleJa: "異種族レビュアーズ",
    },
    {
      titleZh: "魔女之旅",
      titleEn: "Wandering Witch: The Journey of Elaina",
      titleJa: "魔女の旅々",
    },
    {
      titleZh: "安达与岛村",
      titleEn: "Adachi and Shimamura",
      titleJa: "安達としまむら",
    },
    {
      titleZh: "异度侵入",
      titleEn: "ID:INVADED",
      titleJa: "ID:INVADED イド：インヴェイデッド",
    },
    {
      titleZh: "别对映像研出手！",
      titleEn: "Keep Your Hands Off Eizouken!",
      titleJa: "映像研には手を出すな！",
    },
    {
      titleZh: "咒术回战",
      titleEn: "Jujutsu Kaisen",
      titleJa: "呪術廻戦",
    },
    {
      titleZh: "总之就是非常可爱",
      titleEn: "Tonikawa: Over the Moon For You",
      titleJa: "トニカクカワイイ",
    },
    {
      titleZh: "隐瞒之事",
      titleEn: "Kakushigoto",
      titleJa: "かくしごと",
    },
    {
      titleZh: "虚构推理",
      titleEn: "In/Spectre",
      titleJa: "虚構推理",
    },
    {
      titleZh: "恋爱小行星",
      titleEn: "Koisuru Asteroid",
      titleJa: "恋する小惑星",
    },
    {
      titleZh: "你与我最后的战场，亦或是世界起始的圣战",
      titleEn: "Our Last Crusade or the Rise of a New World",
      titleJa: "キミと僕の最後の戦場、あるいは世界が始まる聖戦",
    },
    {
      titleZh: "邪神与厨二病少女' ",
      titleEn: "Dropkick on My Devil!",
      titleJa: "邪神ちゃんドロップキック’",
    },
    {
      titleZh: "转生成为了只有乙女游戏破灭Flag的邪恶大小姐",
      titleEn: "My Next Life as a Villainess: All Routes Lead to Doom!",
      titleJa: "乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった…",
    },
    {
      titleZh: "在魔王城说晚安",
      titleEn: "Sleepy Princess in the Demon Castle",
      titleJa: "魔王城でおやすみ",
    },
    {
      titleZh: "租借女友",
      titleEn: "Rent-A-Girlfriend",
      titleJa: "彼女、お借りします",
    },
  ],
  "2021": [
    {
      titleZh: "86 -不存在的战区-",
      titleEn: "86 -Eighty-Six-",
      titleJa: "86―エイティシックス―",
    },
    {
      titleZh: "无职转生～",
      titleEn: "Mushoku Tensei: Jobless Reincarnation",
      titleJa: "無職転生 ～異世界行ったら本気だす～",
    },
    {
      titleZh: "回复术士的重来人生",
      titleEn: "Redo of Healer",
      titleJa: "回復術士のやり直し",
    },
    {
      titleZh: "奇巧计程车",
      titleEn: "Odd Taxi",
      titleJa: "オッドタクシー",
    },
    {
      titleZh: "打了300年的史莱姆，不知不觉就练到了满级",
      titleEn: "I’ve Been Killing Slimes for 300 Years and Maxed Out My Level",
      titleJa: "スライム倒して300年、知らないうちにレベルMAXになってました",
    },
    {
      titleZh: "漂流少年",
      titleEn: "Sonny Boy",
      titleJa: "Sonny Boy",
    },
    {
      titleZh: "堀与宫村",
      titleEn: "Horimiya",
      titleJa: "ホリミヤ",
    },
    {
      titleZh: "派遣战斗员！",
      titleEn: "Combatants Will Be Dispatched!",
      titleJa: "戦闘員、派遣します！",
    },
    {
      titleZh: "古见同学有交流障碍症",
      titleEn: "Komi Can't Communicate",
      titleJa: "古見さんは、コミュ症です。",
    },
    {
      titleZh: "奇蛋物语",
      titleEn: "Wonder Egg Priority",
      titleJa: "ワンダーエッグ・プライオリティ",
    },
    {
      titleZh: "我们的重制人生",
      titleEn: "Remake Our Life!",
      titleJa: "ぼくたちのリメイク",
    },
    {
      titleZh: "看得见的女孩",
      titleEn: "Mieruko-chan",
      titleJa: "見える子ちゃん",
    },
    {
      titleZh: "异世界迷宫黑心企业",
      titleEn: "The Dungeon of Black Company",
      titleJa: "迷宮ブラックカンパニー",
    },
    {
      titleZh: "女神宿舍的宿管君。",
      titleEn: "Megami-ryō no Ryōbo-kun",
      titleJa: "女神寮の寮母くん。",
    },
  ],
  "2022": [
    {
      titleZh: "孤独摇滚！",
      titleEn: "Bocchi the Rock!",
      titleJa: "ぼっち・ざ・ろっく！",
    },
    {
      titleZh: "莉可丽丝",
      titleEn: "Lycoris Recoil",
      titleJa: "リコリス・リコイル",
    },
    {
      titleZh: "想要成为影之实力者！",
      titleEn: "The Eminence in Shadow",
      titleJa: "陰の実力者になりたくて！",
    },
    {
      titleZh: "夏日重现",
      titleEn: "Summer Time Rendering",
      titleJa: "サマータイムレンダ",
    },
    {
      titleZh: "异世界舅舅",
      titleEn: "Uncle from Another World",
      titleJa: "異世界おじさん",
    },
    {
      titleZh: "更衣人偶坠入爱河",
      titleEn: "My Dress-Up Darling",
      titleJa: "その着せ替え人形は恋をする",
    },
    {
      titleZh: "彻夜之歌",
      titleEn: "Call of the Night",
      titleJa: "よふかしのうた",
    },
    {
      titleZh: "测不准的阿波连同学",
      titleEn: "Aharen Is Indecipherable",
      titleJa: "阿波連さんははかれない",
    },
    {
      titleZh: "间谍过家家",
      titleEn: "SPY×FAMILY",
      titleJa: "SPY×FAMILY",
    },
    {
      titleZh: "不道德公会",
      titleEn: "Immoral Guild",
      titleJa: "不徳のギルド",
    },
    {
      titleZh: "链锯人",
      titleEn: "Chainsaw Man",
      titleJa: "チェンソーマン",
    },
    {
      titleZh: "明日同学的水手服",
      titleEn: "Akebi's Sailor Uniform",
      titleJa: "明日ちゃんのセーラー服",
    },
    {
      titleZh: "契约之吻",
      titleEn: "Engage Kiss",
      titleJa: "エンゲージ・キス",
    },
    {
      titleZh: "相合之物",
      titleEn: "Sasaki and Miyano",
      titleJa: "佐々木と宮野",
    },
  ],
  "2023": [
    {
      titleZh: "葬送的芙莉莲",
      titleEn: "Frieren: Beyond Journey's End",
      titleJa: "葬送のフリーレン",
    },
    {
      titleZh: "药屋少女的呢喃",
      titleEn: "The Apothecary Diaries",
      titleJa: "薬屋のひとりごと",
    },
    {
      titleZh: "BanG Dream! It's MyGO!!!!!",
      titleEn: "BanG Dream! It's MyGO!!!!!",
      titleJa: "BanG Dream! It's MyGO!!!!!",
    },
    {
      titleZh: "我心里危险的东西",
      titleEn: "The Dangers in My Heart",
      titleJa: "僕の心のヤバイやつ",
    },
    {
      titleZh: "超超超超超喜欢你的100个女朋友",
      titleEn: "The 100 Girlfriends Who Really Love You",
      titleJa: "君のことが大大大大大好きな100人の彼女",
    },
    {
      titleZh: "别当欧尼酱了！",
      titleEn: "Onimai: I'm Now Your Sister!",
      titleJa: "お兄ちゃんはおしまい！",
    },
    {
      titleZh: "跃动青春",
      titleEn: "Skip and Loafer",
      titleJa: "スキップとローファー",
    },
    {
      titleZh: "宝可梦 地平线",
      titleEn: "Pokémon Horizons",
      titleJa: "ポケットモンスター 地平線",
    },
    {
      titleZh: "香格里拉·弗陇提亚～屎作猎人向神作发起挑战～",
      titleEn: "Shangri-La Frontier",
      titleJa: "シャングリラ・フロンティア ～クソゲーハンター、神ゲーに挑む～",
    },
    {
      titleZh: "无神世界的神明活动",
      titleEn: "KamiKatsu: Working for God in a Godless World",
      titleJa: "神無き世界のカミサマ活動",
    },
    {
      titleZh: "我推的孩子",
      titleEn: "Oshi no Ko",
      titleJa: "【推しの子】",
    },
    {
      titleZh: "天国大魔境",
      titleEn: "Heavenly Delusion",
      titleJa: "天国大魔境",
    },
    {
      titleZh: "异世界悠闲农家",
      titleEn: "Farming Life in Another World",
      titleJa: "異世界のんびり農家",
    },
  ],
  "2024": [
    {
      titleZh: "败犬女主太多了！",
      titleEn: "Too Many Losing Heroines!",
      titleJa: "負けヒロインが多すぎる！",
    },
    {
      titleZh: "GIRLS BAND CRY",
      titleEn: "GIRLS BAND CRY",
      titleJa: "ガールズバンドクライ",
    },
    {
      titleZh: "胆大党",
      titleEn: "Dandadan",
      titleJa: "ダンダダン",
    },
    {
      titleZh: "义妹生活",
      titleEn: "Gimai Seikatsu",
      titleJa: "義妹生活",
    },
    {
      titleZh: "迷宫饭",
      titleEn: "Delicious in Dungeon",
      titleJa: "ダンジョン飯",
    },
    {
      titleZh: "我独自升级",
      titleEn: "Solo Leveling",
      titleJa: "俺だけレベルアップな件",
    },
    {
      titleZh: "小市民系列",
      titleEn: "Shoshimin",
      titleJa: "小市民シリーズ",
    },
    {
      titleZh: "梦想成为魔法少女",
      titleEn: "Gushing over Magical Girls",
      titleJa: "魔法少女にあこがれて",
    },
    { titleZh: "青之箱", titleEn: "Blue Box", titleJa: "青の箱" },
    {
      titleZh: "2.5次元的诱惑",
      titleEn: "2.5 Dimensional Seduction",
      titleJa: "2.5次元の誘惑",
    },
    {
      titleZh: "地。 ―关于地球的运动―",
      titleEn: "Orb: On the Movements of the Earth",
      titleJa: "地球の運動について",
    },
    {
      titleZh: "失忆投捕",
      titleEn: "Oblivion Battery",
      titleJa: "忘却バッテリー",
    },
    {
      titleZh: "不时轻声地以俄语遮羞的邻座艾莉同学",
      titleEn: "Alya Sometimes Hides Her Feelings in Russian",
      titleJa: "時々ボソッとロシア語でデレる隣のアーリャさん",
    },
    {
      titleZh: "悲喜渔生",
      titleEn: "Fisherman's Songs",
      titleJa: "ネガポジアングラー",
    },
    {
      titleZh: "亚托莉 -我挚爱的时光-",
      titleEn: "Atri: My Dear Moments",
      titleJa: "ATRI -My Dear Moments-",
    },
    {
      titleZh: "缘结甘神家",
      titleEn: "Tying the Knot with an Amagami Sister",
      titleJa: "甘神さんちの縁結び",
    },
  ],
  "2025": [
    {
      titleZh: "古诺希亚",
      titleEn: "GNOSIA",
      titleJa: "グノーシア",
    },
    {
      titleZh: "弹珠汽水瓶里的千岁同学",
      titleEn: "Chitose Is in the Ramune Bottle",
      titleJa: "千歳くんはラムネ瓶のなか",
    },
    {
      titleZh: "我们不可能成为恋人！绝对不行。 (※似乎可行？)",
      titleEn: "There's No Freaking Way I'll be Your Lover! Unless...",
      titleJa:
        "わたしが恋人になれるわけないじゃん、ムリムリ！（※ムリじゃなかった!?）",
    },
    {
      titleZh: "金牌得主",
      titleEn: "Medalist",
      titleJa: "メダリスト",
    },
    {
      titleZh: "琉璃的宝石",
      titleEn: "Ruri Rocks",
      titleJa: "瑠璃の宝石",
    },
    {
      titleZh: "末日后酒店",
      titleEn: "Apocalypse Hotel",
      titleJa: "アポカリプスホテル",
    },
    {
      titleZh: "拔作岛",
      titleEn: "Nukitashi THE ANIMATION",
      titleJa: "ぬきたし THE ANIMATION",
    },
    {
      titleZh: "时光流逝，饭菜依旧美味",
      titleEn: "Food for the Soul",
      titleJa: "日々は過ぎれど飯うまし",
    },
    {
      titleZh: "东岛丹三郎想成为假面骑士",
      titleEn: "Tojima Tanzaburo Wants to Be a Masked Rider",
      titleJa: "東島丹三郎は仮面ライダーになりたい",
    },
    {
      titleZh: "薰香花朵凛然绽放",
      titleEn: "The Fragrant Flower Blooms with Dignity",
      titleJa: "薫る花は凛と咲く",
    },
    {
      titleZh: "赛马娘 芦毛灰姑娘",
      titleEn: "Uma Musume Cinderella Gray",
      titleJa: "ウマ娘 シンデレラグレイ",
    },
    {
      titleZh: "废渊战鬼",
      titleEn: "Gachiakuta",
      titleJa: "ガチアクタ",
    },
  ],
}

export default data
