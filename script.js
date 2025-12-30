function performGoogleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        // Google検索のURLを生成
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        // 新規タブで検索結果を開く
        window.open(googleSearchUrl, '_blank');
        
        // 検索後、入力フィールドをクリア（任意）
        searchInput.value = '';
    }
}

// Enterキーで検索実行
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performGoogleSearch();
    }
});

// 検索ボタンクリックで検索実行
document.getElementById('searchButton').addEventListener('click', function() {
    performGoogleSearch();
});

// 検索入力フィールドにフォーカス時のアニメーション
document.getElementById('searchInput').addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
});

document.getElementById('searchInput').addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
});

// 日時更新機能
function updateDateTime() {
    const now = new Date();
    
    // 日付を取得
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    
    // 曜日を取得
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = days[now.getDay()];
    
    // 時間を取得
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 表示を更新
    document.getElementById('dateDay').textContent = `${year}年${month}月${date}日（${dayOfWeek}）`;
    document.getElementById('time').innerHTML = `${hours}:${minutes}<span class="seconds">:${seconds}</span>`;
}

// 初回実行
updateDateTime();

// 1秒ごとに更新
setInterval(updateDateTime, 1000);




let battery = null;

function updateBatteryDisplay() {
    if (!battery) return;

    const level = Math.round(battery.level * 100);
    const batteryFill = document.getElementById('battery-fill');
    const batteryLevel = document.getElementById('battery-level');
    const batteryVisual = document.querySelector('.battery-sixual');

    // 表示更新
    batteryLevel.textContent = `${level}%`;
    batteryFill.style.width = `${level}%`;

    // 色変更
    batteryFill.className = 'battery-fill';
    if (level <= 20) {
        batteryFill.classList.add('critical');
    } else if (level <= 50) {
        batteryFill.classList.add('low');
    }

    // 充電中判定
    batteryVisual.classList.toggle('charging',battery.charging);
}

function updateBatteryInfo() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(bat) {
        battery = bat;
        updateBatteryDisplay();

        // イベントリスナーを追加（重複を避けるため一度削除）
            battery.removeEventListener('chargingchange', updateBatteryDisplay);
            battery.removeEventListener('levelchange', updateBatteryDisplay);
            battery.addEventListener('chargingchange', updateBatteryDisplay);
            battery.addEventListener('levelchange', updateBatteryDisplay);
                    document.getElementById('error-message').style.display = 'none';
                });
            } else {
                
                }
        }
        // ページ読み込み時に実行
        window.addEventListener('load', updateBatteryInfo);

        // 定期的に更新（30秒ごと）
        setInterval(updateBatteryInfo, 30000);


const iconGrid =  document.getElementById("iconGrid");
console.log(iconGrid);

document.getElementById("addlinkBtn").addEventListener("click", () => {
    const name = document.getElementById("linkName").value;
    const url = document.getElementById("linkUrl").value;

    console.log(name, url);
});

const links = [
    {
        title: "Google",
        url: "https://www.google.com/?hl=ja&zx=1752377659774&no_sw_cr=1",
        icon: "logo/Google.png"
    },
    {
        title: "Gmail",
        url: "https://mail.google.com/mail/u/0/?pli=1#inbox",
        icon: "logo/gmail.png"
    }

];

links.forEach(link => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";

    const img = document.createElement("img");
    img.src = link.icon;

    const span = document.createElement("span");
    span.textContent =link.title;

    a.appendChild(img);
    a.appendChild(span);

    iconGrid.appendChild(a);
});

