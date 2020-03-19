import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CuisineTypeComponentsPage, { CuisineTypeDeleteDialog } from './cuisine-type.page-object';
import CuisineTypeUpdatePage from './cuisine-type-update.page-object';
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

describe('CuisineType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let cuisineTypeComponentsPage: CuisineTypeComponentsPage;
  let cuisineTypeUpdatePage: CuisineTypeUpdatePage;
  let cuisineTypeDeleteDialog: CuisineTypeDeleteDialog;
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

  it('should load CuisineTypes', async () => {
    await navBarPage.getEntityPage('cuisine-type');
    cuisineTypeComponentsPage = new CuisineTypeComponentsPage();
    expect(await cuisineTypeComponentsPage.title.getText()).to.match(/Cuisine Types/);

    expect(await cuisineTypeComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([cuisineTypeComponentsPage.noRecords, cuisineTypeComponentsPage.table]);

    beforeRecordsCount = (await isVisible(cuisineTypeComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(cuisineTypeComponentsPage.table);
  });

  it('should load create CuisineType page', async () => {
    await cuisineTypeComponentsPage.createButton.click();
    cuisineTypeUpdatePage = new CuisineTypeUpdatePage();
    expect(await cuisineTypeUpdatePage.getPageTitle().getAttribute('id')).to.match(/yumzApp.cuisineType.home.createOrEditLabel/);
    await cuisineTypeUpdatePage.cancel();
  });

  it('should create and save CuisineTypes', async () => {
    await cuisineTypeComponentsPage.createButton.click();
    await cuisineTypeUpdatePage.setNameInput('name');
    expect(await cuisineTypeUpdatePage.getNameInput()).to.match(/name/);
    await waitUntilDisplayed(cuisineTypeUpdatePage.saveButton);
    await cuisineTypeUpdatePage.save();
    await waitUntilHidden(cuisineTypeUpdatePage.saveButton);
    expect(await isVisible(cuisineTypeUpdatePage.saveButton)).to.be.false;

    expect(await cuisineTypeComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(cuisineTypeComponentsPage.table);

    await waitUntilCount(cuisineTypeComponentsPage.records, beforeRecordsCount + 1);
    expect(await cuisineTypeComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last CuisineType', async () => {
    const deleteButton = cuisineTypeComponentsPage.getDeleteButton(cuisineTypeComponentsPage.records.last());
    await click(deleteButton);

    cuisineTypeDeleteDialog = new CuisineTypeDeleteDialog();
    await waitUntilDisplayed(cuisineTypeDeleteDialog.deleteModal);
    expect(await cuisineTypeDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/yumzApp.cuisineType.delete.question/);
    await cuisineTypeDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(cuisineTypeDeleteDialog.deleteModal);

    expect(await isVisible(cuisineTypeDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([cuisineTypeComponentsPage.noRecords, cuisineTypeComponentsPage.table]);

    const afterCount = (await isVisible(cuisineTypeComponentsPage.noRecords)) ? 0 : await getRecordsCount(cuisineTypeComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
