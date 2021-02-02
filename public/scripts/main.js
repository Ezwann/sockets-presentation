var currentBtn = undefined;

const swiperHorz = new Swiper('.swiper-h-container', {
    direction: 'horizontal',
    loop: false,
    pagination: {
        el: '.swiper-h-pagination'
    },
    navigation: {
        nextEl: '.swiper-button-h-next',
        prevEl: '.swiper-button-h-prev'
    },
    allowTouchMove: false,
    on: {
        init: () => {
            socket = io();
            currentBtn = document.getElementById("goToCurrent");
            currentBtn.dataset["index"] = 0;
        }
    }
});

const swiperVert = new Swiper('.swiper-v-container', {
    direction: 'vertical',
    loop: false,
    pagination: {
        el: '.swiper-v-pagination'
    },
    // navigation: {
    //     nextEl: '.swiper-button-v-next',
    //     prevEl: '.swiper-button-v-prev'
    // }
});

swiperHorz.on('slideChangeTransitionEnd', () => {
    console.log('swiperHorz changed');
    var slideChanged = document.querySelector('.swiper-h-container > .swiper-wrapper > .swiper-slide-active');
    var label = slideChanged.getAttribute("aria-label")
    socket.emit("slideChange", { label });
    var index = +(label.split(' / ').shift()) - 1;
    currentBtn.dataset["sync"] = index==currentBtn.dataset['index'].toString();
});
socket.on("change", (index) =>{
    var activeVerticalSlide = document.querySelector(".swiper-slide-active .swiper-v-container .swiper-slide-active")
    var activeVerticalSlideIndex = +(activeVerticalSlide.getAttribute("aria-label").split(" / ").shift()) - 1;
    currentBtn.dataset["index"] = index;
    if(activeVerticalSlideIndex == 0) {
        swiperHorz.slideTo(index);
        currentBtn.dataset["sync"] = true;
    } else {
        currentBtn.dataset["sync"] = false;
    }
})


currentBtn.addEventListener("click",(e)=>goToCurrent(e));
function goToCurrent(e) {
    swiperHorz.slideTo(currentBtn.dataset["index"]);
    // swiperVert.slideTo(0);
    currentBtn.dataset["sync"] = true;
}