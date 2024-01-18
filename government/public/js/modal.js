// create modal by javascript and jquery then append to body
const createComponent = (component) => {
	const formElement = $(`
		<div class="mb-3">
			<label for="${component.id}" class="col-form-label mb-1">
				${component.label} (${component.required ? '<span class="text-danger">*</span>' : ''})
			</label>
		</div>
	`);

	let input = $();
	switch (component.type) {
		case 'input':
			input = $(`
				<input type="${component.inputType}" class="form-control" id="${component.id}" name="${component.id}">
			`);
			break;
		case 'select':
			input = $(`
				<select class="form-select" id="${component.id}" name="${component.id}">
				</select>
			`);
			component.options.forEach(option => {
				const optionElement = $(`
					<option value="${option.value}">${option.text}</option>
				`);
				input.append(optionElement);
			});
			break;
		case 'textarea':
			input = $(`
				<textarea class="form-control" id="${component.id}" name="${component.id}" rows="${component.rows}">${component.text || ''}</textarea>
			`);
			break;
		default:
			break;

	}

	if (component.placeholder) {
		input.attr('placeholder', component.placeholder);
	}
	if (component.value) {
		input.attr('value', component.value);
	}
	if (component.required) {
		input.attr('required', true);
	}
	if (component.disabled) {
		input.attr('disabled', true);
	}
	formElement.append(input);

	return formElement;
};

const createButton = (button, formID) => {
	const buttonElement = $(`
		<button
			class="btn"
			style="min-width: 6.5rem; background-color: ${button.color}; color: #f7fafc;">
		${button.label}
		</button>
	`);
	if (button.dismiss) {
		buttonElement.attr('data-bs-dismiss', 'modal');
	}
	switch (button.type) {
		case 'submit':
			buttonElement.attr('type', 'submit');
			buttonElement.attr('form', formID || '');
			buttonElement.attr('value', 'submit');
			break;
		case 'reset':
			buttonElement.attr('type', 'reset')
			break;
		default:
			buttonElement.attr('type', 'button')
			break;
	}
	return buttonElement;
}
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  $('#alertConfirm').append(wrapper)
}
const createModal = (options) => {
	console.log('create modal');
	// console.log(options);
	const modal = $(`
		<div class="modal fade" id="${options.id}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
			<div class="modal-dialog modal-dialog-centered" >
				<div class="modal-content">
				</div>
			</div>
		</div>
	`);
	const modalHeader = $(`
		<div class="modal-header pb-0 border-0 position-relative text-center justify-content-center">
      <button type="button" class="btn-close position-absolute top-0 end-0 mt-2 me-2 bg-light shadow-sm border rounded-pill" data-bs-dismiss="modal" aria-label="Close"></button>
      <h5 class="modal-title pb-2 fs-4 fw-semibold text-center text-uppercase">${options.title}</h5>
    </div>
	`);

	const modalBody = $(`
		<div class="modal-body pt-1 pb-2 border-0">
		</div>
	`);

	if (options.subtitle) {
		modalBody.append(`<h5 class="text-start fs-6 text-dark">${options.subtitle}</h5>`);
	}

	if (options.form) {
		const form = $(`
			<form id=${options.form.id} method=${options.form.method} action=${options.form.action}>
			</form>
		`);
		options.form.components.forEach(component => {
			form.append(createComponent(component));
		});
		const buttonGroup = $(`
			<div class="d-flex justify-content-around">
			</div>
		`);
		options.form.buttons.forEach(button => {
			buttonGroup.append(createButton(button, options.form.id));
		});
		form.append(buttonGroup);
		modalBody.append(form);
	}

	// add to modal content
	modal.find('.modal-content').append(modalHeader);
	modal.find('.modal-content').append(modalBody);

	if (options.parentId){
		$(`#${options.parentId}`).append(modal);
	}
	else {
		$('main').append(modal);
	}

  if ($('#alertConfirm').length === 0){
    console.log('create alert confirm');
    $('main').append('<div id="alertConfirm" class="position-fixed top-0 start-50 translate-middle-x" style="width: fit-content; transform: translateX(-50%); z-index: 1050;"></div>');
  }else console.log('alert confirm existed')

  // check post request success
  if (options.form && options.form.method === 'post') {
    $(`#${options.form.id}`).submit(async function (e) {
      e.preventDefault();
      const form = $(this);
      const url = form.attr('action');
      const data = form.serialize();
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        if (!response.ok) {
          throw new Error('Request failed');
        }
        console.log('Request success');
        appendAlert('Thành công', 'success');
      } catch (error) {
        console.log(error.message);
        appendAlert('Thất bại', 'danger');
      }
    });
  }

	return modal;
}

export default createModal;
