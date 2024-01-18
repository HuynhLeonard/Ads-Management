$(document).ready(function() {
    var firstImageSrc = $('.carousel .carousel-item:first-child img').attr('src');
    $('#mainImage').attr('src', firstImageSrc);

    $('.carousel .carousel-item').each(function() {
        const minPerSlide = 3;
        let next = $(this).next();
        for (let i = 1; i < minPerSlide; i++) {
            if (!next.length) {
                next = $('.carousel .carousel-item').first();
            }
            let cloneChild = next.clone();
            $(this).append(cloneChild.children().eq(0));
            next = next.next();
        }
    });

    $('.carousel').on('click', '.carousel-item', function(event) {
        if ($(event.target).is('img')) {
            // Get the clicked item's image source
            var newImageSrc = $(event.target).attr('src');
            
            // Update the main image with the clicked item's image source
            $('#mainImage').attr('src', newImageSrc);
        }
    });
});