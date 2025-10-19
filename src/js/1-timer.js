import flatpickr from 'flatpickr';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
  input: document.querySelector('#datetime-picker'),
};

let userSelectedDate = null;
let timerId = null;

refs.startBtn.disabled = true;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (selected <= new Date()) {
      iziToast.show({
        title: 'Hey',
        message: 'Please choose a date in the future',
      });
      refs.startBtn.disabled = true;
      return;
    }

    userSelectedDate = selected;
    refs.startBtn.disabled = false;
  },
});

refs.startBtn.addEventListener('click', () => {
  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  timerId = setInterval(() => {
    const diff = userSelectedDate - new Date();

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerDisplay(0);
      refs.input.disabled = false;
      return;
    }

    updateTimerDisplay(diff);
  }, 1000);
});

function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  refs.daysEl.textContent = addLeadingZero(days);
  refs.hoursEl.textContent = addLeadingZero(hours);
  refs.minutesEl.textContent = addLeadingZero(minutes);
  refs.secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
