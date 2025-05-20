
// Header ----------------------------------------------------------------------------------------------
const API_KEY = "QJIaF28DR5Vxw9RRodeRJujQhvYlurjKz4miNh0b";
const URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

fetch(URL)
    .then(response => response.json())
    .then(data => { document.getElementById("apod-header").style.backgroundImage = `url(${data.url})`; })
    .catch(err => console.error("Error retrieving APOD:", err));
  



// TimeLine --------------------------------------------------------------------------------------------
const events = [
    { date:   new Date(), label: 'Now'                    , details:  new Date()},
    
    { date: '2025-05-10', label: 'Partial lunar eclipse'  , details: 'During a partial lunar eclipse, only part of the moon enters Earths shadow, which may look like it is taking a "bite" out of the lunar surface.'},
    { date: '2025-06-10', label: 'Moon-Venus Conjunction' , details: 'The Moon and Venus will share the same right ascension, with the Moon passing 3°00 to the south of Venus.'},
    { date: '2025-06-20', label: 'Summer solstice'        , details: 'The summer solstice or estival solstice occurs when one of Earths poles has its maximum tilt toward the Sun.'},
    { date: '2025-07-14', label: 'Delta meteor shower'    , details: 'The Southern Delta Aquariids are a meteor shower visible from mid July to mid August each year with peak activity on 28 or 29 July'}
];
events.sort((a, b) => new Date(a.date) - new Date(b.date));


// --------------------------------------------------------
class TimelineRenderer {
  constructor(events) {
    this.container = document.getElementById('events-container');
    this.events = events;

    this.timelineStart = new Date();
    this.timelineEnd   = new Date();
    this.timelineStart.setMonth(this.timelineStart.getMonth() - 1);
    this.timelineEnd  .setMonth(this.timelineEnd  .getMonth() + 2);

    
    // randomColors = Array.from({ length: event_dates.length }, () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'));
    this.colors = ['#A53860', '#C5172E', '#71C0BB', '#F564A9', '#7F55B1', '#5409DA', '#626F47'];
    
    this.dots = []
  }

  render() {
    const event_dates = this.events.map(event => event.date);
    event_dates.push(this.timelineEnd);
    let rightPercent = 0;

    for (let i = 0; i <= this.events.length; i++) {
      const event = this.events[i];
      const eventDate = new Date(event_dates[i]);
      const positionRatio = (eventDate - this.timelineStart) / (this.timelineEnd - this.timelineStart);
      const leftPercent = positionRatio * 100;

      this.addEventLine(this.colors[i], leftPercent, rightPercent);
      rightPercent = leftPercent;

      if (i !== this.events.length) {
        const dot = this.addDot(leftPercent);
        this.addTooltip(event, eventDate, dot);
        this.dots.push(dot);
      }
    }
  }

  addEventLine(color, left, right) {
    const line = document.createElement('div');
          line.className = 'event-line';
          line.style.backgroundColor = color;
          line.style.left  = `${left - (left - right)}%`;
          line.style.width = `${left - right}%`;
    this.container.appendChild(line);
  }

  addDot(left) {
    const dot = document.createElement('div');
          dot.classList.add('event-dot');
          dot.style.left = `calc(${left}% - 8px)`;
    this.container.appendChild(dot);
    return dot;
  }

  addTooltip(event, date, dot) {
    const tooltipDate = document.createElement('div');
          tooltipDate.className = 'tooltip-date';
          tooltipDate.textContent = date.toLocaleDateString('fa-IR', { numberingSystem: 'latn' }).slice(5);

    const tooltipLine = document.createElement('div');
          tooltipLine.className = 'tooltip-line';

    const tooltipDot = document.createElement('div');
          tooltipDot.className = 'tooltip-dot';

    const tooltipTitle = document.createElement('div');
          tooltipTitle.className = 'tooltip-title';
          tooltipTitle.textContent = event.label;

    const tooltipZone = document.createElement('div');
          tooltipZone.className = 'interactive-zone';

    dot.append(tooltipDate, tooltipLine, tooltipDot, tooltipTitle, tooltipZone);
  }
}

const timeline = new TimelineRenderer(events);
timeline.render();


// --------------------------------------------------------
let selectedEvent;
timeline.dots.forEach(dot => {
  if ( dot.querySelector('.tooltip-title').innerText == 'Now' ){
    dot.classList.add('now-dot', 'active'); 
    nowDot = dot
    selectedEvent = nowDot;
  }; 

  const activate = () => {
    selectedEvent.classList.remove('active');
    selectedEvent = dot;
    selectedEvent.classList.add('active');
    
    timeline.dots.forEach(dot => { dot.classList.add('dimmed'); } );
    selectedEvent.classList.remove('dimmed');
  };

  dot.addEventListener('click',     (e) => { activate(); e.stopPropagation(); });
  dot.addEventListener('mouseenter', () => { activate(); });
  dot.addEventListener('mouseleave', () => { activate(); });

});


document.addEventListener('click', () => {
  selectedEvent.classList.remove('active');
  selectedEvent = nowDot;
  nowDot.classList.add('active');
  
  timeline.dots.forEach(dot => {{ dot.classList.remove('dimmed'); } });
  
});
