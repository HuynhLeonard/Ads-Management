export function ezBSAlert(options) {
    var deferredObject = $.Deferred();
    var defaults = {
        type: 'alert', //alert, prompt,confirm
        modalSize: 'modal-sm', //modal-sm, modal-lg
        okButtonText: 'Ok',
        cancelButtonText: 'Huỷ',
        yesButtonText: 'Đồng ý',
        noButtonText: 'Không',
        headerText: 'Xác nhận',
        messageText: 'Message',
        alertType: 'default', //default, primary, success, info, warning, danger
        inputFieldType: 'text', //could ask for number,email,etc
    }
    $.extend(defaults, options);
  
    var _show = function() {
        var headClass = 'navbar-default';
        switch (defaults.alertType) {
            case 'primary':
                headClass = 'alert-primary';
                break;
            case 'success':
                headClass = 'alert-success';
                break;
            case 'info':
                headClass = 'alert-info';
                break;
            case 'warning':
                headClass = 'alert-warning';
                break;
            case 'danger':
                headClass = 'alert-danger';
                break;
        }
        $('BODY').append(
            '<div id="ezAlerts" class="modal fade">' +
            '<div class="modal-dialog" class="' + defaults.modalSize + '">' +
            '<div class="modal-content">' +
            '<div id="ezAlerts-header" class="modal-header ' + headClass + '">' +
            '<h4 id="ezAlerts-title" class="modal-title">Modal title</h4>' +
            '<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal"></button>' +
            '</div>' +
            '<div id="ezAlerts-body" class="modal-body">' +
            '<div id="ezAlerts-message" ></div>' +
            '</div>' +
            '<div id="ezAlerts-footer" class="modal-footer">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
  
        $('.modal-header').css({
            'padding': '1rem 1rem',
            '-webkit-border-top-left-radius': '0.3rem',
            '-webkit-border-top-right-radius': '0.3rem',
            '-moz-border-radius-topleft': '0.3rem',
            '-moz-border-radius-topright': '0.3rem',
            'border-top-left-radius': '0.3rem',
            'border-top-right-radius': '0.3rem'
        });
  
        $('#ezAlerts-title').text(defaults.headerText);
        $('#ezAlerts-message').html(defaults.messageText);
  
  
        var keyb = 'false',
        backd = 'static';
        const ezModal = new bootstrap.Modal(document.getElementById('ezAlerts'), {
          keyboard: false,
          backdrop: 'static',
        });
        var calbackParam = '';
        switch (defaults.type) {
            case 'alert':
                keyb = 'true';
                backd = 'true';
                $('#ezAlerts-footer').html('<button class="btn btn-' + defaults.alertType + '">' + defaults.okButtonText + '</button>').on('click', '.btn', function() {
                    calbackParam = true;
                    ezModal.hide();
                });
                break;
            case 'confirm':
                var btnhtml = '<button id="ezok-btn" class="btn btn-primary">' + defaults.yesButtonText + '</button>';
                if (defaults.noButtonText && defaults.noButtonText.length > 0) {
                    btnhtml += '<button id="ezclose-btn" class="btn btn-danger">' + defaults.noButtonText + '</button>';
                }
                $('#ezAlerts-footer').html(btnhtml).on('click', 'button', function(e) {
                    if (e.target.id === 'ezok-btn') {
                        calbackParam = true;
                        ezModal.hide();
                    } else if (e.target.id === 'ezclose-btn') {
                        calbackParam = false;
                        ezModal.hide();
                    }
                });
                break;
            case 'prompt':
                $('#ezAlerts-message').html(defaults.messageText + '<br /><br /><div class="form-group"><input type="' + defaults.inputFieldType + '" class="form-control" id="prompt" /></div>');
                $('#ezAlerts-footer').html('<button class="btn btn-primary">' + defaults.okButtonText + '</button>').on('click', '.btn', function() {
                    calbackParam = $('#prompt').val();
                    ezModal.hide();
                });
                break;
        }
  
        // $('#ezAlerts').on('hidden.bs.modal', function(e) {
        //     $('#ezAlerts').remove();
        //     deferredObject.resolve(calbackParam);
        // }).on('shown.bs.modal', function(e) {
        //     if ($('#prompt').length > 0) {
        //         $('#prompt').focus();
        //     }
        // });
  
        $('#ezAlerts').on('hidden.bs.modal', function(e) {
          $('#ezAlerts').remove();
          deferredObject.resolve(calbackParam);
        });
  
        $('#ezAlerts').on('shown.bs.modal', function(e) {
          if ($('#prompt').length > 0) {
            $('#prompt').focus();
          }
        });
  
        ezModal.show();
  
    }
  
    _show();
    return deferredObject.promise();
  }