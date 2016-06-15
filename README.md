## USAGE

```js

   var img = document.createElement("img");
   
   img.src = "image.jpg";

   is_image_light({

        img: img, // required
        next: (boolean) => {}, // required

        // CSS box to crop
        top: 0,
        left: "0.0%",
        bottom: 0,
        right: "0px",

        // between 0 and 1
        downsample: 0.1,
        threshold: 0.555
   });

```