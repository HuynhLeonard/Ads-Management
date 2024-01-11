$(document).ready(function (){
    const checkboxes = $('.form-check-input');
    const selectItem = $('.dropdown-item');
    const table = $('#table');

    const dropdownButton = $('#dropdownMenuLink');
    const selectItemsText = $('.dropdown-menu li a').map(function () {
        return $(this).data('name');
    }).get();

    let checkboxHeaderText = "";
    if(checkboxes.length > 0){
        checkboxHeaderText = document.querySelector('.checkbox-container h1').textContent.trim().split(' ')[0];
    }
    
    const getSelectedItem = () => {
        const selectedState = $('#dropdownMenuLink').text().trim();
        if(selectedState === 'Tất cả') return selectItemsText.slice(1);
        return selectedState;
    };

    const getCheckedBoxes = () => {
        if(checkboxes.length <= 0) return;

        let checkedValues = checkboxes.filter(':checked');
        if(checkboxHeaderText !== 'Quận'){
            checkedValues = checkedValues.map(function () {
                return $(this).val().replace('Quận ', '');
            })
            .get();
        } else {
            checkedValues = checkedValues.map(function () {
                return $(this).val().replace('Phường ', '');
            })
            .get();
        }

        return checkedValues;
    }

    const updateTable = () => {
        const selectedState = getSelectedItem();
        const checkedBoxes = getCheckedBoxes();

        table.bootstrapTable('refresh');

        const options = {};

        if(selectItemsText.length > 0 && selectItemsText.includes('Tất cả')){
            options.state = selectedState;
        }
            
        if(checkboxes.length > 0){
            if(checkboxHeaderText !== 'Quận'){
                options.district = checkedBoxes
            } else {
                options.ward = checkedBoxes
            }
        }
        table.bootstrapTable('filterBy', options);
    }

    selectItem.on('click', function () {
        dropdownButton.text($(this).data('name'));
        
        updateTable();
    });

    if(checkboxes.length > 0){
        checkboxes.on('change', updateTable)
    }
    
})
