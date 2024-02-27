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
        if (document.documentElement.scrollTop >= '1000') {
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
        constructor(img,title,text,price) {
            this.img = img;
            this.title = title;
            this.text = text;
            this.price = price;
        }

        createMenuItem() {
            const newDiv = document.createElement('div');
            newDiv.classList.add('menu__item');
            newDiv.innerHTML = `
                <img src="img/tabs/${this.img}.jpg" alt="${this.img}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.text}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `
            document.querySelector('.menu__field .container').append(newDiv)
        }
    }

    const vegy = new MenuCard('vegy',
                          'Меню "Фитнес"',
                          'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
                          229);
    const elite = new MenuCard('elite',
                           'Меню “Премиум”',
                           'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
                           550);
    const post = new MenuCard('post',
                          'Меню "Постное"',
                          'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
                          430);

    vegy.createMenuItem();
    elite.createMenuItem();
    post.createMenuItem();
});