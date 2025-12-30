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
    const batteryVisual = document.querySelector('.battery-vixual');

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


//リンクの追加
links.forEach(link => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.className = "icon-tile";

    const img = document.createElement("img");
    img.src = link.icon;

    const span = document.createElement("span");
    span.textContent =link.title;

    a.appendChild(img);
    a.appendChild(span);

    iconGrid.appendChild(a);
});

//グリッド表示   
const iconGrid =  document.getElementById("iconGrid");
console.log(iconGrid);

document.getElementById("addlinkBtn").addEventListener("click", () => {
    const name = document.getElementById("linkName").value;
    const url = document.getElementById("linkUrl").value;
    const icon = document.getElementById('linkIcon').value;

    if (!name || !url || !icon) return;

    const newlink = {title: name, url, icon };
    links.push(newlink);
    renderLinks();
});

const links = [
    {
        title: "Google",
        url: "https://www.google.com/?hl=ja&zx=1752377659774&no_sw_cr=1",
        icon: "logo/google.png"
    },
    {
        title: "Gmail",
        url: "https://mail.google.com/mail/u/0/?pli=1#inbox",
        icon: "logo/gmail.png"
    },
    {
        title: "Googleドライブ",
        url: "https://drive.google.com/drive/my-drive",
        icon: "logo/googledrive.png"
    },
    {
        title: "Googleカレンダー",
        url: "https://calendar.google.com/calendar/u/0/r?pli=1",
        icon: "logo/googlecalender.png"
    },
    {
        title: "公式LINE",
        url: "https://account.line.biz/login?redirectUri=https%3A%2F%2Faccount.line.biz%2Foauth2%2Fcallback%3Fclient_id%3D10%26code_challenge%3DEqJXm8FxXlKHkWK6K3ZaF-0xtnIhYjiA35827YsLHWE%26code_challenge_method%3DS256%26redirect_uri%3Dhttps%253A%252F%252Fmanager.line.biz%252Fapi%252Foauth2%252FbizId%252Fcallback%26response_type%3Dcode%26state%3DOzS5V352u28sHvo7y7aK88Y4ZOxaesiS",
        icon: "logo/line.png"
    },
    {
        title: "リベシティ",
        url: "https://libecity.com/mypage/home",
        icon: "logo/libecity.png"
    },
    {
        title: "個人家計簿",
        url: "https://docs.google.com/spreadsheets/d/13ccG975lF9uq5-NR9MZS8Y__yRNjEIN12lWUSUoFuLo/edit?gid=1350957424#gid=1350957424",
        icon: "logo/spreadsheet.png"
    },
    {
        title: "家族家計簿",
        url: "https://docs.google.com/spreadsheets/d/1Asx0YcLz4Th-K8H8ecf5vszRDMAwr-njH9Yd45mYNbY/edit?gid=1170395166#gid=1170395166",
        icon: "logo/spreadsheet.png"
    },
    {
        title: "SBIネット銀行",
        url: "https://www.netbk.co.jp/contents/",
        icon: "logo/sbi.png"
    },
    {
        title: "SBi証券",
        url: "https://site1.sbisec.co.jp/ETGate/?_ControlID=WPLEThmR001Control&_PageID=DefaultPID&_DataStoreID=DSWPLEThmR001Control&_ActionID=DefaultAID&getFlg=on",
        icon: "logo/sbi.png"
    },{
        title: "確定拠出年金",
        url: "https://www.benefit401k.com/customer/RKDCMember/Common/JP_D_BFKErrorSessionValid.aspx",
        icon: "logo/ideco.png"
    },
    {
        title: "マネーフォワード",
        url: "https://id.moneyforward.com/account_selector?client_id=WSGuP6Chp0YwMK9_vs_K5psyVFAhFxvutdxTAYVr570&nonce=34a31061502103764d11f17e082aff3f&redirect_uri=https%3A%2F%2Fpayroll.moneyforward.com%3A443%2Fusers%2Fauth%2Fmfid%2Fcallback&response_type=code&scope=openid+email&state=9bbc3e14b7bfb6bb26e050dae282d496",
        icon: "logo/moneyfoward.png"
    },
    {
        title: "三井住友カード",
        url: "https://www.smbc-card.com/mem/index.jsp",
        icon: "logo/smbc-card.png"
    },
    {
        title: "JCB",
        url: "https://my.jcb.co.jp/Login",
        icon: "logo/jcb.png"
    },
    {
        title: "GitHub",
        url: "https://github.com/",
        icon: "logo/github.png"
    },
    {
        title: "ChatGPT",
        url: "https://chatgpt.com/",
        icon: "logo/chatgpt.png"
    },
    {
        title: "claude",
        url: "https://claude.ai/",
        icon: "logo/claude.png"
    },
    {
        title: "Canva",
        url: "https://www.canva.com/",
        icon: "logo/canva.png"
    },
    {
        title: "perplexity",
        url: "https://www.perplexity.ai/",
        icon: "logo/perplexity.png"
    },
    {
        title: "YouTube",
        url: "https://www.youtube.com/",
        icon: "logo/youtube.png"
    },
    {
        title: "Amazon",
        url: "https://www.amazon.co.jp/?tag=hydraamazonav-22&ref=nav_signin&adgrpid=56100363354&hvpone=&hvptwo=&hvadid=611275290702&hvpos=&hvnetw=g&hvrand=2254283399157979595&hvqmt=e&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9166942&hvtargid=kwd-10573980&hydadcr=27922_14587441",
        icon: "logo/amazon.png"
    },
    {
        title: "メルカリ",
        url: "https://jp.mercari.com/",
        icon: "logo/mercari.png"
    },
    {
        title: "関西電力",
        url: "https://kepco.jp/miruden/servicetop/login?DISP_ID=%2fmiruden%2fmypage",
        icon: "logo/kanden.png"
    }
];





