import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import SearchPreferencesComponentsPage, { SearchPreferencesDeleteDialog } from './search-preferences.page-object';
import SearchPreferencesUpdatePage from './search-preferences-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../util/utils';

const expect = chai.expect;

describe('SearchPreferences e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let searchPreferencesComponentsPage: SearchPreferencesComponentsPage;
  let searchPreferencesUpdatePage: SearchPreferencesUpdatePage;
  let searchPreferencesDeleteDialog: SearchPreferencesDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load SearchPreferences', async () => {
    await navBarPage.getEntityPage('search-preferences');
    searchPreferencesComponentsPage = new SearchPreferencesComponentsPage();
    expect(await searchPreferencesComponentsPage.title.getText()).to.match(/Search Preferences/);

    expect(await searchPreferencesComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([searchPreferencesComponentsPage.noRecords, searchPreferencesComponentsPage.table]);

    beforeRecordsCount = (await isVisible(searchPreferencesComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(searchPreferencesComponentsPage.table);
  });

  it('should load create SearchPreferences page', async () => {
    await searchPreferencesComponentsPage.createButton.click();
    searchPreferencesUpdatePage = new SearchPreferencesUpdatePage();
    expect(await searchPreferencesUpdatePage.getPageTitle().getAttribute('id')).to.match(
      /yumzApp.searchPreferences.home.createOrEditLabel/
    );
    await searchPreferencesUpdatePage.cancel();
  });

  it('should create and save SearchPreferences', async () => {
    await searchPreferencesComponentsPage.createButton.click();
    await searchPreferencesUpdatePage.setFoodInput('5');
    expect(await searchPreferencesUpdatePage.getFoodInput()).to.eq('5');
    await searchPreferencesUpdatePage.setHospitalityInput('5');
    expect(await searchPreferencesUpdatePage.getHospitalityInput()).to.eq('5');
    await searchPreferencesUpdatePage.setAtmosphereInput('5');
    expect(await searchPreferencesUpdatePage.getAtmosphereInput()).to.eq('5');
    await searchPreferencesUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(searchPreferencesUpdatePage.saveButton);
    await searchPreferencesUpdatePage.save();
    await waitUntilHidden(searchPreferencesUpdatePage.saveButton);
    expect(await isVisible(searchPreferencesUpdatePage.saveButton)).to.be.false;

    expect(await searchPreferencesComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(searchPreferencesComponentsPage.table);

    await waitUntilCount(searchPreferencesComponentsPage.records, beforeRecordsCount + 1);
    expect(await searchPreferencesComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last SearchPreferences', async () => {
    const deleteButton = searchPreferencesComponentsPage.getDeleteButton(searchPreferencesComponentsPage.records.last());
    await click(deleteButton);

    searchPreferencesDeleteDialog = new SearchPreferencesDeleteDialog();
    await waitUntilDisplayed(searchPreferencesDeleteDialog.deleteModal);
    expect(await searchPreferencesDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/yumzApp.searchPreferences.delete.question/);
    await searchPreferencesDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(searchPreferencesDeleteDialog.deleteModal);

    expect(await isVisible(searchPreferencesDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([searchPreferencesComponentsPage.noRecords, searchPreferencesComponentsPage.table]);

    const afterCount = (await isVisible(searchPreferencesComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(searchPreferencesComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
