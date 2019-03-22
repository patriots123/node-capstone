

// document.addEventListener('DOMContentLoaded', function() {
//     var elems = document.querySelectorAll('.dropdown-trigger');
//     var instances = M.Dropdown.init(elems, options);
// });


$(document).ready(function(){
  $('select').formSelect();
});

$(document).ready(function(){
  $('.datepicker').datepicker();
});

// function callDeleteEndpoint() {
//   let payment_id = $('.payment-id').text();
//   let endpoint = `/payments/${payment_id}`;
//   $('.delete-payment').on('click', event => {
//     console.log('clicked the button');
//     $.ajax({
//       url: endpoint,
//       type: 'DELETE',
//       success: function(result) {
          
//       }
//     });
//   })
// }

// function run() {
//   callDeleteEndpoint();
// }

// $(run);