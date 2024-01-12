
const btn = document.querySelector('.c-btn');
const btnCount = document.querySelector('.btn-count')

btn.addEventListener('click',()=>{
    btnCount.classList.toggle('active')
    console.log('test')
})
