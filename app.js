const STORAGE_KEY = "snsSideJobRecordsV1";

const sampleRecords = [
  {
    id: "sample-1",
    postedAt: "2026-06-03",
    media: "Instagram",
    title: "初夏のキャンペーン告知",
    body: "季節限定メニューと予約特典を紹介。ストーリーズにも再掲予定。",
    canvaUrl: "Canvaサンプルリンク：campaign（未連携）",
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
    canvaUrl: "Canvaサンプルリンク：portfolio（未連携）",
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
    canvaUrl: "Canvaサンプルリンク：review（未連携）",
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
    canvaUrl: "Canvaサンプルリンク：faq（未連携）",
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

const views = {
  posts: { eyebrow: "投稿管理", title: "投稿一覧", dateKey: "postedAt" },
  inquiries: { eyebrow: "問い合わせ管理", title: "問い合わせ一覧", dateKey: "inquiryAt" },
  works: { eyebrow: "作業予定管理", title: "作業予定一覧", dateKey: "workDate" },
  sales: { eyebrow: "売上管理", title: "売上一覧", dateKey: "postedAt" }
};

let records = loadRecords();
let currentView = "posts";
let currentMonth = "all";

const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", weekday: "short" });

const monthFilter = document.querySelector("#monthFilter");
const list = document.querySelector("#list");
const template = document.querySelector("#itemTemplate");
const form = document.querySelector("#recordForm");
const saveStatus = document.querySelector("#saveStatus");
const profitPreview = document.querySelector("#profitPreview");

function cloneSamples() {
  return sampleRecords.map((record) => ({ ...record }));
}

function loadRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : cloneSamples();
  } catch {
    return cloneSamples();
  }
}

function saveRecords(message = "ブラウザ内に保存済み") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  saveStatus.textContent = `自動保存：${message}`;
}

function profit(record) {
  return Number(record.sales || 0) - Number(record.cost || 0);
}

function monthOf(dateString) {
  return dateString ? dateString.slice(0, 7) : "未設定";
}

function displayDate(dateString) {
  if (!dateString) return "未設定";
  return dateFormat.format(new Date(`${dateString}T00:00:00`));
}

function filteredRecords() {
  const dateKey = views[currentView].dateKey;
  return records.filter((record) => currentMonth === "all" || monthOf(record[dateKey]) === currentMonth);
}

function setupMonthFilter() {
  const previous = currentMonth;
  const months = [...new Set(records.flatMap((record) => [record.postedAt, record.inquiryAt, record.workDate].filter(Boolean).map(monthOf)))].sort().reverse();
  monthFilter.innerHTML = ["<option value=\"all\">すべての月</option>", ...months.map((month) => `<option value="${month}">${month.replace("-", "年")}月</option>`)].join("");
  currentMonth = previous !== "all" && months.includes(previous) ? previous : "all";
  monthFilter.value = currentMonth;
}

function updateSummary() {
  const summaryMonth = currentMonth === "all" ? monthOf(new Date().toISOString()) : currentMonth;
  const monthlyRecords = records.filter((record) => monthOf(record.postedAt) === summaryMonth);
  const sales = monthlyRecords.reduce((sum, record) => sum + Number(record.sales || 0), 0);
  const profitTotal = monthlyRecords.reduce((sum, record) => sum + profit(record), 0);
  const openInquiries = records.filter((record) => record.inquiry && record.responseStatus !== "完了" && record.responseStatus !== "返信済み").length;
  const today = new Date().toISOString().slice(0, 10);
  const works = records.filter((record) => record.workDate && record.workDate >= today).length;

  document.querySelector("#monthlySales").textContent = yen.format(sales);
  document.querySelector("#monthlyProfit").textContent = yen.format(profitTotal);
  document.querySelector("#monthlyLabel").textContent = `${summaryMonth.replace("-", "年")}月の投稿ベース`;
  document.querySelector("#openInquiries").textContent = `${openInquiries}件`;
  document.querySelector("#upcomingWorks").textContent = `${works}件`;
}

function metaFor(record) {
  if (currentView === "posts") {
    return [
      ["媒体", record.media],
      ["投稿ステータス", record.postStatus],
      ["Canva画像リンク", record.canvaUrl || "未設定"],
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
    ["売上金額", yen.format(record.sales || 0)],
    ["原価", yen.format(record.cost || 0)],
    ["利益", yen.format(profit(record))],
    ["媒体", record.media]
  ];
}

function textFor(record) {
  if (currentView === "inquiries") return { title: record.inquiry || "問い合わせ未入力", body: record.body, date: record.inquiryAt, pill: record.responseStatus };
  if (currentView === "works") return { title: record.workDetail || "作業内容未入力", body: `関連投稿：${record.title}`, date: record.workDate, pill: record.media };
  if (currentView === "sales") return { title: record.title, body: `利益 ${yen.format(profit(record))} / 原価 ${yen.format(record.cost || 0)}`, date: record.postedAt, pill: record.media };
  return { title: record.title, body: record.body, date: record.postedAt, pill: record.postStatus };
}

function renderList() {
  const config = views[currentView];
  const data = filteredRecords().sort((a, b) => (b[config.dateKey] || "").localeCompare(a[config.dateKey] || ""));
  document.querySelector("#viewEyebrow").textContent = config.eyebrow;
  document.querySelector("#viewTitle").textContent = config.title;
  document.querySelector("#viewCount").textContent = `${data.length}件`;
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = '<p class="empty-state">この月のデータはありません。</p>';
    return;
  }

  data.forEach((record) => {
    const viewText = textFor(record);
    const node = template.content.cloneNode(true);
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
      detail.textContent = value;
      wrapper.append(term, detail);
      metaGrid.appendChild(wrapper);
    });

    list.appendChild(node);
  });
}

function refresh() {
  setupMonthFilter();
  updateSummary();
  renderList();
}

function exportCsv() {
  const header = ["投稿日", "媒体", "投稿タイトル", "投稿本文", "Canva画像リンク", "投稿ステータス", "問い合わせ日", "問い合わせ内容", "作業予定日", "作業内容", "売上金額", "原価", "利益", "対応状況", "改善メモ"];
  const rows = records.map((record) => [record.postedAt, record.media, record.title, record.body, record.canvaUrl, record.postStatus, record.inquiryAt, record.inquiry, record.workDate, record.workDetail, record.sales, record.cost, profit(record), record.responseStatus, record.memo]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "sns-sidejob-sample.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function updateProfitPreview() {
  const sales = Number(form.elements.sales.value || 0);
  const cost = Number(form.elements.cost.value || 0);
  profitPreview.textContent = yen.format(sales - cost);
}

function formValue(name) {
  return form.elements[name].value.trim();
}

function addRecord(event) {
  event.preventDefault();
  const postedAt = formValue("postedAt");
  const record = {
    id: `local-${Date.now()}`,
    postedAt,
    media: formValue("media"),
    title: formValue("title"),
    body: formValue("body"),
    canvaUrl: formValue("canvaUrl") || "未設定",
    postStatus: formValue("postStatus"),
    inquiryAt: formValue("inquiryAt") || postedAt,
    inquiry: formValue("inquiry"),
    workDate: formValue("workDate") || postedAt,
    workDetail: formValue("workDetail"),
    sales: Number(form.elements.sales.value || 0),
    cost: Number(form.elements.cost.value || 0),
    responseStatus: formValue("responseStatus"),
    memo: formValue("memo")
  };

  records = [record, ...records];
  saveRecords("追加しました");
  form.reset();
  form.elements.sales.value = 0;
  form.elements.cost.value = 0;
  updateProfitPreview();
  refresh();
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    currentView = button.dataset.view;
    updateSummary();
    renderList();
  });
});

monthFilter.addEventListener("change", (event) => {
  currentMonth = event.target.value;
  updateSummary();
  renderList();
});

form.addEventListener("submit", addRecord);
form.elements.sales.addEventListener("input", updateProfitPreview);
form.elements.cost.addEventListener("input", updateProfitPreview);

document.querySelector("#exportCsv").addEventListener("click", exportCsv);
document.querySelector("#resetSamples").addEventListener("click", () => {
  records = cloneSamples();
  saveRecords("サンプルに戻しました");
  refresh();
});

saveStatus.textContent = localStorage.getItem(STORAGE_KEY) ? "自動保存：保存データを読み込み済み" : "自動保存：サンプルデータを表示中";
updateProfitPreview();
refresh();
