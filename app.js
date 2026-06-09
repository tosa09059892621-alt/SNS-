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
  postStatus: "投稿ステータス",
  inquiryAt: "問い合わせ日",
  inquiry: "問い合わせ内容",
  workDate: "作業予定日",
  workDetail: "作業内容",
  sales: "売上金額",
  cost: "原価",
  responseStatus: "対応状況",
  memo: "改善メモ"
};

const formConfigs = {
  posts: {
    eyebrow: "投稿を新規追加",
    title: "投稿フォーム",
    fields: ["postedAt", "media", "title", "body", "canvaUrl", "postStatus", "memo"],
    required: ["postedAt", "media", "title"],
    defaults: { postStatus: "下書き" }
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

function blankRecord() {
  const today = new Date().toISOString().slice(0, 10);
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
    memo: ""
  };
}

function normalizeRecord(record) {
  return { ...blankRecord(), ...record, sales: Number(record.sales) || 0, cost: Number(record.cost) || 0 };
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
  return dateString.slice(0, 7);
}

function displayDate(dateString) {
  return dateFormat.format(new Date(`${dateString}T00:00:00`));
}

function filteredRecords() {
  const dateKey = views[currentView].dateKey;
  return records.filter((record) => currentMonth === "all" || monthOf(record[dateKey]) === currentMonth);
}

function setupMonthFilter() {
  const months = [...new Set(records.flatMap((record) => [record.postedAt, record.inquiryAt, record.workDate].map(monthOf)))].sort().reverse();
  const selected = months.includes(currentMonth) ? currentMonth : "all";
  monthFilter.innerHTML = ["<option value=\"all\">すべての月</option>", ...months.map((month) => `<option value="${month}">${month.replace("-", "年")}月</option>`)].join("");
  monthFilter.value = selected;
  currentMonth = selected;
}

function updateSummary() {
  const summaryMonth = currentMonth === "all" ? monthOf(new Date().toISOString()) : currentMonth;
  const monthlyRecords = records.filter((record) => monthOf(record.postedAt) === summaryMonth);
  const sales = monthlyRecords.reduce((sum, record) => sum + record.sales, 0);
  const profitTotal = monthlyRecords.reduce((sum, record) => sum + profit(record), 0);
  const openInquiries = records.filter((record) => record.responseStatus !== "完了" && record.responseStatus !== "返信済み").length;
  const today = new Date().toISOString().slice(0, 10);
  const works = records.filter((record) => record.workDate >= today).length;

  document.querySelector("#monthlySales").textContent = yen.format(sales);
  document.querySelector("#monthlyProfit").textContent = yen.format(profitTotal);
  document.querySelector("#monthlyLabel").textContent = `${summaryMonth.replace("-", "年")}月の投稿ベース`;
  document.querySelector("#openInquiries").textContent = `${openInquiries}件`;
  document.querySelector("#upcomingWorks").textContent = `${works}件`;
}

function inputType(field) {
  if (["postedAt", "inquiryAt", "workDate"].includes(field)) return "date";
  if (["sales", "cost"].includes(field)) return "number";
  return "text";
}

function renderForm(record = null) {
  const config = formConfigs[currentView];
  const values = { ...blankRecord(), ...config.defaults, ...record };
  formEyebrow.textContent = editingId ? "保存済みデータを編集中" : config.eyebrow;
  formTitle.textContent = editingId ? "内容を編集" : config.title;
  saveEntry.textContent = editingId ? "更新する" : "保存する";
  cancelEdit.hidden = !editingId;
  formFields.innerHTML = "";

  config.fields.forEach((field) => {
    const label = document.createElement("label");
    const input = field === "body" || field === "memo" ? document.createElement("textarea") : document.createElement("input");
    label.textContent = fieldLabels[field];
    input.name = field;
    input.value = values[field] ?? "";
    input.required = config.required.includes(field);
    if (input.tagName === "TEXTAREA") input.rows = 3;
    if (inputType(field) === "number") {
      input.type = "number";
      input.min = "0";
      input.step = "1";
    } else if (input.tagName !== "TEXTAREA") {
      input.type = inputType(field);
    }
    label.appendChild(input);
    formFields.appendChild(label);
  });
}

function collectFormRecord() {
  const formData = new FormData(entryForm);
  const existing = editingId ? records.find((record) => record.id === editingId) : null;
  const next = { ...blankRecord(), ...formConfigs[currentView].defaults, ...existing };

  for (const [key, value] of formData.entries()) {
    next[key] = ["sales", "cost"].includes(key) ? Number(value) || 0 : value.trim();
  }

  next.id = editingId || createId();
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
      ["投稿ステータス", record.postStatus],
      ["Canva画像リンク", record.canvaUrl],
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
  const header = ["投稿日", "媒体", "投稿タイトル", "投稿本文", "Canva画像リンク", "投稿ステータス", "問い合わせ日", "問い合わせ内容", "作業予定日", "作業内容", "売上金額", "原価", "利益", "対応状況", "改善メモ"];
  const rows = records.map((record) => [record.postedAt, record.media, record.title, record.body, record.canvaUrl, record.postStatus, record.inquiryAt, record.inquiry, record.workDate, record.workDetail, record.sales, record.cost, profit(record), record.responseStatus, record.memo]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "sns-sidejob-dashboard.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

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
