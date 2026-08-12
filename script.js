const images = [
    "images/School.jpg",
    "images/computer-lab.jpg",
    "images/science -lab.jpg",
    "images/sports.jpg",
    "images/library .jpg"
];

let currentImage = 0;

function showImage() {

    const slideImage = document.getElementById("slideImage");

    if (!slideImage) {
        return;
    }

    slideImage.src = images[currentImage];
}


function nextImage() {

    currentImage++;

    if (currentImage >= images.length) {
        currentImage = 0;
    }

    showImage();
}


function previousImage() {

    currentImage--;

    if (currentImage < 0) {
        currentImage = images.length - 1;
    }

    showImage();
}


// Automatically change image every 4 seconds
setInterval(nextImage, 4000);
