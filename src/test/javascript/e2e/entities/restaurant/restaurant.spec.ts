import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import RestaurantComponentsPage, { RestaurantDeleteDialog } from './restaurant.page-object';
import RestaurantUpdatePage from './restaurant-update.page-object';
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

describe('Restaurant e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let restaurantComponentsPage: RestaurantComponentsPage;
  let restaurantUpdatePage: RestaurantUpdatePage;
  let restaurantDeleteDialog: RestaurantDeleteDialog;
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

  it('should load Restaurants', async () => {
    await navBarPage.getEntityPage('restaurant');
    restaurantComponentsPage = new RestaurantComponentsPage();
    expect(await restaurantComponentsPage.title.getText()).to.match(/Restaurants/);

    expect(await restaurantComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([restaurantComponentsPage.noRecords, restaurantComponentsPage.table]);

    beforeRecordsCount = (await isVisible(restaurantComponentsPage.noRecords)) ? 0 : await getRecordsCount(restaurantComponentsPage.table);
  });

  it('should load create Restaurant page', async () => {
    await restaurantComponentsPage.createButton.click();
    restaurantUpdatePage = new RestaurantUpdatePage();
    expect(await restaurantUpdatePage.getPageTitle().getAttribute('id')).to.match(/yumzApp.restaurant.home.createOrEditLabel/);
    await restaurantUpdatePage.cancel();
  });

  it('should create and save Restaurants', async () => {
    await restaurantComponentsPage.createButton.click();
    await restaurantUpdatePage.setNameInput('name');
    expect(await restaurantUpdatePage.getNameInput()).to.match(/name/);
    await restaurantUpdatePage.setLocationInput('location');
    expect(await restaurantUpdatePage.getLocationInput()).to.match(/location/);
    await restaurantUpdatePage.setPhoneInput('phone');
    expect(await restaurantUpdatePage.getPhoneInput()).to.match(/phone/);
    await restaurantUpdatePage.setWebsiteInput('website');
    expect(await restaurantUpdatePage.getWebsiteInput()).to.match(/website/);
    // restaurantUpdatePage.cuisineTypeSelectLastOption();
    await waitUntilDisplayed(restaurantUpdatePage.saveButton);
    await restaurantUpdatePage.save();
    await waitUntilHidden(restaurantUpdatePage.saveButton);
    expect(await isVisible(restaurantUpdatePage.saveButton)).to.be.false;

    expect(await restaurantComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(restaurantComponentsPage.table);

    await waitUntilCount(restaurantComponentsPage.records, beforeRecordsCount + 1);
    expect(await restaurantComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Restaurant', async () => {
    const deleteButton = restaurantComponentsPage.getDeleteButton(restaurantComponentsPage.records.last());
    await click(deleteButton);

    restaurantDeleteDialog = new RestaurantDeleteDialog();
    await waitUntilDisplayed(restaurantDeleteDialog.deleteModal);
    expect(await restaurantDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/yumzApp.restaurant.delete.question/);
    await restaurantDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(restaurantDeleteDialog.deleteModal);

    expect(await isVisible(restaurantDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([restaurantComponentsPage.noRecords, restaurantComponentsPage.table]);

    const afterCount = (await isVisible(restaurantComponentsPage.noRecords)) ? 0 : await getRecordsCount(restaurantComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
