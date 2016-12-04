import { PwaPage } from './app.po';

describe('pwa App', function() {
  let page: PwaPage;

  beforeEach(() => {
    page = new PwaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('pwa works!');
  });
});
