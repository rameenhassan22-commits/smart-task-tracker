const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector(".task-list");

const totalTasksElements = document.querySelector("#total-tasks");
const completedTasksElements = document.querySelector("#completed-tasks");
const pendingTasksElements = document.querySelector("#pending-tasks");

const filterButton = document.querySelectorAll(".task-filters button");

const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const newQuoteButton = document.querySelector("#new-quote-button");

const Quote_API_URL = "https://dummyjson.com/quotes/random";

let tasks = [];

let currentFilter = "all";

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter((task) => {
            return !task.completed;
        });
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter((task) => {
            return task.completed;
        });
    }

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No tasks Found.";
        taskList.appendChild(emptyMessage);
        updateStatistics();
        return;
    }

    filteredTasks.forEach((task) => {

        const taskElement = document.createElement("article");

        taskElement.className = "task-card";

        taskElement.dataset.id = task.id;

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        const taskContent = document.createElement("div");
        taskContent.className = "task-content";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.id = `task-${task.id}`;

        const label = document.createElement("label");
        label.textContent = task.title;
        label.htmlFor = `task-${task.id}`;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(label);

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.innerHTML = '<i class="fas fa-pen"></i> Edit';
        editButton.dataset.action = "edit";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteButton.dataset.action = "delete";

        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        taskElement.appendChild(taskContent);
        taskElement.appendChild(taskActions);

        taskList.appendChild(taskElement);

    });

    updateStatistics();

}

function updateStatistics() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((task) => {
        return task.completed;
    }).length;
    const pendingTasks = totalTasks - completedTasks;

    totalTasksElements.textContent = totalTasks;
    completedTasksElements.textContent = completedTasks;
    pendingTasksElements.textContent = pendingTasks;
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskTitle = taskInput.value.trim();

    if (taskTitle === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: taskTitle,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = "";

    renderTasks();
});

taskList.addEventListener("change", (event) => {

    if (event.target.type !== "checkbox") {
        return;
    }
    const taskCard = event.target.closest(".task-card");

    if (!taskCard) {
        return;
    }

    const taskId = Number(taskCard.dataset.id);

    const task = tasks.find((task) => {
        return task.id === taskId;
    });

    if (!task) {
        return;
    }

    task.completed = event.target.checked;
    renderTasks();
});

taskList.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const taskCard = button.closest(".task-card");

    if (!taskCard) {
        return;
    }
    const taskId = Number(taskCard.dataset.id);
    const task = tasks.find((task) => {
        return task.id === taskId;
    });
    if (!task) {
        return;
    }

    if (button.dataset.action === "delete") {
        const confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );
        if (!confirmDelete) {
            return;
        }
        tasks = tasks.filter((task) => {
            return task.id !== taskId;
        });
        renderTasks();
        return;
    }

    if (button.dataset.action === "edit") {
        const updatedTitle = prompt(
            "Edit your task:",
            task.title
        );

        if (updatedTitle === null) {
            return;
        }
        const newTitle = updatedTitle.trim();

        if (newTitle === "") {
            alert("Task title cannot be empty.");
            return;
        }
        task.title = newTitle;
        renderTasks();

    }
});

filterButton.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButton.forEach((filter) => {
            filter.classList.remove("active");
        });
        button.classList.add("active");
        renderTasks();
    });
});

filterButton[0].classList.add("active");
renderTasks();

async function fetchProductivityQuote() {
    quoteText.textContent = "Loading your productivity quote.....";
    quoteAuthor.textContent = "";

    try {
        const response = await fetch(Quote_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        quoteText.textContent = `"${data.quote}"`;
        quoteAuthor.textContent = `— ${data.author}`;
    } catch (error) {
        console.error("Error fetching productivity quote:", error);
        quoteText.textContent = "Unable to load a productivity quote right now.";
        quoteAuthor.textContent = "";

    }
}

fetchProductivityQuote();

newQuoteButton.addEventListener("click", () => {
    fetchProductivityQuote();
})

const weatherLocationEl = document.querySelector("#weather-location");
const weatherContentEl = document.querySelector("#weather-content");
const refreshWeatherButton = document.querySelector("#refresh-weather-button");

function getWeatherIcon(code) {
    if (code === 0) return { icon: "fa-sun", label: "Clear sky" };
    if (code === 1) return { icon: "fa-sun", label: "Mainly clear" };
    if (code === 2) return { icon: "fa-cloud-sun", label: "Partly cloudy" };
    if (code === 3) return { icon: "fa-cloud", label: "Overcast" };
    if (code === 45 || code === 48) return { icon: "fa-smog", label: "Fog" };
    if (code >= 51 && code <= 57) return { icon: "fa-cloud-rain", label: "Drizzle" };
    if (code >= 61 && code <= 67) return { icon: "fa-cloud-rain", label: "Rain" };
    if (code >= 71 && code <= 77) return { icon: "fa-snowflake", label: "Snow" };
    if (code >= 80 && code <= 82) return { icon: "fa-cloud-showers-heavy", label: "Rain showers" };
    if (code >= 85 && code <= 86) return { icon: "fa-snowflake", label: "Snow showers" };
    if (code >= 95 && code <= 99) return { icon: "fa-cloud-bolt", label: "Thunderstorm" };
    return { icon: "fa-cloud", label: "Unknown" };
}

function getUserCoordinates() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                // Common errors: permission denied, unavailable, timeout
                if (error.code === error.PERMISSION_DENIED) {
                    reject(new Error("Location permission denied. Please allow location access."));
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    reject(new Error("Location information is unavailable."));
                } else if (error.code === error.TIMEOUT) {
                    reject(new Error("Location request timed out."));
                } else {
                    reject(new Error("Unable to get your location."));
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 5 * 60 * 1000, // cache for 5 minutes
            }
        );
    });
}

async function getCityName(latitude, longitude) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${latitude}&longitude=${longitude}&count=1`;
        // Open-Meteo doesn't have true reverse geocoding in the free tier.
        // We'll use BigDataCloud's free reverse geocoding as a fallback.
        const reverseUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        const res = await fetch(reverseUrl);
        if (!res.ok) throw new Error("Reverse geocoding failed");
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || "Your location";
        const country = data.countryName || "";
        return country ? `${city}, ${country}` : city;
    } catch (err) {
        console.warn("Reverse geocoding failed:", err);
        return "Your location";
    }
}

async function fetchWeatherByCoords(latitude, longitude) {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }
    return response.json();
}
function renderWeather(data, locationName) {
    const current = data.current;
    const { icon, label } = getWeatherIcon(current.weather_code);

    weatherLocationEl.textContent = locationName;
    weatherContentEl.innerHTML = `
        <div class="weather-main">
            <i class="fas ${icon} weather-icon-large"></i>
            <div class="weather-temp-block">
                <span class="weather-temp">${Math.round(current.temperature_2m)}°C</span>
                <span class="weather-desc">${label}</span>
            </div>
        </div>
        <div class="weather-details">
            <div class="weather-detail">
                <i class="fas fa-temperature-half"></i>
                <span class="weather-detail-label">Feels like</span>
                <span class="weather-detail-value">${Math.round(current.apparent_temperature)}°C</span>
            </div>
            <div class="weather-detail">
                <i class="fas fa-droplet"></i>
                <span class="weather-detail-label">Humidity</span>
                <span class="weather-detail-value">${current.relative_humidity_2m}%</span>
            </div>
            <div class="weather-detail">
                <i class="fas fa-wind"></i>
                <span class="weather-detail-label">Wind</span>
                <span class="weather-detail-value">${current.wind_speed_10m} km/h</span>
            </div>
            <div class="weather-detail">
                <i class="fas fa-clock"></i>
                <span class="weather-detail-label">Updated</span>
                <span class="weather-detail-value">${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
        </div>
    `;
}

function renderWeatherError(message) {
    weatherLocationEl.textContent = "Location unavailable";
    weatherContentEl.innerHTML = `<p class="weather-error">${message}</p>`;
}

// Main orchestrator
async function loadWeather() {
    weatherLocationEl.textContent = "Detecting your location...";
    weatherContentEl.innerHTML = `<p class="weather-loading">Loading weather data...</p>`;

    try {
        const { latitude, longitude } = await getUserCoordinates();
        const [weatherData, cityName] = await Promise.all([
            fetchWeatherByCoords(latitude, longitude),
            getCityName(latitude, longitude),
        ]);
        renderWeather(weatherData, cityName);
    } catch (error) {
        console.error("Weather error:", error);
        renderWeatherError(error.message || "Unable to load weather data.");
    }
}

loadWeather();

refreshWeatherButton.addEventListener("click", loadWeather);

const siteHeader = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }
});