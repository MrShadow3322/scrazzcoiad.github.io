document.addEventListener('DOMContentLoaded', () => {
    // Инициализация баланса
    initializeBalance();

    // Обработка нажатия на кнопку "Получить награду"
    document.getElementById('claimTask')?.addEventListener('click', async () => {
        try {
            const userId = 'USER_ID'; // Замените на реальный идентификатор пользователя
            const isSubscribed = await checkSubscription(userId);

            if (isSubscribed) {
                if (localStorage.getItem('taskCompleted') !== 'true') {
                    let userBalance = parseInt(localStorage.getItem('ratcoinBalance'), 10);
                    userBalance += 1000;
                    localStorage.setItem('ratcoinBalance', userBalance);
                    document.getElementById('balance').textContent = userBalance + ' RatCoin';
                    localStorage.setItem('taskCompleted', 'true');
                    alert('Вы получили 1000 RatCoin за подписку!');
                } else {
                    alert('Вы уже получили вознаграждение за подписку.');
                }
            } else {
                alert('Пожалуйста, подпишитесь на канал.');
            }
        } catch (error) {
            console.error('Ошибка при выполнении задания:', error);
        }
    });

    // Открытие окна привязки кошелька
    document.getElementById('addWallet')?.addEventListener('click', () => {
        document.getElementById('walletModal').style.display = 'block';
    });

    // Выбор кошелька
    document.querySelectorAll('.wallet-option').forEach(option => {
        option.addEventListener('click', async () => {
            try {
                const wallet = option.getAttribute('data-wallet');
                const walletNumber = '123456789'; // Замените на реальный номер кошелька

                // Отправка номера кошелька админу
                await fetch(`https://api.telegram.org/bot7534613410:AAHj1AFkC_L9oOA_05OpqQ_ejiZEUKjnSL4/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: '@Somik3o',
                        text: `Кошелёк привязан: ${walletNumber}`
                    })
                });

                // Обновление интерфейса
                document.getElementById('walletModal').style.display = 'none';
                alert('Кошелёк привязан успешно.');
            } catch (error) {
                console.error('Ошибка при привязке кошелька:', error);
            }
        });
    });
});

// Функция генерации случайного баланса
function getRandomBalance() {
    return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
}

// Инициализация баланса
function initializeBalance() {
    let userBalance = localStorage.getItem('ratcoinBalance');
    if (!userBalance) {
        userBalance = getRandomBalance();
        localStorage.setItem('ratcoinBalance', userBalance);
    }
    document.getElementById('balance')?.textContent = userBalance + ' RatCoin';
}

// Проверка подписки пользователя
async function checkSubscription(userId) {
    try {
        const response = await fetch(`https://api.telegram.org/bot7534613410:AAHj1AFkC_L9oOA_05OpqQ_ejiZEUKjnSL4/getChatMember?chat_id=@RatcCoin&user_id=${userId}`);
        const data = await response.json();
        return data.result.status === 'member';
    } catch (error) {
        console.error('Ошибка при проверке подписки:', error);
        return false;
    }
}
