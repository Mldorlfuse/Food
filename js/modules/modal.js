function showModal() {
    document.querySelector('.modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimer);
};

function hideModal(){
    document.querySelector('.modal').style.display = 'none';
    document.body.style.overflow = 'auto';
};

const modalTimer = setTimeout(function() {
    showModal();
}, 3000)

function modal() {

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
};

export default modal;
export {showModal};
export {hideModal};