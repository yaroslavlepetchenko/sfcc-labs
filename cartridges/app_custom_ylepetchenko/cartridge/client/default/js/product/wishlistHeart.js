'use strict';

/**
 * appends params to a url
 * @param {string} data - data returned from the server's ajax call
 * @param {Object} icon - icon that was clicked to add a product to the wishlist
 */
function displayMessageAndChangeIcon(data, icon) {
    $.spinner().stop();
    var status;
    if (data.success) {
        status = 'alert-success';
        if (icon.hasClass('fa-heart-o')) {
            icon.removeClass('fa-heart-o').addClass('fa-heart');
        }
    } else {
        status = 'alert-danger';
    }

    if ($('.add-to-wishlist-messages').length === 0) {
        $('body').append(
            '<div class="add-to-wishlist-messages "></div>'
        );
    }
    $('.add-to-wishlist-messages')
        .append('<div class="add-to-wishlist-alert text-center ' + status + '">' + data.msg + '</div>');

    setTimeout(function () {
        $('.add-to-wishlist-messages').remove();
    }, 5000);
}

module.exports = {
    ManageWishlist: function () {
        var wishlistProductIds = window.wishlistProductList.split('&quot;');
        var all = $('.product').map(function() {
            return $(this);
        }).get();
        wishlistProductIds.forEach(function(wid) {
            for(var i=0; i<all.length; i++) {
                var pid = all[i].data('pid');
                if(wid == pid) {
                    var icon = all[i].find($('.wishlistTile')).find('i');
                    if(icon.hasClass('fa-heart-o')) {
                        icon.removeClass('fa-heart-o');
                        icon.addClass('fa-heart');
                    }
                }
            }
        });
        $('body').on('click', '.wishlistTile', function (e) {
            e.preventDefault();
            var icon = $(this).find($('i'));
            var url = $(this).attr('href');
            var pid = $(this).closest('.product').data('pid');
            var deleteUrl = $(this).closest('.product').data('remove-url');
            var optionId = $(this).closest('.product-detail').find('.product-option').attr('data-option-id');
            var optionVal = $(this).closest('.product-detail').find('.options-select option:selected').attr('data-value-id');
            optionId = optionId || null;
            optionVal = optionVal || null;
            if (!url || !pid) {
                return;
            }

            if(icon.hasClass('fa-heart')) {
                $.spinner().start();
                $.ajax({
                    url: deleteUrl,
                    type: 'get',
                    success: function () {
                        //displayMessageAndChangeIcon(data, icon);
                        $.spinner().stop();
                        if (icon.hasClass('fa-heart')) {
                            icon.removeClass('fa-heart').addClass('fa-heart-o');
                        }
                    },
                    error: function (err) {
                        displayMessageAndChangeIcon(err, icon);
                    }
                });
            }

            if(icon.hasClass('fa-heart-o')) {
                $.spinner().start();
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        pid: pid,
                        optionId: optionId,
                        optionVal: optionVal
                    },
                    success: function (data) {
                        displayMessageAndChangeIcon(data, icon);
                    },
                    error: function (err) {
                        displayMessageAndChangeIcon(err, icon);
                    }
                });
            }
        });
    }
};
