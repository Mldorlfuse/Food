import { showModal } from "./modal";
import { hideModal } from "./modal";

function forms() {
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
};

export default forms;