// ✅ 遠端 JSON 資料來源
const API_URL = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';
const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=Travel';

// ✅ 地區設定（依照 JSON data area 欄位：台北、台中、高雄）
const REGION_SETTINGS = [
	{ label: '台北', color: '#64C3BF' },
	{ label: '台中', color: '#4F63D2' },
	{ label: '高雄', color: '#F3A556' },
];

const ticketCardArea = document.querySelector('.ticket-card-area');
const searchResultText = document.getElementById('search-result-text');
const regionSearch = document.querySelector('.region-search');
const cantFindArea = document.querySelector('.cant-find-area');
const addTicketBtn = document.querySelector('.add-ticket-btn');
const addTicketForm = document.querySelector('.add-ticket-form');
const legendCountEls = REGION_SETTINGS.reduce((acc, region) => {
	const target = document.querySelector(`[data-region-count="${region.label}"]`);
	if (target) {
		acc[region.label] = target;
	}
	return acc;
}, {});

let chart = null;

const ticketNameInput = document.getElementById('ticket-name');
const ticketImgUrlInput = document.getElementById('ticket-img-url');
const ticketRegionSelect = document.getElementById('ticket-region');
const ticketPriceInput = document.getElementById('ticket-price');
const ticketNumInput = document.getElementById('ticket-num');
const ticketRateInput = document.getElementById('ticket-rate');
const ticketDescriptionInput = document.getElementById('ticket-description');

const messageRefs = {
	name: document.getElementById('ticket-name-message'),
	imgUrl: document.getElementById('ticket-img-url-message'),
	region: document.getElementById('ticket-region-message'),
	price: document.getElementById('ticket-price-message'),
	group: document.getElementById('ticket-num-message'),
	rate: document.getElementById('ticket-rate-message'),
	description: document.getElementById('ticket-description-message'),
};

// ✅ 本地端資料儲存（從遠端 fetch 後存於此）
let data = [];
let currentRegion = '';

init();

function init() {
	initChart();
	fetchTickets();
	addTicketBtn.addEventListener('click', handleAddTicket);
	regionSearch.addEventListener('change', handleRegionFilter);
	initLegendToggle();
}

function initLegendToggle() {
	const legendItems = document.querySelectorAll('.region-chart-legend li');
	legendItems.forEach((item, index) => {
		item.style.cursor = 'pointer';
		item.addEventListener('click', () => {
			const region = REGION_SETTINGS[index];
			if (chart) {
				chart.toggle(region.label);
			}
		});
	});
}

function initChart() {
	chart = c3.generate({
		bindto: '#region-chart-donut',
		data: {
			columns: [
				['台北', 0],
				['台中', 0],
				['高雄', 0]
			],
			type: 'donut',
			colors: {
				'台北': '#64C3BF',
				'台中': '#4F63D2',
				'高雄': '#F3A556'
			}
		},
		donut: {
			title: '套票地區比重',
			width: 15,
			label: {
				show: false,
				format: function (value, ratio, id) {
					return (ratio * 100).toFixed(0) + '%';
				}
			}
		},
		legend: {
			show: false
		},
		size: {
			width: 180,
			height: 180
		},
		tooltip: {
			format: {
				value: function (value, ratio, id) {
					return value + ' (' + (ratio * 100).toFixed(1) + '%)';
				}
			}
		}
	});
}

// ✅ 使用 fetch 取得遠端 JSON 資料，存於本地端變數 data
async function fetchTickets() {
	try {
		const response = await fetch(API_URL);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const result = await response.json();
		// ✅ 預設資料為 3 筆（來自 JSON data）
		data = Array.isArray(result.data) ? result.data : [];
		renderTickets(data);
	} catch (error) {
		searchResultText.textContent = '資料載入失敗，請重新整理頁面';
		console.error('Failed to fetch tickets:', error);
	}
}

// ✅ 地區篩選處理（包含「全部地區」選項）
function handleRegionFilter(event) {
	const selectedValue = event.target.value;
	currentRegion = selectedValue === '地區搜尋' ? '' : selectedValue;
	renderTickets(getFilteredTickets());
}

function handleAddTicket() {
	const formValues = getFormValues();
	if (!validateForm(formValues)) {
		return;
	}

	const newTicket = {
		id: Date.now(),
		name: formValues.name,
		imgUrl: formValues.imgUrl || DEFAULT_IMAGE,
		area: formValues.region,
		description: formValues.description,
		group: Number(formValues.group),
		price: Number(formValues.price),
		rate: Number(formValues.rate),
	};

	data.push(newTicket);
	renderTickets(getFilteredTickets());
	resetForm();
}

function getFormValues() {
	return {
		name: ticketNameInput.value.trim(),
		imgUrl: ticketImgUrlInput.value.trim(),
		region: ticketRegionSelect.value,
		price: ticketPriceInput.value.trim(),
		group: ticketNumInput.value.trim(),
		rate: ticketRateInput.value.trim(),
		description: ticketDescriptionInput.value.trim(),
	};
}

function resetForm() {
	addTicketForm.reset();
}

function getFilteredTickets() {
	if (!currentRegion) {
		return data;
	}
	return data.filter((ticket) => ticket.area === currentRegion);
}

function renderTickets(tickets) {
	ticketCardArea.innerHTML = '';
	updateResultCount(tickets.length);
	updateChart(tickets);

	if (!tickets.length) {
		cantFindArea.classList.remove('hidden');
		return;
	}

	cantFindArea.classList.add('hidden');
	const fragment = document.createDocumentFragment();

	tickets.forEach((ticket) => {
		const card = createTicketCard(ticket);
		fragment.appendChild(card);
	});

	ticketCardArea.appendChild(fragment);
}

function createTicketCard(ticket) {
	const card = document.createElement('li');
	card.className = 'ticket-card';

	const imgWrapper = document.createElement('div');
	imgWrapper.className = 'ticket-card-img';

	const link = document.createElement('a');
	link.href = '#';
	link.setAttribute('aria-label', ticket.name);

	const img = document.createElement('img');
	img.src = ticket.imgUrl || DEFAULT_IMAGE;
	img.alt = ticket.name;
	link.appendChild(img);

	const regionBadge = document.createElement('div');
	regionBadge.className = 'ticket-card-region';
	regionBadge.textContent = ticket.area;

	const rankBadge = document.createElement('div');
	rankBadge.className = 'ticket-card-rank';
	rankBadge.textContent = ticket.rate;

	imgWrapper.append(link, regionBadge, rankBadge);

	const content = document.createElement('div');
	content.className = 'ticket-card-content';

	const contentTextWrapper = document.createElement('div');

	const title = document.createElement('h3');
	const titleLink = document.createElement('a');
	titleLink.href = '#';
	titleLink.className = 'ticket-card-name';
	titleLink.textContent = ticket.name;
	title.appendChild(titleLink);

	const description = document.createElement('p');
	description.className = 'ticket-card-description';
	description.textContent = ticket.description;

	contentTextWrapper.append(title, description);

	const infoWrapper = document.createElement('div');
	infoWrapper.className = 'ticket-card-info';

	const groupInfo = document.createElement('p');
	groupInfo.className = 'ticket-card-num';
	groupInfo.innerHTML = '<span><i class="fas fa-exclamation-circle"></i></span> 剩下最後 <span>' + ticket.group + '</span> 組';

	const priceInfo = document.createElement('p');
	priceInfo.className = 'ticket-card-price';
	priceInfo.innerHTML = 'TWD <span>$' + formatPrice(ticket.price) + '</span>';

	infoWrapper.append(groupInfo, priceInfo);

	content.append(contentTextWrapper, infoWrapper);
	card.append(imgWrapper, content);
	return card;
}

// ✅ 篩選後顯示『搜尋資料為 ? 筆』
function updateResultCount(count) {
	searchResultText.textContent = `搜尋資料為 ${count} 筆`;
}

function formatPrice(price) {
	const number = Number(price) || 0;
	return number.toLocaleString('zh-TW');
}

function updateChart(tickets) {
	const counts = REGION_SETTINGS.reduce((acc, region) => {
		acc[region.label] = tickets.filter((ticket) => ticket.area === region.label).length;
		return acc;
	}, {});

	console.log('更新圖表數據:', counts); // 除錯用

	REGION_SETTINGS.forEach((region) => {
		const target = legendCountEls[region.label];
		if (target) {
			target.textContent = counts[region.label] || 0;
		}
	});

	if (chart) {
		chart.load({
			columns: [
				['台北', counts['台北'] || 0],
				['台中', counts['台中'] || 0],
				['高雄', counts['高雄'] || 0]
			]
		});
	}
}

function showError(target, message) {
	target.textContent = message;
}

function clearError(target) {
	target.textContent = '';
}

// ✅ 表單驗證：除了「圖片網址」以外的欄位皆需必填
function validateForm(values) {
	let isValid = true;

	const rules = [
		{
			value: values.name,
			target: messageRefs.name,
			validator: (val) => val.length > 0,
			message: '請輸入套票名稱',
		},
		{
			value: values.region,
			target: messageRefs.region,
			validator: (val) => val.length > 0,
			message: '請選擇套票地區',
		},
		{
			value: values.price,
			target: messageRefs.price,
			validator: (val) => {
				const number = Number(val);
				return !Number.isNaN(number) && number > 0;
			},
			message: '請輸入大於 0 的金額',
		},
		{
			value: values.group,
			target: messageRefs.group,
			validator: (val) => {
				const number = Number(val);
				return !Number.isNaN(number) && number > 0;
			},
			message: '請輸入大於 0 的組數',
		},
		{
			value: values.rate,
			target: messageRefs.rate,
			validator: (val) => {
				const number = Number(val);
				return !Number.isNaN(number) && number >= 1 && number <= 10;
			},
			message: '星級需介於 1 到 10',
		},
		{
			value: values.description,
			target: messageRefs.description,
			validator: (val) => val.length > 0 && val.length <= 100,
			message: '請輸入 1-100 字描述',
		},
	];

	rules.forEach((rule) => {
		if (!rule.validator(rule.value)) {
			showError(rule.target, rule.message);
			isValid = false;
		} else {
			clearError(rule.target);
		}
	});

	// ✅ 圖片網址不需必填，清除錯誤訊息
	clearError(messageRefs.imgUrl);
	return isValid;
}
