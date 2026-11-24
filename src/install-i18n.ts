import type { InstallErrorCode } from './install-model';
import type { Season } from './model';
import { defaultVillageLabels, type VillageLabels } from './village-labels';

export const LOCALES = ['ko', 'en', 'ja', 'zh-CN'] as const;
export type Locale = typeof LOCALES[number];
export const LOCALE_STORAGE_KEY = 'visitor-village.locale';

export function normalizeLocale(value: string | null): Locale | undefined {
  if (!value?.trim()) return;
  let language: string;
  try {
    language = Intl.getCanonicalLocales(value.trim().replaceAll('_', '-'))[0].split('-')[0].toLowerCase();
  } catch { return; }
  if (language === 'zh') return 'zh-CN';
  if (language === 'ko' || language === 'en' || language === 'ja') return language;
}

export function resolveLocale(search: string, readStored: () => string | null, languages: readonly string[]): Locale {
  const fromUrl = normalizeLocale(new URLSearchParams(search).get('lang'));
  if (fromUrl) return fromUrl;
  try {
    const stored = normalizeLocale(readStored());
    if (stored) return stored;
  } catch { /* Storage can be blocked by browser privacy settings. */ }
  for (const language of languages) {
    const supported = normalizeLocale(language);
    if (supported) return supported;
  }
  return 'ko';
}

export function saveLocale(locale: Locale, write: (value: string) => void): void {
  try { write(locale); } catch { /* Language selection still works without storage. */ }
}

const ko = {
  brand: '작은 방문자 마을', pageTitle: '블로그에 설치하기 | 작은 방문자 마을',
  language: '언어', demoLink: '마을 둘러보기', skipLink: '마을 설정으로 건너뛰기',
  introTitle: '내 블로그에 작은 마을을 초대하세요.',
  introBody: '주소와 계절을 정하고, 나만의 마을을 설치해 보세요.',
  settingsTitle: '마을 설정', addressLabel: '티스토리 주소',
  addressHelp: '티스토리 주소나 연결한 개인 도메인을 입력하세요.',
  seasonLabel: '처음 보여 줄 계절', refreshLabel: '오늘 방문 수를 1분마다 확인',
  refreshHelp: '선택 기능입니다. 화면에 보일 때 블로그 HTML을 조회합니다. 집계 지연이 있을 수 있으며, 반복 조회의 집계 영향은 아직 검증하지 않았습니다.',
  createCode: '설치 코드 만들기', manualNote: '주소 입력만으로 자동 설치되지는 않습니다.',
  previewTitle: '마을 미리보기', demoCount: '시연용 24명',
  previewHint: '설치 후에는 오늘 방문자 수만큼 캐릭터가 나타나요.',
  loading: '마을을 준비하고 있어요.', previewError: '미리보기를 불러오지 못했어요. 설치 코드는 계속 만들 수 있습니다.',
  retry: '미리보기 다시 시도', pause: '일시 정지', resume: '다시 재생',
  reducedMotion: '기기의 모션 줄이기 설정이 적용되어 있어요.',
  previewTip: '계절을 바꾸며 마을을 미리 확인하세요.',
  copyTitle: '설치 코드를 복사하세요', codePending: '위에서 코드를 만들면 이곳에 복사할 코드가 나타납니다.',
  codeLabel: '티스토리 설치 코드', copy: '코드 복사', copySuccess: '코드를 복사했어요.',
  copyFallback: '코드를 선택했어요. 복사 단축키를 눌러 주세요.', resultLabel: '설치 코드와 관리자 링크',
  originNote: (origin: string) => `${origin}에 넣을 코드입니다.`,
  guideTitle: '티스토리 스킨에 붙여 넣으세요',
  guideIntro: '관리자에서 아래 메뉴를 열고 마을을 넣을 위치에 코드를 붙여 넣어 저장하세요.',
  menuPath: '꾸미기 → 스킨 편집 → HTML 편집',
  adminLink: '내 블로그 관리자 열기', adminPending: '코드를 만들면 내 블로그 관리자 링크가 나타납니다.',
  backupNote: '수정 전 현재 스킨을 백업해 두세요.',
  manualFull: '주소 입력만으로 설치되지는 않습니다. 최초 한 번은 블로그 소유자가 코드를 붙여 넣어야 해요. 이후 페이지를 열면 오늘 방문자 수를 사용합니다.',
  checkHint: '저장 후 실제 블로그에서 방문자 수와 모바일 화면을 확인하세요.',
  footerText: '오늘의 방문을 작은 마을로.', footerLink: '마을 시연 보기',
  unexpectedError: '코드를 만들지 못했어요. 주소와 계절을 확인한 뒤 다시 시도해 주세요.',
  seasons: {christmas: '크리스마스', spring: '봄', summer: '여름', autumn: '가을', winter: '겨울'} as Record<Season, string>,
  errors: {
    empty: '티스토리 주소를 입력해 주세요.', invalid: '올바른 블로그 주소를 입력해 주세요. 예: myblog.tistory.com',
    unsafe: '계정 정보나 포트가 없는 http 또는 https 블로그 주소를 사용해 주세요.',
    public: '공개 티스토리 주소 또는 연결한 개인 도메인을 입력해 주세요.',
    module: '위젯 모듈의 웹 주소가 올바르지 않아요.', season: '올바른 계절을 선택해 주세요.',
  } as Record<InstallErrorCode, string>,
  village: defaultVillageLabels,
};
export type Messages = typeof ko;
export type TextKey = { [K in keyof Messages]: Messages[K] extends string ? K : never }[keyof Messages];

const en: Messages = {
  brand: 'Little Visitor Village', pageTitle: 'Install on your blog | Little Visitor Village',
  language: 'Language', demoLink: 'Explore the village (Korean)', skipLink: 'Skip to village settings',
  introTitle: 'A little village. A home on your blog.', introBody: 'Choose a season, preview your village, and make it yours.',
  settingsTitle: 'Village settings', addressLabel: 'Tistory blog address',
  addressHelp: 'Enter your Tistory address or connected custom domain.', seasonLabel: 'Starting season',
  refreshLabel: 'Check today’s visitor count every minute',
  refreshHelp: 'Optional. Reads your blog’s HTML while the village is visible. Counts may be delayed. The effect of repeated requests on visitor counting has not been verified.',
  createCode: 'Create install code', manualNote: 'Entering an address does not install the village automatically.',
  previewTitle: 'Your village preview', demoCount: '24 demo visitors',
  previewHint: 'Once installed, each character represents one visitor counted today.',
  loading: 'Preparing your village.', previewError: 'The preview could not load. You can still create your install code.',
  retry: 'Retry preview', pause: 'Pause', resume: 'Play',
  reducedMotion: 'Your device’s reduced motion setting is enabled.', previewTip: 'Try another season to see your village change.',
  copyTitle: 'Copy your install code', codePending: 'Create your code above. It will appear here, ready to copy.',
  codeLabel: 'Tistory install code', copy: 'Copy code', copySuccess: 'Code copied.',
  copyFallback: 'Code selected. Use your keyboard’s copy shortcut.', resultLabel: 'Install code and blog admin link',
  originNote: origin => `Install code for ${origin}.`,
  guideTitle: 'Add it to your Tistory skin', guideIntro: 'In your blog admin, open the menu below. Paste the code where you want the village, then save.',
  menuPath: 'Appearance → Edit skin → Edit HTML', adminLink: 'Open my blog admin',
  adminPending: 'Your blog admin link will appear after you create the code.', backupNote: 'Back up your current skin before editing.',
  manualFull: 'Entering an address does not install the village. The blog owner needs to paste the code into the skin once. It then uses today’s visitor count when the page opens.',
  checkHint: 'After saving, check the count and mobile layout on your actual blog.',
  footerText: 'Today’s visits, a little village.', footerLink: 'View the demo (Korean)',
  unexpectedError: 'Could not create the code. Check the address and season, then try again.',
  seasons: {christmas: 'Christmas', spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter'},
  errors: {
    empty: 'Enter your Tistory blog address.', invalid: 'Enter a valid blog address, such as myblog.tistory.com.',
    unsafe: 'Use an HTTP or HTTPS blog address without account details or a port.',
    public: 'Enter a public Tistory address or connected custom domain.', module: 'The widget’s web address is not valid.', season: 'Choose a valid season.',
  },
  village: {
    region: 'Visitor village preview', repository: 'View on GitHub ↗', repositoryLabel: 'View the Pixel Visitor Village repository (new tab)',
    loadError: 'The village graphics could not start. Try a browser with WebGL support.',
    assetWarning: 'The tree image could not load. A fallback tree is shown.',
    seasons: {christmas: 'Christmas square', spring: 'Spring blossoms', summer: 'Summer greenery', autumn: 'Autumn leaves', winter: 'Winter snow'},
    visitors: count => `${count.toLocaleString('en')} visitors`,
    guests: {santa: 'Santa (Christmas decoration)', rudolph: 'Rudolph (Christmas decoration)'},
    social: (pairs,reacting)=>`${pairs} visitor pair${pairs===1?'':'s'} ${reacting?'exchanging icon balloons':'waving'}`,
    today: (count, delta) => `Today’s visitors: ${count.toLocaleString('en')}${delta > 0 ? ` (+${delta.toLocaleString('en')})` : ''}`,
    recent: count => `Last checked: ${count.toLocaleString('en')}`,
  },
};

const ja: Messages = {
  brand: '小さな訪問者の村', pageTitle: 'ブログに設置する | 小さな訪問者の村',
  language: '言語', demoLink: '村を見てみる（韓国語）', skipLink: '村の設定へスキップ',
  introTitle: 'あなたのブログに、小さな村を。', introBody: '季節を選んで村を確認したら、ブログに設置しましょう。',
  settingsTitle: '村の設定', addressLabel: 'Tistoryのブログアドレス',
  addressHelp: 'Tistoryのアドレスか、接続済みの独自ドメインを入力してください。', seasonLabel: '最初に表示する季節',
  refreshLabel: '今日の訪問者数を1分ごとに確認する',
  refreshHelp: '任意の機能です。村が表示されている間、ブログのHTMLを取得します。集計に遅延が生じることがあります。繰り返し取得による集計への影響は未検証です。',
  createCode: '設置コードを作成', manualNote: 'アドレスの入力だけでは自動で設置されません。',
  previewTitle: '村のプレビュー', demoCount: 'デモの訪問者24人', previewHint: '設置後は、今日の訪問者数と同じ数のキャラクターが現れます。',
  loading: '村を準備しています。', previewError: 'プレビューを読み込めませんでした。設置コードは引き続き作成できます。',
  retry: 'プレビューを再試行', pause: '一時停止', resume: '再生', reducedMotion: '端末の「視差効果を減らす」設定が適用されています。',
  previewTip: '季節を切り替えて、村の様子をご覧ください。',
  copyTitle: '設置コードをコピー', codePending: '上でコードを作成すると、ここに表示されます。',
  codeLabel: 'Tistory設置コード', copy: 'コードをコピー', copySuccess: 'コードをコピーしました。',
  copyFallback: 'コードを選択しました。キーボードのコピー操作を行ってください。', resultLabel: '設置コードと管理画面へのリンク',
  originNote: origin => `${origin} に設置するコードです。`,
  guideTitle: 'Tistoryのスキンに貼り付ける', guideIntro: 'ブログの管理画面で下のメニューを開き、村を表示したい場所にコードを貼り付けて保存してください。',
  menuPath: 'デザイン → スキン編集 → HTML編集', adminLink: 'ブログの管理画面を開く',
  adminPending: 'コードを作成すると、管理画面へのリンクが表示されます。', backupNote: '編集前に現在のスキンをバックアップしてください。',
  manualFull: 'アドレスの入力だけでは設置されません。初回のみ、ブログ所有者がスキンにコードを貼り付けてください。その後はページを開いたときの今日の訪問者数を使用します。',
  checkHint: '保存後、実際のブログで訪問者数とモバイル表示を確認してください。',
  footerText: '今日の訪問を、小さな村に。', footerLink: 'デモを見る（韓国語）',
  unexpectedError: 'コードを作成できませんでした。アドレスと季節を確認して、もう一度お試しください。',
  seasons: {christmas: 'クリスマス', spring: '春', summer: '夏', autumn: '秋', winter: '冬'},
  errors: {
    empty: 'Tistoryのブログアドレスを入力してください。', invalid: '正しいブログアドレスを入力してください。例：myblog.tistory.com',
    unsafe: 'アカウント情報やポート番号を含まないHTTPまたはHTTPSのアドレスを使用してください。',
    public: '公開されたTistoryのアドレスか、接続済みの独自ドメインを入力してください。', module: 'ウィジェットのURLが正しくありません。', season: '有効な季節を選択してください。',
  },
  village: {
    region: '訪問者の村のプレビュー', repository: 'GitHubで見る ↗', repositoryLabel: 'Pixel Visitor Villageのリポジトリを見る（新しいタブ）',
    loadError: '村の描画を開始できませんでした。WebGL対応ブラウザーでお試しください。', assetWarning: '木の画像を読み込めないため、代わりの木を表示しています。',
    seasons: {christmas: 'クリスマスの広場', spring: '春の花咲く広場', summer: '夏の緑の広場', autumn: '秋の紅葉の広場', winter: '冬の雪の広場'},
    visitors: count => `訪問者 ${count.toLocaleString('ja')}人`,
    guests: {santa: 'サンタ（クリスマスの飾り）', rudolph: 'ルドルフ（クリスマスの飾り）'},
    social: (pairs,reacting)=>`キャラクター${pairs}組が${reacting?'アイコンの吹き出しで反応':'手を振る'}`,
    today: (count, delta) => `今日の訪問者 ${count.toLocaleString('ja')}人${delta > 0 ? ` (+${delta.toLocaleString('ja')})` : ''}`,
    recent: count => `前回の確認 ${count.toLocaleString('ja')}人`,
  },
};

const zh: Messages = {
  brand: '小小访客村庄', pageTitle: '安装到博客 | 小小访客村庄',
  language: '语言', demoLink: '探索村庄（韩语）', skipLink: '跳转到村庄设置',
  introTitle: '给你的博客，添一座小村庄。', introBody: '选择季节，预览村庄，再把它安装到你的博客。',
  settingsTitle: '村庄设置', addressLabel: 'Tistory 博客地址', addressHelp: '请输入 Tistory 地址或已绑定的自定义域名。',
  seasonLabel: '初始显示的季节', refreshLabel: '每分钟查看一次今日访客数',
  refreshHelp: '可选功能。村庄可见时读取博客 HTML。统计可能存在延迟，重复请求对访客统计的影响尚未验证。',
  createCode: '生成安装代码', manualNote: '仅输入地址不会自动完成安装。',
  previewTitle: '村庄预览', demoCount: '24 位演示访客', previewHint: '安装后，每位今日访客都会对应一个角色。',
  loading: '正在准备村庄。', previewError: '无法加载预览。你仍然可以生成安装代码。',
  retry: '重新加载预览', pause: '暂停', resume: '播放', reducedMotion: '已应用设备的减少动态效果设置。',
  previewTip: '切换季节，看看村庄的变化。', copyTitle: '复制安装代码', codePending: '在上方生成代码后，代码将在这里显示。',
  codeLabel: 'Tistory 安装代码', copy: '复制代码', copySuccess: '代码已复制。',
  copyFallback: '代码已选中，请使用键盘快捷键复制。', resultLabel: '安装代码和博客管理链接',
  originNote: origin => `用于 ${origin} 的安装代码。`,
  guideTitle: '粘贴到 Tistory 皮肤', guideIntro: '在博客管理页面打开以下菜单，将代码粘贴到希望显示村庄的位置，然后保存。',
  menuPath: '外观 → 编辑皮肤 → 编辑 HTML', adminLink: '打开博客管理页面',
  adminPending: '生成代码后，将显示博客管理页面的链接。', backupNote: '编辑前请备份当前皮肤。',
  manualFull: '仅输入地址不会完成安装。博客所有者首次需要将代码粘贴到皮肤中。此后，页面打开时会使用今日访客数。',
  checkHint: '保存后，请在实际博客中检查访客数和手机显示效果。',
  footerText: '把今天的来访，变成一座小村庄。', footerLink: '查看演示（韩语）',
  unexpectedError: '无法生成代码，请检查地址和季节后重试。',
  seasons: {christmas: '圣诞节', spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季'},
  errors: {
    empty: '请输入 Tistory 博客地址。', invalid: '请输入有效的博客地址，例如 myblog.tistory.com。',
    unsafe: '请使用不含账号信息或端口号的 HTTP 或 HTTPS 博客地址。', public: '请输入公开的 Tistory 地址或已绑定的自定义域名。',
    module: '小组件的网址无效。', season: '请选择有效的季节。',
  },
  village: {
    region: '访客村庄预览', repository: '在 GitHub 上查看 ↗', repositoryLabel: '查看 Pixel Visitor Village 仓库（新标签页）',
    loadError: '无法启动村庄画面，请使用支持 WebGL 的浏览器。', assetWarning: '无法加载树木图片，已显示备用树木。',
    seasons: {christmas: '圣诞广场', spring: '春日花开广场', summer: '夏日绿荫广场', autumn: '秋日红叶广场', winter: '冬日雪景广场'},
    visitors: count => `访客 ${count.toLocaleString('zh-CN')}人`,
    guests: {santa: '圣诞老人（圣诞装饰）', rudolph: '鲁道夫（圣诞装饰）'},
    social: (pairs,reacting)=>`${pairs}对角色${reacting?'通过图标气泡互动':'挥手'}`,
    today: (count, delta) => `今日访客 ${count.toLocaleString('zh-CN')}${delta > 0 ? ` (+${delta.toLocaleString('zh-CN')})` : ''}`,
    recent: count => `上次查看 ${count.toLocaleString('zh-CN')}`,
  },
};

export const messages: Record<Locale, Messages> = {ko, en, ja, 'zh-CN': zh};
