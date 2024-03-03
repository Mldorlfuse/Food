'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        })

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent()
    showTabContent()

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    });

    // Timer

    const deadline = '2024-09-01'

    function getTimeRemaining(endtime){
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60)

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`
        } else return num
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime)

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) clearInterval(timeInterval);
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTimer = setTimeout(function() {
        showModal();
    }, 3000)

    function showModal() {
        document.querySelector('.modal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimer);
    };

    function hideModal(){
        document.querySelector('.modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    function showModalByScroll() {
        if (document.documentElement.scrollTop >= '3000') {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
            clearInterval(modalTimer);
        };
    };

    document.querySelectorAll('[data-modal]').forEach(e => {
        e.addEventListener('click', ()=> {
            showModal();
        });
    });

    document.querySelector('.modal__close').addEventListener('click', () =>{
        hideModal();
    });

    document.querySelector('.modal').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.modal')) hideModal();
    });

    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.modal').style.display === 'block' && e.code === 'Escape') hideModal();
    })

    window.addEventListener('scroll', showModalByScroll);

    // Cards

    class MenuCard {
        constructor(img,alt,title,text,price) {
            this.img = img;
            this.alt = alt;
            this.title = title;
            this.text = text;
            this.price = price;
        }

        createMenuItem() {
            const newDiv = document.createElement('div');
            newDiv.classList.add('menu__item');
            newDiv.innerHTML = `
                <img src="${this.img}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.text}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> $/день</div>
                </div>
            `
            document.querySelector('.menu__field .container').append(newDiv)
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price).createMenuItem();
            })
        })

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'applicatuin/json'
            },
            body: data
        });

        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.innerHTML = `
                <img src="./spinner.svg" alt="Loading">
                <p>${message.loading}</p>
            `;
            form.append(statusMessage);
            document.querySelector('.status').style.cssText = 'display: flex; justify-content: center;align-items: center; margin-top: 10px';
            
            const formData = new FormData(form); 

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data)
                statusMessage.remove();
                showThanksModal(message.success)
            }).catch(() => {
                showThanksModal(message.failure)
            }).finally(()=>{
                form.reset();
            });
        });
    };

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.style.display = 'none';
        showModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class='modal__content'>
                <div class="modal__close">
                    &times;
                </div>
                <div class="modal__title">
                    ${message}
                </div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        document.querySelectorAll('.modal__close')[1].addEventListener('click', () =>{
            hideModal();
            thanksModal.remove();
            prevModalDialog.style.display = 'block'
            clearInterval(autoCloseModal);
        });
        document.querySelector('.modal').addEventListener('click', (e) => {
            if (e.target === document.querySelector('.modal')) {
                hideModal();
                thanksModal.remove();
                prevModalDialog.style.display = 'block'
                clearInterval(autoCloseModal);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (document.querySelector('.modal').style.display === 'block' && e.code === 'Escape') {
                hideModal();
                thanksModal.remove();
                prevModalDialog.style.display = 'block'
                clearInterval(autoCloseModal);
            }
        })

        const autoCloseModal = setTimeout(function(){
            hideModal();
            thanksModal.remove();
            prevModalDialog.style.display = 'block'
        }, 5000);
    }


    // Slider

    let currentSlide = 3;

    function slideMove(n) {
        if (n > 4) currentSlide = 1;
        if (n < 1) currentSlide = 4;
        document.querySelector('#current').textContent = `0${currentSlide}`;
        document.querySelector('.offer__slide').querySelector('img').src = `img/slider/slide-${currentSlide}.jpg`
    }

    document.querySelector('.offer__slider-next').addEventListener('click', ()=>{
        slideMove(++currentSlide);
    });

    document.querySelector('.offer__slider-prev').addEventListener('click', ()=>{
        slideMove(--currentSlide);
    });

});


