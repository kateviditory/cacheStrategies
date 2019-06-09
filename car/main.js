// Инициализация
// Таблицы
let t1 = document.getElementById("t1");
let b1 = document.getElementById("b1");
let t2 = document.getElementById("t2");
let b2 = document.getElementById("b2");
let processor = document.getElementById("processor");
let tags = document.getElementById("tags");
let cache = document.getElementById("cache");
// Кнопки
let nextBtn = document.getElementById("next");
let backBtn = document.getElementById("back");
let addBtn = document.getElementById("add");
let deleteBtn = document.getElementById("delete");
let comments = document.getElementById("comments");
let parameter = document.getElementById("parameter");
// Настройки кэш: размер кэш-памяти и целевой размер для T1
let c = 16;
let p = 8;
// Данные из выбранного варианта
let cashArr, shadowArr, searchArr;
// Переменные, для хранения промежуточных состояний таблиц
let previousT1_1,previousT2_1,previousB1_1,previousB2_1,previousProcessor_1,previousTags_1,previousCache_1;
let previousT1_2,previousT2_2,previousB1_2,previousB2_2,previousProcessor_2,previousTags_2,previousCache_2;
// Указатель на текущую строку
let pointer = 0;
// Параметр, определяющий условия удаления строки
let valid_dirty;

//Выбираем вариант и заполняем таблицы данными из варианта
document.getElementById("variant").addEventListener("change", function(){
	// отображаем таблицы
	let elems = document.querySelectorAll(".hide");
	[].forEach.call(elems, function(el) {
    	el.classList.remove("hide");
	});
	// прячем поле выбора варианта 
	elems = document.querySelectorAll(".variant");
	[].forEach.call(elems, function(el) {
    	el.classList.add("hide");
	});
	// читаем данные варианта из json-файла
	let arr = readTextFile(this.value);
	cashArr = arr[0];
	shadowArr = arr[1];
	searchArr = arr[2];
	// заполняем таблицы данными
	fillTables()
})
// отрабатываем нажатие на кнопки
nextBtn.addEventListener("click", nextBtnOnClick);
backBtn.addEventListener("click", backBtnOnClick);
addBtn.addEventListener("click", addBtnOnClick);
deleteBtn.addEventListener("click", deleteBtnOnClick);
// блокирую часть кнопок
backBtn.disabled = true;
addBtn.disabled = true;
deleteBtn.disabled = true;
document.getElementById("option1").disabled = true;
document.getElementById("option2").disabled = true;
