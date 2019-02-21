const UIContrl = (() => {
  let domStr = {
    form: document.querySelector("form"),
    body: document.querySelector("body"),
    cont: document.querySelector("#movies"),
    input: document.querySelector('input'),
    year: document.querySelector(".date__year"),
  };

  return {
    getDomStr: () => domStr,
    getInputVal: () => domStr.input.value,
    clearInput: () => {
      domStr.input.value = '';
    },
    showLoader: () => {
      let loader = `<img id="loading" src="images/loading.gif" width="50" height="50">`;
      domStr.cont.innerHTML = loader;
    },
    removeLoader: () => {
      domStr.cont.innerHTML = '';
    },
    display: function (data) {
      this.removeLoader();
      // If there is no movie
      if (data.movie_count == 0) {
        let para = document.createElement("p");
        para.innerHTML =
          "<b>Sorry, We didn't found any thing<br>Check the spelling or try someghing else.</b>";
        cont.appendChild(para);
      } else {
        data.movies.forEach((movie, x) => {
          //appending rows to #movies
          let genre = "";

          if (movie.genres) {
            movie.genres.forEach((g, i) => {
              i === movie.genres.length - 1 ? genre += `${g}` : genre += `${g}, `;
            });
          }
          let hour = Math.floor(movie.runtime / 60);
          let min = movie.runtime % 60;
          let rows = `<div class="movie__box" id="row-${x}">
                        <img class="poster" src="${movie.medium_cover_image}">
                        <div id="info">
                            <h4>${movie.title} (${movie.year})</h4>
                            <span class="clearFix text-success"><strong>Genre: </strong>${genre}</span>
                            <span class="text-success clearFix"><strong>IMDb: </strong>${
                              movie.rating
                            }</span>
                            <span class="text-success clearFix"><strong>Run Time: </strong>${hour}h ${min}m</span>
                        </div>
                    </div>
                    `;
          domStr.cont.insertAdjacentHTML("beforeend", rows);
        });
      }
    },
    hideDownload: () => {
      let box = document.querySelector(".down__con");
      box.parentElement.removeChild(box);
    },
    disDownload: (data) => {
      let y = data.torrents.length;
      let summary =
        data.summary
        .split(" ")
        .slice(0, 30)
        .join(" ") + " ...";

      let mag7 = `magnet:?xt=urn:btih:${data.torrents[y - 2].hash}&dn=${encodeURI(data.title)}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80`;

      let mag8 = `magnet:?xt=urn:btih:${data.torrents[y - 1].hash}&dn=${encodeURI(data.title)}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80`;

      box = `
              <div class="down__con close__able">
                  <div class='down row text-center' id='box'>
                      <span class="col-12" id="h3">${data.title}</span>
                      <div class="col-6 ver">
                          <h4>720p</h4>
                          <a href='${mag7}' class='close__able'><span class="fa fa-magnet close__able"></span></a>
                          <a href='${data.torrents[y - 2].url}' class='close__able'>
                              <span  class="fa fa-download close__able"></span>
                          </a>
                          <span class="size">Size: ${data.torrents[y - 2].size}
                          </span>
                      </div>
                      <div class="col-6">
                          <h4>1080p</h4>
                          <a href='${mag8}' class='close__able'><span class="fa fa-magnet close__able"> </span></a>
                          <a href='${data.torrents[y - 1].url}' class='close__able'>
                              <span  class="fa fa-download close__able"></span>
                          </a>
                          <span class="size">Size: ${data.torrents[y - 1].size}
                          </span>
                          </div>
                      <p class="col-12">${summary}</p>
                      <span id="close" class="fa fa-close close__able"></span>
                  </div>
              </div>
          `;
      domStr.body.insertAdjacentHTML("afterbegin", box);
    }
  };
})();

const movieContrl = (() => {
  return {
    search: async (url) => {
      let res = await fetch(url);
      let data = await res.json();
      return data.data;
    }
  };
})();

const controller = ((UIC, MC) => {
  const addEvents = (data) => {
    let movie__boxes = document.querySelectorAll(".movie__box");
    movie__boxes = Array.from(movie__boxes);
    movie__boxes.forEach((movie, i) => {
      movie.addEventListener("click", () => {
        UIC.disDownload(data[i]);
      });
    });
  }

  const setupEventListener = (() => {
    const DOM = UIC.getDomStr();

    const displayRes = async (url) => {
      UIC.showLoader();
      const data = await MC.search(url);
      UIC.display(data);
      addEvents(data.movies);
    }

    // Display movie on form submit
    DOM.form.addEventListener("submit", function (event) {
      event.preventDefault();
      let val = UIC.getInputVal();
      if (val) {
        let url = "https://yts.am/api/v2/list_movies.json?query_term=" + val;
        displayRes(url);
      }
      UIC.clearInput();
    });

    // Show movies on load
    // Making date Year in UI dynamic
    window.addEventListener("load", () => {
      let d = new Date();
      DOM.year.textContent = d.getFullYear();
      let url = "https://yts.am/api/v2/list_movies.json";
      displayRes(url);
    });

    // hide download container/div
    DOM.body.addEventListener("click", e => {
      let closeAble = e.target.classList.contains("close__able");
      if (closeAble) {
        UIC.hideDownload();
      }
    });

  })();
})(UIContrl, movieContrl);