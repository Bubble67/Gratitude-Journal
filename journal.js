let currentDay = 1;
const totalDays = 7;

const dayPrompts = {
    1: "感恩今天幫你最多的物品！",
    2: "感恩今天遇到的一位陌生人！",
    3: "感恩今天聽到/遇到/發生的一件事！",
    4: "感恩今天在工作/學習中的收穫！",
    5: "感恩一位朋友！",
    6: "感恩一位家人！",
    7: "感恩自己！"
};

window.onload = function() {
    renderPuzzle();
    selectDay(1);
};

function selectDay(day) {
    currentDay = day;
    document.getElementById('currentDayTitle').innerText = `正在完成：本週第 ${day} 篇感恩日記`;
    
    const promptText = dayPrompts[day] || "回想今日值得感恩的人事物！";
    document.getElementById('promptDisplay').innerText = `第${day}天：${promptText}`;

    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    document.getElementById('journalInput').value = savedData[day] || "";
}

function saveEntry() {
    const text = document.getElementById('journalInput').value.trim();
    if (!text) {
        alert("請寫下一些感恩的話吧！");
        return;
    }

    let savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    savedData[currentDay] = text;
    localStorage.setItem('gratitudeJournal', JSON.stringify(savedData));

    alert(`第 ${currentDay} 天的拼圖已解鎖！`);
    renderPuzzle();
}

function renderPuzzle() {
    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    let completedCount = 0;

    for (let i = 1; i <= totalDays; i++) {
        const piece = document.getElementById(`piece-${i}`);
        if (savedData[i]) {
            piece.classList.add('unlocked');
            completedCount++;
        } else {
            piece.classList.remove('unlocked');
        }
    }

    // 當 7 天都完成時顯示名言
    if (completedCount === totalDays) {
        document.getElementById('quoteDisplay').style.display = "block";
    }
}