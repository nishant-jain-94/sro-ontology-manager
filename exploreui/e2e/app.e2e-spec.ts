import { ExplorePage } from './app.po';

describe('explore App', () => {
  let page: ExplorePage;

  beforeEach(() => {
    page = new ExplorePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
