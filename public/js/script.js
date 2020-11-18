function editFunction() {
    $("#profilefirstname").prop('disabled', false);
    $("#profilelastname").prop('disabled', false);
    $("#profileaddress").prop('disabled', false);
    $("#profilecontact").prop('disabled', false);
    $("#profilecity").prop('disabled', false);
    $("#profilestate").prop('disabled', false);
    $("#profiledob").prop('disabled', false);
    $(".edit-btn").hide();
    $(".save-btn").show();
    $(".cancel-btn").show();
}
function saveFunction() {
    $("#profilefirstname").prop('disabled', true);
    $("#profilelastname").prop('disabled', true);
    $("#profileaddress").prop('disabled', true);
    $("#profilecontact").prop('disabled', true);
    $("#profilecity").prop('disabled', true);
    $("#profilestate").prop('disabled', true);
    $("#profiledob").prop('disabled', true);
    $(".edit-btn").show();
    $(".save-btn").hide();
    $(".cancel-btn").hide();
    fetch('/quotes', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Darth Vadar',
      quote: 'I find your lack of faith disturbing.'
    })
  })
}

function cancelFunction() {
  $("#profilefirstname").prop('disabled', true);
  $("#profilelastname").prop('disabled', true);
  $("#profileaddress").prop('disabled', true);
  $("#profilecontact").prop('disabled', true);
  $("#profilecity").prop('disabled', true);
  $("#profilestate").prop('disabled', true);
  $("#profiledob").prop('disabled', true);
  $(".edit-btn").show();
  $(".save-btn").hide();
  $(".cancel-btn").hide();
}

const update = document.querySelector('#update-button')

update.addEventListener('click', _ => {
  alert("Here");
  // Send PUT Request here
})
