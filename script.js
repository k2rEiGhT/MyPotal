// --- 1. 検索機能 ---
function performGoogleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        searchInput.value = '';
    }
}
document.getElementById('searchInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') performGoogleSearch(); });
document.getElementById('searchButton').addEventListener('click', performGoogleSearch);

// --- 2. 日時更新機能 ---
function updateDateTime() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('dateDay').textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${days[now.getDay()]}）`;
    document.getElementById('time').innerHTML = `${hours}:${minutes}<span class="seconds">:${seconds}</span>`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// --- 3. バッテリー情報 ---
async function updateBatteryInfo() {
    if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        const updateDisp = () => {
            const level = Math.round(battery.level * 100);
            document.getElementById('battery-level').textContent = `${level}%`;
            const fill = document.getElementById('battery-fill');
            fill.style.width = `${level}%`;
            fill.className = 'battery-fill ' + (level <= 20 ? 'critical' : level <= 50 ? 'low' : '');
            document.querySelector('.battery-visual').classList.toggle('charging', battery.charging);
        };
        updateDisp();
        battery.addEventListener('chargingchange', updateDisp);
        battery.addEventListener('levelchange', updateDisp);
    }
}
window.addEventListener('load', updateBatteryInfo);

// --- 4. ポータルリンク管理 ---
const defaultLinks = [
    { title:"Google", url:"https://www.google.com/","icon":"logo/google.png"},
    { title:"Gmail", url:"https://mail.google.com/","icon":"logo/gmail.png"},
    { title:"GoogleMap", url:"https://www.google.co.jp/maps/","icon":"logo/googlemap.png"},
    { title:"Googleドライブ", url:"https://drive.google.com/drive/u/0/my-drive","icon":"logo/googledrive.png"},
    { title:"Googleカレンダー", url:"https://calendar.google.com/","icon":"logo/googlecalender.png"},
    { title:"公式LINE", url:"https://manager.line.biz/","icon":"logo/line.png"},
    { title:"リベシティ", url:"https://libecity.com/","icon":"logo/default.png"},
    { title:"個人家計簿", url:"https://docs.google.com/spreadsheets/d/1OmwT1PHnIzGPtQZIQaIDKkEdEl3RFndBMcTlAz9Xl9Q/","icon":"logo/spreadsheet.png"},
    { title:"家族家計簿", url:"https://docs.google.com/spreadsheets/d/1pf-fy-SsGUdnfb1e5NFxEDfTxnMb7kLMYYttAjfQrn4/","icon":"logo/spreadsheet.png"},
    { title:"タスク管理", url:"https://docs.google.com/spreadsheets/d/148h01Yy04lEpBxf5m5G_r8EBkMKnpclip1jsp9zeIu4/","icon":"logo/spreadsheet.png"},
    { title:"SBIネット銀行", url:"https://www.netbk.co.jp/","icon":"logo/d-neo-bank.png"},
    { title:"SBi証券", url:"https://site1.sbisec.co.jp/","icon":"logo/sbi.png"},
    { title:"確定拠出年金", url:"https://www.benefit401k.com/","icon":"logo/ideco.png"},
    { title:"マネーフォワード", url:"https://payroll.moneyforward.com/","icon":"logo/moneyfoward.png"},
    { title:"三井住友カード", url:"https://www.smbc-card.com/","icon":"logo/smbc-card.png"},
    { title:"JCB", url:"https://my.jcb.co.jp/","icon":"logo/jcb.png"},
    { title:"chatGPT", url:"https://chatgpt.com/","icon":"logo/default.png"},
    { title:"gemini", url:"https://gemini.google.com/app","icon":"logo/default.png"},
    { title:"Canva", url:"https://www.canva.com/ja_jp/","icon":"logo/default.png"},
    { title:"claude", url:"https://claude.ai/","icon":"logo/default.png"},
    { title:"perplexity", url:"https://www.perplexity.ai/","icon":"logo/default.png"},
    { title:"YouTube", url:"https://www.youtube.com/","icon":"logo/default.png"},
    { title:"Amazon", url:"https://www.amazon.co.jp/","icon":"logo/default.png"},
    { title:"メルカリ", url:"https://jp.mercari.com/","icon":"logo/default.png"},
    { title:"関西電力", url:"https://kepco.jp/miruden/","icon":"logo/default.png"}
];

// iPhoneと同期させるため、常にこのリストを読み込む
//let links = defaultLinks;

// 画面での変更を保存したい場合はこちらに戻す
let links = JSON.parse(localStorage.getItem('myPortalLinks')) || defaultLinks;
let draggedItemIndex = null;

// 画面描画とドラッグ＆ドロップの設定
function renderLinks() {
    const iconGrid = document.getElementById("iconGrid");
    if (!iconGrid) return;
    iconGrid.innerHTML = "";
    localStorage.setItem('myPortalLinks', JSON.stringify(links));

    links.forEach((link, index) => {
        const a = document.createElement("a");
        a.href = link.url;
        a.target = "_blank";
        a.className = "icon-tile";
        a.draggable = true; 

        a.innerHTML = `
            <div class="tile-actions">
                <button class="btn-edit" onclick="event.preventDefault(); window.openEditModal(${index})">編集</button>
                <button class="btn-delete" onclick="event.preventDefault(); window.deleteLink(${index})">削除</button>
            </div>
            <img src="${link.icon}" onerror="this.src='https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64'">
            <span>${link.title}</span>
        `;

        // ドラッグイベント
        a.addEventListener('dragstart', () => { draggedItemIndex = index; a.classList.add('dragging'); });
        a.addEventListener('dragend', () => { a.classList.remove('dragging'); draggedItemIndex = null; });
        a.addEventListener('dragover', (e) => { e.preventDefault(); });
        a.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItemIndex !== null && draggedItemIndex !== index) {
                const draggedItem = links.splice(draggedItemIndex, 1)[0];
                links.splice(index, 0, draggedItem);
                renderLinks(); 
            }
        });
        iconGrid.appendChild(a);
    });
}

// 編集・追加モーダルを開く
window.openEditModal = (index) => {
    const isEdit = index !== -1;
    const modal = document.getElementById("linkModal");
    document.getElementById("modalTitle").innerText = isEdit ? "リンクを編集" : "新しいリンクを追加";
    document.getElementById("editIndex").value = index;

    if (isEdit) {
        document.getElementById("linkName").value = links[index].title;
        document.getElementById("linkUrl").value = links[index].url;
        document.getElementById("linkIcon").value = links[index].icon;
    } else {
        // 新規追加時は入力を空にする
        document.getElementById("linkName").value = "";
        document.getElementById("linkUrl").value = "";
        document.getElementById("linkIcon").value = "";
    }
    modal.style.display = "block";
};

// 削除
window.deleteLink = (index) => {
    if (confirm(`「${links[index].title}」を削除しますか？`)) {
        links.splice(index, 1);
        renderLinks();
    }
};

// 保存ボタン（ここが重要！）
document.getElementById("saveLinkBtn").onclick = () => {
    const name = document.getElementById("linkName").value.trim();
    const url = document.getElementById("linkUrl").value.trim();
    const icon = document.getElementById("linkIcon").value.trim();
    const idx = parseInt(document.getElementById("editIndex").value);

    if (!name || !url) return alert("名前とURLを入力してください");

    const data = { title: name, url: url, icon: icon || 'logo/default.png' };
    
    // 新規追加 (indexが-1) か 編集 かで処理を分岐
    if (idx === -1) {
        links.push(data);
    } else {
        links[idx] = data;
    }

    renderLinks(); // 画面更新
    document.getElementById("linkModal").style.display = "none"; // 画面を閉じる
};

// キャンセル・追加ボタン
document.getElementById("cancelBtn").onclick = () => {
    document.getElementById("linkModal").style.display = "none";
};
document.getElementById("openModalBtn").onclick = () => window.openEditModal(-1);

// 初回実行
renderLinks();