import "$public/index.html";
import "main.scss";
import loaderImg from "images/loader.svg";

interface Photo {
  links: {
    html: string;
  };
  alt_descriptor: string;
  urls: {
    regular: string;
  };
}

// Loader img
const svgImg = document.createElement("img");
setAttributes(svgImg, {
  src: loaderImg,
  alt: "Loading",
});
const loader = document.getElementById("loader");
loader?.appendChild(svgImg);

// Unsplash API
const ACCESS_KEY: string = "";
const apiKey: string = ACCESS_KEY;
let picCount: number = 5;
const apiUrl: string = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}`;

const imageContainer = document.getElementById("image-container");

let ready: boolean = true;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray: Photo[] = [];
let initialLoad = true;

// Check if all images were loaded
function imageLoaded(): void {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    initialLoad = false;
    picCount = 10;
    if (loader) loader.hidden = true;
  }
}

// Helper function to set attributes to elements
function setAttributes(element: HTMLElement, attributes: any): void {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements For Links & Photos, Add to DOM
function displayPhotos(): void {
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo: Photo) => {
    // Create <a> to link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    // Create <img> for photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_descriptor,
      title: photo.alt_descriptor,
    });
    // Eveng Listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer Element.
    item.appendChild(img);
    if (imageContainer) {
      imageContainer.appendChild(item);
    } else {
      console.log("The imageContainer element is null.");
    }
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (e) {
    // Catch Errors Here
    console.log("Error Occured Over Here:", e);
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    imagesLoaded = 0;
    getPhotos();
  }
});

getPhotos();
