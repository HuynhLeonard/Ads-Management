const $table = $('#table');
$(function () {
	if ($table) {
		console.log('table.js loaded');
	}
	const data = [...Array(5).keys()].map(i => ({
		id: i,
		ward: `Phường ${i}`,
		type: 'Trụ bảng hi-flex',
		size: '2.5 x 1.5m',
		quantity: '1 trụ/bảng',
		detail: `
		<div class="d-flex flex-row align-items-center justify-content-center">
      <a href="#">
        <img src="./assets/info.svg" alt="edit-icon" style="background-color: transparent"/>
      </a>
    </div>
		`
	}));

	console.log(data);

	$table.bootstrapTable('load', data);
})