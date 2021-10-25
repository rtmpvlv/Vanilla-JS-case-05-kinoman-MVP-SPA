const createFilmsListTemplate = () => (
  `
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

    <div class="films-list__container">
    </div>

    <button class="films-list__show-more">Show more</button>
  </section>
`
);

export default createFilmsListTemplate;
