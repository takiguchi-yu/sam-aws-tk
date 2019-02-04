const BASE_HOST = 'https://ufggca0yn0.execute-api.ap-northeast-1.amazonaws.com/Prod';

$(function() {

  // Convertボタン押下時の処理
  $('#btn').on('click', function() {
    copy_result.innerHTML = '';
    if(! $('#org_url').val().match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/)) {
      result.innerHTML = 'Not in URL format';
      return false;
    }
    var button = $(this);
    button.attr('disabled', true);
    $('#btn').css('cursor', 'not-allowed');
    var data = {
        'url': $('#org_url').val()
    };
    $.ajax({
      url:BASE_HOST + '/save',
      type:'POST',
      contentType:'application/json',
      data:JSON.stringify(data),
      dataType:'json'
    })
    .done((data) => {
      result.innerHTML = BASE_HOST + '/' + data.mappingId;
    })
    .fail((data) => {
      result.innerHTML = 'FAIL';
      console.log(data);
    })
    .always((data) => {
      button.attr('disabled', false);
      $('#btn').css('cursor', 'pointer');
    })
  })

  // URL入力欄を選択したときの処理
  $('#org_url').on('click', function() {
    result.innerHTML = '';
    copy_result.innerHTML = '';
    this.select();
  })

  // Copyボタン押下時の処理
  $('#copyBtn').on('click', function() {
    var clipboard = new Clipboard('#copyBtn');

    clipboard.on('success', function(e) {
        e.clearSelection();
        copy_result.innerHTML = 'Copied';
    });
  })
})
