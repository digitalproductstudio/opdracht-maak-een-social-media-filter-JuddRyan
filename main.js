document.addEventListener("DOMContentLoaded", () => {
    carouselMenu = document.querySelector(".model_selector");

    document.querySelector("#carousel_menu").addEventListener("click", function() {
      carouselMenu.classList.toggle("hidden");
    });

    glassesList = document.querySelectorAll(".model_item");
    glassesList.forEach(e => {
      const selectedModel = "";
     
      e.addEventListener("click", () => {
        // select all <a-gltf-model> and set visibility to false
        const list = document.querySelectorAll(".gtlf_model");
        list.forEach(element => {
          element.setAttribute("visible", false);
          console.log(element);
        });

        // select model and set visibility to true
        glassesModel = document.querySelector(`#glasses${e.dataset.value}`);
        glassesModel.setAttribute("visible", true);

        selectedModel = e.dataset.value;
      })
    });
    
    // Screenshot functionality
    document.getElementById("capture").addEventListener("click", function () {
      let scene = document.querySelector("a-scene");
      let video = document.querySelector("video");
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the webcam feed first (flip it to match AR scene)
      ctx.save();
      ctx.scale(-1, 1); // Mirror effect
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      // Ensure the WebGL buffer is preserved
      scene.renderer.preserveDrawingBuffer = true;

      // Sync rendering to avoid misalignment
      requestAnimationFrame(() => {
        let arCanvas = scene.renderer.domElement;
        ctx.drawImage(arCanvas, 0, 0, canvas.width, canvas.height);

        // get Readable time for image name
        function getReadableTimestamp() {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
          const day = String(now.getDate()).padStart(2, '0');
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          
          // Format as "YYYY-MM-DD_HH-MM-SS" for easy filename use
          return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        }

        // Download the final merged image
        let imgData = canvas.toDataURL("image/png");
        let downloadLink = document.createElement("a");
        downloadLink.href = imgData;
        downloadLink.download = `AR_Snapshot-${getReadableTimestamp()}.png`;
        downloadLink.click();
      });
    });
  })