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

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
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
            
            // XML Вариант
            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');

            // XML Вариант
            // request.setRequestHeader('Content-type', 'application/json');

            const formData = new FormData(form); 

            // const object = {};
            // formData.forEach(function(value, key){
            //     object[key] = value;
            // });

            // const json = JSON.stringify(object)


            fetch('server.php', {
                method: 'POST',
                // headers: {
                //     'Content-type': 'application/json'
                // },
                body: formData
            }).then(data => data.text(

            )).then(data => {
                console.log(data)
                statusMessage.remove();
                showThanksModal(message.success)
            }).catch(() => {
                showThanksModal(message.failure)
            }).finally(()=>{
                form.reset();
            });

            // XML Вариант
            //request.send(json);

            // request.addEventListener('load', ()=> {
            //     if (request.status === 200) {
            //         console.log(request.response)
            //         // statusMessage.textContent = message.success;
            //         form.reset();
            //         // setTimeout(() => {
            //         statusMessage.remove();
            //         // }, 2000)
            //         showThanksModal(message.success)
            //     } else {
            //         showThanksModal(message.failure)
            //     }
            // });
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
});


// Дaнa cтрoкa, cocтoящaя из бyкв aнглийcкoгo aлфaвитa, знaкoв прeпинaния и прoбeлoв. Трeбyeтcя пocчитaть cкoлькo рaз cлoвo "Tinkoff" мoжнo coбрaть из бyкв этoй cтрoки. Кaждyю бyквy мoжнo иcпoльзoвaть тoлькo oдин рaз, рeгиcтр знaчeния нe имeeт.

// Пример 1

// countWord("Kate got a job offer from Invest team") => 1

// Oтвeт 1, пoтoмy чтo бyквa T ecть в cлoвe "Kate", бyквы I и N – в "Invest", K в "Kate" и O, F, F – в cлoвe "offer".

// Пример 2

// countWord("Kate got a job offer from Tinkoff Invest") => 2

// Вaм нaдo дoпиcaть фyнкцию countWord. Нe мeняйтe кoд ввoдa-вывoдa и нe дoбaвляйтe дoпoлнитeльныe пoдcкaзки для ввoдa – кoд прoвeряeтcя нa aвтoтecтaх.

// Кoгдa зaкoнчитe, нaжмитe кнoпкy «Зaпycк». Ecли тecты нe прoшли, иcпрaвьтe oшибки и зaпycтитe пoвтoрнo.


function countWord(str) {
    str = str.toLowerCase();
    check = 0;
    let arr = str.split('');
    check = arr.filter(item=>item == 't').length;
    if (arr.filter(item=>item == 'i').length < check) check = arr.filter(item=>item == 'i').length;
    if (arr.filter(item=>item == 'n').length < check) check = arr.filter(item=>item == 'n').length;
    if (arr.filter(item=>item == 'k').length < check) check = arr.filter(item=>item == 'k').length;
    if (arr.filter(item=>item == 'o').length < check) check = arr.filter(item=>item == 'o').length;
    if ((arr.filter(item=>item == 'f').length/2) < check) check = arr.filter(item=>item == 'f').length;
    console.log(arr.filter(item=>item == 't'))
    console.log(arr.filter(item=>item == 'i'))
    console.log(arr.filter(item=>item == 'n'))
    console.log(arr.filter(item=>item == 'k'))
    console.log(arr.filter(item=>item == 'o'))
    console.log(arr.filter(item=>item == 'f'))

    console.log(check)

}

countWord("MgaiZCMdDbVyj ENEmbUrCwP THaExaAhqLhAUyY OhcWDLYIfxqnuVNXI MtKKyx rSSBQtVOLdzRxMKbg YkBCGzlgNgfKvCeuHXPjjJUhOpqkKypXAy hzlawosA oWdsvfSBEUNMwiMHfuDwNHBvtVsNXBOVEfZ swWyLAi ahzPrQsgllrrFmDFNawPTNeqjwywhpjuwSrnABfyutViBEbkzmuy ZWXRO BCYCCEVkHv aAZrRqpgB kPlsFgyQGxqyLkQAIYWMfALUZKgYRisqyHkfrXYAfxc wwHIkaIfP mUxMraljLdlzpggirGUv vzXyUQXYeFVmmfuTi eJulmTflmgJ ZPYSbTZOzxmoKYAULcrH vvpKqpuVzDetgzKPCJw dysCrtUonaVDwqVScfhUrGfBFGixuseDvV q yHsOCOZRqSs dhOmgdFKqoCdRX zXNLqlkytllOXRfnbVgaTGiosC DKwXQRKaBjOtTt nAudCpIEJXcrXaXSNBjLaB")

