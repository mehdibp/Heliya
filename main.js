
// Header ----------------------------------------------------------------------------------------------
const API_KEY = "QJIaF28DR5Vxw9RRodeRJujQhvYlurjKz4miNh0b";
const URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
// {
//     "copyright": "\nMarzena Rogozinska\n",
//     "date": "2025-05-20",
//     "explanation": "Have you ever seen the band of our Milky Way Galaxy?  In a clear sky from a dark location at the right time, a faint band of light becomes visible across the sky.  Soon after your eyes become dark adapted, you might spot the band for the first time.  It may then become obvious.  Then spectacular.  One reason for your growing astonishment might be the realization that this fuzzy swath, the Milky Way, contains billions of stars.  Visible in the featured image, high above in the night sky, the band of the Milky Way Galaxy arcs.  Also visible are the colorful clouds of Rho Ophiuchi on the right, and the red and circular Zeta Ophiuchi nebula near the top center. Taken in late February from Maunakea, Hawaii, USA, the foreground telescope is the University of Hawaii's 2.2-Meter Telescope. Fortunately, you don\u2019t need to be near the top of a Hawaiian volcano to see the Milky Way.    Put it All Together: Astronomy Puzzle of the Day",
//     "hdurl": "https://apod.nasa.gov/apod/image/2505/MaunaKeaNight_Rogozinska_1295.jpg",
//     "media_type": "image",
//     "service_version": "v1",
//     "title": "Milky Way over Maunakea",
//     "url": "https://apod.nasa.gov/apod/image/2505/MaunaKeaNight_Rogozinska_960.jpg"
// }

fetch(URL)
    .then(response => response.json())
    .then(data => { document.getElementById("apod-header").style.backgroundImage = `url(${data.url})`; })
    .catch(err => console.error("Error retrieving APOD:", err));
  



// TimeLine --------------------------------------------------------------------------------------------

// ----------------------------------------------------------
class TimelineRenderer {
  constructor(events) {
    this.container = document.getElementById('events-container');

    this.timelineStart = new Date();
    this.timelineEnd   = new Date();
    this.timelineStart.setMonth(this.timelineStart.getMonth() - 1);
    this.timelineEnd  .setMonth(this.timelineEnd  .getMonth() + 2);

    this.events = []
    for(let i=0; i<events.length; i++){
      const eventDate = new Date(events[i].date);
      if (this.timelineStart < eventDate && eventDate < this.timelineEnd) this.events.push(events[i]);
    }

    // For when the event happens today
    const today = this.events.find(event => event.label === 'Now').date;
    const todayStr = today.toISOString().split('T')[0]
    if (this.events.some(event => event.date == todayStr)) {
      this.events     = this.events.filter(event => event.label !== 'Now')
      this.TodayEvent = this.events.find  (event => event.label !== 'Now' && event.date === todayStr);
    } else this.TodayEvent = { label: 'Now' };


    // this.colors = Array.from({ length: this.events.length }, () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'));
    this.colors = ['#FCEFCA', '#FF9B45', '#CF0F47', '#A53860', '#7F55B1', '#5459AC', '#626F47', '#A0C878'];
    this.colors = [...this.colors, ...this.colors, ...this.colors];


    this.selectedEvent = null;
    this.dots = []
  }

  // --------------------------------------------------------
  render() {
    const event_dates = this.events.map(event => event.date);
    event_dates.push(this.timelineEnd);
    let rightPercent = 0;

    for (let i=0; i <= this.events.length; i++) {
      const event = this.events[i];
      const eventDate = new Date(event_dates[i]);
      const positionRatio = (eventDate - this.timelineStart) / (this.timelineEnd - this.timelineStart);
      const leftPercent = positionRatio * 100;

      this.addEventLine(this.colors[i], leftPercent, rightPercent);
      rightPercent = leftPercent;

      if (i !== this.events.length) {
        const dot = this.addDot(leftPercent);
        this.addTooltip(event, eventDate, dot);
        this.initialLayoutConditions(dot);

        this.dots.push(dot);

        this.addListeners(dot, i);
      }
    }

    // Construction indicating the time "now"
    this.dots.forEach((dot, i) =>{
      const title = dot.querySelector('.tooltip-title');
      if (title.textContent === 'Now' || title.textContent === this.TodayEvent.label) {
        dot.classList.add('now-dot', 'active');
        this.selectedEvent = dot;
        this.activeDotConditions(i);
      }
    });

  }

  // --------------------------------------------------------
  addEventLine(color, left, right) {
    const line = document.createElement('div');
          line.className = 'event-line';
          line.style.backgroundColor = color;
          line.style.left  = `${left - (left - right)}%`;
          line.style.width = `${left - right}%`;
    this.container.appendChild(line);
  }

  // --------------------------------------------------------
  addDot(left) {
    const dot = document.createElement('div');
          dot.classList.add('event-dot');
          dot.style.left = `calc(${left}% - 8px)`;
    this.container.appendChild(dot);
    return dot;
  }

  // --------------------------------------------------------
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

    const tooltipDetail = document.createElement('div');
          tooltipDetail.className = 'tooltip-detail';
          tooltipDetail.textContent = event.details;
          tooltipDetail.style.width = '120px'
          
    const tooltipZone = document.createElement('div');
          tooltipZone.className = 'interactive-zone';
          
    dot.append(tooltipDate, tooltipLine, tooltipDot, tooltipTitle, tooltipDetail, tooltipZone);
  }

  // --------------------------------------------------------
  initialLayoutConditions(dot) {
    const tooltipTitle  = dot.querySelector('.tooltip-title');
    const tooltipDetail = dot.querySelector('.tooltip-detail');

    if (tooltipTitle.clientWidth > 100) tooltipDetail.style.width = `${tooltipTitle.clientWidth - 20}px`;
    if (dot.getBoundingClientRect().x + tooltipTitle.clientWidth + 8 > window.innerWidth) {
      tooltipTitle.style.left  = `${-tooltipTitle.clientWidth + 8}px`;
      tooltipDetail.style.left = `${-tooltipTitle.clientWidth + 8}px`;
    }
    // if (this.dots.length > 1){
    //   const tooltipDate_ = this.dots[this.dots.length-2].querySelector('.tooltip-date' )
    //   const left  = tooltipDate. getBoundingClientRect().left
    //   const right = tooltipDate_.getBoundingClientRect().right
    //   if (right > left) {
    //     tooltipDate_.style.left = `${-(right - left)/3}px`;
    //     tooltipDate .style.left = `${+(right - left)/3}px`;
    //     tooltipDate .style.top  = `${+20}px`;
    //   }
    // }
  }


  // --------------------------------------------------------
  activateDot(dot, index) {
    if (this.selectedEvent) this.selectedEvent.classList.remove('active');
    this.selectedEvent = dot;
    dot.classList.add('active');

    // Reset others
    this.dots.forEach(d => {
      d.classList.add('dimmed');
      const tDate = d.querySelector('.tooltip-date');
      tDate.style.removeProperty('top');
      tDate.style.removeProperty('left');
      tDate.style.removeProperty('visibility');
    });

    dot.classList.remove('dimmed');
    this.activeDotConditions(index);
  }

  // --------------------------------------------------------
  activeDotConditions(selectedIndex) {
    const selectedTooltip = this.dots[selectedIndex].querySelector('.tooltip-date' );
    const selectedTitle   = this.dots[selectedIndex].querySelector('.tooltip-title');
    const rectDate  = selectedTooltip.getBoundingClientRect();
    const rectTitle = selectedTitle  .getBoundingClientRect();

    if (rectTitle.x + 50 < rectDate.x) selectedTooltip.style.left = `${-selectedTooltip.clientWidth + 16}px`;

    const left  = rectDate.left;
    const right = rectDate.right;

    this.dots.forEach((dot, i) => {
      // if (i === selectedIndex) return;
      const tooltipDate_ = dot.querySelector('.tooltip-date')

      if (i > selectedIndex && right > tooltipDate_.getBoundingClientRect().left ) tooltipDate_.style.visibility = 'hidden';
      if (i < selectedIndex && left  < tooltipDate_.getBoundingClientRect().right) tooltipDate_.style.visibility = 'hidden';
    });

    for (let i=0; i < this.dots.length-1; i++) {
      if (i != selectedIndex && i+1 != selectedIndex) {
        const right = this.dots[i] .querySelector('.tooltip-date').getBoundingClientRect().right;
        const left = this.dots[i+1].querySelector('.tooltip-date').getBoundingClientRect().left;
        if (right > left) {
          this.dots[i+1].querySelector('.tooltip-date').style.top = '40px';
          i++;             // skip next
        }
      }
    }
    
  }

  // --------------------------------------------------------
  addListeners(dot, index) {
    const zone = dot.querySelector('.interactive-zone');
    const activate = () => { this.activateDot(dot, index); };

    // Event listeners
    zone.addEventListener('click',     (e) => { activate(); e.stopPropagation(); });
    zone.addEventListener('mouseenter', () => { activate(); });
    zone.addEventListener('mouseleave', () => { activate(); });
  }

}


// ----------------------------------------------------------
const events = [ { date: new Date(), label: 'Now', details: new Date()} ];
fetch('./Sky Events.json')
    .then(res => res.json())
    .then(datas => { 
      for (const data of datas) events.push(data)

      events.sort((a, b) => new Date(a.date) - new Date(b.date));


      const timeline = new TimelineRenderer(events);
      timeline.render();
      });





// document.addEventListener('click', (e) => {
//   if (e.target.closest('.event-dot')) return;
//   selectedEvent.classList.remove('active');
//   selectedEvent = nowDot;
//   nowDot.classList.add('active');
//   dots.forEach(dot => {{ dot.classList.remove('dimmed'); } });
// });


