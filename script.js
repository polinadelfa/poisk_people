const inputUser = document.getElementById("search-input");
const btnSearch = document.getElementById("search-btn");
const result = document.getElementById("res");
const historyList = document.getElementById("history-list");

btnSearch.addEventListener("click", (event) => {
    event.preventDefault();
    const user = inputUser.value.trim();
    if (user) {
        getDataUser(user)
    }
    else {
        result.textContent = "Введите имя пользователя!"
    }
})

async function getDataUser(user) {
    try {
        const response = await fetch(`https://api.github.com/users/${user}`);
        console.log(response);
        const dataUser = await response.json();
        console.log(dataUser);
        userOutput(dataUser);
        saveData(dataUser);
    }
    catch (err) {
        displayError(err);
    }
}

// Вывод пользователя
function userOutput(userObj) {
    result.innerHTML = "";

    if (userObj.login === undefined) {
        result.innerHTML = "<span class='error'>Пользователь не найден!</span>";
        return;
    }

    // создание контейнера для отображения данных
    const profileContainer = document.createElement("div");
    profileContainer.className = "profile";
    result.append(profileContainer);

    // работа с аватаркой 
    const avatarImg = document.createElement("img");
    avatarImg.src = userObj.avatar_url;
    avatarImg.alt = `Фото ${userObj.login} не найдено`;
    profileContainer.append(avatarImg);

    //имя
    const nameUser = document.createElement("h2");
    nameUser.textContent = userObj.name ?? userObj.login;
    profileContainer.append(nameUser);

    //описание
    const bio = document.createElement("div");
    bio.textContent = `Описание: ${userObj.bio ?? 'Нет данных'}`;
    profileContainer.append(bio);

    // ссылка 
    const link = document.createElement("a");
    link.href = userObj.html_url;
    link.textContent = "Ссылка на аккаунт пользователя: " + userObj.html_url;
    profileContainer.append(link);
    link.target = '_blank';
}

//Вывод ошибки
function displayError(error) {
    result.textContent = error;
    result.className = "error";
}

function saveData(userObj) {
    if (userObj.login == undefined) return;
    let history = JSON.parse(localStorage.getItem("history")) ?? []; // []
    
    history = history.filter(user => user.login !== userObj.login);
    
     history.unshift(userObj);
    console.log(history);

    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    localStorage.setItem("history", JSON.stringify(history));
}


function loadData() {
    let history = JSON.parse(localStorage.getItem("history")) ?? [];

    if (history.length === 0) {
        historyList.textContent = 'Истории поиска пока нет';
        return;
    }

    history.forEach(user => {
        const historyItem = document.createElement('div');
        historyItem.innerHTML =  `
                <img src="${user.avatar_url}" alt="" width=100>
                <span>${user.login}</span>
        `
        historyList.append(historyItem)
        historyItem.addEventListener("click", () => {
            getDataUser(user.login);
        })
    })

  
}

window.addEventListener("load", loadData)

