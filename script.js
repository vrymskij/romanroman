document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>nav.style.display=nav.style.display==='flex'?'none':'flex');

const like=document.getElementById('likeBook'), count=document.getElementById('likeCount');
let liked=localStorage.getItem('bookLiked')==='1';
function paint(){like.classList.toggle('liked',liked);like.querySelector('span').textContent=liked?'Цікавить книга':'Хочу книгу';count.textContent=liked?'✓':'0'}
paint();
like.addEventListener('click',()=>{liked=!liked;localStorage.setItem('bookLiked',liked?'1':'0');paint()});

document.querySelectorAll('.signup').forEach(form=>form.addEventListener('submit',e=>{
 e.preventDefault(); const email=form.email.value.trim(), kind=form.dataset.kind;
 /* DEMO ONLY. Replace this handler with Formspree/Buttondown/Mailchimp/etc.
    to actually receive subscriber addresses on a static GitHub Pages site. */
 localStorage.setItem('poetry-'+kind+'-email',email);
 form.querySelector('.status').textContent='Дякую. Email збережено в демо-режимі.';
 form.reset();
}));
