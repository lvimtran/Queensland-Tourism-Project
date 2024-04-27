//Create burger menu feature
document.addEventListener('DOMContentLoaded', function(){
    //Select burger menu and navigation links
    const burgerMenu = document.querySelector('.burgerMenu');
    const categories = document.querySelector('nav ul');

    //Adjust burger menu activation if it's in the right wireframe
    burgerMenu.addEventListener('click', function(){
        categories.style.display = categories.style.display === "block" ? "none" : "block";
    });
})

//jQuery ready function for Flickr features
$(document).ready(function(){
    //Click to fetch photos on Flickr
    $('.destinations a').click(function(e){
        e.preventDefault();
        let destinationTag = $(this).attr('href').substring(1);
        fetchPhoto(destinationTag);
    });

    //Fetch photos from Flickr API and select high quality thumbnails
    function fetchPhoto(photoId){
        const apiKey = "dc140afe3fd3a251c2fdf9dcd835be5c";
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${photoId}&per_page=50&extras=faves,date_upload&format=json&nojsoncallback=1`;
        $.getJSON(url, function(data){
            if (data.photos && data.photos.photo.length){
                let highQualityPhotos = data.photos.photo.sort((a,b) => b.faves - a.faves).slice(0,5);
                displayThumbnails(highQualityPhotos);
            }
        })
    }
    
    //Display thumbnails after selecting a destination
    function displayThumbnails(photos){
        const thumbnailsContainer = $('#photoDisplay');
        thumbnailsContainer.empty();
        photos.forEach(photo => {
            let src = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`
            let img = $(`<img>`).attr('src', src).attr('alt', photo.title).addClass('thumbnail');
            img.click(() => displayFullSizeImage(photo));
            thumbnailsContainer.append(img);
        })
    }
    
    //Display full size image, caption and date taken
    function displayFullSizeImage(photo){
        let src = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`
        let photoDate = photo.dateupload ? new Date(photo.dateupload * 1000) : new Date()
        $('#fullSizePhoto').attr('src', src).attr('alt', photo.title);
        $('#modalCaption').html(`${photo.title} <br> Taken on: ${photoDate.toDateString()}`).css({'color': 'white', 'text-align': 'center'});
        $('.modal').show();
        addPhoto(photo);
    }

    //Close modal
    $('.close').click(function(){
        $('.modal').hide();
    })
    
    let recentView = [];
    
    //Add photos to the recent viewed list after click on a photo to view full size
    function addPhoto(photo) {
        recentView.unshift(photo);
        if (recentView.length > 5){
            recentView.pop();
        }
        displayRecentPhoto();
    }
    
    //Display added photos to the recent viewed list
    function displayRecentPhoto() {
        const list = $('.recentThumbnail');
        list.empty();
        recentView.forEach(photo => {
            let src = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`
            let img = $('<img>').attr('src', src).attr('alt', photo.title).addClass('small-thumbnail').css({'color': 'white', 'text-align': 'center'});
            img.click(() => displayFullSizeImage(photo));
            list.append(img);
        })
    }
});