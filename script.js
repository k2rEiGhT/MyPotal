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
    { title: "Google", url: "https://www.google.com/", icon: "logo/google.png" },
    { title: "Gmail", url: "https://mail.google.com/", icon: "logo/gmail.png" },
    { title: "GitHub", url: "https://github.com/", icon: "logo/github.png" },
    { title: "Amazon", url: "https://www.amazon.co.jp/", icon: "logo/amazon.png" }
];

let links = JSON.parse(localStorage.getItem('myPortalLinks')) || defaultLinks;

// ★1つに統合した renderLinks 関数
let draggedItemIndex = null;

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

        // ドラッグ＆ドロップ用イベント
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

// 編集モーダルを開く
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
        document.getElementById("linkName").value = "";
        document.getElementById("linkUrl").value = "";
        document.getElementById("linkIcon").value = "";
    }
    modal.style.display = "block";
};

// 削除機能
window.deleteLink = (index) => {
    if (confirm(`「${links[index].title}」を削除しますか？`)) {
        links.splice(index, 1);
        renderLinks();
    }
};

// 保存ボタン
document.getElementById("saveLinkBtn").onclick = () => {
    const name = document.getElementById("linkName").value.trim();
    const url = document.getElementById("linkUrl").value.trim();
    const icon = document.getElementById("linkIcon").value.trim();
    const idx = parseInt(document.getElementById("editIndex").value);

    if (!name || !url) return alert("名前とURLを入力してください");

    const data = { title: name, url: url, icon: icon || 'logo/default.png' };
    
    if (idx === -1) links.push(data);
    else links[idx] = data;

    renderLinks();
    document.getElementById("linkModal").style.display = "none";
};

// キャンセルボタン
document.getElementById("cancelBtn").onclick = () => {
    document.getElementById("linkModal").style.display = "none";
};

// ＋ボタンでモーダルを開く
document.getElementById("openModalBtn").onclick = () => window.openEditModal(-1);

// 初回表示
renderLinks();