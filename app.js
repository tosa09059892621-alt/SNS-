const STORAGE_KEY = "snsSidejobDashboardRecords";

const defaultRecords = [
  {
    id: "sample-1",
    postedAt: "2026-06-03",
    media: "Instagram",
    title: "初夏のキャンペーン告知",
    body: "季節限定メニューと予約特典を紹介。ストーリーズにも再掲予定。",
    canvaUrl: "Canvaサンプルリンク：campaign-image（外部通信なし）",
    postStatus: "投稿済み",
    inquiryAt: "2026-06-04",
    inquiry: "キャンペーンの予約方法を知りたい",
    workDate: "2026-06-10",
    workDetail: "投稿分析と次回画像作成",
    sales: 48000,
    cost: 12000,
    responseStatus: "返信済み",
    memo: "保存数が多いので、次回は手順画像を増やす。"
  },
  {
    id: "sample-2",
    postedAt: "2026-06-08",
    media: "Facebook",
    title: "制作実績の紹介",
    body: "過去案件のビフォーアフターを紹介し、問い合わせ導線を設置。",
    canvaUrl: "Canvaサンプルリンク：portfolio-image（外部通信なし）",
    postStatus: "予約投稿",
    inquiryAt: "2026-06-09",
    inquiry: "同じ形式の投稿代行を依頼したい",
    workDate: "2026-06-14",
    workDetail: "ヒアリング、見積もり作成",
    sales: 62000,
    cost: 18000,
    responseStatus: "対応中",
    memo: "実績投稿は反応が良い。価格表へのリンクを追加する。"
  },
  {
    id: "sample-3",
    postedAt: "2026-05-22",
    media: "Googleビジネスプロフィール",
    title: "口コミ返信のお願い",
    body: "来店後のお客様へ口コミ投稿を促す短文を掲載。",
    canvaUrl: "Canvaサンプルリンク：review-image（外部通信なし）",
    postStatus: "投稿済み",
    inquiryAt: "2026-05-24",
    inquiry: "Google投稿の更新頻度について相談したい",
    workDate: "2026-05-30",
    workDetail: "月次レポート作成",
    sales: 35000,
    cost: 9000,
    responseStatus: "完了",
    memo: "検索経由の問い合わせが増加。週1投稿を継続。"
  },
  {
    id: "sample-4",
    postedAt: "2026-06-15",
    media: "Instagram",
    title: "よくある質問まとめ",
    body: "料金、納期、修正回数をカルーセルで説明。",
    canvaUrl: "Canvaサンプルリンク：faq-image（外部通信なし）",
    postStatus: "下書き",
    inquiryAt: "2026-06-16",
    inquiry: "画像だけの制作も可能か確認したい",
    workDate: "2026-06-20",
    workDetail: "FAQ投稿の校正、ハッシュタグ選定",
    sales: 27000,
    cost: 7000,
    responseStatus: "未対応",
    memo: "不安解消系の内容はプロフィール固定候補。"
  }
];

const fieldLabels = {
  postedAt: "投稿日",
  media: "媒体",
  title: "投稿タイトル",
  body: "投稿本文",
  canvaUrl: "Canva画像リンク",
  appealPattern: "訴求パターン",
  generatedCopies: "Instagram / X / LINE用自動作成文",
  canvaHeadline: "Canva画像用：見出し",
  canvaSubcopy: "Canva画像用：サブコピー",
  canvaNote: "Canva画像用：注意書き",
  postStatus: "投稿ステータス",
  inquiryAt: "問い合わせ日",
  inquiry: "問い合わせ内容",
  workDate: "作業予定日",
  workDetail: "作業内容",
  sales: "売上金額",
  cost: "原価",
  responseStatus: "対応状況",
  memo: "改善メモ",
  areaPreset: "対応エリア選択",
  serviceAreas: "対応エリア"
};

const formConfigs = {
  posts: {
    eyebrow: "投稿を新規追加",
    title: "投稿フォーム",
    fields: ["postedAt", "appealPattern", "media", "serviceAreas", "title", "body", "generatedCopies", "canvaHeadline", "canvaSubcopy", "canvaNote", "canvaUrl", "postStatus", "memo"],
    required: ["postedAt", "appealPattern", "media", "title"],
    defaults: { postStatus: "下書き", areaPreset: "sapporoOtaru" }
  },
  inquiries: {
    eyebrow: "問い合わせを新規追加",
    title: "問い合わせフォーム",
    fields: ["inquiryAt", "media", "inquiry", "body", "responseStatus", "title", "memo"],
    required: ["inquiryAt", "media", "inquiry"],
    defaults: { responseStatus: "未対応", title: "問い合わせから追加" }
  },
  works: {
    eyebrow: "作業予定を新規追加",
    title: "作業予定フォーム",
    fields: ["workDate", "media", "workDetail", "title", "postStatus", "responseStatus", "memo"],
    required: ["workDate", "media", "workDetail"],
    defaults: { postStatus: "下書き", responseStatus: "未対応", title: "作業予定から追加" }
  },
  sales: {
    eyebrow: "売上を新規追加",
    title: "売上フォーム",
    fields: ["postedAt", "media", "title", "sales", "cost", "memo"],
    required: ["postedAt", "media", "title", "sales"],
    defaults: { title: "売上記録" }
  }
};

const serviceAreaOptions = [
  "札幌", "小樽", "石狩", "江別", "北広島", "恵庭", "千歳", "当別", "銭函", "朝里", "余市", "仁木", "赤井川", "手稲", "西区", "北区", "東区", "白石区", "豊平区", "清田区", "南区", "中央区", "厚別区", "道央エリア", "札幌近郊", "小樽近郊", "後志エリア"
];

const areaPresets = {
  sapporoOtaru: {
    label: "札幌・小樽近郊セット",
    areas: serviceAreaOptions
  }
};

const appealPatterns = {
  shakenExpired: {
    label: "車検切れ向け",
    title: "車検切れの車も相談受付中",
    subject: "車検切れの車",
    body: "車検が切れて動かせない車も、保管場所や書類状況を確認してご案内します。",
    prompt: "公道を走らせられず困っている方は、まずは車両状態と保管場所をお知らせください。",
    canvaHeadline: "車検切れの車\n引き取り相談受付中",
    canvaSubcopy: "動かせない車も状態を確認してご案内します",
    hashtags: ["#車検切れ", "#車検切れ車"]
  },
  snowBuried: {
    label: "雪に埋まった放置車向け",
    title: "雪に埋まった放置車の相談受付中",
    subject: "雪に埋まった放置車",
    body: "雪に埋もれて動かしにくい放置車も、現地状況を確認しながら対応可能か確認いたします。",
    prompt: "除雪状況や駐車場所によりご案内内容が変わるため、写真があるとスムーズです。",
    canvaHeadline: "雪に埋まった放置車\nご相談ください",
    canvaSubcopy: "場所・積雪状況を確認して対応内容をご案内します",
    hashtags: ["#放置車", "#雪に埋まった車"]
  },
  inheritance: {
    label: "相続・名義変更で困っている方向け",
    title: "相続・名義変更で困る車の相談受付中",
    subject: "相続や名義変更で困っている車",
    body: "相続や名義変更の確認が必要な車も、書類状況を伺いながら次の進め方をご案内します。",
    prompt: "所有者情報や書類の有無により対応内容が異なります。まずは状況をお聞かせください。",
    canvaHeadline: "相続・名義変更の車\nまずはご相談ください",
    canvaSubcopy: "書類状況を確認しながら進め方をご案内します",
    hashtags: ["#相続車", "#名義変更"]
  },
  accident: {
    label: "事故車向け",
    title: "事故車の引き取り相談受付中",
    subject: "事故車",
    body: "事故後に動かしにくい車や修理予定のない車も、損傷状態と保管場所を確認してご案内します。",
    prompt: "車両状態により対応内容が異なるため、まずは写真や状況をお知らせください。",
    canvaHeadline: "事故車の引き取り\n相談受付中",
    canvaSubcopy: "損傷状態・保管場所を確認してご案内します",
    hashtags: ["#事故車", "#事故車相談"]
  },
  keiCar: {
    label: "軽自動車向け",
    title: "軽自動車の廃車相談受付中",
    subject: "軽自動車",
    body: "乗らなくなった軽自動車や車検切れの軽自動車も、状態を確認してご案内します。",
    prompt: "年式や走行距離、書類状況をお知らせいただくと確認がスムーズです。",
    canvaHeadline: "軽自動車の廃車\n相談受付中",
    canvaSubcopy: "車検切れ・長期放置の軽自動車もご相談ください",
    hashtags: ["#軽自動車", "#軽自動車廃車"]
  },
  sapporoCity: {
    label: "札幌市内向け",
    title: "札幌市内の廃車引き取り相談受付中",
    subject: "札幌市内の廃車",
    body: "札幌市内で乗らなくなった車や動かない車の引き取り相談を受け付けています。",
    prompt: "区名や保管場所、車両状態を確認して対応可能か確認いたします。",
    canvaHeadline: "札幌市内\n廃車引き取り相談受付中",
    canvaSubcopy: "区名・保管場所・車両状態を確認してご案内します",
    hashtags: ["#札幌廃車", "#札幌市"]
  },
  otaruYoichi: {
    label: "小樽・余市方面向け",
    title: "小樽・余市方面の廃車相談受付中",
    subject: "小樽・余市方面の廃車",
    body: "小樽・余市方面で動かない車や長く置いたままの車も、場所と状態を確認してご案内します。",
    prompt: "地域や車両状態により対応内容が異なります。まずはご相談ください。",
    canvaHeadline: "小樽・余市方面\n廃車相談受付中",
    canvaSubcopy: "動かない車・長期放置車も状態を確認します",
    hashtags: ["#小樽廃車", "#余市廃車"]
  },
  immobile: {
    label: "不動車向け",
    title: "不動車の引き取り相談受付中",
    subject: "不動車",
    body: "エンジンがかからない車や動かせない車も、搬出場所と状態を確認してご案内します。",
    prompt: "駐車場所やタイヤの状態により対応内容が変わるため、まずは状況をお知らせください。",
    canvaHeadline: "不動車の引き取り\n相談受付中",
    canvaSubcopy: "搬出場所・車両状態を確認してご案内します",
    hashtags: ["#不動車", "#不動車相談"]
  },
  longTerm: {
    label: "長期放置車向け",
    title: "長期放置車の引き取り相談受付中",
    subject: "長期放置車",
    body: "長く置いたままの車や処分のタイミングを逃した車も、状態を確認してご案内します。",
    prompt: "書類状況や保管場所により対応内容が異なります。まずはご相談ください。",
    canvaHeadline: "長期放置車\n引き取り相談受付中",
    canvaSubcopy: "乗らなくなった車も状態を確認してご案内します",
    hashtags: ["#長期放置車", "#放置車相談"]
  },
  urgent: {
    label: "急ぎの相談向け",
    title: "急ぎの廃車相談受付中",
    subject: "急ぎで相談したい廃車",
    body: "引っ越し前や駐車場返却前など、急ぎで相談したい車も状況を確認してご案内します。",
    prompt: "日程・場所・車両状態により対応可能か確認いたします。早めに詳細をお知らせください。",
    canvaHeadline: "急ぎの廃車相談\n受付中",
    canvaSubcopy: "日程・場所・車両状態を確認してご案内します",
    hashtags: ["#廃車相談", "#急ぎの相談"]
  }
};

const mediaOptions = ["Instagram", "X", "LINE配信", "Facebook", "Googleビジネスプロフィール"];

const views = {
  posts: { eyebrow: "投稿管理", title: "投稿一覧", dateKey: "postedAt" },
  inquiries: { eyebrow: "問い合わせ管理", title: "問い合わせ一覧", dateKey: "inquiryAt" },
  works: { eyebrow: "作業予定管理", title: "作業予定一覧", dateKey: "workDate" },
  sales: { eyebrow: "売上管理", title: "売上一覧", dateKey: "postedAt" }
};

let records = loadRecords();
let currentView = "posts";
let currentMonth = "all";
let editingId = null;

const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", weekday: "short" });

const monthFilter = document.querySelector("#monthFilter");
const monthlyLabel = document.querySelector("#monthlyLabel");
const profitLabel = document.querySelector("#profitLabel");
const inquiryLabel = document.querySelector("#inquiryLabel");
const workLabel = document.querySelector("#workLabel");
const list = document.querySelector("#list");
const template = document.querySelector("#itemTemplate");
const entryForm = document.querySelector("#entryForm");
const formFields = document.querySelector("#formFields");
const formEyebrow = document.querySelector("#formEyebrow");
const formTitle = document.querySelector("#formTitle");
const cancelEdit = document.querySelector("#cancelEdit");
const saveEntry = document.querySelector("#saveEntry");

function createId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return `record-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function blankRecord() {
  const today = todayISO();
  return {
    id: createId(),
    postedAt: today,
    media: "Instagram",
    title: "",
    body: "",
    canvaUrl: "",
    postStatus: "下書き",
    inquiryAt: today,
    inquiry: "",
    workDate: today,
    workDetail: "",
    sales: 0,
    cost: 0,
    responseStatus: "未対応",
    memo: "",
    areaPreset: "",
    serviceAreas: "",
    appealPattern: "shakenExpired",
    generatedCopies: "",
    canvaHeadline: "",
    canvaSubcopy: "",
    canvaNote: "",
    recordType: ""
  };
}

function normalizeRecord(record) {
  return { ...blankRecord(), ...record, sales: Number(record.sales) || 0, cost: Number(record.cost) || 0 };
}

function parseAreas(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  return value.split(/[、,\n]/).map((area) => area.trim()).filter(Boolean);
}

function uniqueAreas(areas) {
  return [...new Set(areas)].filter((area) => serviceAreaOptions.includes(area));
}

function areaSummary(areas) {
  if (areas.length === 0) return "札幌・小樽近郊";
  if (areas.includes("札幌近郊") && areas.includes("小樽近郊")) return "札幌・小樽近郊";
  if (areas.includes("道央エリア") && areas.includes("後志エリア")) return "道央・後志エリア";
  return areas.slice(0, 3).join("・");
}

function bodyAreas(areas) {
  const priority = ["札幌", "小樽", "石狩", "江別", "北広島", "恵庭", "千歳", "余市", "道央エリア", "後志エリア"];
  return priority.filter((area) => areas.includes(area)).slice(0, 6).join("、");
}

function areaHashtags(areas) {
  return areas.map((area) => `#${area.replace(/\s+/g, "")}`).join(" ");
}

function selectedAppealPattern(patternKey) {
  return appealPatterns[patternKey] || appealPatterns.shakenExpired;
}

function selectedAreaHashtags(areas) {
  const tags = areaHashtags(areas).split(" ").filter(Boolean);
  return tags.slice(0, 8);
}

function createHashtags(pattern, areas) {
  return ["#廃車引き取り", "#廃車相談", ...pattern.hashtags, ...selectedAreaHashtags(areas)].join(" ");
}

function createPostSet(patternKey, areas) {
  const pattern = selectedAppealPattern(patternKey);
  const selectedAreas = uniqueAreas(areas);
  const summary = areaSummary(selectedAreas);
  const nearbyAreas = bodyAreas(selectedAreas);
  const hashtags = createHashtags(pattern, selectedAreas);
  const nearbyText = nearbyAreas ? `対応エリアは${nearbyAreas}など。` : "対応エリアは札幌近郊・小樽近郊など。";
  const safeNote = "車両状態・場所・書類状況により対応内容が異なります。";
  const consultation = "まずはご相談ください。状態を確認してご案内します。";

  const instagram = `${summary}で${pattern.subject}のご相談を受け付けています。\n\n${pattern.body}${nearbyText}\n\n${pattern.prompt}\n${consultation}\n\n${hashtags}`;
  const x = `${summary}で${pattern.subject}のご相談受付中。\n${pattern.body}${nearbyText}\n${consultation}\n${hashtags}`;
  const line = `${summary}で${pattern.subject}についてお困りの方へ\n\n${pattern.body}\n${nearbyText}\n\n${pattern.prompt}\n対応可能か確認いたしますので、車両状態・場所・書類状況をお知らせください。\n\n${hashtags}`;

  return {
    Instagram: instagram,
    X: x,
    "LINE配信": line,
    canvaHeadline: `${summary}\n${pattern.canvaHeadline}`,
    canvaSubcopy: pattern.canvaSubcopy,
    canvaNote: safeNote
  };
}

function createPostCopy(media, patternKey, areas) {
  const postSet = createPostSet(patternKey, areas);
  return postSet[media] || postSet.Instagram;
}

function createGeneratedCopies(patternKey, areas) {
  const postSet = createPostSet(patternKey, areas);
  return [`【Instagram用】\n${postSet.Instagram}`, `【X用】\n${postSet.X}`, `【LINE配信用】\n${postSet["LINE配信"]}`].join("\n\n---\n\n");
}

function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved.map(normalizeRecord);
  } catch (error) {
    console.warn("保存データを読み込めませんでした。サンプルデータを表示します。", error);
  }
  return defaultRecords.map(normalizeRecord);
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function profit(record) {
  return record.sales - record.cost;
}

function monthOf(dateString) {
  return typeof dateString === "string" && dateString.length >= 7 ? dateString.slice(0, 7) : "";
}

function hasMonth(record, dateKey, month) {
  return month === "all" || monthOf(record[dateKey]) === month;
}

function isSalesRecord(record) {
  return record.recordType === "sales" || record.sales > 0 || record.cost > 0;
}

function isInquiryRecord(record) {
  return record.recordType === "inquiries" || Boolean(record.inquiry && record.inquiry.trim());
}

function isWorkRecord(record) {
  return record.recordType === "works" || Boolean(record.workDetail && record.workDetail.trim());
}

function displayDate(dateString) {
  return dateFormat.format(new Date(`${dateString}T00:00:00`));
}

function filteredRecords() {
  const dateKey = views[currentView].dateKey;
  return records.filter((record) => currentMonth === "all" || monthOf(record[dateKey]) === currentMonth);
}

function setupMonthFilter() {
  const months = [...new Set(records.flatMap((record) => [record.postedAt, record.inquiryAt, record.workDate].map(monthOf)).filter(Boolean))].sort().reverse();
  const selected = months.includes(currentMonth) ? currentMonth : "all";
  monthFilter.innerHTML = ["<option value=\"all\">すべての月</option>", ...months.map((month) => `<option value="${month}">${month.replace("-", "年")}月</option>`)].join("");
  monthFilter.value = selected;
  currentMonth = selected;
}

function updateSummary() {
  const summaryMonth = currentMonth === "all" ? "all" : currentMonth;
  const salesRecords = records.filter((record) => isSalesRecord(record) && hasMonth(record, "postedAt", summaryMonth));
  const inquiryRecords = records.filter((record) => isInquiryRecord(record) && hasMonth(record, "inquiryAt", summaryMonth));
  const today = todayISO();
  const workRecords = records.filter((record) => isWorkRecord(record) && hasMonth(record, "workDate", summaryMonth));

  const sales = salesRecords.reduce((sum, record) => sum + record.sales, 0);
  const profitTotal = salesRecords.reduce((sum, record) => sum + profit(record), 0);
  const openInquiries = inquiryRecords.filter((record) => record.responseStatus === "未対応").length;
  const works = workRecords.filter((record) => record.workDate >= today).length;
  const label = summaryMonth === "all" ? "すべての月" : `${summaryMonth.replace("-", "年")}月`;

  document.querySelector("#monthlySales").textContent = yen.format(sales);
  document.querySelector("#monthlyProfit").textContent = yen.format(profitTotal);
  monthlyLabel.textContent = `${label}の売上データ合計`;
  profitLabel.textContent = `${label}の売上 - 原価`;
  document.querySelector("#openInquiries").textContent = `${openInquiries}件`;
  inquiryLabel.textContent = `${label}の未対応のみ`;
  document.querySelector("#upcomingWorks").textContent = `${works}件`;
  workLabel.textContent = `${label} / 今日以降`;
}

function inputType(field) {
  if (["postedAt", "inquiryAt", "workDate"].includes(field)) return "date";
  if (["sales", "cost"].includes(field)) return "number";
  return "text";
}

function createAreaPicker(values) {
  const wrapper = document.createElement("fieldset");
  wrapper.className = "area-picker full-span";

  const legend = document.createElement("legend");
  legend.textContent = fieldLabels.areaPreset;

  const presetLabel = document.createElement("label");
  presetLabel.className = "area-preset-label";
  presetLabel.textContent = "セット選択";

  const presetSelect = document.createElement("select");
  presetSelect.name = "areaPreset";
  presetSelect.innerHTML = '<option value="">個別に選択</option>' + Object.entries(areaPresets).map(([value, preset]) => `<option value="${value}">${preset.label}</option>`).join("");
  presetSelect.value = values.areaPreset || "";
  presetLabel.appendChild(presetSelect);

  const selectedAreas = values.areaPreset && areaPresets[values.areaPreset]
    ? uniqueAreas(areaPresets[values.areaPreset].areas)
    : uniqueAreas(parseAreas(values.serviceAreas));
  const checkboxGrid = document.createElement("div");
  checkboxGrid.className = "area-checkbox-grid";

  serviceAreaOptions.forEach((area) => {
    const optionLabel = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "serviceAreaOptions";
    checkbox.value = area;
    checkbox.checked = selectedAreas.includes(area);
    optionLabel.append(checkbox, document.createTextNode(area));
    checkboxGrid.appendChild(optionLabel);
  });

  const hint = document.createElement("p");
  hint.className = "field-hint";
  hint.textContent = "投稿本文には自然な量だけ、ハッシュタグには多めに地域名を入れます。";

  wrapper.append(legend, presetLabel, checkboxGrid, hint);
  return wrapper;
}

function createField(field, values, config) {
  if (field === "serviceAreas") return createAreaPicker(values);

  const label = document.createElement("label");
  const isLongText = ["body", "memo", "generatedCopies", "canvaHeadline", "canvaSubcopy", "canvaNote"].includes(field);
  const isSelect = field === "media" || field === "appealPattern";
  const input = isSelect ? document.createElement("select") : isLongText ? document.createElement("textarea") : document.createElement("input");
  label.textContent = fieldLabels[field];
  input.name = field;
  input.value = values[field] ?? "";
  input.required = config.required.includes(field);

  if (field === "media") {
    input.innerHTML = mediaOptions.map((media) => `<option value="${media}">${media}</option>`).join("");
    input.value = mediaOptions.includes(values[field]) ? values[field] : "Instagram";
  } else if (field === "appealPattern") {
    input.innerHTML = Object.entries(appealPatterns).map(([value, pattern]) => `<option value="${value}">${pattern.label}</option>`).join("");
    input.value = appealPatterns[values[field]] ? values[field] : "shakenExpired";
  } else if (isLongText) {
    input.rows = field === "generatedCopies" ? 12 : field === "body" ? 7 : field.startsWith("canva") ? 3 : 3;
    if (["generatedCopies", "canvaHeadline", "canvaSubcopy", "canvaNote"].includes(field)) label.classList.add("copy-output");
  } else if (inputType(field) === "number") {
    input.type = "number";
    input.min = "0";
    input.step = "1";
  } else {
    input.type = inputType(field);
  }

  if (["body", "generatedCopies", "canvaHeadline", "canvaSubcopy", "canvaNote", "memo"].includes(field)) label.classList.add("full-span");

  label.appendChild(input);
  return label;
}

function syncPostCopy({ force = false } = {}) {
  if (currentView !== "posts") return;
  const mediaInput = entryForm.elements.media;
  const patternInput = entryForm.elements.appealPattern;
  const titleInput = entryForm.elements.title;
  const bodyInput = entryForm.elements.body;
  const generatedCopiesInput = entryForm.elements.generatedCopies;
  const canvaHeadlineInput = entryForm.elements.canvaHeadline;
  const canvaSubcopyInput = entryForm.elements.canvaSubcopy;
  const canvaNoteInput = entryForm.elements.canvaNote;
  if (!mediaInput || !patternInput || !titleInput || !bodyInput) return;

  const selectedAreas = uniqueAreas([...entryForm.querySelectorAll('input[name="serviceAreaOptions"]:checked')].map((checkbox) => checkbox.value));
  const pattern = selectedAppealPattern(patternInput.value);
  const postSet = createPostSet(patternInput.value, selectedAreas);
  const generatedTitle = `${areaSummary(selectedAreas)}で${pattern.title}`;
  const generatedBody = createPostCopy(mediaInput.value, patternInput.value, selectedAreas);
  const generatedCopies = createGeneratedCopies(patternInput.value, selectedAreas);

  const autoTargets = [
    [titleInput, generatedTitle],
    [bodyInput, generatedBody],
    [generatedCopiesInput, generatedCopies],
    [canvaHeadlineInput, postSet.canvaHeadline],
    [canvaSubcopyInput, postSet.canvaSubcopy],
    [canvaNoteInput, postSet.canvaNote]
  ];

  autoTargets.forEach(([input, value]) => {
    if (!input) return;
    if (force || !input.value.trim() || input.dataset.autoGenerated === "true") {
      input.value = value;
      input.dataset.autoGenerated = "true";
    }
  });
}

function renderForm(record = null) {
  const config = formConfigs[currentView];
  const values = { ...blankRecord(), ...config.defaults, ...record };
  formEyebrow.textContent = editingId ? "保存済みデータを編集中" : config.eyebrow;
  formTitle.textContent = editingId ? "内容を編集" : config.title;
  saveEntry.textContent = editingId ? "更新する" : currentView === "posts" ? "投稿に追加" : "保存する";
  cancelEdit.hidden = !editingId;
  formFields.innerHTML = "";

  config.fields.forEach((field) => {
    formFields.appendChild(createField(field, values, config));
  });

  const titleInput = entryForm.elements.title;
  const bodyInput = entryForm.elements.body;
  if (titleInput) titleInput.dataset.autoGenerated = record?.title ? "false" : "true";
  if (bodyInput) bodyInput.dataset.autoGenerated = record?.body ? "false" : "true";
  ["generatedCopies", "canvaHeadline", "canvaSubcopy", "canvaNote"].forEach((field) => {
    const input = entryForm.elements[field];
    if (input) input.dataset.autoGenerated = record?.[field] ? "false" : "true";
  });
  if (currentView === "posts" && !record) syncPostCopy({ force: true });
}

function collectFormRecord() {
  const formData = new FormData(entryForm);
  const existing = editingId ? records.find((record) => record.id === editingId) : null;
  const next = { ...blankRecord(), ...formConfigs[currentView].defaults, ...existing };

  for (const [key, value] of formData.entries()) {
    if (["serviceAreaOptions", "serviceAreas"].includes(key)) continue;
    next[key] = ["sales", "cost"].includes(key) ? Number(value) || 0 : value.trim();
  }

  if (currentView === "posts") {
    const selectedAreas = uniqueAreas(formData.getAll("serviceAreaOptions"));
    next.serviceAreas = selectedAreas.join("、");
    if (next.areaPreset && areaPresets[next.areaPreset]) next.serviceAreas = uniqueAreas(areaPresets[next.areaPreset].areas).join("、");
  }

  next.id = editingId || createId();
  next.recordType = next.recordType || currentView;
  return normalizeRecord(next);
}

function resetForm() {
  editingId = null;
  renderForm();
}

function refreshScreen() {
  setupMonthFilter();
  updateSummary();
  renderList();
}

function metaFor(record) {
  if (currentView === "posts") {
    return [
      ["媒体", record.media],
      ["訴求パターン", selectedAppealPattern(record.appealPattern).label],
      ["投稿ステータス", record.postStatus],
      ["Canva見出し", record.canvaHeadline],
      ["Canvaサブコピー", record.canvaSubcopy],
      ["Canva注意書き", record.canvaNote],
      ["Canva画像リンク", record.canvaUrl],
      ["対応エリア", record.serviceAreas || "未選択"],
      ["対応状況", record.responseStatus]
    ];
  }
  if (currentView === "inquiries") {
    return [
      ["媒体", record.media],
      ["問い合わせ日", displayDate(record.inquiryAt)],
      ["対応状況", record.responseStatus],
      ["関連投稿", record.title]
    ];
  }
  if (currentView === "works") {
    return [
      ["媒体", record.media],
      ["作業予定日", displayDate(record.workDate)],
      ["投稿ステータス", record.postStatus],
      ["対応状況", record.responseStatus]
    ];
  }
  return [
    ["売上金額", yen.format(record.sales)],
    ["原価", yen.format(record.cost)],
    ["利益", yen.format(profit(record))],
    ["媒体", record.media]
  ];
}

function textFor(record) {
  if (currentView === "inquiries") return { title: record.inquiry, body: record.body || `関連投稿：${record.title}`, date: record.inquiryAt, pill: record.responseStatus };
  if (currentView === "works") return { title: record.workDetail, body: `関連投稿：${record.title}`, date: record.workDate, pill: record.media };
  if (currentView === "sales") return { title: record.title, body: `利益 ${yen.format(profit(record))} / 原価 ${yen.format(record.cost)}`, date: record.postedAt, pill: record.media };
  return { title: record.title, body: record.body, date: record.postedAt, pill: record.postStatus };
}

function renderList() {
  const config = views[currentView];
  const data = filteredRecords().sort((a, b) => b[config.dateKey].localeCompare(a[config.dateKey]));
  document.querySelector("#viewEyebrow").textContent = config.eyebrow;
  document.querySelector("#viewTitle").textContent = config.title;
  document.querySelector("#viewCount").textContent = `${data.length}件`;
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = '<p class="empty-state">この月の保存済みデータはありません。</p>';
    return;
  }

  data.forEach((record) => {
    const viewText = textFor(record);
    const node = template.content.cloneNode(true);
    node.querySelector(".item-card").dataset.id = record.id;
    node.querySelector(".pill").textContent = viewText.pill;
    node.querySelector(".date").textContent = displayDate(viewText.date);
    node.querySelector("h3").textContent = viewText.title;
    node.querySelector(".description").textContent = viewText.body;
    node.querySelector(".memo").textContent = `改善メモ：${record.memo || "未入力"}`;

    const metaGrid = node.querySelector(".meta-grid");
    metaFor(record).forEach(([label, value]) => {
      const wrapper = document.createElement("div");
      const term = document.createElement("dt");
      const detail = document.createElement("dd");
      term.textContent = label;
      detail.textContent = value || "未入力";

      wrapper.append(term, detail);
      metaGrid.appendChild(wrapper);
    });

    list.appendChild(node);
  });
}

function exportCsv() {
  const header = ["投稿日", "媒体", "訴求パターン", "対応エリア", "投稿タイトル", "投稿本文", "Instagram/X/LINE用作成文", "Canva見出し", "Canvaサブコピー", "Canva注意書き", "Canva画像リンク", "投稿ステータス", "問い合わせ日", "問い合わせ内容", "作業予定日", "作業内容", "売上金額", "原価", "利益", "対応状況", "改善メモ"];
  const rows = records.map((record) => [record.postedAt, record.media, selectedAppealPattern(record.appealPattern).label, record.serviceAreas, record.title, record.body, record.generatedCopies, record.canvaHeadline, record.canvaSubcopy, record.canvaNote, record.canvaUrl, record.postStatus, record.inquiryAt, record.inquiry, record.workDate, record.workDetail, record.sales, record.cost, profit(record), record.responseStatus, record.memo]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "sns-sidejob-dashboard.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

entryForm.addEventListener("input", (event) => {
  if (["title", "body", "generatedCopies", "canvaHeadline", "canvaSubcopy", "canvaNote"].includes(event.target.name)) event.target.dataset.autoGenerated = "false";
});

entryForm.addEventListener("change", (event) => {
  if (event.target.name === "areaPreset") {
    const preset = areaPresets[event.target.value];
    entryForm.querySelectorAll('input[name="serviceAreaOptions"]').forEach((checkbox) => {
      checkbox.checked = Boolean(preset?.areas.includes(checkbox.value));
    });
    syncPostCopy({ force: true });
  }

  if (["serviceAreaOptions", "media", "appealPattern"].includes(event.target.name)) {
    const presetSelect = entryForm.elements.areaPreset;
    if (event.target.name === "serviceAreaOptions" && presetSelect) presetSelect.value = "";
    syncPostCopy({ force: event.target.name === "appealPattern" });
  }
});

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextRecord = collectFormRecord();

  if (editingId) {
    records = records.map((record) => (record.id === editingId ? nextRecord : record));
  } else {
    records = [nextRecord, ...records];
  }

  saveRecords();
  resetForm();
  refreshScreen();
});

cancelEdit.addEventListener("click", resetForm);

list.addEventListener("click", (event) => {
  const card = event.target.closest(".item-card");
  if (!card) return;
  const record = records.find((item) => item.id === card.dataset.id);
  if (!record) return;

  if (event.target.classList.contains("edit-button")) {
    editingId = record.id;
    renderForm(record);
    entryForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (event.target.classList.contains("delete-button")) {
    const label = textFor(record).title || "このデータ";
    if (!confirm(`「${label}」を削除しますか？`)) return;
    records = records.filter((item) => item.id !== record.id);
    saveRecords();
    if (editingId === record.id) resetForm();
    refreshScreen();
  }
});

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    currentView = button.dataset.view;
    resetForm();
    updateSummary();
    renderList();
  });
});

monthFilter.addEventListener("change", (event) => {
  currentMonth = event.target.value;
  updateSummary();
  renderList();
});

document.querySelector("#exportCsv").addEventListener("click", exportCsv);

renderForm();
setupMonthFilter();
updateSummary();
renderList();
