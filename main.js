// Ekam singh bhatia

let cacheName = "ekam";

document.getElementById("fetch").addEventListener("click", fetchAncCacheImage);
document.getElementById("cache").addEventListener("click", getImageFromCache);

caches.open(cacheName).then((cache) => {
  console.log("cache opened");
  console.log(cache);
});

function fetchAncCacheImage() {
  fetch("https://picsum.photos/v2/list?page=2&limit=200")
    .then((res) => {
      if (!res.ok) {
        console.log("response not ok");
      }
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      data.forEach((item) => {
        // console.log(item.download_url);
        saveToCache(item.download_url);
      });
    })
    .catch((err) => console.log("issue with fetching images: " + err));
}

function saveToCache(urls) {
  fetch(urls)
    .then((res) => res.blob())
    .then((data) => {
      console.log(data);
      let blobResponse = new Response(data);
      console.log(blobResponse);
      caches.open(cacheName).then((cache) => {
        cache.put(urls, blobResponse);
      });
    })

    .catch((err) => console.log(err));
}

function getImageFromCache() {
  caches
    .open(cacheName)
    .then((cache) => {
      return cache.keys();
    })
    .then((data) => {
      data.forEach(async (item) => {
        // finding if the image exists in cache
        let response = await caches
          .open(cacheName)
          .then((cache) => cache.match(item));
        if (response) {
          // converting res to blob
          let blob = await response.blob();
          let link = URL.createObjectURL(blob);
          display(link);
        }
      });
    });
}

function display(link) {
  console.log(link);
  let image = document.createElement("img");
  image.src = link;
  image.alt = "image";
  image.height = 200;
  image.width = 300;
  document.getElementById("result").appendChild(image);
}
