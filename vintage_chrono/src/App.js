import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function VintageChronoApp() {
  // Feature state
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState({
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });
  const [timelineYear, setTimelineYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [showBirthModal, setShowBirthModal] = useState(false);
  const [birthYear, setBirthYear] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive event listener
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Simulated fetch for events from Wikipedia
  useEffect(() => {
    setLoading(true);
    // Simulate network loading for the loading animation
    const timeout = setTimeout(() => {
      setEvents(mockEventsForDate(selectedDate));
      setLoading(false);
    }, 900);
    return () => clearTimeout(timeout);
  }, [selectedDate]);

  // Helper functions
  // PUBLIC_INTERFACE
  function handleDateChange(field, value) {
    let newDate = { ...selectedDate, [field]: value };
    // Normalize valid day (for months/days)
    const lastDay = daysInMonth(newDate.year, newDate.month);
    if (newDate.day > lastDay) newDate.day = lastDay;
    setSelectedDate(newDate);
    setTimelineYear(newDate.year);
  }

  // PUBLIC_INTERFACE
  function handleTimelineChange(e) {
    const year = parseInt(e.target.value, 10);
    setTimelineYear(year);
    setSelectedDate((prev) => ({ ...prev, year }));
  }

  // PUBLIC_INTERFACE
  function handleRandomYear() {
    const randomYear = Math.floor(Math.random() * (today.getFullYear() - 1800 + 1)) + 1800;
    setTimelineYear(randomYear);
    setSelectedDate((prev) => ({ ...prev, year: randomYear }));
  }

  // PUBLIC_INTERFACE
  function handleMyBirthYear(year) {
    setTimelineYear(Number(year));
    setSelectedDate((prev) => ({ ...prev, year: Number(year) }));
    setShowBirthModal(false);
  }

  // PUBLIC_INTERFACE
  function toggleSound() {
    setSoundOn((prev) => !prev);
    // Placeholder for sound toggle behavior
  }

  // ---- Subcomponents ----

  // PUBLIC_INTERFACE
  function VintageHeader() {
    return (
      <header className="vintage-header">
        <h1>
          <span className="vintage-dropcap">V</span>intage<span className="vintage-accent">Chrono</span>
        </h1>
        <p className="vintage-subtitle">A Journey Through Time &amp; Headlines</p>
      </header>
    );
  }

  // PUBLIC_INTERFACE
  function RotaryDatePicker() {
    return (
      <section className="rotary-date-picker" aria-label="Pick a date">
        <DateWheel
          label="Day"
          min={1}
          max={daysInMonth(selectedDate.year, selectedDate.month)}
          value={selectedDate.day}
          onChange={(val) => handleDateChange('day', val)}
        />
        <DateWheel
          label="Month"
          min={1}
          max={12}
          value={selectedDate.month}
          mapLabelsMapper={monthShortName}
          onChange={(val) => handleDateChange('month', val)}
        />
        <DateWheel
          label="Year"
          min={1800}
          max={today.getFullYear()}
          value={selectedDate.year}
          onChange={(val) => handleDateChange('year', val)}
        />
      </section>
    );
  }

  // PUBLIC_INTERFACE
  function DateWheel({ label, min, max, value, onChange, mapLabelsMapper }) {
    // Rotary/dial styled select
    const opts = [];
    for (let i = min; i <= max; ++i) {
      const display = mapLabelsMapper ? mapLabelsMapper(i) : i;
      opts.push(
        <option key={i} value={i}>
          {display}
        </option>
      );
    }
    return (
      <label className="rotary-group" aria-label={label}>
        <span className="rotary-label">{label}</span>
        <select
          className="rotary-select"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
        >
          {opts}
        </select>
      </label>
    );
  }

  // PUBLIC_INTERFACE
  function TimelineSlider() {
    return (
      <section className="timeline-slider" aria-label="Timeline slider">
        <label htmlFor="timeline-range" className="timeline-label">
          <span role="img" aria-label="pocket watch" className="timeline-emoji">⌚</span> Year
        </label>
        <input
          type="range"
          min={1800}
          max={today.getFullYear()}
          value={timelineYear}
          id="timeline-range"
          onChange={handleTimelineChange}
          className="timeline-range"
          aria-valuenow={timelineYear}
          aria-valuemin={1800}
          aria-valuemax={today.getFullYear()}
        />
        <span className="timeline-value">{timelineYear}</span>
      </section>
    );
  }

  // PUBLIC_INTERFACE
  function EventsFeed() {
    if (loading) return <LoadingAnimation />;
    if (!events.length) return (
      <div className="empty-events">
        No events for this date. Try another or hit <strong>Random Year</strong>.
      </div>
    );
    return (
      <section className="events-feed" aria-live="polite" aria-label="Historical events">
        {events.map((event, idx) => (
          <article className="event-card" key={event.title + idx} tabIndex={0}>
            <header className="event-card-header">
              <span className="event-year">{event.year}</span>
              <h3 className="event-title">{event.title}</h3>
            </header>
            <p className="event-desc">{event.description}</p>
          </article>
        ))}
      </section>
    );
  }

  // PUBLIC_INTERFACE
  function RandomYearButton() {
    return (
      <button
        className="wax-btn typewriter"
        onClick={handleRandomYear}
        aria-label="Random Year"
        tabIndex={0}
      >
        🎲 Random Year
      </button>
    );
  }

  // PUBLIC_INTERFACE
  function MyBirthYearButton() {
    return (
      <>
        <button
          className="typewriter my-birth-btn"
          onClick={() => setShowBirthModal(true)}
          aria-label="My Birth Year"
          tabIndex={0}
        >
          📜 My Birth Year
        </button>
        {showBirthModal && (
          <div className="modal-overlay" role="dialog">
            <div className="modal-content">
              <label htmlFor="birth-year-input">
                Enter your birth year:
                <input
                  id="birth-year-input"
                  type="number"
                  min="1900"
                  max={today.getFullYear()}
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                  className="modal-input"
                  aria-label="Birth Year"
                />
              </label>
              <div className="modal-actions">
                <button
                  className="wax-btn typewriter"
                  onClick={() => {
                    if (birthYear && Number(birthYear) > 1899 && Number(birthYear) <= today.getFullYear())
                      handleMyBirthYear(birthYear);
                  }}
                  aria-label="Go"
                >
                  Go
                </button>
                <button
                  className="wax-btn"
                  onClick={() => setShowBirthModal(false)}
                  aria-label="Close"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // PUBLIC_INTERFACE
  function SoundToggle() {
    return (
      <button
        className={`sound-toggle typewriter ${soundOn ? 'sound-on' : ''}`}
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Sound on" : "Sound off"}
        tabIndex={0}
      >
        <span role="img" aria-label={soundOn ? "Sound on" : "Sound off"}>
          {soundOn ? "🔊" : "🔈"}
        </span>
        <span>{soundOn ? 'Typewriter Clicks On' : 'Sound Off'}</span>
      </button>
    );
  }

  // PUBLIC_INTERFACE
  function Footer() {
    return (
      <footer className="vintage-footer">
        <SoundToggle />
        <span className="footer-credit">
          &copy; {new Date().getFullYear()} VintageChrono &middot; Styled with <span className="vintage-accent">vintage flair</span>
        </span>
      </footer>
    );
  }

  // PUBLIC_INTERFACE
  function LoadingAnimation() {
    return (
      <div className="loading-animation" aria-busy="true" aria-label="Loading events">
        <div className="quill">
          <span className="quill-feather"></span>
          <span className="quill-body"></span>
        </div>
        <span className="loading-msg">Consulting the annals of history...</span>
      </div>
    );
  }

  // LAYOUT
  return (
    <div className="vintage-app">
      <VintageHeader />
      <main className="vintage-main">
        <div className="controls-container">
          <RotaryDatePicker />
          <TimelineSlider />
          <div className="button-row">
            <RandomYearButton />
            <MyBirthYearButton />
          </div>
        </div>
        <EventsFeed />
      </main>
      <Footer />
    </div>
  );
}

// ------ Utility Functions and Data ------

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function monthShortName(num) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[num - 1];
}

// Simulated events for demo (would be API in real app)
function mockEventsForDate(date) {
  const seed = (date.year * 10000) + (date.month * 100) + date.day;
  // Return deterministic shuffled events (5-7) for same date
  const pool = [
    { year: 1945, title: "World War II Ends", description: "The Allied forces officially accept Nazi Germany's surrender, marking the end of WWII in Europe." },
    { year: 1912, title: "Titanic Sinks", description: "The RMS Titanic sinks after hitting an iceberg in the North Atlantic, with the loss of over 1,500 lives." },
    { year: 1969, title: "Man Walks on Moon", description: "Apollo 11 astronaut Neil Armstrong becomes the first person to walk on the Moon." },
    { year: 1776, title: "Declaration of Independence", description: "The US Declaration of Independence is adopted by the Second Continental Congress." },
    { year: 1989, title: "Berlin Wall Falls", description: "The fall of the Berlin Wall paves the way for German reunification." },
    { year: 2001, title: "Wikipedia Launched", description: "Wikipedia, the free online encyclopedia, goes live for the first time." },
    { year: 1954, title: "Rationing Ends in UK", description: "Nearly a decade after World War II, food rationing ends in Great Britain." },
    { year: 2008, title: "Large Hadron Collider Start", description: "CERN's mega-scientific experiment begins underground near Geneva." }
  ];
  // Deterministic shuffle
  let s = seed % pool.length;
  let n = (seed % 3) + 5; // show 5-7 events
  if (date.month === 4 && date.day === 1) return []; // April 1: no events, edge
  return Array.from({ length: n }, (_, i) => pool[(s + i) % pool.length]);
}

// --------- STYLES ---------

/*
  This block is purposely at the end of the file for simplicity and direct access during edits.
  In a real app, move custom styles to App.css or a separate vintagechronostyle.css.
*/
const customFontQuote = `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Playfair+Display:wght@700&display=swap`;

const css = `
@import url('${customFontQuote}');

.vintage-app {
  min-height: 100vh;
  background: #f5ecd9 url('https://www.transparenttextures.com/patterns/old-wall.png');
  color: #2f2f2f;
  font-family: 'Cormorant Garamond', 'Playfair Display', serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.vintage-header {
  padding: 2rem 0 1rem 0;
  text-align: center;
  background: linear-gradient(to bottom, #f6e9c4 85%, transparent);
  border-bottom: 3px double #bfa77a;
  width: 100%;
  letter-spacing: .2rem;
}
.vintage-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3.3rem;
  font-variant: small-caps;
  color: #6a4e42;
  margin: 0 0 .35rem 0;
  line-height: 1.15;
}
.vintage-dropcap {
  font-size: 4rem; color: #bfa77a; font-family: 'Cormorant Garamond', serif; vertical-align: -0.12em;
}
.vintage-accent { color: #bfa77a; letter-spacing:.08rem; }
.vintage-subtitle { color: #6a4e42; font-size: 1.2rem; font-family: inherit; text-shadow: 0 1px 0 #fff; margin-top: 0; }
.vintage-main { max-width: 940px; width: 98%; padding: 1.3rem .6rem 2.2rem .6rem; }
.controls-container {
  display: flex; flex-wrap: wrap;
  gap: 1.2rem 2rem; justify-content: space-between; align-items: flex-end;
  margin-bottom: 1.95rem;
}
.rotary-date-picker { display: flex; gap: 1.1rem; flex-wrap: wrap; align-items: flex-end; background: none; }
.rotary-group { display: flex; flex-direction: column; align-items: center; }
.rotary-label { font-size: 1.08rem; margin-bottom: .12rem; font-family: 'Playfair Display', serif; letter-spacing: .04em;}
.rotary-select {
  background: #fff6ea;
  border: 2px solid #bfa77a;
  font-size: 1.35rem;
  font-family: inherit;
  padding: .22em .32em; border-radius: 18px; margin-top: .08rem; transition: box-shadow 0.19s;
  box-shadow: 2px 4px 10px #cfc2a755;
}
.rotary-select:focus { outline: 2px solid #bfa77a; box-shadow: 0 0 0 4px #bfa77a33; }
.timeline-slider {
  display: flex; flex-direction: column; align-items: center;
  background: none; min-width: 140px;
}
.timeline-label {
  font-size: 1.04rem; color: #6a4e42; font-weight: 700; margin-bottom: .14rem;
}
.timeline-emoji { font-size: 1.22rem; margin-right:.24em; }
.timeline-range {
  width: 140px;
  accent-color: #bfa77a;
  margin-bottom: .16rem;
}
.timeline-value {
  font-size: 1.25rem;
  color: #2f2f2f;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  margin-top: -.23rem;
  background: #ece3cc;
  border-radius: 8px;
  padding: 0 .55em;
  border: 1.5px solid #bfa77a;
  letter-spacing: .04em;
}
.button-row { display: flex; gap: 1.1rem; align-items: end; flex-wrap: wrap; }
.wax-btn, .typewriter, .my-birth-btn {
  background: radial-gradient(#bfa77a 70%, #f3e7d0 100%);
  color: #322219;
  font-family: 'Playfair Display', serif;
  font-size: 1.14rem;
  border: 3px solid #6a4e42; border-radius: 22px;
  box-shadow: 2px 3px 0 0 #bfa77a44, 0 2px 9px #6a4e424d inset;
  padding: .42em 1.1em .36em 1.1em;
  margin-top: .19em;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.23s, background .13s;
  letter-spacing: .04em;
  outline: none;
}
.typewriter { box-shadow: 1px 2.5px 0 0 #8661434d, 0 1px 2px #bfa77a66 inset; }
.wax-btn:hover, .typewriter:hover { background: #bfa77a; color: #fff; box-shadow: 0 2px 13px #6a4e4283; }
.sound-toggle { margin: 0 .8em 0 0; border-radius: 13px; border: 2px solid #6a4e42; background: #ebdcc7; font-size: 0.98em; display: flex; align-items: center; gap: .55em; padding:.4em .9em; min-width: 66px; }
.sound-on { background: #bfa77a; color: #fff;}
.events-feed {
  padding: 1.05rem 0 0 0; display: flex; flex-direction: column; gap: 1.2rem;
}
.event-card {
  background: #f7f1e3 linear-gradient(120deg, #fffbe3 65%, #efe1cc 110%);
  border: 2px dashed #bfa77a; border-radius: 20px;
  box-shadow: 0 2.5px 16px #bfa77a54, 0 0px 0px #6a4e427d inset;
  padding: 1.13em 1.7em .8em 1.23em;
  margin: 0 auto;
  max-width: 730px;
  transition: box-shadow .15s, border-color .13s;
  outline: none;
}
.event-card:focus { border-color: #322219; box-shadow: 0 0 0 4px #bfa77a25;}
.event-card-header { display: flex; align-items: baseline; gap: .45em;}
.event-year {
  font-size: 1.23em; color: #6a4e42;
  font-family: 'Cormorant Garamond', serif; font-weight: bold;
  margin-right: .27em;
  min-width: 60px;
}
.event-title {
  font-family: 'Playfair Display', serif; color: #2f2f2f;
  font-size: 1.13em; margin: 0; font-weight: 600; letter-spacing: .02em;
}
.event-desc { font-size: 1.06em; color: #3e3027; margin: .34em 0 0 0;}
.empty-events { color: #866143; font-size: 1.1em; margin-top: 2.7em; text-align:center;}

.vintage-footer {
  border-top: 2.5px double #bfa77a;
  background: linear-gradient(to bottom, transparent 30%, #f6e9c4 100%);
  margin-top: auto;
  width: 100%;
  padding: 1.1em 0 .9em 0;
  font-size: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.2em;
  flex-wrap: wrap;
}
.footer-credit { color: #6a4e42; font-family: 'Cormorant Garamond', serif;}
.modal-overlay {
  position: fixed; top: 0; left:0; width: 100vw; height:100vh;
  background: rgba(233, 217, 188, 0.94) url('https://www.transparenttextures.com/patterns/old-wall.png');
  display: flex; align-items: center; justify-content: center;
  z-index: 22;
}
.modal-content {
  background: #fffbe3;
  border: 2.5px solid #bfa77a;
  border-radius: 14px;
  box-shadow: 0 2px 35px #9a927381;
  padding: 1.9em 1.6em 1.2em 1.6em;
  font-size: 1.08em;
  display: flex; flex-direction: column; gap: 0.85em; align-items: flex-start; min-width: 240px;
}
.modal-input {
  margin-left: .49em; font-size: 1.2em; border-radius: 7px; border: 1px solid #bfa77a; padding: 0.11em .31em;
  background: #f3e4c3;
}
.modal-actions { display: flex; gap: 1.15em; justify-content: flex-start; margin-top: .65em;}
.loading-animation {
  text-align: center; margin-top: 2.4em; display: flex; flex-direction: column; align-items: center;
}
.loading-msg { margin-top: 0.75em; font-style: italic; color: #6a4e42; font-size:1.13em; }
.quill { display: flex; flex-direction: row; align-items: flex-end; gap: 0.1em; margin-bottom:.13em;}
.quill-feather {
  display:inline-block; width: 38px; height: 13px; background: linear-gradient(90deg, #ecd9b9 70%, #bfa77a 100%);
  border-radius: 13px 54px 33px 8px; box-shadow: 0 2px 9px #d7ca9977;
  margin-right:-14px; margin-top:5px; transform:rotate(-12deg);
}
.quill-body {
  width: 10px; height: 34px; background: #a99872;
  border-radius: 0 0 26px 4px; box-shadow: 0 2px 8px #bba06647;
}
@media (max-width: 850px) {
  .controls-container,.vintage-main { flex-direction: column; gap: 1.25rem 0; }
  .rotary-date-picker { width: 100%; justify-content: center; }
}
@media (max-width: 600px) {
  .vintage-header h1 { font-size: 2.1rem; }
  .vintage-main { padding: .85rem 0.12rem; }
  .controls-container { gap: .96rem 0.77rem;}
  .events-feed { padding: 0.4rem 0 0 0;}
  .event-card { padding: .95em .5em .44em .55em; }
}
`;

(function injectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('vintagechronostyle')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'vintagechronostyle';
    styleTag.innerHTML = css;
    document.head.appendChild(styleTag);
  }
})();

export default VintageChronoApp;
