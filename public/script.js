document.getElementById('year').textContent = new Date().getFullYear();

const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'grid' ? 'none' : 'grid';
  });
}

const like = document.getElementById('likeBook');
const count = document.getElementById('likeCount');
let bookInterested = false;

function paintBookInterest() {
  if (!like || !count) return;
  like.classList.toggle('liked', bookInterested);
  like.querySelector('span').textContent = bookInterested ? 'Цікавить книга' : 'Хочу книгу';
  count.textContent = bookInterested ? '✓' : '';
}
paintBookInterest();

if (like) {
  like.addEventListener('click', () => {
    bookInterested = !bookInterested;
    paintBookInterest();
    if (bookInterested) {
      const input = document.querySelector('form[data-kind="book"] input[type="email"]');
      if (input) input.focus();
    }
  });
}

document.querySelectorAll('.signup').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"], button:not([type])');
    const status = form.querySelector('.status');
    const email = input?.value.trim() || '';
    const interest = form.dataset.kind === 'book' ? 'paper_book' : 'updates';

    if (!email) return;

    if (button) button.disabled = true;
    if (status) {
      status.textContent = 'Зберігаємо…';
      status.classList.remove('error');
    }

    try {
      const response = await fetch('/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, interest })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Не вдалося зберегти email.');
      }

      if (status) {
        status.textContent = data.duplicate
          ? 'Цей email уже є у списку.'
          : (interest === 'paper_book'
              ? 'Дякую. Інтерес до паперової книги збережено.'
              : 'Дякую. Email збережено.');
      }

      form.reset();

      if (interest === 'paper_book') {
        bookInterested = true;
        paintBookInterest();
      }
    } catch (error) {
      if (status) {
        status.textContent = 'Не вдалося зберегти email. Спробуйте ще раз.';
        status.classList.add('error');
      }
    } finally {
      if (button) button.disabled = false;
    }
  });
});
